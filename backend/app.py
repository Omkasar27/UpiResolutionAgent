import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.middleware.proxy_fix import ProxyFix
from models import init_db
from config import JWT_SECRET_KEY
from routes.disputes import disputes_bp
from routes.verification import verification_bp
from routes.admin import admin_bp
from routes.auth import auth_bp, init_oauth

app = Flask(__name__)

# Fix https behind Render proxy
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

CORS(app,
    supports_credentials=True,
    origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        os.getenv("FRONTEND_URL", "")
    ]
)

app.config["JWT_SECRET_KEY"]           = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
app.config["SECRET_KEY"]               = JWT_SECRET_KEY

JWTManager(app)
init_oauth(app)
init_db()

app.register_blueprint(auth_bp)
app.register_blueprint(disputes_bp)
app.register_blueprint(verification_bp)
app.register_blueprint(admin_bp)

@app.route("/")
def home():
    return {"message": "UPI Dispute Resolution Agent is running!"}

@app.route("/debug")
def debug():
    import os
    db_url = os.getenv("DATABASE_URL")
    return {
        "DATABASE_URL_SET": bool(db_url),
        "DATABASE_URL_PREFIX": db_url[:20] if db_url else None,
        "FRONTEND_URL": os.getenv("FRONTEND_URL"),
        "GROQ_KEY_SET": bool(os.getenv("GROQ_API_KEY"))
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)