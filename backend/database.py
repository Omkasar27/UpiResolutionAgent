import os

def is_postgres():
    return bool(os.getenv("DATABASE_URL"))


class DBWrapper:
    """
    Wraps psycopg2 connection to behave like SQLite.
    Allows: cursor.execute(), cursor.fetchone(), cursor.fetchall()
    cursor.lastrowid works via RETURNING id
    """
    def __init__(self, conn, is_pg):
        self.conn   = conn
        self.is_pg  = is_pg
        self._cur   = conn.cursor()

    def cursor(self):
        return CursorWrapper(self._cur, self.is_pg)

    def commit(self):
        self.conn.commit()

    def close(self):
        self._cur.close()
        self.conn.close()


class CursorWrapper:
    def __init__(self, cur, is_pg):
        self.cur    = cur
        self.is_pg  = is_pg
        self.lastrowid = None

    def execute(self, query, params=None):
        # Auto add RETURNING id for INSERT on postgres
        if self.is_pg and query.strip().upper().startswith("INSERT"):
            if "RETURNING" not in query.upper():
                query = query.rstrip().rstrip(";") + " RETURNING id"

        if params:
            self.cur.execute(query, params)
        else:
            self.cur.execute(query)

        # Capture lastrowid for INSERT
        if self.is_pg and query.strip().upper().startswith("INSERT"):
            try:
                row = self.cur.fetchone()
                if row:
                    self.lastrowid = dict(row).get("id")
            except Exception:
                self.lastrowid = None
        return self

    def fetchone(self):
        row = self.cur.fetchone()
        if row is None:
            return None
        return dict(row) if self.is_pg else row

    def fetchall(self):
        rows = self.cur.fetchall()
        if self.is_pg:
            return [dict(r) for r in rows]
        return rows


def get_db():
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        import psycopg2
        import psycopg2.extras

        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)

        conn = psycopg2.connect(
            database_url,
            sslmode="require",
            cursor_factory=psycopg2.extras.RealDictCursor
        )
        return DBWrapper(conn, is_pg=True)

    else:
        import sqlite3
        from config import DATABASE_PATH
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return DBWrapper(conn, is_pg=False)