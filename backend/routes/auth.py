"""
EarlyCare Authentication & RBAC Routes (Future-Ready)
------------------------------------------------------
API routes for user registration, authentication (JWT), session management, and RBAC role retrieval.
"""
from flask import Blueprint, jsonify, request

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/login", methods=["POST"])
def login():
    """Placeholder login endpoint preparing JWT authentication architecture."""
    data = request.get_json() or {}
    email = data.get("email", "")
    role = data.get("role", "patient")

    return jsonify({
        "status": "success",
        "message": "Authentication endpoint ready for JWT implementation",
        "user": {
            "id": 1,
            "email": email or "user@earlycare.org",
            "name": "Demo User",
            "role": role,
        },
        "token": "mock-jwt-token-placeholder"
    }), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    """Placeholder register endpoint for user onboarding with RBAC role assignment."""
    data = request.get_json() or {}
    return jsonify({
        "status": "success",
        "message": "User registration endpoint ready for DB persistence",
        "user": {
            "id": 1,
            "email": data.get("email", "newuser@earlycare.org"),
            "role": data.get("role", "patient")
        }
    }), 201


@auth_bp.route("/me", methods=["GET"])
def current_user():
    """Placeholder current user authentication check."""
    return jsonify({
        "status": "success",
        "user": {
            "id": 1,
            "email": "user@earlycare.org",
            "role": "patient",
            "name": "Demo User"
        }
    }), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Placeholder logout endpoint."""
    return jsonify({"status": "success", "message": "Logged out successfully"}), 200
