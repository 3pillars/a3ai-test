#!/bin/bash
# BitNet Wrapper for OpenClaw
# Usage: ./bitnet-run.sh "Your prompt here"

PROMPT="${1:-What is artificial intelligence?}"
TOKENS="${2:-100}"
MODEL_PATH="/tmp/BitNet/models/bitnet_b1_58-large/bitnet_b1_58-large/ggml-model-i2_s.gguf"

cd /tmp/BitNet
source .venv/bin/activate

python run_inference.py \
    -m "$MODEL_PATH" \
    -p "$PROMPT" \
    -n "$TOKENS" \
    -t 4 \
    --temp 0.7 2>&1 | grep -v "^llama\|^ggml\|^main:\|^system_info\|^sampler\|^generate\|^common_init\|^Loading\|^\s*$"
