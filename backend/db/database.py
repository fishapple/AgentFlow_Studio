"""
Database Configuration and Connection Management
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

logger = logging.getLogger(__name__)


# Database URL (should be loaded from settings in production)
DATABASE_URL = "postgresql://agentflow:secret@localhost/agentflow_db"

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Check connections before using
    pool_size=10,         # Number of connections to keep in pool
    max_overflow=20,      # Max additional connections beyond pool_size
    echo=False,           # Set True for SQL logging (development only)
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()


# Dependency: Get database session
def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
