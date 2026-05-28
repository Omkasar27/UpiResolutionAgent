import os
from flask import Blueprint, redirect, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from authlib.integrations.flask_client import OAuth
from services.auth_service import get_or_create_user
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

auth_bp = Blueprint("auth", __name__)
oauth   = OAuth()

def init_oauth(app):
    oauth.init_app(app)
    oauth.register(
        name="google",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"}
    )

def get_frontend_url():
    """Always reads fresh from environment."""
    return os.getenv("FRONTEND_URL", "http://localhost:5173")

def get_redirect_uri():
    """Force https for production on Render."""
    host = request.host_url.rstrip("/")
    if "onrender.com" in host:
        host = host.replace("http://", "https://")
    return f"{host}/auth/callback"

@auth_bp.route("/auth/login")
def login():
    redirect_uri = get_redirect_uri()
    return oauth.google.authorize_redirect(redirect_uri)


@auth_bp.route("/auth/callback")
def callback():
    frontend_url = get_frontend_url()
    try:
        token     = oauth.google.authorize_access_token()
        user_info = token.get("userinfo")

        if not user_info:
            return redirect(f"{frontend_url}/auth?error=No user info returned")

        google_id = user_info["sub"]
        email     = user_info["email"]
        name      = user_info.get("name", "User")

        user      = get_or_create_user(google_id, email, name)

        jwt_token = create_access_token(
            identity=str(user["id"]),
            additional_claims={
                "role":  user["role"],
                "name":  user["name"],
                "email": user["email"]
            }
        )

        return redirect(
            f"{frontend_url}/auth?token={jwt_token}&role={user['role']}&name={user['name']}"
        )

    except Exception as e:
        return redirect(f"{frontend_url}/auth?error={str(e)}")


@auth_bp.route("/auth/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    claims  = get_jwt()
    return jsonify({
        "success": True,
        "user": {
            "id":    user_id,
            "role":  claims.get("role"),
            "name":  claims.get("name"),
            "email": claims.get("email")
        }
    })