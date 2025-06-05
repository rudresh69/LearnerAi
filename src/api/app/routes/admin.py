from flask import Blueprint, request, jsonify, current_app as app
from datetime import datetime, timedelta
import logging

from app.decorators import admin_required
from app.utils.session import get_user_limit, update_last_active
from app.utils.cache import clear_cached_map, list_all_cached_maps

bp = Blueprint("admin", __name__, url_prefix="/api/admin")
logger = logging.getLogger(__name__)

@bp.route("/sessions")
@admin_required
def admin_sessions():
    keys = app.config["SESSION_REDIS"].keys("user:*")
    sessions = []

    for key in keys:
        email = key.decode().split("user:")[1]
        data = app.config["SESSION_REDIS"].hgetall(key)
        if b"google" not in data:
            continue

        last_active_str = data.get(b"last_active", b"").decode()
        last_active = datetime.fromisoformat(last_active_str) if last_active_str else None
        online = last_active and datetime.utcnow() - last_active < timedelta(minutes=5)

        sessions.append({
            "email": email,
            "name": data.get(b"name", b"").decode(),
            "ip": data.get(b"ip", b"").decode(),
            "agent": data.get(b"agent", b"").decode(),
            "login_time": data.get(b"login_time", b"").decode(),
            "last_active": last_active_str,
            "status": "online" if online else "offline",
            "mindMapsUsed": app.config["SESSION_REDIS"].hlen(f"user:{email}:mindmaps"),
            "mindMapLimit": get_user_limit(email)
        })

    return jsonify(sessions)

@bp.route("/terminate-session", methods=["POST"])
@admin_required
def admin_terminate():
    email = request.json.get("email")
    if not email:
        return jsonify({"error": "Missing email"}), 400

    session_id = app.config["SESSION_REDIS"].hget(f"user:{email}", "session_id")
    app.config["SESSION_REDIS"].delete(f"user:{email}")
    if session_id:
        app.config["SESSION_REDIS"].delete(f"session:{session_id.decode()}")

    return jsonify({"message": "Session terminated"})

@bp.route("/stats")
@admin_required
def admin_stats():
    keys = app.config["SESSION_REDIS"].keys("user:*")
    total_users = 0
    online_users = 0
    total_maps = 0

    for key in keys:
        email = key.decode().split("user:")[1]
        data = app.config["SESSION_REDIS"].hgetall(key)

        if b"google" not in data:
            continue

        total_users += 1
        last_active_str = data.get(b"last_active", b"").decode()
        last_active = datetime.fromisoformat(last_active_str) if last_active_str else None
        if last_active and datetime.utcnow() - last_active < timedelta(minutes=5):
            online_users += 1

        mindmaps_key = f"user:{email}:mindmaps"
        total_maps += app.config["SESSION_REDIS"].hlen(mindmaps_key)

    return jsonify({
        "totalUsers": total_users,
        "onlineUsers": online_users,
        "totalMindMaps": total_maps
    })

@bp.route("/reset-mindmaps", methods=["POST"])
@admin_required
def reset_mindmaps():
    email = request.json.get("email")
    app.config["SESSION_REDIS"].delete(f"user:{email}:mindmaps")
    return jsonify({"message": f"Mind maps for {email} reset."})

@bp.route("/set-limit", methods=["POST"])
@admin_required
def admin_set_limit():
    email, limit = request.json.get("email"), request.json.get("limit")
    app.config["SESSION_REDIS"].hset(f"user:{email}", "limit", limit)
    return jsonify({"message": f"Limit set to {limit} for {email}."})

@bp.route("/cached-maps", methods=["GET"])
@admin_required
def get_cached_maps():
    try:
        keys = list_all_cached_maps()
        return jsonify(keys)
    except Exception as e:
        logger.error(f"Failed to list cached maps: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route("/list-cache", methods=["GET"])
@admin_required
def list_cache():
    maps = list_all_cached_maps()
    return jsonify({"maps": maps})

@bp.route("/clear-cache", methods=["POST"])
@admin_required
def clear_cache():
    data = request.get_json()
    topic = data.get("topic", "").strip().lower()
    map_type = data.get("map_type", "").strip().lower()

    if not topic or not map_type:
        return jsonify({"success": False, "error": "Missing topic or map_type"}), 400

    try:
        cleared = clear_cached_map(topic, map_type)
        if cleared:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "Cache key not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route("/clear-cached-map", methods=["POST", "OPTIONS"])
@admin_required
def clear_cached_map_route():
    if request.method == "OPTIONS":
        return '', 200  # preflight response

    data = request.json
    topic = data.get("topic")
    map_type = data.get("type")
    if not topic or not map_type:
        return jsonify({"error": "Missing topic or type"}), 400

    try:
        clear_cached_map(topic, map_type)
        return jsonify({"message": "Cache cleared."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/all-users")
@admin_required
def get_all_users():
    try:
        keys = app.config["SESSION_REDIS"].keys("user:*")
        users = []

        for key in keys:
            key_str = key.decode()
            if ":mindmaps" in key_str:
                continue

            email = key_str.replace("user:", "")
            user_data = app.config["SESSION_REDIS"].hgetall(key)
            user = {
                "email": email,
                "name": user_data.get(b"name", b"").decode(),
                "picture": user_data.get(b"picture", b"").decode(),
                "limit": int(user_data.get(b"limit", b"5").decode())
            }
            users.append(user)

        return jsonify(users)
    except Exception as e:
        logger.error(f"[ERROR] Failed to fetch all users: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500
