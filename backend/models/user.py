"""
User Model Definition - Authentication and Authorization
"""

from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4
from datetime import datetime
import secrets
import bcrypt

from ..db.database import Base


class User(Base):
    """Users table for authentication."""
    
    __tablename__ = "users"
    
    # Core fields
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    
    # Password hashing (store hash only!)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Role management
    role: Mapped[str] = mapped_column(String(50), default="user")  # user, admin
    
    # Account status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Timestamps (handled by migration script)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(onupdate=datetime.utcnow)
    
    # Relationships
    workflows: Mapped[List["Workflow"]] = relationship(
        "Workflow",
        foreign_keys="workflows.owner_id"
    )
    
    def hash_password(self, password: str) -> None:
        """Hash a plain text password."""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode(), salt).decode()
    
    def check_password(self, password: str) -> bool:
        """Verify if the provided password matches the stored hash."""
        return bcrypt.checkpw(
            password.encode(), 
            self.password_hash.encode()
        )
    
    def to_dict(self, exclude_sensitive: bool = True) -> dict:
        """Convert user to dictionary (optionally excluding sensitive data)."""
        result = {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        
        # Never include password hash in responses
        return result


def create_sample_user(email: str = "admin@agentflow.io") -> User:
    """Create a sample admin user for development."""
    user = User(email=email)
    user.hash_password("admin123")  # Development-only weak password!
    return user
