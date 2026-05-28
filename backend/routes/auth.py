from flask import Blueprint, redirect, jsonify, request, current_app
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity
from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.auth_service import get_or_create_user
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL

auth_bp = Blueprint("auth", __name__)
oauth    = OAuth()

def init_oauth(app):
    oauth.init_app(app)
    oauth.register(
        name="google",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"}
    )


@auth_bp.route("/auth/login")
def login():
    """
    Redirects user to Google OAuth login page.
    """
    redirect_uri = request.host_url.rstrip("/") + "/auth/callback"
    return oauth.google.authorize_redirect(redirect_uri)


@auth_bp.route("/auth/callback")
def callback():
    try:
        token       = oauth.google.authorize_access_token()
        user_info   = token.get("userinfo")

        google_id   = user_info["sub"]
        email       = user_info["email"]
        name        = user_info.get("name", "User")

        # Get or create user in DB
        user        = get_or_create_user(google_id, email, name)

        # Fix — identity must be a string (use user id as string)
        jwt_token   = create_access_token(
            identity=str(user["id"]),
            additional_claims={
                "role":  user["role"],
                "name":  user["name"],
                "email": user["email"]
            }
        )

        return redirect(f"{FRONTEND_URL}/auth?token={jwt_token}&role={user['role']}&name={user['name']}")

    except Exception as e:
        return redirect(f"{FRONTEND_URL}/auth?error=Login failed: {str(e)}")


@auth_bp.route("/auth/me")
@jwt_required()
def me():
    user_id  = get_jwt_identity()       # now a string
    claims   = get_jwt()                # gets additional claims
    return jsonify({
        "success": True,
        "user": {
            "id":    user_id,
            "role":  claims.get("role"),
            "name":  claims.get("name"),
            "email": claims.get("email")
        }
    })