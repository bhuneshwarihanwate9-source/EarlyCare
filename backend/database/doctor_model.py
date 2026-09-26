"""
EarlyCare Doctor Model Schema (Future-Ready)
---------------------------------------------
Schema abstraction representing Doctor profiles, patient assignments, and clinical diagnostic notes.
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class DoctorProfile:
    """Doctor professional profile."""
    id: Optional[int] = None
    user_id: Optional[int] = None
    specialty: str = "General Physician"
    license_number: str = ""
    department: str = "Preventive Care"


@dataclass
class ClinicalNote:
    """Doctor diagnostic notes attached to patient risk assessments."""
    id: Optional[int] = None
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None
    assessment_id: Optional[int] = None
    note_text: str = ""
    created_at: Optional[datetime] = None
