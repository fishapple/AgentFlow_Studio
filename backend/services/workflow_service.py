"""
Workflow Service - Business Logic Layer for Workflows
"""

from typing import Dict, Any, Optional, List
from fastapi import HTTPException
import json
import logging

from ..models.workflow import Workflow, WorkflowVersion
from ..db.database import get_db


logger = logging.getLogger(__name__)


class WorkflowService:
    """Service layer for workflow operations."""
    
    def __init__(self, db):
        self.db = db
    
    def create_workflow(self, owner_id: str, name: str, description: Optional[str] = None) -> Workflow:
        """Create a new workflow definition."""
        
        # Validate inputs
        if not name or len(name.strip()) < 2:
            raise HTTPException(status_code=400, detail="Workflow name must be at least 2 characters")
        
        # Create new workflow instance
        workflow = Workflow(
            owner_id=owner_id,
            name=name,
            description=description,
            status="draft"
        )
        
        self.db.add(workflow)
        self.db.commit()
        self.db.refresh(workflow)
        
        return workflow
    
    def get_workflow(self, workflow_id: str) -> Optional[Workflow]:
        """Retrieve a workflow by ID."""
        workflow = self.db.query(Workflow).filter(Workflow.id == workflow_id).first()
        return workflow
    
    def update_workflow(
        self, 
        workflow_id: str, 
        name: Optional[str] = None,
        description: Optional[str] = None,
        is_public: Optional[bool] = None,
        status: Optional[str] = None
    ) -> Workflow:
        """Update workflow properties."""
        
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Update provided fields
        if name is not None:
            workflow.name = name
        if description is not None:
            workflow.description = description
        if is_public is not None:
            workflow.is_public = is_public
        if status is not None:
            workflow.status = status
        
        self.db.commit()
        self.db.refresh(workflow)
        
        return workflow
    
    def delete_workflow(self, workflow_id: str) -> bool:
        """Delete a workflow permanently."""
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        self.db.delete(workflow)
        self.db.commit()
        
        return True
    
    def create_version(
        self, 
        workflow_id: str, 
        name: str,
        definition: Dict[str, Any],
        author_id: str = "system"
    ) -> WorkflowVersion:
        """Create a new version of an existing workflow."""
        
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Create version
        version = workflow.create_version(
            name=name,
            definition=definition,
            author_id=author_id
        )
        
        self.db.add(version)
        self.db.commit()
        self.db.refresh(version)
        
        return version
    
    def list_versions(self, workflow_id: str) -> List[WorkflowVersion]:
        """List all versions of a workflow."""
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        return sorted(workflow.versions, key=lambda x: x.version_number, reverse=True)
    
    def compare_versions(
        self, 
        workflow_id: str, 
        version_from: int, 
        version_to: int
    ) -> Dict[str, Any]:
        """Compare two workflow versions and return diff."""
        
        versions = self.list_versions(workflow_id)
        
        if len(versions) < 2:
            raise HTTPException(status_code=400, detail="Need at least 2 versions to compare")
        
        from_version = next((v for v in versions if v.version_number == version_from), None)
        to_version = next((v for v in versions if v.version_number == version_to), None)
        
        if not from_version or not to_version:
            raise HTTPException(status_code=404, detail="Version not found")
        
        # Simple diff (JSON comparison) - can be enhanced later
        import difflib
        
        def json_diff(old_json: Dict[str, Any], new_json: Dict[str, Any]) -> List[Dict[str, str]]:
            """Generate a simple JSON diff."""
            changes = []
            
            for key in set(list(old_json.keys()) + list(new_json.keys())):
                old_val = old_json.get(key)
                new_val = new_json.get(key)
                
                if key not in old_json:
                    changes.append({"type": "added", "field": key, "value": str(new_val)})
                elif key not in new_json:
                    changes.append({"type": "removed", "field": key, "old_value": str(old_val)})
                elif old_val != new_val:
                    changes.append({
                        "type": "modified", 
                        "field": key,
                        "old_value": str(old_val),
                        "new_value": str(new_val)
                    })
            
            return changes
        
        diff = json_diff(from_version.definition, to_version.definition)
        
        return {
            "from_version": version_from,
            "to_version": version_to,
            "changes": diff,
            "summary": f"{len([c for c in diff if c['type'] == 'added'])} additions, "
                      f"{len([c for c in diff if c['type'] == 'removed'])} removals, "
                      f"{len([c for c in diff if c['type'] == 'modified'])} modifications"
        }
