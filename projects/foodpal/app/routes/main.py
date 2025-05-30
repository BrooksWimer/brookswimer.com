from flask import Blueprint, jsonify, Response, stream_with_context
import time
import logging

logger = logging.getLogger(__name__)
main_bp = Blueprint('main', __name__)

# Global status updates list
status_updates = []

def send_update(message):
    """Stores status updates to send to the frontend."""
    status_updates.append(message)
    logger.info(f"Update: {message}")

@main_bp.route("/")
def home():
    """Simple health check endpoint."""
    return "Backend is running!"

@main_bp.route("/progress")
def progress():
    """Streams status updates to the frontend."""
    def generate():
        while True:
            if status_updates:
                yield f"data: {status_updates.pop(0)}\n\n"
            time.sleep(0.5)  # Avoid excessive CPU usage
    return Response(stream_with_context(generate()), mimetype="text/event-stream")

@main_bp.errorhandler(Exception)
def handle_exception(e):
    """Global error handler."""
    logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({"error": "Something went wrong. Please try again later."}), 500 