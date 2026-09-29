"""
Convert socialflow_test_5000.jsonl (OpenAI chat format) to test.json (instruction format)
for the ML pipeline evaluation.
"""
import os
import sys
import json

JSONL_PATH = r"C:\Users\gandu\Downloads\socialflow_multiplatform_train_test_10000\socialflow_test_5000.jsonl"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "data", "test_from_jsonl.json")

def convert():
    samples = []
    skipped = 0

    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                skipped += 1
                continue

            messages = record.get("messages", [])
            # Expected: system, user, assistant
            system_msg = ""
            user_msg = ""
            assistant_msg = ""

            for m in messages:
                role = m.get("role", "")
                content = m.get("content", "")
                if role == "system":
                    system_msg = content
                elif role == "user":
                    user_msg = content
                elif role == "assistant":
                    assistant_msg = content

            if user_msg and assistant_msg:
                samples.append({
                    "id": f"test_{line_num:05d}",
                    "task_type": "dataset_instruction",
                    "instruction": system_msg or "You are SocialFlow AI, a social-media analytics and strategy assistant.",
                    "input": user_msg,
                    "output": assistant_msg
                })
            else:
                skipped += 1

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(samples, f, indent=2, ensure_ascii=False)

    print(f"Converted {len(samples)} samples from JSONL to instruction format", flush=True)
    print(f"Skipped {skipped} malformed records", flush=True)
    print(f"Saved to: {OUTPUT_PATH}", flush=True)

if __name__ == "__main__":
    convert()
