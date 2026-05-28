import os
from database import get_db, is_postgres

ADMIN_EMAILS = [
    "omkasar80@gmail.com",
]

def get_or_create_user(google_id: str, email: str, name: str) -> dict:
    db     = get_db()
    cursor = db.cursor()
    P      = "%s" if is_postgres() else "?"

    role = "admin" if email in ADMIN_EMAILS else "customer"

    user = cursor.execute(
        f"SELECT * FROM users WHERE google_id = {P}", (google_id,)
    ).fetchone()

    if not user:
        cursor.execute(
            f"INSERT INTO users (google_id, email, name, role) VALUES ({P}, {P}, {P}, {P})",
            (google_id, email, name, role)
        )
        db.commit()
    else:
        user = dict(user)
        if email in ADMIN_EMAILS and user.get("role") != "admin":
            cursor.execute(
                f"UPDATE users SET role = {P} WHERE google_id = {P}",
                ("admin", google_id)
            )
            db.commit()

    user = cursor.execute(
        f"SELECT * FROM users WHERE google_id = {P}", (google_id,)
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
    P      = "%s" if is_postgres() else "?"

    user = cursor.execute(
        f"SELECT * FROM users WHERE id = {P}", (user_id,)
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