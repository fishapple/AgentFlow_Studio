-- AgentFlow Studio Database Initialization Script
-- This script creates necessary tables and indexes for the application

-- Enable UUID extension (needed for PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',  -- user, admin
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflows table (main definition)
CREATE TABLE workflows (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'draft',  -- draft, active, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflow versions table (Git-like versioning)
CREATE TABLE workflow_versions (
    id VARCHAR(36) PRIMARY KEY,
    workflow_id VARCHAR(36) REFERENCES workflows(id),
    version_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    definition JSONB NOT NULL,  -- Full workflow definition as JSON
    author_id VARCHAR(36) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(workflow_id, version_number)
);

-- Execution records table
CREATE TABLE executions (
    id VARCHAR(36) PRIMARY KEY,
    workflow_id VARCHAR(36) REFERENCES workflows(id),
    version_id VARCHAR(36) REFERENCES workflow_versions(id),
    trigger_type VARCHAR(50),  -- 'api', 'schedule', 'webhook'
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(50) DEFAULT 'pending',  -- pending, running, success, failed
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    
    INDEX idx_workflow (workflow_id),
    INDEX idx_version (version_id),
    INDEX idx_status (status)
);

-- Plugins table
CREATE TABLE plugins (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(50) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    manifest JSONB NOT NULL,  -- Plugin metadata and configuration
    installed_by VARCHAR(36) REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_executions_workflow ON executions(workflow_id);
CREATE INDEX idx_executions_version ON executions(version_id);
CREATE INDEX idx_workflows_owner ON workflows(owner_id);
CREATE INDEX idx_plugins_installed_by ON plugins(installed_by);
