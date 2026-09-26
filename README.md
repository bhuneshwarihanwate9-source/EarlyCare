<<<<<<< HEAD
# EarlyCare - Early Disease Risk Screening Platform

A production-ready, scalable architecture for multi-condition early risk screening (**Diabetes**, **Hypertension**, and **Heart Disease**). Powered by pre-trained machine learning models with modular Flask REST backend services and a React frontend application.

---

## 🏗️ Project Architecture Overview

```
EarlyCare/
├── backend/
│   ├── app.py                     # Flask entrypoint & Blueprint registration
│   ├── routes/
│   │   ├── auth.py                # Authentication & RBAC routes
│   │   ├── patient.py             # Patient portal & report upload routes
│   │   ├── doctor.py              # Clinician workspace & notes routes
│   │   ├── admin.py               # Platform administration & telemetry routes
│   │   └── prediction.py          # ML Risk Screening endpoints (/api/predict)
│   ├── services/
│   │   ├── prediction_service.py  # Preserved ML inference engine & feature builder
│   │   ├── report_parser.py       # OCR lab report parser service (Future Ready)
│   │   └── shap_service.py        # SHAP feature explainability service (Future Ready)
│   ├── models/
│   │   ├── model_diabetes.joblib
│   │   ├── model_heart_disease.joblib
│   │   ├── model_hypertension.joblib
│   │   ├── model_columns.json
│   │   └── risk_thresholds.json
│   ├── database/
│   │   ├── db.py                  # Database connection abstraction (SQLite/MySQL/PostgreSQL)
│   │   ├── user_model.py          # User & RBAC schema models
│   │   ├── patient_model.py       # Patient profile & history schema
│   │   └── doctor_model.py        # Doctor & clinical notes schema
│   └── uploads/                   # Medical report file uploads directory
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── patient/           # Patient Portal Views (Dashboard, Assessment, Results)
│   │   │   ├── doctor/            # Doctor Portal Views (Dashboard, Notes)
│   │   │   └── admin/             # Admin Portal Views (Dashboard, Analytics, Users)
│   │   ├── components/            # Reusable UI (Navbar, Sidebar, RiskCard, StatsCard, Charts)
│   │   ├── services/              # API Client Services (api.js, auth.js)
│   │   ├── context/               # Global AuthContext & Role Management
│   │   └── assets/
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
│
├── datasets/
│   ├── test.csv
│   ├── train.csv
│   └── val.csv
│
├── requirements.txt
└── README.md
```

---

## 🚀 Running the Project

### 1. Backend API Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
pip install -r ../requirements.txt

# Start Flask production server
python app.py
```

The API server will run at `http://127.0.0.1:5000`.

### 2. Frontend React Application

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend will run at `http://localhost:3000` with API calls proxied to `http://127.0.0.1:5000`.

---

## 🤖 Machine Learning Inference Engine

The prediction pipeline resides in `backend/services/prediction_service.py`. It evaluates patient vitals and lab parameters across three binary ML models:

| Condition | Model Type | Decision Threshold | Signal Notes |
|---|---|---|---|
| **Diabetes** | Random Forest | 0.40 | High accuracy, driven by HbA1c & fasting glucose |
| **Hypertension** | Histogram Gradient Boosting | 0.05 | High sensitivity cutoff tuned for class imbalance |
| **Heart Disease** | Random Forest | 0.47 | Balanced recall & precision |

### Core API Endpoints

- `GET /api/form-schema` - Returns section metadata and form fields schema for frontend rendering.
- `POST /api/predict` - Accepts vitals dictionary and returns calculated risk probabilities and risk tiers (`low`, `moderate`, `high`).
- `POST /api/patient/upload-report` - Upload lab report PDFs/Images for OCR parsing.
- `POST /api/auth/login` - User authentication and RBAC session initialization.

---

## 🔒 Future Ready Extensions Prepared

The codebase architecture is structured for seamless integration of:
1. **JWT Authentication**: Modular routes in `backend/routes/auth.py` and `frontend/services/auth.js`.
2. **Multi-Database ORM**: `backend/database/db.py` configured for SQLite, MySQL, or PostgreSQL.
3. **Role-Based Access Control (RBAC)**: Support for `patient`, `doctor`, and `admin` roles in schemas and context.
4. **Lab Report OCR**: Service stub in `backend/services/report_parser.py`.
5. **SHAP Explainability**: Service stub in `backend/services/shap_service.py`.
=======
# EarlyCare
>>>>>>> 60b2bd16fe4f9e3078467111942ea2a328fae312
