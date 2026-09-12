"""
Execution Model Definition - Tracks workflow execution history
"""

from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4
from datetime import datetime
import json
from enum import Enum

from ..db.database import Base


class ExecutionStatus(str, Enum):
    """Execution status enumeration."""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Execution(Base):
    """Execution records table for tracking workflow runs."""
    
    __tablename__ = "executions"
    
    # Foreign keys
    workflow_id: Mapped[str] = mapped_column(String(36), foreign_key="workflows.id", nullable=False)
    version_id: Mapped[Optional[str]] = mapped_column(String(36), foreign_key="workflow_versions.id")
    
    # Execution metadata
    trigger_type: Mapped[Optional[str]] = mapped_column(String(50))  # 'api', 'schedule', 'webhook'
    input_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB)
    output_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB)
    
    # Status tracking
    status: Mapped[str] = mapped_column(String(50), default=ExecutionStatus.PENDING.value)
    error_message: Mapped[Optional[str]] = mapped_column(Text, default=None)
    
    # Timestamps
    started_at: Mapped[Optional[datetime]] = mapped_column(default=datetime.utcnow)
    finished_at: Mapped[Optional[datetime]] = mapped_column(default=datetime.utcnow)
    
    # Performance metrics (JSONB for flexibility)
    metrics: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, default=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert execution to dictionary representation."""
        return {
            "id": self.id,
            "workflow_id": self.workflow_id,
            "version_id": self.version_id,
            "trigger_type": self.trigger_type,
            "status": self.status,
            "input_data": self.input_data,
            "output_data": self.output_data,
            "error_message": self.error_message,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "finished_at": self.finished_at.isoformat() if self.finished_at else None,
            "metrics": self.metrics or {},
        }
    
    def is_complete(self) -> bool:
        """Check if execution has finished."""
        return (self.status in [ExecutionStatus.SUCCESS.value, ExecutionStatus.FAILED.value] 
                and self.finished_at is not None)
