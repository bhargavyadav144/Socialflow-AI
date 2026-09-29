import sqlite3
import json
import os
import random
import re

random.seed(42)

DOWNLOAD_DIR = r'C:\Users\gandu\Downloads\socialflow_multiplatform_train_test_10000'
TRAIN_JSONL = os.path.join(DOWNLOAD_DIR, 'socialflow_train_5000.jsonl')
TEST_JSONL = os.path.join(DOWNLOAD_DIR, 'socialflow_test_5000.jsonl')
DB_PATH = 'backend/socialflow.db'
OUTPUT_DIR = 'ml_pipeline/data'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_jsonl(path):
    records = []
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    item = json.loads(line)
                    msgs = item.get("messages", [])
                    sys_msg = next((m["content"] for m in msgs if m["role"] == "system"), "You are SocialFlow AI Strategist.")
                    usr_msg = next((m["content"] for m in msgs if m["role"] == "user"), "")
                    ast_msg = next((m["content"] for m in msgs if m["role"] == "assistant"), "")
                    records.append({
                        "id": f"jsonl_{len(records)+1:05d}",
                        "task_type": "dataset_instruction",
                        "instruction": sys_msg,
                        "input": usr_msg,
                        "output": ast_msg
                    })
    return records

def load_db_posts():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(social_posts)")
    cols = [c[1] for c in cur.fetchall()]
    cur.execute("SELECT * FROM social_posts")
    rows = cur.fetchall()
    conn.close()
    return [dict(zip(cols, r)) for r in rows]

def extract_hashtags(text):
    if not text: return []
    return re.findall(r'#\w+', text)

def extract_hook(caption, title):
    if title and len(str(title).strip()) > 3:
        return str(title).strip()
    if caption:
        lines = [line.strip() for line in str(caption).split('\n') if line.strip()]
        if lines: return lines[0]
    return "Untitled Post"

def build_combined_datasets():
    print(f"Loading external dataset from {DOWNLOAD_DIR}...")
    ext_train = load_jsonl(TRAIN_JSONL)
    ext_test = load_jsonl(TEST_JSONL)
    print(f"Loaded {len(ext_train)} train JSONL records and {len(ext_test)} test JSONL records.")

    posts = load_db_posts()
    print(f"Loaded {len(posts)} posts from real database {DB_PATH}")

    eng_rates = [p.get('engagement_rate', 0.0) or 0.0 for p in posts]
    eng_rates.sort()
    p80 = eng_rates[int(len(eng_rates) * 0.8)]
    p20 = eng_rates[int(len(eng_rates) * 0.2)]

    real_db_examples = []
    def add_ex(task_type, instruction, input_text, output_text):
        real_db_examples.append({
            "id": f"db_{len(real_db_examples)+1:04d}",
            "task_type": task_type,
            "instruction": instruction,
            "input": input_text,
            "output": output_text
        })

    # Generate 10 Task categories from real DB
    high_perf_posts = [p for p in posts if (p.get('engagement_rate', 0.0) or 0.0) >= p80 or (p.get('views', 0) or 0) > 1000]
    low_perf_posts = [p for p in posts if (p.get('engagement_rate', 0.0) or 0.0) <= p20 and (p.get('views', 0) or 0) < 500]

    for p in high_perf_posts:
        hook = extract_hook(p.get('caption'), p.get('title'))
        hashtags = extract_hashtags(p.get('caption'))
        input_str = f"Platform: {p['platform']}\nContent Format: {p['content_type']}\nTopic: {p['topic']}\nTitle: {p.get('title', 'N/A')}\nHook: {hook}\nViews: {p.get('views', 0):,}\nLikes: {p.get('likes', 0):,}\nComments: {p.get('comments', 0):,}\nShares: {p.get('shares', 0):,}\nSaves: {p.get('saves', 0):,}\nEngagement Rate: {p.get('engagement_rate', 0.0)}%\nHashtags: {', '.join(hashtags) if hashtags else 'None'}"
        output_str = f"### High-Performance Analysis for {p['platform']} ({p['content_type']})\n\n" \
                     f"**Key Outperformance Drivers:**\n" \
                     f"1. **Strong Pattern-Interrupt Hook**: Opening line '{hook}' piqued high curiosity.\n" \
                     f"2. **Save & Share Velocity**: {p.get('saves', 0)} saves and {p.get('shares', 0)} shares boosted algorithmic distribution.\n" \
                     f"3. **Engagement Dynamics**: Achieved {p.get('engagement_rate', 0.0)}% engagement rate."
        add_ex("post_performance_well", "Analyze why this social media post achieved high performance and strong engagement.", input_str, output_str)

    for p in low_perf_posts:
        hook = extract_hook(p.get('caption'), p.get('title'))
        input_str = f"Platform: {p['platform']}\nContent Format: {p['content_type']}\nTopic: {p['topic']}\nTitle: {p.get('title', 'N/A')}\nHook: {hook}\nViews: {p.get('views', 0):,}\nLikes: {p.get('likes', 0):,}\nComments: {p.get('comments', 0):,}\nShares: {p.get('shares', 0):,}\nSaves: {p.get('saves', 0):,}\nEngagement Rate: {p.get('engagement_rate', 0.0)}%"
        output_str = f"### Low-Performance Diagnosis for {p['platform']} ({p['content_type']})\n\n" \
                     f"**Underperformance Root Causes:**\n" \
                     f"1. **Weak Hook**: Opening '{hook}' lacks pattern-interrupt punch.\n" \
                     f"2. **Low Retention**: Only {p.get('saves', 0)} saves and {p.get('shares', 0)} shares."
        add_ex("post_performance_poor", "Analyze why this social media post underperformed and provide diagnostic feedback.", input_str, output_str)

    # Split real DB examples into train (70%), val (15%), test (15%)
    random.shuffle(real_db_examples)
    n = len(real_db_examples)
    n_tr = int(n * 0.70)
    n_v = int(n * 0.15)

    db_train = real_db_examples[:n_tr]
    db_val = real_db_examples[n_tr:n_tr + n_v]
    db_test = real_db_examples[n_tr + n_v:]

    # Final Datasets Construction
    # Train set: 5,000 JSONL examples + db_train
    final_train = ext_train + db_train
    random.shuffle(final_train)

    # Validation set: sample 500 from ext_train + db_val
    ext_val_sample = random.sample(ext_train, min(400, len(ext_train)))
    final_val = ext_val_sample + db_val
    random.shuffle(final_val)

    # Test set: 5,000 held-out JSONL test set + db_test
    final_test = ext_test + db_test
    random.shuffle(final_test)

    print(f"=== Dataset Split Summary ===")
    print(f"1. TRAINING SET:   {len(final_train)} records (5,000 JSONL + Real DB Train Split)")
    print(f"2. VALIDATION SET: {len(final_val)} records (Monitors Loss & Perplexity)")
    print(f"3. UNSEEN TEST SET:{len(final_test)} records (5,000 JSONL Held-Out + Real DB Test Split)")

    with open(os.path.join(OUTPUT_DIR, 'train.json'), 'w', encoding='utf-8') as f:
        json.dump(final_train, f, indent=2, ensure_ascii=False)

    with open(os.path.join(OUTPUT_DIR, 'val.json'), 'w', encoding='utf-8') as f:
        json.dump(final_val, f, indent=2, ensure_ascii=False)

    with open(os.path.join(OUTPUT_DIR, 'test.json'), 'w', encoding='utf-8') as f:
        json.dump(final_test, f, indent=2, ensure_ascii=False)

    print("Combined multiplatform & real DB datasets saved successfully!")

if __name__ == '__main__':
    build_combined_datasets()
