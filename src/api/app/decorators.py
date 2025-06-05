from flask import session, jsonify
from functools import wraps
import os

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

def is_admin():
    return session.get("user") == ADMIN_EMAIL

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not is_admin():
            return jsonify({"error": "Unauthorized"}), 403
        return f(*args, **kwargs)
    return wrapper
