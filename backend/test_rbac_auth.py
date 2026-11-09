"""
EarlyCare RBAC & Auth Verification Suite
-----------------------------------------
Validates role enforcement, cross-role isolation, admin restrictions,
and exact error messaging.
"""
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

# Add backend directory to path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

import json
from app import create_app

app = create_app()
client = app.test_client()

def test_admin_registration_blocked():
    print("\n--- Test 1: Admin Public Registration Must Be Blocked ---")
    res = client.post("/api/auth/register", json={
        "email": "hacker_admin@earlycare.org",
        "password": "Password123!",
        "name": "Malicious Admin",
        "role": "admin"
    })
    print(f"Status: {res.status_code}")
    data = res.get_json() or {}
    print(f"Response: {data}")
    assert res.status_code == 403, f"Expected 403, got {res.status_code}"
    assert data.get("error_code") == "ADMIN_REGISTRATION_RESTRICTED", f"Unexpected error code: {data}"
    print("PASS: Admin registration is strictly blocked.")

def test_login_role_mismatch_exact_message():
    print("\n--- Test 2: Role Mismatch Returns Exact Required Message ---")
    mock_user = MagicMock()
    mock_user.id = "test-uuid-patient"
    mock_user.user_metadata = {"role": "patient", "full_name": "Test Patient"}

    mock_session = MagicMock()
    mock_session.access_token = "mock-token"
    mock_session.refresh_token = "mock-refresh"
    mock_session.expires_at = 1234567890

    mock_auth_res = MagicMock()
    mock_auth_res.user = mock_user
    mock_auth_res.session = mock_session

    mock_db = MagicMock()
    # Mock profiles table query returning role: patient
    mock_select = MagicMock()
    mock_select.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "test-uuid-patient", "email": "patient@earlycare.org", "role": "patient", "full_name": "Test Patient"}
    ]
    mock_db.table.return_value = mock_select

    with patch("routes.auth.supabase.auth.sign_in_with_password", return_value=mock_auth_res), \
         patch("routes.auth.get_supabase", return_value=mock_db):

        # Scenario A: Patient tries to log in under doctor portal
        res = client.post("/api/auth/login", json={
            "email": "patient@earlycare.org",
            "password": "Password123!",
            "role": "doctor"
        })
        print(f"Status (Doctor portal attempt): {res.status_code}")
        data = res.get_json() or {}
        print(f"Response: {data}")
        assert res.status_code == 403, f"Expected 403, got {res.status_code}"
        assert data.get("error_code") == "ROLE_MISMATCH", f"Expected ROLE_MISMATCH, got {data}"
        assert data.get("message") == "You are not registered under this account type. Please select your registered role."
        print("PASS: Exact required role mismatch error returned for Doctor attempt!")

        # Scenario B: Patient tries to log in under admin portal
        res_admin = client.post("/api/auth/login", json={
            "email": "patient@earlycare.org",
            "password": "Password123!",
            "role": "admin"
        })
        print(f"Status (Admin portal attempt): {res_admin.status_code}")
        data_admin = res_admin.get_json() or {}
        assert res_admin.status_code == 403
        assert data_admin.get("error_code") == "ROLE_MISMATCH"
        assert data_admin.get("message") == "You are not registered under this account type. Please select your registered role."
        print("PASS: Cross-role login to Admin strictly rejected with exact message!")

        # Scenario C: Correct role matching (patient logging in under patient portal)
        res_ok = client.post("/api/auth/login", json={
            "email": "patient@earlycare.org",
            "password": "Password123!",
            "role": "patient"
        })
        print(f"Status (Patient matching): {res_ok.status_code}")
        data_ok = res_ok.get_json() or {}
        assert res_ok.status_code == 200
        assert data_ok.get("status") == "success"
        assert data_ok.get("user", {}).get("role") == "patient"
        print("PASS: Matching role login succeeds with 200 OK!")

def test_auth_routes():
    print("\n--- Test 3: Route Discovery & Status ---")
    routes = [str(p) for p in app.url_map.iter_rules()]
    print(f"Total endpoints registered: {len(routes)}")
    assert any("/api/auth/login" in r for r in routes)
    assert any("/api/auth/register" in r for r in routes)
    assert any("/api/auth/profile" in r for r in routes)
    assert any("/api/doctor/dashboard" in r for r in routes)
    assert any("/api/patient/dashboard" in r for r in routes)
    assert any("/api/admin/dashboard" in r for r in routes)
    print("PASS: All required RBAC API routes are active.")

if __name__ == "__main__":
    test_admin_registration_blocked()
    test_login_role_mismatch_exact_message()
    test_auth_routes()
    print("\nAll automated RBAC verification tests passed successfully!")
