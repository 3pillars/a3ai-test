# Robot Lab — Mac-native physical-AI stack

**Built:** Oct 21, 2026
**Host:** Mac mini, Apple M4, 16 GB RAM, 10-core CPU, no NVIDIA GPU
**Purpose:** A local equivalent of the NVIDIA physical-AI pipeline in the reference
video, running entirely on Apple Silicon.

## Why this exists

The reference image shows NVIDIA's stack:

| Stage | NVIDIA tool | Execution |
|---|---|---|
| Planning / scene ideation | Hermes, Nemotron | LOCAL (RTX Spark) |
| Orchestration | GPT-6 Astra | CLOUD |
| Create assets | FreeCAD, Blender | LOCAL (RTX Spark) |
| Configure scene, rig robot | Isaac Sim | LOCAL (RTX Spark) |
| Train walking policy | Newton, Isaac Lab | CLOUD |
| Validate | Isaac Sim | LOCAL (RTX Spark) |

**That stack cannot run on this Mac.** Isaac Sim and Isaac Lab require Windows 11
or Ubuntu 22.04/24.04 and an NVIDIA RTX GPU (Isaac Sim's documented local
workstation minimum is RTX 4080). Newton runs macOS **CPU only**. So the "LOCAL
(RTX Spark)" rows in that diagram assume hardware we do not have.

This lab is the same shape of pipeline with components that do run here.

## Stack

| Stage | This lab | Runs on Mac |
|---|---|---|
| Environment / scene | MuJoCo 3.16.0 + Unitree G1 (MuJoCo Menagerie) | ✅ CPU, 78.6× realtime |
| Asset / model source | MuJoCo Menagerie (Google DeepMind, Apache-2.0) | ✅ |
| Orchestration (LLM planning) | OpenClaw + local Ollama models | ✅ |
| Train walking policy | PPO (stable-baselines3) on PyTorch MPS | ✅ |
| Validate / render | MuJoCo offscreen renderer | ✅ |

## Measured results (verified on this machine)

**Physics:** G1 humanoid, 36 qpos / 35 qvel / 29 actuators / 31 bodies, 0.002s timestep.
2000 steps (4.0s sim time) in 0.05s wall time = **78.6× realtime**.

**Training:** PPO, MLP policy, 3000 steps in **8.2s (366 steps/s)** on MPS.
Eval over 5 episodes: mean reward **3668.4**, 3/5 episodes ran the full 1000 steps
without falling (end z ≈ 0.79–0.80m).

**Render:** 640×480 offscreen, 600-frame MP4 at 30fps, verified visually — robot
stands upright, arms forward, on the Menagerie checkered ground plane.

## Layout

```
robot-lab/
├── .venv/                     Python 3.11 venv (mujoco, torch, sb3, gymnasium, imageio)
├── menagerie/unitree_g1/      G1 model (g1.xml, scene.xml, 51 STL assets)
├── out/
│   ├── 01_g1_settle.png       scene load + free-fall settle render
│   ├── 03_g1_policy_walk.mp4  600-frame policy rollout video
│   ├── 03_g1_policy_final.png final frame
│   └── g1_ppo_policy.zip      trained PPO policy
└── scripts/
    ├── 01_load_scene.py       load G1, verify physics, render test
    ├── 02_train_ppo.py        Gymnasium env + PPO training + eval
    └── 03_evaluate_render.py  rollout + video/PNG render
```

## Run it

```bash
cd ~/.openclaw/workspace/robot-lab
.venv/bin/python scripts/01_load_scene.py
.venv/bin/python scripts/02_train_ppo.py 3000
.venv/bin/python scripts/03_evaluate_render.py
```

## Honest limitations

- **The policy stands; it does not walk.** After 3000 PPO steps the robot stays
  upright and holds a stable pose, but net forward displacement is ~0
  (final x = −0.122 m). Real walking needs 1e5–1e6 steps and a proper curriculum.
  3000 steps only proves the training loop works end to end.
- **Reward shaping is naive.** Height + uprightness + forward velocity + energy
  penalty, with a fall threshold at z < 0.5m. Real bipedal RL needs gait phase
  rewards, contact-aware terms, and domain randomization for sim-to-real.
- **No sim-to-real.** The policy runs in MuJoCo only. Transfer to a physical G1
  needs system identification, actuator latency modelling, and safety limits.
- **No vision.** Observations are state vectors (qpos/qvel), not camera pixels.
  The reference pipeline's camera-based assets and GR00T-style VLA policies are
  not reproduced here.
- **The NVIDIA stack is not obsolete — it is just not ours.** Isaac Sim gives
  RTX rendering, sensor simulation, and USD pipeline integration. MuJoCo gives
  speed and Mac support. For actual robot work, that pipeline is still ahead.
