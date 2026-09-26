"""
EarlyCare Doctor Portal Routes (Future-Ready)
---------------------------------------------
Endpoints for clinicians to monitor patient risk portfolios, review assessments, and add clinical notes.
"""
from flask import Blueprint, jsonify, request

doctor_bp = Blueprint("doctor", __name__, url_prefix="/api/doctor")


@doctor_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Placeholder doctor workspace metrics (high-risk patients, recent assessments)."""
    return jsonify({
        "status": "success",
        "data": {
            "total_assigned_patients": 0,
            "flagged_patients_count": 0,
            "recent_flags": []
        }
    }), 200


@doctor_bp.route("/patients", methods=["GET"])
def get_patients():
    """Placeholder patient list assigned to doctor."""
    return jsonify({
        "status": "success",
        "patients": []
    }), 200


@doctor_bp.route("/notes", methods=["POST"])
def add_clinical_note():
    """Placeholder endpoint for adding clinician diagnosis notes to patient risk records."""
    data = request.get_json() or {}
    return jsonify({
        "status": "success",
        "message": "Clinical note attached successfully",
        "note": {
            "patient_id": data.get("patient_id"),
            "content": data.get("content", ""),
            "created_at": "2026-09-20T00:00:00Z"
        }
    }), 200
