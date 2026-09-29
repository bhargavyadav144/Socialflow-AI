import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'socialflow.db')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("DELETE FROM social_posts WHERE platform = 'Instagram'")
    conn.commit()
    print("SUCCESS: Deleted all Instagram posts from database.")
