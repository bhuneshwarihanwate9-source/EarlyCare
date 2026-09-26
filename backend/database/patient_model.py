"""
EarlyCare Patient Model Schema (Future-Ready)
----------------------------------------------
Schema abstraction representing Patient clinical profiles, risk assessment histories, and lab reports.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional


@dataclass
class AssessmentRecord:
    """Stores individual screening assessment results."""
    id: Optional[int] = None
    patient_id: Optional[int] = None
    input_vitals: Dict = field(default_factory=dict)
    risk_results: List[Dict] = field(default_factory=list)
    created_at: Optional[datetime] = None


@dataclass
class PatientProfile:
    """Patient demographic and medical history profile."""
    id: Optional[int] = None
    user_id: Optional[int] = None
    age: int = 0
    gender: str = ""
    medical_history_notes: str = ""
    assigned_doctor_id: Optional[int] = None
    created_at: Optional[datetime] = None
