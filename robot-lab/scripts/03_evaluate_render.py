#!/usr/bin/env python3
"""
Stage 3 - Evaluate the trained policy and render a walk video.

Mac-native equivalent of the image's "Evaluate" stage.
"""
import sys
from pathlib import Path

import mujoco
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SCENE = ROOT / "menagerie" / "unitree_g1" / "scene.xml"
POLICY = ROOT / "out" / "g1_ppo_policy.zip"


def main() -> int:
    sys.path.insert(0, str(ROOT / "scripts"))
    from importlib import import_module
    train = import_module("02_train_ppo")
    import torch
    from stable_baselines3 import PPO

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model = PPO.load(str(POLICY), device=device)

    env = train.make_env()
    obs, _ = env.reset(seed=7)

    model_obj = env.model
    data = env.data
    cam = mujoco.MjvCamera()
    cam.type = mujoco.mjtCamera.mjCAMERA_FREE
    cam.lookat[:] = [0.0, 0.0, 0.8]
    cam.distance = 3.2
    cam.azimuth = 140
    cam.elevation = -12

    renderer = mujoco.Renderer(model_obj, height=480, width=640)

    frames, rewards = [], []
    total, steps = 0.0, 0
    while steps < 600:
        act, _ = model.predict(obs, deterministic=True)
        obs, r, terminated, truncated, _ = env.step(act)
        total += r
        steps += 1
        renderer.update_scene(data, camera=cam)
        frames.append(renderer.render())
        if terminated or truncated:
            break
    renderer.close()

    out = ROOT / "out" / "03_g1_policy_walk.mp4"
    import imageio.v3 as iio
    iio.imwrite(out, np.stack(frames), fps=30, codec="libx264")
    print(f"rendered {len(frames)} frames -> {out}")
    print(f"episode reward: {total:.1f} | steps: {steps} | end z: {data.qpos[2]:.3f}")
    print(f"final x (forward distance): {data.qpos[0]:.3f} m")

    png = ROOT / "out" / "03_g1_policy_final.png"
    iio.imwrite(png, frames[-1])
    print(f"final frame -> {png}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
