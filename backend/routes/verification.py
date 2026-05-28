from flask import Blueprint, jsonify
from database import get_db
from services.mock_bank import get_transaction_from_bank
from services.mock_merchant import get_merchant_status
from services.ai_agent import call_groq_agent

verification_bp = Blueprint("verification", __name__)


@verification_bp.route("/disputes/<int:dispute_id>/verify", methods=["POST"])
def verify_dispute(dispute_id):
    """
    Triggers AI verification for a dispute.
    - Fetches bank + merchant data
    - Calls Groq AI agent
    - Updates dispute status
    - Triggers refund if AI says REFUND
    """
    db = get_db()
    cursor = db.cursor()

    # Fetch dispute
    dispute = cursor.execute(
        "SELECT * FROM disputes WHERE id = ?", (dispute_id,)
    ).fetchone()

    if not dispute:
        db.close()
        return jsonify({"success": False, "error": "Dispute not found."}), 404

    if dispute["status"] != "OPEN":
        db.close()
        return jsonify({
            "success": False,
            "error": f"Dispute is already {dispute['status']}. Cannot re-verify."
        }), 400

    transaction_id = dispute["transaction_id"]

    # Fetch bank + merchant data
    bank_data = get_transaction_from_bank(transaction_id)
    merchant_data = get_merchant_status(transaction_id)

    bank_status = bank_data.get("bank_status", "UNKNOWN")
    merchant_status = merchant_data.get("merchant_status", "UNKNOWN")
    amount = bank_data.get("amount", 0.0)

    # Call AI Agent
    ai_result = call_groq_agent(
        transaction_id=transaction_id,
        bank_status=bank_status,
        merchant_status=merchant_status,
        amount_debited=amount
    )

    if not ai_result["success"]:
        db.close()
        return jsonify({"success": False, "error": ai_result["error"]}), 500

    ai_action     = ai_result["action"]
    ai_reason     = ai_result["reason"]
    ai_confidence = ai_result["confidence"]

    # Map AI action to dispute status
    status_map = {
        "REFUND":   "RESOLVED",
        "WAIT":     "PENDING",
        "ESCALATE": "ESCALATED"
    }
    new_status = status_map.get(ai_action, "PENDING")

    # Update dispute in DB
    cursor.execute("""
        UPDATE disputes
        SET status = ?, ai_action = ?, ai_reason = ?, ai_confidence = ?
        WHERE id = ?
    """, (new_status, ai_action, ai_reason, ai_confidence, dispute_id))

    # If REFUND — create a refund record
    refund_info = None
    if ai_action == "REFUND":
        cursor.execute("""
            INSERT INTO refunds (transaction_id, dispute_id, amount, status)
            VALUES (?, ?, ?, ?)
        """, (transaction_id, dispute_id, amount, "INITIATED"))

        refund_id = cursor.lastrowid
        refund_info = {
            "refund_id": refund_id,
            "amount": amount,
            "status": "INITIATED"
        }

    db.commit()
    db.close()

    return jsonify({
        "success": True,
        "dispute_id": dispute_id,
        "transaction_id": transaction_id,
        "ai_action": ai_action,
        "ai_reason": ai_reason,
        "ai_confidence": ai_confidence,
        "dispute_status": new_status,
        "refund": refund_info
    })