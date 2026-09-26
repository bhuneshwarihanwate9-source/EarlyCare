"""
EarlyCare Database Layer (Future-Ready)
----------------------------------------
Database engine connection and session management abstraction.
Prepared for SQLite, MySQL, and PostgreSQL connection configuration.
"""
import os

# Database configuration environment variable
# e.g., sqlite:///earlycare.db or postgresql://user:pass@localhost:5432/earlycare
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///earlycare.db")


class Database:
    """Database interface wrapper supporting multi-backend database adapters."""

    def __init__(self, db_url: str = DATABASE_URL):
        self.db_url = db_url
        self.connected = False

    def init_app(self, app):
        """Bind database session to Flask application lifecycle."""
        # Future: SQLAlchemy / SQLModel db.init_app(app)
        pass

    def get_session(self):
        """Provide a context-managed database session."""
        raise NotImplementedError("Database connection not active. Ready for ORM configuration.")


db = Database()
