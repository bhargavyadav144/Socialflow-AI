import sqlite3  
conn = sqlite3.connect('socialflow.db')  
cur = conn.cursor()  
cols = [row[1] for row in cur.execute('PRAGMA table_info(users)')]  
print('Columns:', cols)  
if 'dob' not in cols: cur.execute('ALTER TABLE users ADD COLUMN dob VARCHAR(50)'); conn.commit(); print('Added dob column.')  
else: print('dob already exists.')  
conn.close()  
