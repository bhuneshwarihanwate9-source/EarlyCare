"""
EarlyCare Patient Portal Routes (Future-Ready)
----------------------------------------------
Endpoints for patient dashboard telemetry, risk assessment history, and medical report upload.
"""
from flask import Blueprint, jsonify, request
from services.report_parser import report_parser_service

patient_bp = Blueprint("patient", __name__, url_prefix="/api/patient")


@patient_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Placeholder patient dashboard telemetry and assessment summaries."""
    return jsonify({
        "status": "success",
        "data": {
            "recent_assessments": [],
            "risk_trends": {"diabetes": "low", "hypertension": "moderate", "heart_disease": "low"},
            "pending_reports": 0
        }
    }), 200


@patient_bp.route("/assessments", methods=["GET"])
def get_assessment_history():
    """Placeholder historical risk evaluations for patient profile."""
    return jsonify({
        "status": "success",
        "assessments": []
    }), 200


@patient_bp.route("/upload-report", methods=["POST"])
def upload_report():
    """Placeholder endpoint for uploading medical lab report PDFs/Images."""
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files["file"]
    result = report_parser_service.parse_file(file.filename)
    return jsonify({
        "status": "success",
        "message": "File received for processing",
        "filename": file.filename,
        "parser_result": result
    }), 200
