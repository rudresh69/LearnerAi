import os
import redis
from flask import Flask
from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth

# Load environment variables
load_dotenv()

# Initialize OAuth
oauth = OAuth()
google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile", "prompt": "select_account"}
)

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY")

    # Redis session setup
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    app.config.update(
        SESSION_TYPE="redis",
        SESSION_REDIS=redis.from_url(redis_url),
        SESSION_PERMANENT=False,
        SESSION_USE_SIGNER=True,
        SESSION_COOKIE_SAMESITE="None",   
        SESSION_COOKIE_SECURE=True,       
    )
    Session(app)

    # CORS for API routes — explicitly allow your frontend origin
    CORS(app, supports_credentials=True, origins=[os.getenv("FRONTEND_URL")])


    # ✅ OAuth must be initialized BEFORE blueprints are imported
    oauth.init_app(app)

    # Route blueprints
    from app.routes.auth import bp as auth_bp
    from app.routes.mindmap import bp as mindmap_bp
    from app.routes.admin import bp as admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(mindmap_bp)
    app.register_blueprint(admin_bp)

    return app
