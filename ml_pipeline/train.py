"""
SocialFlow AI - Optimized Local LLM Training Pipeline
=====================================================
Fine-tunes Qwen2.5-0.5B-Instruct with LoRA for social media analytics.
Optimized for CPU training with reduced sample size for fast convergence.
"""
import os
import sys
import site
sys.path.append(site.getusersitepackages())

import json
import time
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForCausalLM, get_linear_schedule_with_warmup
from peft import LoraConfig, get_peft_model, TaskType

MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"
TRAIN_PATH = os.path.join(os.path.dirname(__file__), "data", "train.json")
VAL_PATH = os.path.join(os.path.dirname(__file__), "data", "val.json")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "models", "socialflow_lora_adapter")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "models", "training_metrics.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(METRICS_PATH), exist_ok=True)


class SocialFlowDataset(Dataset):
    def __init__(self, json_path, tokenizer, max_length=128, max_samples=None):
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if max_samples and len(data) > max_samples:
            data = data[:max_samples]
        self.data = data
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        # Build chat-template prompt
        prompt = (
            f"<|im_start|>system\n{item['instruction']}<|im_end|>\n"
            f"<|im_start|>user\n{item['input']}<|im_end|>\n"
            f"<|im_start|>assistant\n{item['output']}<|im_end|>"
        )

        encoded = self.tokenizer(
            prompt,
            truncation=True,
            max_length=self.max_length,
            padding="max_length",
            return_tensors="pt"
        )

        input_ids = encoded["input_ids"].squeeze(0)
        attention_mask = encoded["attention_mask"].squeeze(0)
        labels = input_ids.clone()
        labels[labels == self.tokenizer.pad_token_id] = -100

        return {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
            "labels": labels
        }


def train():
    print("=" * 60, flush=True)
    print("  SocialFlow AI - Local LLM Training (CPU Optimized)", flush=True)
    print("=" * 60, flush=True)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[CONFIG] Device: {device.upper()}", flush=True)
    print(f"[CONFIG] Base Model: {MODEL_NAME}", flush=True)
    print(f"[CONFIG] Method: LoRA (Low-Rank Adaptation)", flush=True)

    # Load tokenizer
    print("\n[STEP 1/5] Loading tokenizer...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    print(f"  Tokenizer loaded: vocab_size={tokenizer.vocab_size}", flush=True)

    # Load base model
    print("[STEP 2/5] Loading base model...", flush=True)
    base_model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float32,
        trust_remote_code=True
    )

    # Apply LoRA
    print("[STEP 3/5] Applying LoRA adapter...", flush=True)
    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=8,              # Reduced rank for faster CPU training
        lora_alpha=16,
        lora_dropout=0.05,
        target_modules=["q_proj", "v_proj"]  # Only 2 modules for speed
    )

    model = get_peft_model(base_model, lora_config)
    model.to(device)
    model.print_trainable_parameters()

    # Load datasets - reduced for CPU feasibility
    # 500 train samples, 100 val samples, max_length=128 tokens
    print("[STEP 4/5] Loading datasets...", flush=True)
    train_dataset = SocialFlowDataset(TRAIN_PATH, tokenizer, max_length=128, max_samples=500)
    val_dataset = SocialFlowDataset(VAL_PATH, tokenizer, max_length=128, max_samples=100)
    print(f"  Train: {len(train_dataset)} samples | Val: {len(val_dataset)} samples", flush=True)

    train_loader = DataLoader(train_dataset, batch_size=4, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=4, shuffle=False)

    # Training config
    epochs = 2  # 2 epochs is enough for LoRA fine-tuning
    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-4, weight_decay=0.01)
    total_steps = len(train_loader) * epochs
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=int(total_steps * 0.1),
        num_training_steps=total_steps
    )

    metrics = {
        "base_model": MODEL_NAME,
        "method": "LoRA",
        "lora_r": 8,
        "lora_alpha": 16,
        "epochs": epochs,
        "train_samples": len(train_dataset),
        "val_samples": len(val_dataset),
        "max_length": 128,
        "history": []
    }

    print(f"\n[STEP 5/5] Training for {epochs} epochs ({len(train_loader)} batches/epoch)...", flush=True)
    print("-" * 60, flush=True)

    start_time = time.time()

    for epoch in range(1, epochs + 1):
        model.train()
        total_train_loss = 0.0

        for step, batch in enumerate(train_loader, 1):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            optimizer.zero_grad()
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()

            total_train_loss += loss.item()

            if step % 25 == 0 or step == len(train_loader):
                print(f"  Epoch {epoch}/{epochs} | Step {step}/{len(train_loader)} | Loss: {loss.item():.4f}", flush=True)

        avg_train_loss = total_train_loss / len(train_loader)

        # Validation
        model.eval()
        total_val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch["input_ids"].to(device)
                attention_mask = batch["attention_mask"].to(device)
                labels = batch["labels"].to(device)
                outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
                total_val_loss += outputs.loss.item()

        avg_val_loss = total_val_loss / len(val_loader)
        perplexity = round(float(torch.exp(torch.tensor(avg_val_loss)).item()), 2)

        print(f"  >> Epoch {epoch}: Train Loss={avg_train_loss:.4f} | Val Loss={avg_val_loss:.4f} | Perplexity={perplexity:.2f}", flush=True)

        metrics["history"].append({
            "epoch": epoch,
            "train_loss": round(avg_train_loss, 4),
            "val_loss": round(avg_val_loss, 4),
            "perplexity": perplexity
        })

    elapsed = round(time.time() - start_time, 2)
    metrics["training_time_seconds"] = elapsed
    metrics["final_train_loss"] = metrics["history"][-1]["train_loss"]
    metrics["final_val_loss"] = metrics["history"][-1]["val_loss"]

    # Save model
    print(f"\nSaving LoRA adapter to {OUTPUT_DIR}...", flush=True)
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    with open(METRICS_PATH, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)

    print(f"\n{'=' * 60}", flush=True)
    print(f"  TRAINING COMPLETE!", flush=True)
    print(f"  Time: {elapsed}s | Final Loss: {metrics['final_train_loss']}", flush=True)
    print(f"  Adapter saved to: {OUTPUT_DIR}", flush=True)
    print(f"{'=' * 60}", flush=True)


if __name__ == '__main__':
    train()
