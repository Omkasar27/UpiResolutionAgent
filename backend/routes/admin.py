import os
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, get_jwt
from database import get_db
from routes.auth_helper import admin_required
from utils.db_helper import placeholder as ph

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/admin/disputes", methods=["GET"])
@admin_required
def get_all_disputes():
    db     = get_db()
    cursor = db.cursor()

    disputes = cursor.execute("""
        SELECT d.*, t.amount, t.merchant_id
        FROM disputes d
        LEFT JOIN transactions t ON d.transaction_id = t.id
        ORDER BY d.created_at DESC
    """).fetchall()

    db.close()

    return jsonify({
        "success":  True,
        "total":    len(disputes),
        "disputes": [{
            "dispute_id":     d["id"],
            "transaction_id": d["transaction_id"],
            "customer_name":  d["customer_name"],
            "description":    d["description"],
            "status":         d["status"],
            "ai_action":      d["ai_action"],
            "ai_reason":      d["ai_reason"],
            "ai_confidence":  d["ai_confidence"],
            "amount":         d["amount"],
            "merchant_id":    d["merchant_id"],
            "created_at":     str(d["created_at"])
        } for d in disputes]
    })


@admin_bp.route("/admin/disputes/<int:dispute_id>/override", methods=["POST"])
@admin_required
def override_decision(dispute_id):
    claims = get_jwt()
    data   = request.get_json()
    P      = ph()

    if not data or "action" not in data:
        return jsonify({"success": False, "error": "action is required."}), 400

    action = data["action"].upper()
    if action not in ["REFUND", "WAIT", "ESCALATE"]:
        return jsonify({"success": False, "error": "Invalid action."}), 400

    status_map = {
        "REFUND":   "RESOLVED",
        "WAIT":     "PENDING",
        "ESCALATE": "ESCALATED"
    }

    db     = get_db()
    cursor = db.cursor()

    dispute = cursor.execute(
        f"SELECT * FROM disputes WHERE id = {P}", (dispute_id,)
    ).fetchone()

    if not dispute:
        db.close()
        return jsonify({"success": False, "error": "Dispute not found."}), 404

    cursor.execute(f"""
        UPDATE disputes
        SET ai_action = {P}, ai_reason = {P}, status = {P}
        WHERE id = {P}
    """, (action, "Manually overridden by admin.", status_map[action], dispute_id))

    cursor.execute(
        f"INSERT INTO logs (dispute_id, action, performed_by, note) VALUES ({P}, {P}, {P}, {P})",
        (dispute_id, f"OVERRIDE - {action}", claims.get("email"), f"Admin overrode to {action}.")
    )

    db.commit()
    db.close()

    return jsonify({
        "success":    True,
        "message":    f"Dispute {dispute_id} overridden to {action}.",
        "new_status": status_map[action]
    })


@admin_bp.route("/admin/disputes/<int:dispute_id>/logs", methods=["GET"])
@admin_required
def get_dispute_logs(dispute_id):
    P      = ph()
    db     = get_db()
    cursor = db.cursor()

    logs = cursor.execute(
        f"SELECT * FROM logs WHERE dispute_id = {P} ORDER BY created_at ASC",
        (dispute_id,)
    ).fetchall()

    db.close()

    return jsonify({
        "success": True,
        "logs": [{
            "action":       l["action"],
            "performed_by": l["performed_by"],
            "note":         l["note"],
            "created_at":   str(l["created_at"])
        } for l in logs]
    })