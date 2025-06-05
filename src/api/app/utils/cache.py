import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()
redis_url = os.getenv("REDIS_URL")
r = redis.StrictRedis.from_url(redis_url, decode_responses=True)

def _get_cache_key(topic, map_type):
    return f"mindmap:{topic}:{map_type}"

def cache_mind_map(topic, map_type, code):
    key = _get_cache_key(topic, map_type)
    data = {"mermaid": code}
    r.set(key, json.dumps(data), ex=86400)  # Optional: expires in 1 day

def get_cached_mind_map(topic, map_type):
    key = _get_cache_key(topic, map_type)
    value = r.get(key)
    if value:
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            print(f"[!] Failed to decode cached map for key: {key}")
            return None
    return None

def clear_cached_map(topic, map_type):
    key = _get_cache_key(topic, map_type)
    if r.exists(key):
        r.delete(key)
        return True
    else:
        print(f"[!] Cache key not found: {key}")
        return False

def list_all_cached_maps():
    maps = []
    for key in r.scan_iter("mindmap:*"):
        parts = key.split(":")
        if len(parts) == 3:
            _, topic, map_type = parts
            maps.append({
                "topic": topic,
                "map_type": map_type
            })
    return maps
