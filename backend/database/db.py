import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from supabase import Client, create_client

# Locate and load backend/.env or root .env
_CURRENT_DIR = Path(__file__).resolve().parent
_BACKEND_DIR = _CURRENT_DIR.parent
_ROOT_DIR = _BACKEND_DIR.parent

if (_BACKEND_DIR / ".env").exists():
    load_dotenv(_BACKEND_DIR / ".env", override=True)
elif (_ROOT_DIR / ".env").exists():
    load_dotenv(_ROOT_DIR / ".env", override=True)
else:
    load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_KEY")
    or os.getenv("SUPABASE_PUBLISHABLE_KEY")
    or os.getenv("SUPABASE_SERVICE_KEY")
)

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials are missing! Ensure SUPABASE_URL and SUPABASE_KEY/SUPABASE_PUBLISHABLE_KEY are set.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_supabase(access_token: Optional[str] = None) -> Client:
    """
    Return a Supabase client.
    If access_token is provided, set it on the client for RLS-authenticated queries.
    """
    if access_token:
        # Create a client copy and set the Authorization header
        auth_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        auth_client.postgrest.auth(access_token)
        return auth_client
    return supabase


def test_connection():
    """Test connection to Supabase."""
    try:
        supabase.table("diseases").select("*").limit(1).execute()
        print("Supabase connected successfully!")
        return True
    except Exception as e:
        print("Supabase connection failed:", e)
        return False