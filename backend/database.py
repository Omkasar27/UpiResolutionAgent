import os
import psycopg2
import psycopg2.extras
import sqlite3

def is_postgres():
    return bool(os.getenv("DATABASE_URL"))

def get_db():
    """
    Production  → PostgreSQL via DATABASE_URL
    Local dev   → SQLite
    """
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        conn = psycopg2.connect(
            database_url,
            cursor_factory=psycopg2.extras.RealDictCursor
        )
        conn.autocommit = False
        return conn
    else:
        from config import DATABASE_PATH
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn