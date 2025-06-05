from flask import current_app as app
from datetime import datetime
import json

def update_last_active(email: str):
    now = datetime.utcnow().isoformat()
    app.config["SESSION_REDIS"].hset(f"user:{email}", "last_active", now)

def get_user_limit(email: str) -> int:
    key = f"user:{email}"
    val = app.config["SESSION_REDIS"].hget(key, "limit")
    return int(val.decode()) if val else 5

def store_mind_map(email: str, map_id: str, topic: str, map_type: str, mermaid_code: str):
    redis_key = f"user:{email}:mindmaps"
    if app.config["SESSION_REDIS"].hlen(redis_key) >= get_user_limit(email):
        raise ValueError("Limit reached.")
    app.config["SESSION_REDIS"].hset(redis_key, map_id, json.dumps({
        "id": map_id,
        "createdAt": datetime.utcnow().isoformat(),
        "topic": topic,
        "type": map_type,
        "mermaidCode": mermaid_code
    }))
