"""
Base Model for SQLAlchemy ORM - Abstract base class for all models
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSONB, Text
from datetime import datetime
import uuid


class BaseModel:
    """Abstract base model with common fields."""
    
    __abstract__ = True
    
    # Unique identifier (UUID v4)
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Timestamps for tracking creation and updates
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, server_default="CURRENT_TIMESTAMP")
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow)


class SoftDeleteMixin(BaseModel):
    """Mixin for soft delete functionality."""
    
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    def is_deleted(self) -> bool:
        """Check if record has been soft-deleted."""
        return self.deleted_at is not None
