from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt
from database import get_db
from services.mock_bank import get_transaction_from_bank
from services.mock_merchant import get_merchant_status
from routes.auth_helper import jwt_required_custom

disputes_bp = Blueprint("disputes", __name__)

VALID_TRANSACTION_IDS = ["TXN001", "TXN002", "TXN003", "TXN004", "TXN005"]

@disputes_bp.route("/disputes", methods=["POST"])
@jwt_required_custom
def create_dispute():
    user_id       = get_jwt_identity()
    claims        = get_jwt()
    customer_name = claims.get("name")

    data = request.get_json()

    # Validate input
    if not data:
        return jsonify({"success": False, "error": "Request body is required."}), 400

    transaction_id = data.get("transaction_id", "").strip().upper()
    description    = data.get("description", "").strip()

    if not transaction_id:
        return jsonify({"success": False, "error": "Transaction ID is required."}), 400

    if len(transaction_id) < 3:
        return jsonify({"success": False, "error": "Invalid Transaction ID format."}), 400

    if len(description) > 500:
        return jsonify({"success": False, "error": "Description too long. Max 500 characters."}), 400

    # Fetch from mock bank
    bank_data = get_transaction_from_bank(transaction_id)
    if not bank_data["success"]:
        return jsonify({
            "success": False,
            "error": f"Transaction {transaction_id} not found. Please check the ID."
        }), 404

    db     = get_db()
    cursor = db.cursor()

    # Insert transaction if not exists
    existing = cursor.execute(
        "SELECT * FROM transactions WHERE id = ?", (transaction_id,)
    ).fetchone()

    if not existing:
        cursor.execute(
            "INSERT INTO transactions (id, amount, status, merchant_id) VALUES (?, ?, ?, ?)",
            (transaction_id, bank_data["amount"], bank_data["bank_status"], bank_data["merchant_id"])
        )

    # Check duplicate dispute for this user
    existing_dispute = cursor.execute(
        "SELECT * FROM disputes WHERE transaction_id = ? AND user_id = ?",
        (transaction_id, user_id)
    ).fetchone()

    if existing_dispute:
        db.close()
        return jsonify({
            "success":    False,
            "error":      f"You have already raised a dispute for {transaction_id}.",
            "dispute_id": existing_dispute["id"]
        }), 409

    # Create dispute
    cursor.execute(
        """INSERT INTO disputes
           (user_id, transaction_id, customer_name, description, status)
           VALUES (?, ?, ?, ?, ?)""",
        (user_id, transaction_id, customer_name, description or "No description provided.", "OPEN")
    )
    db.commit()
    dispute_id = cursor.lastrowid

    # Log it
    cursor.execute(
        "INSERT INTO logs (dispute_id, action, performed_by, note) VALUES (?, ?, ?, ?)",
        (dispute_id, "CREATED", customer_name, "Dispute raised by customer.")
    )
    db.commit()
    db.close()

    return jsonify({
        "success":        True,
        "message":        "Dispute created successfully.",
        "dispute_id":     dispute_id,
        "transaction_id": transaction_id,
        "customer_name":  customer_name,
        "amount":         bank_data["amount"],
        "bank_status":    bank_data["bank_status"]
    }), 201


@disputes_bp.route("/disputes/<int:dispute_id>", methods=["GET"])
@jwt_required_custom
def get_dispute(dispute_id):
    user_id = get_jwt_identity()
    claims  = get_jwt()
    role    = claims.get("role")

    db     = get_db()
    cursor = db.cursor()

    dispute = cursor.execute(
        "SELECT * FROM disputes WHERE id = ?", (dispute_id,)
    ).fetchone()

    if not dispute:
        db.close()
        return jsonify({"success": False, "error": "Dispute not found."}), 404

    if role != "admin" and str(dispute["user_id"]) != str(user_id):
        db.close()
        return jsonify({"success": False, "error": "Access denied."}), 403

    transaction = cursor.execute(
        "SELECT * FROM transactions WHERE id = ?", (dispute["transaction_id"],)
    ).fetchone()

    db.close()

    return jsonify({
        "success":        True,
        "dispute_id":     dispute["id"],
        "transaction_id": dispute["transaction_id"],
        "customer_name":  dispute["customer_name"],
        "description":    dispute["description"],
        "dispute_status": dispute["status"],
        "ai_action":      dispute["ai_action"],
        "ai_reason":      dispute["ai_reason"],
        "ai_confidence":  dispute["ai_confidence"],
        "amount":         transaction["amount"] if transaction else None,
        "created_at":     dispute["created_at"]
    })


@disputes_bp.route("/disputes/my", methods=["GET"])
@jwt_required_custom
def get_my_disputes():
    user_id = get_jwt_identity()

    db     = get_db()
    cursor = db.cursor()

    disputes = cursor.execute("""
        SELECT d.*, t.amount, t.merchant_id
        FROM disputes d
        LEFT JOIN transactions t ON d.transaction_id = t.id
        WHERE d.user_id = ?
        ORDER BY d.created_at DESC
    """, (user_id,)).fetchall()

    db.close()

    return jsonify({
        "success":  True,
        "disputes": [{
            "dispute_id":     d["id"],
            "transaction_id": d["transaction_id"],
            "description":    d["description"],
            "status":         d["status"],
            "ai_action":      d["ai_action"],
            "ai_reason":      d["ai_reason"],
            "ai_confidence":  d["ai_confidence"],
            "amount":         d["amount"],
            "created_at":     d["created_at"]
        } for d in disputes]
    })