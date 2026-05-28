from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt

def jwt_required_custom(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return jsonify({"success": False, "error": "Unauthorized. Please login."}), 401
        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") != "admin":
                return jsonify({"success": False, "error": "Admin access only."}), 403
        except Exception:
            return jsonify({"success": False, "error": "Unauthorized."}), 401
        return f(*args, **kwargs)
    return decorated