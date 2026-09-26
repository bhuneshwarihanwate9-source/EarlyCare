"""
EarlyCare Prediction Routes
---------------------------
API endpoints for health risk screening assessment and form schema definition.
"""
from flask import Blueprint, jsonify, request
from services.prediction_service import FORM_SECTIONS, predict_risk

prediction_bp = Blueprint("prediction", __name__, url_prefix="/api")


@prediction_bp.route("/form-schema", methods=["GET"])
def get_form_schema():
    """Returns the form fields metadata required to build the assessment UI."""
    return jsonify({"status": "success", "sections": FORM_SECTIONS})


@prediction_bp.route("/predict", methods=["POST"])
def predict():
    """
    Evaluates patient parameters against trained ML models.
    Supports both JSON payload and standard Form submission.
    """
    if request.is_json:
        form_data = request.get_json() or {}
    else:
        form_data = request.form.to_dict()

    results = predict_risk(form_data)
    return jsonify({"status": "success", "results": results})
