"""
SocialFlow AI - Complete Model Evaluation Pipeline
===================================================
Uses the user-provided socialflow_test_5000.jsonl (converted to instruction format)
to evaluate the fine-tuned LoRA model against the base Qwen model.

Steps:
1. Load base model + fine-tuned LoRA adapter
2. Run side-by-side inference on 50 randomly sampled test items
3. Score responses for relevance, format, and overall quality
4. Generate detailed evaluation report
"""
import os
import sys
import site
sys.path.append(site.getusersitepackages())

import json
import time
import random
import re
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"
ADAPTER_PATH = "ml_pipeline/models/socialflow_lora_adapter"
TEST_PATH = "ml_pipeline/data/test_from_jsonl.json"
RESULTS_PATH = "ml_pipeline/evaluation_results.json"

random.seed(42)

def generate_completion(model, tokenizer, instruction, input_text, device, max_new_tokens=180):
    """Generate a completion from the model given instruction + input."""
    prompt = f"<|im_start|>system\n{instruction}<|im_end|>\n<|im_start|>user\n{input_text}<|im_end|>\n<|im_start|>assistant\n"
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).to(device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.pad_token_id or tokenizer.eos_token_id
        )

    gen_text = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    return gen_text.strip()


def extract_performance_level(text):
    """Extract the performance level label from a response."""
    text_lower = text.lower()
    for level in ["high", "medium", "low"]:
        if f"performance level: {level}" in text_lower or f"performance: {level}" in text_lower:
            return level.capitalize()
    # Fallback: check if any level keyword appears
    for level in ["high", "medium", "low"]:
        if level in text_lower:
            return level.capitalize()
    return "Unknown"


def extract_engagement_rate(text):
    """Extract engagement rate percentage from text."""
    match = re.search(r'engagement rate[:\s]+is\s+([\d.]+)%', text.lower())
    if match:
        return float(match.group(1))
    match = re.search(r'([\d.]+)%', text)
    if match:
        return float(match.group(1))
    return None


def score_response(response, ground_truth):
    """Score a model response against ground truth on multiple dimensions."""
    resp_lower = response.lower()
    gt_lower = ground_truth.lower()

    # 1. Performance Level Accuracy (exact match)
    pred_level = extract_performance_level(response)
    true_level = extract_performance_level(ground_truth)
    level_match = 1.0 if pred_level == true_level else 0.0

    # 2. Engagement Rate Mention Accuracy
    pred_rate = extract_engagement_rate(response)
    true_rate = extract_engagement_rate(ground_truth)
    rate_match = 1.0 if pred_rate is not None and true_rate is not None and abs(pred_rate - true_rate) < 0.5 else 0.0

    # 3. Key Metric Coverage (mentions likes, comments, shares, saves, views)
    key_metrics = ["likes", "comments", "shares", "saves", "views"]
    gt_metrics_present = sum(1 for m in key_metrics if m in gt_lower)
    pred_metrics_present = sum(1 for m in key_metrics if m in resp_lower)
    metric_coverage = pred_metrics_present / max(gt_metrics_present, 1)

    # 4. Strategic Quality (mentions evidence, future, historical, etc.)
    strategic_terms = ["evidence", "historical", "future", "observe", "audience", "interaction", "content"]
    strategic_score = min(1.0, sum(1 for t in strategic_terms if t in resp_lower) / 3.0)

    # 5. Response Length Quality (not too short, not excessively long)
    word_count = len(response.split())
    length_score = 1.0 if 20 <= word_count <= 150 else (0.5 if 10 <= word_count <= 200 else 0.2)

    # Overall weighted score (out of 10)
    overall = round(
        (level_match * 3.0) +      # 30% weight: correct performance level
        (rate_match * 2.0) +        # 20% weight: correct engagement rate
        (metric_coverage * 2.0) +   # 20% weight: metric coverage
        (strategic_score * 2.0) +   # 20% weight: strategic quality
        (length_score * 1.0),       # 10% weight: response quality
        1
    )

    return {
        "performance_level_match": level_match,
        "engagement_rate_match": rate_match,
        "metric_coverage": round(metric_coverage, 2),
        "strategic_quality": round(strategic_score, 2),
        "length_quality": round(length_score, 2),
        "overall_quality_score": overall,
        "predicted_level": pred_level,
        "true_level": true_level
    }


def evaluate():
    print("=" * 70, flush=True)
    print("  SocialFlow AI - Model Evaluation on User Test Dataset", flush=True)
    print("  Test File: socialflow_test_5000.jsonl (5,000 unseen samples)", flush=True)
    print("=" * 70, flush=True)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"\n[CONFIG] Device: {device.upper()}", flush=True)
    print(f"[CONFIG] Base Model: {MODEL_NAME}", flush=True)
    print(f"[CONFIG] LoRA Adapter: {ADAPTER_PATH}", flush=True)

    # Load test data
    with open(TEST_PATH, "r", encoding="utf-8") as f:
        test_data = json.load(f)
    print(f"[DATA] Loaded {len(test_data):,} unseen test samples", flush=True)

    # Load tokenizer
    print("\n[STEP 1/4] Loading tokenizer...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # Load base model
    print("[STEP 2/4] Loading base model (Qwen 0.5B)...", flush=True)
    base_model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float32,
        trust_remote_code=True
    ).to(device)
    base_model.eval()

    # Load fine-tuned model
    has_adapter = os.path.exists(ADAPTER_PATH) and len(os.listdir(ADAPTER_PATH)) > 0
    finetuned_model = None

    if has_adapter:
        print("[STEP 3/4] Loading fine-tuned model (Base + LoRA adapter)...", flush=True)
        ft_base = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float32,
            trust_remote_code=True
        ).to(device)
        finetuned_model = PeftModel.from_pretrained(ft_base, ADAPTER_PATH).to(device)
        finetuned_model.eval()
    else:
        print("[STEP 3/4] WARNING: No LoRA adapter found. Running BASE-ONLY evaluation.", flush=True)
        print(f"  (Train first with: py ml_pipeline/train.py)", flush=True)

    # Sample evaluation set
    EVAL_SIZE = 50
    eval_indices = random.sample(range(len(test_data)), min(EVAL_SIZE, len(test_data)))
    eval_samples = [test_data[i] for i in eval_indices]

    print(f"\n[STEP 4/4] Running inference on {len(eval_samples)} randomly sampled test items...", flush=True)
    print("-" * 70, flush=True)

    base_scores = []
    ft_scores = []
    level_correct_base = 0
    level_correct_ft = 0
    side_by_side = []

    start_time = time.time()

    for idx, item in enumerate(eval_samples, 1):
        inst = item["instruction"]
        inp = item["input"]
        gt = item["output"]

        # Base model response
        base_resp = generate_completion(base_model, tokenizer, inst, inp, device)
        base_eval = score_response(base_resp, gt)
        base_scores.append(base_eval["overall_quality_score"])
        if base_eval["performance_level_match"] == 1.0:
            level_correct_base += 1

        result_entry = {
            "test_id": item["id"],
            "input_preview": inp[:120] + "...",
            "ground_truth_level": base_eval["true_level"],
            "base_model": {
                "predicted_level": base_eval["predicted_level"],
                "response_preview": base_resp[:200],
                "scores": base_eval
            }
        }

        # Fine-tuned model response (if available)
        if finetuned_model:
            ft_resp = generate_completion(finetuned_model, tokenizer, inst, inp, device)
            ft_eval = score_response(ft_resp, gt)
            ft_scores.append(ft_eval["overall_quality_score"])
            if ft_eval["performance_level_match"] == 1.0:
                level_correct_ft += 1

            result_entry["fine_tuned_model"] = {
                "predicted_level": ft_eval["predicted_level"],
                "response_preview": ft_resp[:200],
                "scores": ft_eval
            }

        side_by_side.append(result_entry)

        # Progress logging
        if idx <= 5 or idx % 10 == 0 or idx == len(eval_samples):
            base_score_str = f"Base: {base_eval['overall_quality_score']:.1f}/10"
            ft_score_str = ""
            if finetuned_model and ft_scores:
                ft_score_str = f" | Fine-Tuned: {ft_eval['overall_quality_score']:.1f}/10"
            print(f"  Sample {idx:02d}/{len(eval_samples)} | {base_score_str}{ft_score_str} | True: {base_eval['true_level']}", flush=True)

    elapsed = round(time.time() - start_time, 2)

    # Calculate final metrics
    base_avg = round(float(np.mean(base_scores)), 2)
    base_level_acc = round(level_correct_base / len(eval_samples) * 100, 1)

    print("\n" + "=" * 70, flush=True)
    print("  EVALUATION RESULTS - User Test Dataset (socialflow_test_5000.jsonl)", flush=True)
    print("=" * 70, flush=True)
    print(f"  Total Test Pool:            {len(test_data):,} unseen samples", flush=True)
    print(f"  Evaluated Sample Size:      {len(eval_samples)} randomly selected", flush=True)
    print(f"  Evaluation Time:            {elapsed}s", flush=True)
    print(f"", flush=True)
    print(f"  --- Base Model (Qwen 0.5B, NO fine-tuning) ---", flush=True)
    print(f"  Average Quality Score:      {base_avg} / 10", flush=True)
    print(f"  Performance Level Accuracy: {base_level_acc}% ({level_correct_base}/{len(eval_samples)})", flush=True)

    summary = {
        "test_source": "socialflow_test_5000.jsonl (user-provided)",
        "total_test_pool": len(test_data),
        "evaluated_samples": len(eval_samples),
        "evaluation_time_seconds": elapsed,
        "base_model": {
            "name": MODEL_NAME,
            "avg_quality_score": base_avg,
            "performance_level_accuracy_pct": base_level_acc,
            "correct_predictions": level_correct_base
        }
    }

    if finetuned_model and ft_scores:
        ft_avg = round(float(np.mean(ft_scores)), 2)
        ft_level_acc = round(level_correct_ft / len(eval_samples) * 100, 1)
        improvement = round(ft_avg - base_avg, 2)
        improvement_pct = round((improvement / max(base_avg, 0.01)) * 100, 1)

        print(f"", flush=True)
        print(f"  --- Fine-Tuned Model (Base + LoRA Adapter) ---", flush=True)
        print(f"  Average Quality Score:      {ft_avg} / 10", flush=True)
        print(f"  Performance Level Accuracy: {ft_level_acc}% ({level_correct_ft}/{len(eval_samples)})", flush=True)
        print(f"", flush=True)
        print(f"  --- Improvement ---", flush=True)
        print(f"  Quality Score Delta:        +{improvement} pts ({improvement_pct:+.1f}%)", flush=True)
        print(f"  Level Accuracy Delta:       +{ft_level_acc - base_level_acc:.1f}%", flush=True)

        summary["fine_tuned_model"] = {
            "name": f"{MODEL_NAME} + LoRA",
            "adapter_path": ADAPTER_PATH,
            "avg_quality_score": ft_avg,
            "performance_level_accuracy_pct": ft_level_acc,
            "correct_predictions": level_correct_ft
        }
        summary["improvement"] = {
            "quality_score_delta": improvement,
            "quality_improvement_pct": improvement_pct,
            "level_accuracy_delta": round(ft_level_acc - base_level_acc, 1)
        }
    else:
        print(f"\n  [INFO] Fine-tuned model not available. Train first:", flush=True)
        print(f"         py ml_pipeline/train.py", flush=True)

    print("=" * 70, flush=True)

    summary["side_by_side_evaluations"] = side_by_side

    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\nFull evaluation report saved to: {RESULTS_PATH}", flush=True)


if __name__ == "__main__":
    evaluate()
