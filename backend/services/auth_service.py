from database import get_db

def get_or_create_user(google_id: str, email: str, name: str) -> dict:
    """
    If user exists → return them.
    If not → create with default role: customer.
    """
    db = get_db()
    cursor = db.cursor()

    user = cursor.execute(
        "SELECT * FROM users WHERE google_id = ?", (google_id,)
    ).fetchone()

    if not user:
        cursor.execute(
            "INSERT INTO users (google_id, email, name, role) VALUES (?, ?, ?, ?)",
            (google_id, email, name, "customer")
        )
        db.commit()
        user = cursor.execute(
            "SELECT * FROM users WHERE google_id = ?", (google_id,)
        ).fetchone()

    db.close()

    return {
        "id":    user["id"],
        "email": user["email"],
        "name":  user["name"],
        "role":  user["role"]
    }


def get_user_by_id(user_id: int) -> dict:
    db = get_db()
    cursor = db.cursor()

    user = cursor.execute(
        "SELECT * FROM users WHERE id = ?", (user_id,)
    ).fetchone()

    db.close()

    if not user:
        return None

    return {
        "id":    user["id"],
        "email": user["email"],
        "name":  user["name"],
        "role":  user["role"]
    }