"""
Workflow Model Definition
"""

from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4
from datetime import datetime
import json

from ..db.database import Base


class Workflow(Base):
    """Main workflow definition table."""
    
    __tablename__ = "workflows"
    
    # Foreign keys
    owner_id: Mapped[str] = mapped_column(String(36), foreign_key="users.id", nullable=False)
    
    # Core fields
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, default=None)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    
    # Timestamps (handled by migration script)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(onupdate=datetime.utcnow)
    
    # Relationships
    versions: Mapped[List["WorkflowVersion"]] = relationship(
        "WorkflowVersion",
        back_populates="workflow",
        cascade="all, delete-orphan"
    )
    executions: Mapped[List["Execution"]] = relationship(
        "Execution",
        back_populates="workflow",
        foreign_keys="executions.workflow_id"
    )
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert workflow to dictionary representation."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_public": self.is_public,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "owner_id": self.owner_id,
        }
    
    def create_version(self, name: str, definition: Dict[str, Any], author_id: str = "") -> "WorkflowVersion":
        """Create a new version of this workflow."""
        from ..models.workflow import WorkflowVersion
        
        # Find max version number
        max_version = 1
        if self.versions:
            for v in self.versions:
                if v.version_number >= max_version:
                    max_version = v.version_number + 1
        
        new_version = WorkflowVersion(
            workflow_id=self.id,
            name=name,
            description=None,
            definition=definition,
            author_id=author_id or "system",
            version_number=max_version
        )
        
        self.versions.append(new_version)
        return new_version


class WorkflowVersion(Base):
    """Workflow versions table (Git-like versioning)."""
    
    __tablename__ = "workflow_versions"
    
    # Foreign keys
    workflow_id: Mapped[str] = mapped_column(String(36), foreign_key="workflows.id", nullable=False)
    author_id: Mapped[str] = mapped_column(String(36), default=lambda: uuid4())
    
    # Core fields
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, default=None)
    
    # Full workflow definition as JSONB for efficient querying
    definition: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    
    # Timestamps (handled by migration script)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    workflow: Mapped["Workflow"] = relationship(
        "Workflow",
        back_populates="versions"
    )
    
    executions: Mapped[List["Execution"]] = relationship(
        "Execution",
        back_populates="version",
        foreign_keys="executions.version_id"
    )
