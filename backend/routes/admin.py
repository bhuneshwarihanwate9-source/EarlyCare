"""
EarlyCare Admin Portal Routes (Future-Ready)
--------------------------------------------
Endpoints for platform administration, system usage analytics, model stats, and user account management.
"""
from flask import Blueprint, jsonify, request

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Placeholder overall platform telemetry for administrator oversight."""
    return jsonify({
        "status": "success",
        "data": {
            "total_users": 0,
            "total_screenings": 0,
            "system_health": "operational"
        }
    }), 200


@admin_bp.route("/analytics", methods=["GET"])
def get_analytics():
    """Placeholder model usage distribution and population risk metrics."""
    return jsonify({
        "status": "success",
        "analytics": {
            "disease_distribution": {"diabetes": 0, "hypertension": 0, "heart_disease": 0},
            "monthly_screenings": []
        }
    }), 200


@admin_bp.route("/users", methods=["GET"])
def list_users():
    """Placeholder user list across roles (patients, doctors, admins)."""
    return jsonify({
        "status": "success",
        "users": []
    }), 200
