import os

def placeholder():
    """Returns %s for PostgreSQL, ? for SQLite."""
    return "%s" if os.getenv("DATABASE_URL") else "?"

def p(count=1):
    """Returns placeholders for given count of params."""
    ph = placeholder()
    return ", ".join([ph] * count)