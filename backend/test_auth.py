import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Resolve .env relative to script directory
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

if (BASE_DIR / ".env").exists():
    load_dotenv(BASE_DIR / ".env", override=True)
elif (ROOT_DIR / ".env").exists():
    load_dotenv(ROOT_DIR / ".env", override=True)
else:
    load_dotenv()

url = os.getenv("SUPABASE_URL")
key = (
    os.getenv("SUPABASE_KEY")
    or os.getenv("SUPABASE_PUBLISHABLE_KEY")
    or os.getenv("SUPABASE_SERVICE_KEY")
)

if not url or not key:
    print("FAILED: Missing SUPABASE_URL or SUPABASE_KEY/SUPABASE_PUBLISHABLE_KEY.")
    sys.exit(1)

supabase: Client = create_client(url, key)

# If run with --check-client or --test-init, test client setup and exit
if len(sys.argv) > 1 and sys.argv[1] in ("--check-client", "--test-init"):
    print("SUCCESS: Supabase client initialized cleanly.")
    print("Endpoint:", url)
    sys.exit(0)

# Optional CLI arguments for automated execution
if len(sys.argv) >= 3:
    email = sys.argv[1]
    password = sys.argv[2]
else:
    email = input("Enter registered email: ").strip()
    password = input("Enter password: ").strip()

try:
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

    print("\nLOGIN SUCCESSFUL!")
    print("User ID:", response.user.id)
    print("Email:", response.user.email)

except Exception as e:
    err_str = str(e)
    print("\nLOGIN FAILED!")
    if "Email not confirmed" in err_str:
        print("Reason: Email has not been verified yet.")
        print("Action: Please check your inbox or spam folder for the confirmation email.")
    elif "Invalid login credentials" in err_str:
        print("Reason: Invalid email or password.")
    else:
        print("Error:", err_str)