"""
EarlyCare Authentication & RBAC Routes
--------------------------------------
API routes for user registration, Supabase authentication, session management,
and user profile data persistence with Role-Based Access Control (RBAC).
"""
import re
from flask import Blueprint, jsonify, request
from database.db import get_supabase, supabase

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def extract_token_from_header() -> str:
    """Extract Bearer token from Authorization request header."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:].strip()
    return ""


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Registers a new user with Supabase Auth and saves their profile metadata.
    Supported Roles: 'patient', 'doctor', 'admin'.
    """
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    name = data.get("name", "").strip()
    role = data.get("role", "patient").strip().lower()

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required."}), 400

    if not name:
        name = email.split("@")[0].capitalize()

    if role == "admin":
        return jsonify({
            "status": "error",
            "error_code": "ADMIN_REGISTRATION_RESTRICTED",
            "message": "Admin registration is restricted. Authorized administrators must be provisioned directly."
        }), 403

    if role not in ("patient", "doctor"):
        role = "patient"

    # Role-specific fields
    phone = data.get("phone", "").strip()
    specialization = data.get("specialization", "Cardiology").strip()
    hospital = data.get("hospital", "").strip()

    user_metadata = {
        "full_name": name,
        "name": name,
        "role": role,
        "phone": phone,
        "specialization": specialization,
        "hospital": hospital,
    }

    try:
        # Create user in Supabase Auth
        signup_res = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": user_metadata
            }
        })

        if not signup_res.user:
            return jsonify({"status": "error", "message": "Failed to create user account."}), 400

        user_id = signup_res.user.id
        has_active_session = bool(signup_res.session and signup_res.session.access_token)

        # If an active session was returned (email autoconfirm on):
        if has_active_session:
            token = signup_res.session.access_token
            auth_db = get_supabase(token)

            # Create or update profile in profiles table
            profile_data = {
                "id": user_id,
                "email": email,
                "full_name": name,
                "role": role,
                "is_active": True,
            }
            try:
                auth_db.table("profiles").upsert(profile_data).execute()
            except Exception as pe:
                print("Profile upsert notice:", pe)

            # Create role-specific record
            if role == "patient":
                try:
                    auth_db.table("patients").upsert({
                        "user_id": user_id,
                        "medical_history_notes": phone or "",
                    }).execute()
                except Exception as pte:
                    print("Patient record notice:", pte)

            elif role == "doctor":
                try:
                    auth_db.table("doctors").upsert({
                        "user_id": user_id,
                        "specialty": specialization,
                        "department": hospital or "General Care",
                    }).execute()
                except Exception as dte:
                    print("Doctor record notice:", dte)

            return jsonify({
                "status": "success",
                "message": "Account created successfully!",
                "user": {
                    "id": user_id,
                    "email": email,
                    "name": name,
                    "role": role,
                },
                "session": {
                    "access_token": token,
                    "refresh_token": signup_res.session.refresh_token,
                }
            }), 201

        # Email verification is required by Supabase settings:
        return jsonify({
            "status": "verification_required",
            "message": "Account created! A confirmation email has been sent to your address. Please verify your email before logging in.",
            "user": {
                "id": user_id,
                "email": email,
                "name": name,
                "role": role,
            }
        }), 201

    except Exception as e:
        err_msg = str(e)
        if "already registered" in err_msg.lower() or "unique constraint" in err_msg.lower():
            return jsonify({
                "status": "error",
                "message": "An account with this email already exists. Please log in instead."
            }), 400
        return jsonify({"status": "error", "message": f"Registration error: {err_msg}"}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticates a user with Supabase, fetches their profile, and enforces RBAC roles.
    """
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    requested_role = data.get("role", "").strip().lower()

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required."}), 400

    try:
        # Authenticate with Supabase Auth
        sign_in_res = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not sign_in_res.user or not sign_in_res.session:
            return jsonify({"status": "error", "message": "Authentication failed."}), 401

        user = sign_in_res.user
        session = sign_in_res.session
        token = session.access_token
        user_id = user.id

        # Use authenticated client with the user's bearer token
        auth_db = get_supabase(token)

        # 1. Fetch or create profile in 'profiles' table
        profile = None
        try:
            p_res = auth_db.table("profiles").select("*").eq("id", user_id).execute()
            if p_res.data:
                profile = p_res.data[0]
        except Exception as pe:
            print("Error reading profile:", pe)

        meta = user.user_metadata or {}
        user_name = (profile.get("full_name") if profile else None) or meta.get("full_name") or meta.get("name") or email.split("@")[0].capitalize()

        # Determine actual registered role: database profile takes absolute precedence, then user_metadata
        verified_role = (profile.get("role") if profile else None) or meta.get("role") or "patient"
        verified_role = str(verified_role).strip().lower()

        # STRICT ROLE ENFORCEMENT:
        # If requested_role is passed from the role-selection page/login portal,
        # verify it strictly matches the account's registered role in the database.
        if requested_role:
            if verified_role != requested_role:
                return jsonify({
                    "status": "error",
                    "error_code": "ROLE_MISMATCH",
                    "message": "You are not registered under this account type. Please select your registered role."
                }), 403

        user_role = verified_role

        # If profile doesn't exist in profiles table yet, insert it
        if not profile:
            try:
                new_profile = {
                    "id": user_id,
                    "email": email,
                    "full_name": user_name,
                    "role": user_role,
                    "is_active": True,
                }
                ins_res = auth_db.table("profiles").upsert(new_profile).execute()
                if ins_res.data:
                    profile = ins_res.data[0]
            except Exception as pe2:
                print("Error auto-creating profile in profiles table:", pe2)

        # 2. Ensure role-specific record exists
        patient_info = None
        doctor_info = None

        if user_role == "patient":
            try:
                pat_res = auth_db.table("patients").select("*").eq("user_id", user_id).execute()
                if pat_res.data:
                    patient_info = pat_res.data[0]
                else:
                    new_pat = auth_db.table("patients").upsert({"user_id": user_id}).execute()
                    if new_pat.data:
                        patient_info = new_pat.data[0]
            except Exception as pe3:
                print("Patient record check notice:", pe3)

        elif user_role == "doctor":
            try:
                doc_res = auth_db.table("doctors").select("*").eq("user_id", user_id).execute()
                if doc_res.data:
                    doctor_info = doc_res.data[0]
                else:
                    new_doc = auth_db.table("doctors").upsert({
                        "user_id": user_id,
                        "specialty": meta.get("specialization", "General Medicine"),
                        "department": meta.get("hospital", "Clinical Care"),
                    }).execute()
                    if new_doc.data:
                        doctor_info = new_doc.data[0]
            except Exception as de:
                print("Doctor record check notice:", de)

        return jsonify({
            "status": "success",
            "message": "Login successful",
            "user": {
                "id": user_id,
                "email": email,
                "name": profile.get("full_name", user_name) if profile else user_name,
                "role": user_role,
                "patient_id": patient_info.get("id") if patient_info else None,
                "doctor_id": doctor_info.get("id") if doctor_info else None,
            },
            "token": token,
            "session": {
                "access_token": token,
                "refresh_token": session.refresh_token,
                "expires_at": session.expires_at,
            }
        }), 200

    except Exception as e:
        err_msg = str(e)
        if "Email not confirmed" in err_msg:
            return jsonify({
                "status": "error",
                "error_code": "EMAIL_NOT_CONFIRMED",
                "message": "Your email address has not been confirmed yet. Please verify your email before logging in."
            }), 403
        elif "Invalid login credentials" in err_msg:
            return jsonify({
                "status": "error",
                "error_code": "INVALID_CREDENTIALS",
                "message": "Invalid email or password. Please check your credentials."
            }), 401
        return jsonify({"status": "error", "message": f"Login failed: {err_msg}"}), 400


@auth_bp.route("/me", methods=["GET"])
def current_user():
    """
    Returns authenticated user profile information using the provided Bearer token.
    """
    token = extract_token_from_header()
    if not token:
        return jsonify({"status": "error", "message": "Authorization Bearer token is required."}), 401

    try:
        auth_client = get_supabase(token)
        user_res = auth_client.auth.get_user(token)
        if not user_res.user:
            return jsonify({"status": "error", "message": "Invalid or expired session token."}), 401

        user = user_res.user
        user_id = user.id

        # Fetch profile
        profile = None
        try:
            p_res = auth_client.table("profiles").select("*").eq("id", user_id).execute()
            if p_res.data:
                profile = p_res.data[0]
        except Exception as pe:
            print("Error retrieving profile for /me:", pe)

        role = (profile.get("role") if profile else None) or user.user_metadata.get("role", "patient")
        name = (profile.get("full_name") if profile else None) or user.user_metadata.get("full_name", "User")

        # Fetch patient or doctor specifics
        patient_id = None
        doctor_id = None
        if role == "patient":
            try:
                res = auth_client.table("patients").select("id").eq("user_id", user_id).execute()
                if res.data:
                    patient_id = res.data[0].get("id")
            except Exception:
                pass
        elif role == "doctor":
            try:
                res = auth_client.table("doctors").select("id").eq("user_id", user_id).execute()
                if res.data:
                    doctor_id = res.data[0].get("id")
            except Exception:
                pass

        return jsonify({
            "status": "success",
            "user": {
                "id": user_id,
                "email": user.email,
                "name": name,
                "role": role,
                "patient_id": patient_id,
                "doctor_id": doctor_id,
                "profile": profile,
            }
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": f"Session verification error: {str(e)}"}), 401


@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    """
    Allows authenticated users to update their profile information.
    """
    token = extract_token_from_header()
    if not token:
        return jsonify({"status": "error", "message": "Authorization token required."}), 401

    data = request.get_json() or {}
    # Explicitly disallow role tampering/escalation via profile update endpoint
    data.pop("role", None)
    full_name = data.get("name") or data.get("full_name")

    try:
        auth_client = get_supabase(token)
        user_res = auth_client.auth.get_user(token)
        if not user_res.user:
            return jsonify({"status": "error", "message": "Invalid session token."}), 401

        user_id = user_res.user.id

        # Update profiles table
        if full_name:
            auth_client.table("profiles").update({"full_name": full_name}).eq("id", user_id).execute()

        # Update patient-specific data if applicable
        if "age" in data or "gender" in data or "medical_history_notes" in data:
            patient_updates = {}
            if "age" in data:
                patient_updates["age"] = int(data["age"])
            if "gender" in data:
                patient_updates["gender"] = str(data["gender"])
            if "medical_history_notes" in data:
                patient_updates["medical_history_notes"] = str(data["medical_history_notes"])
            if patient_updates:
                auth_client.table("patients").update(patient_updates).eq("user_id", user_id).execute()

        # Update doctor-specific data if applicable
        if "specialty" in data or "license_number" in data or "department" in data:
            doc_updates = {}
            if "specialty" in data:
                doc_updates["specialty"] = str(data["specialty"])
            if "license_number" in data:
                doc_updates["license_number"] = str(data["license_number"])
            if "department" in data:
                doc_updates["department"] = str(data["department"])
            if doc_updates:
                auth_client.table("doctors").update(doc_updates).eq("user_id", user_id).execute()

        return jsonify({"status": "success", "message": "Profile updated successfully."}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": f"Profile update failed: {str(e)}"}), 400


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logs out user session."""
    return jsonify({"status": "success", "message": "Logged out successfully"}), 200
