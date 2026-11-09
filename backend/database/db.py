import os

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials are missing!")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_supabase():
    """Return the Supabase client."""
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