import os
import shutil
import csv

downloads_dir = os.path.expanduser(r"~\Downloads\socialflow_multiplatform_train_test_10000")
data_dir = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(data_dir, exist_ok=True)

print("Searching for dataset in:", downloads_dir)
if os.path.exists(downloads_dir):
    files = os.listdir(downloads_dir)
    print("Files found in downloads folder:", files)
    for f in files:
        src = os.path.join(downloads_dir, f)
        dst = os.path.join(data_dir, f)
        shutil.copy2(src, dst)
        print(f"Copied {f} ({os.path.getsize(dst):,} bytes) to {dst}")

# Inspect the dataset files in data_dir
for f in os.listdir(data_dir):
    if f.endswith('.csv'):
        file_path = os.path.join(data_dir, f)
        print(f"\n--- Inspecting {f} ---")
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as fp:
            reader = csv.reader(fp)
            header = next(reader)
            print("Columns:", header)
            rows = [next(reader) for _ in range(5)]
            print(f"Sample row 1: {rows[0] if rows else 'None'}")
            total_rows = 1 + sum(1 for _ in fp)
            print(f"Total rows in {f}: {total_rows:,}")
