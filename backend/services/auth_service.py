import os
from database import get_db

ADMIN_EMAILS = [
    "omkasar80@gmail.com",  # replace with your email
]

def get_or_create_user(google_id: str, email: str, name: str) -> dict:
    db     = get_db()
    cursor = db.cursor()

    role = "admin" if email in ADMIN_EMAILS else "customer"

    user = cursor.execute(
        "SELECT * FROM users WHERE google_id = %s"
        if os.getenv("DATABASE_URL")
        else "SELECT * FROM users WHERE google_id = ?",
        (google_id,)
    ).fetchone()

    if not user:
        if os.getenv("DATABASE_URL"):
            cursor.execute(
                "INSERT INTO users (google_id, email, name, role) VALUES (%s, %s, %s, %s)",
                (google_id, email, name, role)
            )
        else:
            cursor.execute(
                "INSERT INTO users (google_id, email, name, role) VALUES (?, ?, ?, ?)",
                (google_id, email, name, role)
            )
        db.commit()
    else:
        if email in ADMIN_EMAILS and dict(user).get("role") != "admin":
            if os.getenv("DATABASE_URL"):
                cursor.execute(
                    "UPDATE users SET role = %s WHERE google_id = %s",
                    ("admin", google_id)
                )
            else:
                cursor.execute(
                    "UPDATE users SET role = ? WHERE google_id = ?",
                    ("admin", google_id)
                )
            db.commit()

    user = cursor.execute(
        "SELECT * FROM users WHERE google_id = %s"
        if os.getenv("DATABASE_URL")
        else "SELECT * FROM users WHERE google_id = ?",
        (google_id,)
    ).fetchone()

    db.close()

    user = dict(user)
    return {
        "id":    user["id"],
        "email": user["email"],
        "name":  user["name"],
        "role":  user["role"]
    }


def get_user_by_id(user_id: int) -> dict:
    db     = get_db()
    cursor = db.cursor()

    user = cursor.execute(
        "SELECT * FROM users WHERE id = %s"
        if os.getenv("DATABASE_URL")
        else "SELECT * FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    db.close()

    if not user:
        return None

    user = dict(user)
    return {
        "id":    user["id"],
        "email": user["email"],
        "name":  user["name"],
        "role":  user["role"]
    }