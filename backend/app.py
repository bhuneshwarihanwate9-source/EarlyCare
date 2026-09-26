"""
EarlyCare Scalable Backend Server
---------------------------------
Flask application factory and Blueprint registration entrypoint.
Organized into modular routes, services, database models, and ML prediction engines.

Run:
    cd backend
    python app.py
"""
import os
import sys

# Ensure backend root directory is in Python path for clean module imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS

from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.doctor import doctor_bp
from routes.patient import patient_bp
from routes.prediction import prediction_bp


def create_app():
    """Application factory for EarlyCare API server."""
    app = Flask(__name__)
    CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

    # Register modular Blueprints
    app.register_blueprint(prediction_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(patient_bp)
    app.register_blueprint(doctor_bp)
    app.register_blueprint(admin_bp)

    @app.route("/", methods=["GET"])
    def root():
        return jsonify({
            "name": "EarlyCare API Server",
            "status": "healthy",
            "version": "2.0.0",
            "endpoints": {
                "health": "/api/health",
                "prediction_schema": "/api/form-schema",
                "prediction": "/api/predict",
                "auth": "/api/auth/*",
                "patient": "/api/patient/*",
                "doctor": "/api/doctor/*",
                "admin": "/api/admin/*"
            }
        })

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "service": "EarlyCare Backend"})

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Starting EarlyCare Production Server on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
