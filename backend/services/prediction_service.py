"""
EarlyCare Prediction Service
----------------------------
Encapsulates model loading and inference logic for diabetes, hypertension,
and heart disease models without changing ML prediction algorithms.
"""
import json
import os
import joblib
import pandas as pd

# Path relative to backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ---- Load models and metadata once at module load ----------------------------
MODELS = {
    "diabetes": joblib.load(os.path.join(MODELS_DIR, "model_diabetes.joblib")),
    "hypertension": joblib.load(os.path.join(MODELS_DIR, "model_hypertension.joblib")),
    "heart_disease": joblib.load(os.path.join(MODELS_DIR, "model_heart_disease.joblib")),
}

with open(os.path.join(MODELS_DIR, "model_columns.json"), "r") as f:
    MODEL_COLUMNS = json.load(f)

with open(os.path.join(MODELS_DIR, "risk_thresholds.json"), "r") as f:
    THRESHOLDS = json.load(f)

CONDITION_LABELS = {
    "diabetes": "Diabetes",
    "hypertension": "Hypertension",
    "heart_disease": "Heart disease",
}

CONDITION_NOTE = {
    "diabetes": (
        "Very reliable on this dataset, driven mainly by HbA1c and glucose, "
        "the standard clinical diagnostic markers."
    ),
    "hypertension": (
        "The weakest of the three models. Only about 2% of the training "
        "data is hypertensive, so it favors catching real cases over "
        "avoiding false alarms. Read a flag here as 'worth checking', not certainty."
    ),
    "heart_disease": "Reasonably balanced signal, good recall at the chosen threshold.",
}

FORM_SECTIONS = [
    {
        "title": "About you",
        "fields": [
            {"name": "age", "label": "Age", "type": "number", "unit": "years", "default": 45, "min": 1, "max": 110, "step": 1},
            {"name": "age_level", "label": "Age group", "type": "select", "options": ["Young", "Middle", "Mature", "Senior"]},
            {"name": "gender", "label": "Gender", "type": "select", "options": ["Female", "Male"]},
            {"name": "bmi", "label": "BMI", "type": "number", "unit": "kg/m²", "default": 25.0, "min": 10, "max": 60, "step": 0.1},
            {"name": "bmi_level", "label": "BMI category", "type": "select", "options": ["Normal", "Underweight", "Overweight", "Obese"]},
            {"name": "education_level", "label": "Education level", "type": "select", "options": ["Secondary", "Primary", "Tertiary"]},
            {"name": "employment_status", "label": "Employment status", "type": "select", "options": ["Employed", "Unemployed", "Retired"]},
        ],
    },
    {
        "title": "Lifestyle & history",
        "fields": [
            {"name": "smoking", "label": "Smoking status", "type": "select", "options": ["Never", "Former", "Current"]},
            {"name": "physical_activity", "label": "Physical activity level", "type": "select", "options": ["Moderate", "Low", "High"]},
            {"name": "stress_level", "label": "Stress level", "type": "select", "options": ["Medium", "Low", "High"]},
            {"name": "sugar_consumption", "label": "Sugar consumption", "type": "select", "options": ["Medium", "Low", "High"]},
            {"name": "alcohol_intake", "label": "Alcohol intake", "type": "number", "unit": "units/week", "default": 2, "min": 0, "max": 50, "step": 1},
            {"name": "salt_intake", "label": "Salt intake", "type": "number", "unit": "g/day", "default": 6, "min": 0, "max": 30, "step": 0.5},
            {"name": "sleep_hours", "label": "Average sleep", "type": "number", "unit": "hours/night", "default": 7.0, "min": 0, "max": 14, "step": 0.1},
            {"name": "family_history", "label": "Family history of these conditions", "type": "select", "options": ["No", "Yes"]},
            {"name": "low_hdl_cholesterol", "label": "Ever diagnosed with low HDL cholesterol?", "type": "select", "options": ["No", "Yes"]},
            {"name": "high_ldl_cholesterol", "label": "Ever diagnosed with high LDL cholesterol?", "type": "select", "options": ["No", "Yes"]},
            {"name": "high_blood_pressure", "label": "Ever diagnosed with high blood pressure?", "type": "select", "options": ["No", "Yes"]},
        ],
    },
    {
        "title": "Vitals & labs",
        "description": "From a recent check-up or lab report, if you have one on hand.",
        "fields": [
            {"name": "HbA1c_level", "label": "HbA1c", "type": "number", "unit": "%", "default": 5.6, "min": 3, "max": 15, "step": 0.1},
            {"name": "glucose", "label": "Fasting glucose", "type": "number", "unit": "mg/dL", "default": 100, "min": 40, "max": 400, "step": 1},
            {"name": "cholesterol", "label": "Total cholesterol", "type": "number", "unit": "mg/dL", "default": 190, "min": 80, "max": 400, "step": 1},
            {"name": "hdl", "label": "HDL cholesterol", "type": "number", "unit": "mg/dL", "default": 55, "min": 10, "max": 120, "step": 1},
            {"name": "ldl", "label": "LDL cholesterol", "type": "number", "unit": "mg/dL", "default": 110, "min": 20, "max": 300, "step": 1},
            {"name": "triglycerides", "label": "Triglycerides", "type": "number", "unit": "mg/dL", "default": 130, "min": 30, "max": 600, "step": 1},
            {"name": "systolic_bp", "label": "Systolic blood pressure", "type": "number", "unit": "mmHg", "default": 120, "min": 70, "max": 220, "step": 1},
            {"name": "diastolic_bp", "label": "Diastolic blood pressure", "type": "number", "unit": "mmHg", "default": 80, "min": 40, "max": 140, "step": 1},
            {"name": "blood_pressure", "label": "Overall blood pressure reading", "type": "number", "unit": "mmHg", "default": 120, "min": 70, "max": 220, "step": 1},
            {"name": "heart_rate", "label": "Resting heart rate", "type": "number", "unit": "bpm", "default": 72, "min": 30, "max": 200, "step": 1},
            {"name": "crp_level", "label": "CRP level", "type": "number", "unit": "mg/L", "default": 3.0, "min": 0, "max": 50, "step": 0.1},
            {"name": "homocysteine_level", "label": "Homocysteine level", "type": "number", "unit": "µmol/L", "default": 10.0, "min": 0, "max": 60, "step": 0.1},
        ],
    },
]


def all_fields():
    for section in FORM_SECTIONS:
        for field in section["fields"]:
            yield field


def build_feature_row(form_data: dict) -> pd.DataFrame:
    """Turn submitted form data dictionary into one-hot encoded row expected by models."""
    row = {}
    for field in all_fields():
        name = field["name"]
        if field["type"] == "number":
            raw = form_data.get(name, "")
            try:
                row[name] = float(raw)
            except (TypeError, ValueError):
                row[name] = float(field["default"])
        else:
            val = form_data.get(name, field["options"][0])
            row[name] = val if val != "" else field["options"][0]

    df = pd.DataFrame([row])
    encoded = pd.get_dummies(df)
    encoded = encoded.reindex(columns=MODEL_COLUMNS, fill_value=0)
    return encoded


def risk_tier(probability: float, threshold: float) -> str:
    """Three-tier risk read: below half threshold = low, above threshold = high, between = moderate."""
    if probability >= threshold:
        return "high"
    if probability >= threshold * 0.5:
        return "moderate"
    return "low"


def predict_risk(form_data: dict) -> list:
    """Execute prediction pipeline on incoming form data dict."""
    X = build_feature_row(form_data)

    results = []
    for cond, model in MODELS.items():
        probability = float(model.predict_proba(X)[0, 1])
        threshold = THRESHOLDS[cond]
        results.append(
            {
                "key": cond,
                "label": CONDITION_LABELS[cond],
                "note": CONDITION_NOTE[cond],
                "probability_pct": round(probability * 100, 1),
                "tier": risk_tier(probability, threshold),
                "flagged": bool(probability >= threshold),
            }
        )
    results.sort(key=lambda r: r["probability_pct"], reverse=True)
    return results
