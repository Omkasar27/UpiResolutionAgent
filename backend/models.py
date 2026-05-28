import os
from database import get_db, is_postgres

def init_db():
    db     = get_db()
    cursor = db.cursor()

    if is_postgres():

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id         SERIAL PRIMARY KEY,
                google_id  TEXT UNIQUE NOT NULL,
                email      TEXT UNIQUE NOT NULL,
                name       TEXT,
                role       TEXT DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id          TEXT PRIMARY KEY,
                amount      REAL,
                status      TEXT,
                merchant_id TEXT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS disputes (
                id             SERIAL PRIMARY KEY,
                user_id        INTEGER REFERENCES users(id),
                transaction_id TEXT,
                customer_name  TEXT,
                description    TEXT,
                status         TEXT DEFAULT 'OPEN',
                ai_action      TEXT,
                ai_reason      TEXT,
                ai_confidence  REAL,
                created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS refunds (
                id             SERIAL PRIMARY KEY,
                transaction_id TEXT,
                dispute_id     INTEGER REFERENCES disputes(id),
                amount         REAL,
                status         TEXT DEFAULT 'INITIATED',
                created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS logs (
                id           SERIAL PRIMARY KEY,
                dispute_id   INTEGER REFERENCES disputes(id),
                action       TEXT,
                performed_by TEXT,
                note         TEXT,
                created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

    else:
        # SQLite for local dev
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                google_id TEXT UNIQUE NOT NULL,
                email     TEXT UNIQUE NOT NULL,
                name      TEXT,
                role      TEXT DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id          TEXT PRIMARY KEY,
                amount      REAL,
                status      TEXT,
                merchant_id TEXT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS disputes (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id        INTEGER,
                transaction_id TEXT,
                customer_name  TEXT,
                description    TEXT,
                status         TEXT DEFAULT 'OPEN',
                ai_action      TEXT,
                ai_reason      TEXT,
                ai_confidence  REAL,
                created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS refunds (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id TEXT,
                dispute_id     INTEGER,
                amount         REAL,
                status         TEXT DEFAULT 'INITIATED',
                created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS logs (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                dispute_id   INTEGER,
                action       TEXT,
                performed_by TEXT,
                note         TEXT,
                created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

    db.commit()
    db.close()
    print("Database initialized.")