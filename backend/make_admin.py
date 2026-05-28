import sqlite3

db = sqlite3.connect("dispute_agent.db")
db.execute("UPDATE users SET role='admin' WHERE id=1")
db.commit()

# Verify
user = db.execute("SELECT * FROM users WHERE id=1").fetchone()
print(f"User: {user[3]} | Email: {user[2]} | Role: {user[4]}")
db.close()