#!/usr/bin/env python3
"""
Stage 1 - Load the Unitree G1 bipedal humanoid in MuJoCo and verify physics.

Mac-native equivalent of the image's "Generate Environment" stage.
No NVIDIA GPU required (MuJoCo runs CPU on Apple Silicon).
"""
import sys
import time
from pathlib import Path

import mujoco
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SCENE = ROOT / "menagerie" / "unitree_g1" / "scene.xml"


def main() -> int:
    if not SCENE.exists():
        print(f"FAIL: scene not found at {SCENE}")
        return 1

    print(f"scene: {SCENE}")
    t0 = time.time()
    model = mujoco.MjModel.from_xml_path(str(SCENE))
    data = mujoco.MjData(model)
    load_s = time.time() - t0

    print(f"mujoco version : {mujoco.__version__}")
    print(f"load time      : {load_s:.2f}s")
    print(f"nq (positions) : {model.nq}")
    print(f"nv (velocities): {model.nv}")
    print(f"nu (actuators) : {model.nu}")
    print(f"nbody (bodies) : {model.nbody}")
    print(f"timestep       : {model.opt.timestep}s")
    print(f"gravity        : {model.opt.gravity}")

    # --- settle the robot under gravity (no controller) ---
    t0 = time.time()
    steps = 2000
    for _ in range(steps):
        mujoco.mj_step(model, data)
    sim_s = time.time() - t0
    sim_time = data.time
    real_time_factor = sim_time / sim_s if sim_s > 0 else 0.0

    z = data.qpos[2]
    print("\n--- settle test (free fall, 2000 steps, no policy) ---")
    print(f"sim time       : {sim_time:.2f}s")
    print(f"wall time      : {sim_s:.2f}s")
    print(f"realtime factor: {real_time_factor:.1f}x")
    print(f"root height z  : {z:.4f} m (collapsed = fell over)")

    # --- actuator inventory ---
    print("\n--- actuators ---")
    for i in range(model.nu):
        name = mujoco.mj_id2name(model, mujoco.mjtObj.mjOBJ_ACTUATOR, i)
        print(f"  [{i:2d}] {name}")

    # --- free camera for rendering ---
    cam = mujoco.MjvCamera()
    cam.type = mujoco.mjtCamera.mjCAMERA_FREE
    cam.lookat[:] = [0.0, 0.0, 0.8]
    cam.distance = 3.0
    cam.azimuth = 140
    cam.elevation = -15

    # --- offscreen render test (proves we can see it) ---
    print("\n--- render test (offscreen 640x480) ---")
    try:
        renderer = mujoco.Renderer(model, height=480, width=640)
        renderer.update_scene(data, camera=cam)
        frame = renderer.render()
        out = ROOT / "out" / "01_g1_settle.png"
        out.parent.mkdir(exist_ok=True)
        import imageio.v3 as iio
        iio.imwrite(out, frame)
        print(f"rendered OK -> {out}  shape={frame.shape} mean_px={frame.mean():.1f}")
        renderer.close()
    except Exception as e:
        print(f"render FAILED: {type(e).__name__}: {e}")
        print("  (physics still works; rendering is optional)")

    print("\nOK: environment stage works locally on this Mac.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
