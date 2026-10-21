#!/usr/bin/env python3
"""
Stage 2 - Gymnasium wrapper for the Unitree G1 humanoid + PPO training.

Mac-native equivalent of the image's "Train Walking Policy" stage.
Runs on Apple Silicon (MPS for the NN, CPU for physics).
"""
import sys
import time
from pathlib import Path

import mujoco
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SCENE = ROOT / "menagerie" / "unitree_g1" / "scene.xml"


def make_env():
    import gymnasium as gym
    from gymnasium import spaces

    class G1WalkEnv(gym.Env):
        """Minimal stand-up/walk task: keep the torso upright and alive."""

        metadata = {"render_modes": []}

        def __init__(self):
            super().__init__()
            self.model = mujoco.MjModel.from_xml_path(str(SCENE))
            self.data = mujoco.MjData(self.model)
            self.nq, self.nv, self.nu = self.model.nq, self.model.nv, self.model.nu
            self.act_low = self.model.actuator_ctrlrange[:, 0].copy()
            self.act_high = self.model.actuator_ctrlrange[:, 1].copy()
            self.observation_space = spaces.Box(
                -np.inf, np.inf, shape=(self.nq + self.nv,), dtype=np.float32)
            self.action_space = spaces.Box(
                self.act_low, self.act_high, shape=(self.nu,), dtype=np.float32)
            self.max_steps = 1000
            self.t = 0
            # torso body carries the robot's orientation (w,x,y,z quaternion)
            self.torso_id = mujoco.mj_name2id(
                self.model, mujoco.mjtObj.mjOBJ_BODY, "torso_link")
            if self.torso_id == -1:
                self.torso_id = 1  # fallback: first body after worldbody

        def _obs(self):
            return np.concatenate([self.data.qpos, self.data.qvel]).astype(np.float32)

        def _reward(self):
            # stay upright + head height + alive + forward velocity + energy penalty
            z = self.data.qpos[2]
            q = self.data.xquat[self.torso_id]  # (w, x, y, z)
            upright = float(q[0])  # w component: 1.0 == perfectly upright
            fwd_vel = self.data.qvel[0]
            ctrl_cost = float(np.sum(np.square(self.data.ctrl)))
            alive = 1.0
            return (1.0 * z + 2.0 * upright + 0.6 * fwd_vel
                    - 0.0005 * ctrl_cost + alive)

        def reset(self, *, seed=None, options=None):
            super().reset(seed=seed)
            mujoco.mj_resetData(self.model, self.data)
            # small random perturbation so the policy can't rely on one pose
            if seed is not None:
                np.random.seed(seed)
            self.data.qpos[:] += self.np_random.uniform(-0.02, 0.02, self.nq)
            mujoco.mj_forward(self.model, self.data)
            self.t = 0
            return self._obs(), {}

        def step(self, action):
            self.data.ctrl[:] = np.clip(action, self.act_low, self.act_high)
            mujoco.mj_step(self.model, self.data)
            self.t += 1
            terminated = False
            truncated = self.t >= self.max_steps
            # fell over: torso below a height threshold -> terminate (common trick)
            if self.data.qpos[2] < 0.5:
                terminated = True
            return self._obs(), self._reward(), terminated, truncated, {}

    return G1WalkEnv()


def main() -> int:
    steps = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    print(f"=== G1 PPO training on Apple Silicon ({steps} steps) ===\n")

    import torch
    from stable_baselines3 import PPO
    from stable_baselines3.common.vec_env import DummyVecEnv

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"torch {torch.__version__} | device: {device}")

    env = DummyVecEnv([make_env])
    model = PPO(
        "MlpPolicy", env, verbose=1, n_steps=512, batch_size=64,
        gae_lambda=0.95, gamma=0.99, learning_rate=3e-4, ent_coef=0.0,
        device=device, seed=0,
    )

    t0 = time.time()
    model.learn(total_timesteps=steps)
    train_s = time.time() - t0

    print(f"\ntraining done in {train_s:.1f}s "
          f"({steps / train_s:.0f} steps/s)")

    out = ROOT / "out" / "g1_ppo_policy"
    model.save(str(out))
    print(f"saved policy -> {out}.zip")

    # --- evaluate ---
    print("\n=== evaluation (5 episodes) ===")
    raw_env = make_env()
    rewards = []
    for ep in range(5):
        obs, _ = raw_env.reset(seed=100 + ep)
        total, steps_ep, terminated = 0.0, 0, False
        while not (terminated or steps_ep >= raw_env.max_steps):
            act, _ = model.predict(obs, deterministic=True)
            obs, r, terminated, truncated, _ = raw_env.step(act)
            total += r
            steps_ep += 1
        rewards.append(total)
        print(f"  ep {ep}: reward {total:8.1f} | steps {steps_ep:4d} | "
              f"end z {raw_env.data.qpos[2]:.3f}")

    print(f"\nmean episode reward: {np.mean(rewards):.1f}")
    print("\nOK: RL stage works locally on this Mac.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
