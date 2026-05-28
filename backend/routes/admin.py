from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity
from database import get_db
from routes.auth_helper import admin_required
from flask_jwt_extended import get_jwt_identity, get_jwt

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
            "created_at":     d["created_at"]
        } for d in disputes]
    })




# Inside override_decision()
@admin_bp.route("/admin/disputes/<int:dispute_id>/override", methods=["POST"])
@admin_required
def override_decision(dispute_id):
    claims = get_jwt()
    data   = request.get_json()

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
        "SELECT * FROM disputes WHERE id = ?", (dispute_id,)
    ).fetchone()

    if not dispute:
        db.close()
        return jsonify({"success": False, "error": "Dispute not found."}), 404

    cursor.execute("""
        UPDATE disputes
        SET ai_action = ?, ai_reason = ?, status = ?
        WHERE id = ?
    """, (action, "Manually overridden by admin.", status_map[action], dispute_id))

    # Log the override
    cursor.execute(
        "INSERT INTO logs (dispute_id, action, performed_by, note) VALUES (?, ?, ?, ?)",
        (dispute_id, f"OVERRIDE → {action}", claims.get("email"), f"Admin overrode to {action}.")
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
    db     = get_db()
    cursor = db.cursor()

    logs = cursor.execute(
        "SELECT * FROM logs WHERE dispute_id = ? ORDER BY created_at ASC",
        (dispute_id,)
    ).fetchall()

    db.close()

    return jsonify({
        "success": True,
        "logs": [{
            "action":       l["action"],
            "performed_by": l["performed_by"],
            "note":         l["note"],
            "created_at":   l["created_at"]
        } for l in logs]
    })