import os
from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt
from database import get_db
from services.mock_bank import get_transaction_from_bank
from services.mock_merchant import get_merchant_status
from services.ai_agent import call_groq_agent
from routes.auth_helper import jwt_required_custom
from utils.db_helper import placeholder as ph

verification_bp = Blueprint("verification", __name__)

@verification_bp.route("/disputes/<int:dispute_id>/verify", methods=["POST"])
@jwt_required_custom
def verify_dispute(dispute_id):
    user_id = get_jwt_identity()
    claims  = get_jwt()
    role    = claims.get("role")
    P       = ph()

    db     = get_db()
    cursor = db.cursor()

    dispute = cursor.execute(
        f"SELECT * FROM disputes WHERE id = {P}", (dispute_id,)
    ).fetchone()

    if not dispute:
        db.close()
        return jsonify({"success": False, "error": "Dispute not found."}), 404

    dispute = dict(dispute)

    if role != "admin" and str(dispute["user_id"]) != str(user_id):
        db.close()
        return jsonify({"success": False, "error": "Access denied."}), 403

    if dispute["status"] != "OPEN":
        db.close()
        return jsonify({
            "success": False,
            "error":   f"Dispute is already {dispute['status']}."
        }), 400

    transaction_id  = dispute["transaction_id"]
    bank_data       = get_transaction_from_bank(transaction_id)
    merchant_data   = get_merchant_status(transaction_id)

    bank_status     = bank_data.get("bank_status", "UNKNOWN")
    merchant_status = merchant_data.get("merchant_status", "UNKNOWN")
    amount          = bank_data.get("amount", 0.0)

    # Call AI Agent
    ai_result = call_groq_agent(
        transaction_id=transaction_id,
        bank_status=bank_status,
        merchant_status=merchant_status,
        amount_debited=amount
    )

    if not ai_result["success"]:
        db.close()
        return jsonify({
            "success": False,
            "error":   "AI agent failed. Please try again.",
            "detail":  ai_result.get("error")
        }), 500

    ai_action     = ai_result["action"]
    ai_reason     = ai_result["reason"]
    ai_confidence = ai_result["confidence"]

    status_map = {
        "REFUND":   "RESOLVED",
        "WAIT":     "PENDING",
        "ESCALATE": "ESCALATED"
    }
    new_status = status_map.get(ai_action, "PENDING")

    # Update dispute
    cursor.execute(f"""
        UPDATE disputes
        SET status = {P}, ai_action = {P}, ai_reason = {P}, ai_confidence = {P}
        WHERE id = {P}
    """, (new_status, ai_action, ai_reason, ai_confidence, dispute_id))

    # Log AI decision
    cursor.execute(
        f"INSERT INTO logs (dispute_id, action, performed_by, note) VALUES ({P}, {P}, {P}, {P})",
        (dispute_id, f"AI - {ai_action}", "AI Agent", ai_reason)
    )

    # Create refund if needed
    refund_info = None
    if ai_action == "REFUND":
        cursor.execute(f"""
            INSERT INTO refunds (transaction_id, dispute_id, amount, status)
            VALUES ({P}, {P}, {P}, {P})
        """, (transaction_id, dispute_id, amount, "INITIATED"))

        # Get refund id
        if os.getenv("DATABASE_URL"):
            refund_id = cursor.execute(
                "SELECT id FROM refunds WHERE dispute_id = %s ORDER BY created_at DESC LIMIT 1",
                (dispute_id,)
            ).fetchone()["id"]
        else:
            refund_id = cursor.lastrowid

        refund_info = {
            "refund_id": refund_id,
            "amount":    amount,
            "status":    "INITIATED"
        }

        cursor.execute(
            f"INSERT INTO logs (dispute_id, action, performed_by, note) VALUES ({P}, {P}, {P}, {P})",
            (dispute_id, "REFUND INITIATED", "System", f"Refund of {amount} initiated.")
        )

    db.commit()
    db.close()

    return jsonify({
        "success":        True,
        "dispute_id":     dispute_id,
        "transaction_id": transaction_id,
        "ai_action":      ai_action,
        "ai_reason":      ai_reason,
        "ai_confidence":  ai_confidence,
        "dispute_status": new_status,
        "refund":         refund_info
    })