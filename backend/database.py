import os

def is_postgres():
    return bool(os.getenv("DATABASE_URL"))

def get_db():
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        import psycopg2
        import psycopg2.extras

        # Fix: Render uses postgres:// but psycopg2 needs postgresql://
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)

        conn = psycopg2.connect(
            database_url,
            sslmode="require",
            cursor_factory=psycopg2.extras.RealDictCursor
        )
        conn.autocommit = False
        return conn

    else:
        import sqlite3
        from config import DATABASE_PATH
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn