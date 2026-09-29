# SocialFlow AI Multiplatform Synthetic Dataset

This package contains 10,000 SYNTHETIC records created for model-development experiments.

Files:
- socialflow_train_5000.csv — 5,000 training records
- socialflow_test_5000.csv — 5,000 held-out test records
- socialflow_train_5000.jsonl — 5,000 instruction/chat examples
- socialflow_test_5000.jsonl — 5,000 held-out instruction/chat examples

Platforms:
Instagram, YouTube, LinkedIn, Facebook, X, TikTok

Important:
These records are synthetic, not scraped or claimed to be real platform data.
Use them for pipeline development/testing. For a real production model,
replace or augment them with authorized first-party/exported data.

The schema uses a common cross-platform structure. Some fields can be
null because not every platform exposes the same metrics.
