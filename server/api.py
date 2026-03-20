from io import StringIO
import os
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from business_logic import analyze_portfolio

DIST_DIR = Path(__file__).resolve().parent.parent / "app" / "dist"

app = Flask(__name__, static_folder=str(DIST_DIR), static_url_path="")

app_env = os.getenv("APP_ENV", os.getenv("FLASK_ENV", "development")).lower()
is_dev = app_env in {"development", "dev", "local"}
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
cors_origins = [frontend_origin] if is_dev else os.getenv("CORS_ORIGINS", "").split(",")
cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]

if cors_origins:
    CORS(app, resources={r"/submit": {"origins": cors_origins}})

@app.route("/submit", methods=["POST"])
def handle_submit():
    content_type = (request.content_type or "").lower()

    if content_type.startswith("text/csv"):
        csv_text = request.get_data(as_text=True)
        if not csv_text.strip():
            return jsonify({"error": "Request body must contain CSV data."}), 400
        csv_source = StringIO(csv_text)
    else:
        return jsonify({"error": "Content-Type header must be set to text/csv."}), 400

    try:
        analytics = analyze_portfolio(csv_source)
    except Exception:
        app.logger.exception("Portfolio analysis failed")
        return jsonify({"error": "Unable to analyze portfolio right now."}), 500

    return jsonify({"analytics": analytics})


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_app(path: str):
    if not DIST_DIR.exists():
        return jsonify({"error": "Frontend build not found."}), 503

    if path:
        asset_path = DIST_DIR / path
        if asset_path.exists() and asset_path.is_file():
            return send_from_directory(DIST_DIR, path)

    return send_from_directory(DIST_DIR, "index.html")


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    app.run(host=host, port=port, debug=is_dev)
