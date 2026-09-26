"""
EarlyCare User Model & RBAC Schema (Future-Ready)
--------------------------------------------------
Schema abstraction representing platform accounts and Role-Based Access Control (RBAC).
Supported Roles: 'patient', 'doctor', 'admin'.
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class User:
    """User account schema definition for Authentication and RBAC."""
    id: Optional[int] = None
    email: str = ""
    password_hash: str = ""
    full_name: str = ""
    role: str = "patient"  # 'patient' | 'doctor' | 'admin'
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
