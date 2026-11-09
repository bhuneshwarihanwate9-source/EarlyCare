"""
EarlyCare Patient Portal Routes
------------------------------
Endpoints for patient dashboard telemetry, risk assessment history,
saving screenings, and uploading medical lab reports.
"""
import os
from flask import Blueprint, jsonify, request
from database.db import get_supabase, supabase
from services.report_parser import report_parser_service

patient_bp = Blueprint("patient", __name__, url_prefix="/api/patient")


def get_token_client():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:].strip() if auth_header.startswith("Bearer ") else ""
    return get_supabase(token if token else None)


@patient_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Returns patient dashboard telemetry and assessment summaries."""
    db = get_token_client()
    patient_id = request.args.get("patient_id")

    recent_assessments = []
    risk_trends = {"diabetes": "low", "hypertension": "low", "heart_disease": "low"}

    if patient_id:
        try:
            res = db.table("assessments").select("*, prediction_results(*)").eq("patient_id", patient_id).order("created_at", desc=True).limit(5).execute()
            if res.data:
                recent_assessments = res.data
                # Update trends based on newest assessment
                latest_preds = recent_assessments[0].get("prediction_results", [])
                for p in latest_preds:
                    name = p.get("disease_name", "").lower()
                    for k in risk_trends:
                        if k in name:
                            risk_trends[k] = p.get("risk_level", "low")
        except Exception as e:
            print("Dashboard assessment query notice:", e)

    return jsonify({
        "status": "success",
        "data": {
            "recent_assessments": recent_assessments,
            "risk_trends": risk_trends,
            "pending_reports": 0
        }
    }), 200


@patient_bp.route("/assessments", methods=["GET", "POST"])
def assessments():
    """Historical risk evaluations and saving new screening assessment results."""
    db = get_token_client()

    if request.method == "POST":
        data = request.get_json() or {}
        patient_id = data.get("patient_id")
        input_vitals = data.get("input_vitals", {})
        symptoms = data.get("symptoms", {})
        risk_results = data.get("risk_results", [])

        if not patient_id:
            return jsonify({"status": "error", "message": "patient_id is required"}), 400

        try:
            # 1. Insert assessment
            ass_res = db.table("assessments").insert({
                "patient_id": patient_id,
                "input_vitals": input_vitals,
                "symptoms": symptoms,
            }).execute()

            assessment_record = ass_res.data[0] if ass_res.data else None
            assessment_id = assessment_record.get("id") if assessment_record else None

            # 2. Insert prediction results
            if assessment_id and risk_results:
                pred_rows = []
                for r in risk_results:
                    pred_rows.append({
                        "assessment_id": assessment_id,
                        "disease_name": r.get("label", r.get("key", "Unknown")),
                        "risk_level": r.get("tier", "low"),
                        "probability": float(r.get("probability_pct", 0.0)),
                    })
                db.table("prediction_results").insert(pred_rows).execute()

            return jsonify({
                "status": "success",
                "message": "Assessment recorded successfully",
                "assessment": assessment_record
            }), 201

        except Exception as e:
            return jsonify({"status": "error", "message": f"Failed to record assessment: {str(e)}"}), 400

    # GET: return list of assessments
    patient_id = request.args.get("patient_id")
    try:
        query = db.table("assessments").select("*, prediction_results(*)")
        if patient_id:
            query = query.eq("patient_id", patient_id)
        res = query.order("created_at", desc=True).limit(20).execute()
        return jsonify({"status": "success", "assessments": res.data or []}), 200
    except Exception as e:
        return jsonify({"status": "success", "assessments": []}), 200


@patient_bp.route("/upload-report", methods=["POST"])
def upload_report():
    """Uploads medical lab report PDFs/Images and creates a medical record entry."""
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"status": "error", "message": "No file selected"}), 400

    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    saved_path = os.path.join(uploads_dir, file.filename)
    file.save(saved_path)

    result = report_parser_service.parse_file(file.filename)

    # If patient_id supplied, save to medical_records table
    patient_id = request.form.get("patient_id")
    if patient_id:
        try:
            db = get_token_client()
            db.table("medical_records").insert({
                "patient_id": patient_id,
                "title": f"Lab Report: {file.filename}",
                "description": f"Uploaded medical report - {file.content_type or 'document'}",
                "record_type": "lab_report",
                "file_path": saved_path,
            }).execute()
        except Exception as me:
            print("Notice saving medical_records:", me)

    return jsonify({
        "status": "success",
        "message": "File received and archived successfully",
        "filename": file.filename,
        "parser_result": result
    }), 200
