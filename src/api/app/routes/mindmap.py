from flask import Blueprint, request, jsonify, session, current_app as app
from datetime import datetime
import logging

from app.utils.cache import get_cached_mind_map, cache_mind_map
from app.utils.gemini import query_gemini, extract_mermaid_code, get_gemini_response
from app.utils.svg import convert_mermaid_to_svg
from app.utils.image_scrapper import scrape_images
from app.utils.session import update_last_active, store_mind_map

bp = Blueprint("mindmap", __name__, url_prefix="/api")
logger = logging.getLogger(__name__)

@bp.route("/generate-mindmap", methods=["POST"])
def generate_mindmap():
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    update_last_active(session["user"])
    data = request.json
    topic, map_type, text = data.get("topic"), data.get("type"), data.get("text")

    if not topic or not map_type:
        return jsonify({"error": "Missing fields"}), 400

    try:
        cached = get_cached_mind_map(topic, map_type)
        if cached:
            logger.info(f"[CACHE HIT] topic='{topic}' type='{map_type}'")
            svg = convert_mermaid_to_svg(cached["mermaid"])
            map_id = str(datetime.utcnow().timestamp())
            store_mind_map(session["user"], map_id, topic, map_type, cached["mermaid"])
            return jsonify({"mermaidCode": cached["mermaid"], "svg": svg, "mindMapId": map_id})

        if map_type == "text":
            prompt = f"Create a mind map in Mermaid syntax based on this paragraph:\n{text}"
            logger.info(f"[TEXT MAP] Prompt sent to Gemini:\n{prompt}")
            gemini_response = get_gemini_response(prompt)
            logger.info(f"[TEXT MAP] Gemini response:\n{gemini_response}")
            code = extract_mermaid_code(gemini_response)
            if not code:
                raise ValueError("Failed to extract Mermaid code from Gemini response.")
        else:
            code = query_gemini(topic, map_type, text)

        svg = convert_mermaid_to_svg(code)
        map_id = str(datetime.utcnow().timestamp())
        store_mind_map(session["user"], map_id, topic, map_type, code)
        cache_mind_map(topic, map_type, code)
        logger.info(f"[CACHE STORE] topic='{topic}' type='{map_type}'")

        return jsonify({"mermaidCode": code, "svg": svg, "mindMapId": map_id})
    except Exception as e:
        logger.error(f"[ERROR] generate_mindmap failed: {e}")
        return jsonify({"error": str(e)}), 500

@bp.route("/related-images", methods=["GET"])
def related_images():
    if "user" in session:
        update_last_active(session["user"])

    topic = request.args.get("topic")
    if not topic:
        return jsonify({"error": "Missing topic"}), 400

    try:
        return jsonify(scrape_images(topic))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
