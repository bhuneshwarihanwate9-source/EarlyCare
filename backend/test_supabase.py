import os
import httpx
from dotenv import load_dotenv

 # Load environment variables
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env", override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY")


def test_supabase():

    print("\n========== EARLYCARE DATABASE TEST ==========\n")

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("FAILED: Supabase credentials missing.")
        return

    headers = {
        "apikey": SUPABASE_KEY
    }

    # TEST 1: Supabase server connection
    print("[1] Testing Supabase server...")

    try:
        response = httpx.get(
            f"{SUPABASE_URL}/auth/v1/health",
            headers=headers,
            timeout=15
        )

        print("HTTP Status:", response.status_code)

        if response.status_code == 200:
            print("SUCCESS: Supabase server is reachable!")
        else:
            print("FAILED:", response.text)
            return

    except Exception as e:
        print("CONNECTION ERROR:", e)
        return

    # TEST 2: Actual database table
    print("\n[2] Testing PostgreSQL database...")

    try:
        response = httpx.get(
            f"{SUPABASE_URL}/rest/v1/diseases?select=id&limit=1",
            headers=headers,
            timeout=15
        )

        print("HTTP Status:", response.status_code)

        if response.status_code == 200:
            print("SUCCESS: Database query executed!")
            print("Response:", response.json())

        else:
            print("DATABASE QUERY FAILED:")
            print(response.text)

    except Exception as e:
        print("DATABASE ERROR:", e)

    print("\n========== TEST COMPLETED ==========\n")


if __name__ == "__main__":
    test_supabase()

