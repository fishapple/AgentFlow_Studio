/**
 * Workflow Type Definitions - TypeScript interfaces for AgentFlow Studio
 */

// Node Types
export enum NodeType {
  LLM = 'llm',
  TOOL = 'tool',
  CONDITION = 'condition',
  PARALLEL = 'parallel',
  HUMAN = 'human',
}

// Edge/Connection Types
export enum ConnectionType {
  DATA = 'data',
  CONTROL = 'control',
  EVENT = 'event',
}

// Node Configuration Interface
export interface NodeConfig {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  
  // Common properties for all node types
  name: string;
  description?: string;
  
  // Type-specific configurations
  [key: string]: any;
}

// LLM Node Configuration
export interface LLNodeConfig extends NodeConfig {
  type: NodeType.LLM;
  provider?: 'openai' | 'anthropic' | 'google';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Tool Node Configuration  
export interface ToolNodeConfig extends NodeConfig {
  type: NodeType.TOOL;
  toolName: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url?: string;
  headers?: Record<string, string>;
  bodyTemplate?: string;
}

// Condition Node Configuration
export interface ConditionNodeConfig extends NodeConfig {
  type: NodeType.CONDITION;
  conditionType: 'if' | 'unless' | 'switch';
  variableName?: string;
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=';
  value?: any;
}

// Parallel Node Configuration
export interface ParallelNodeConfig extends NodeConfig {
  type: NodeType.PARALLEL;
  splitBy: 'field' | 'list';
  fieldPath?: string;
}

// Human Input Node Configuration
export interface HumanInputNodeConfig extends NodeConfig {
  type: NodeType.HUMAN;
  promptTemplate?: string;
  requiredFields: string[];
}

// Workflow Definition
export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  
  // Node definitions
  nodes: NodeConfig[];
  
  // Edge/Connection definitions
  edges: {
    sourceNode: string;
    targetNode: string;
    type?: ConnectionType.DATA;
    label?: string;
  }[];
  
  // Entry and exit points
  entryNode?: string;
  exitNodes?: string[];
  
  // Execution settings
  timeoutMs?: number;
  maxRetries?: number;
}

// Workflow Version
export interface WorkflowVersion {
  id: string;
  workflowId: string;
  versionNumber: number;
  name: string;
  definition: WorkflowDefinition;
  createdAt: string; // ISO 8601 timestamp
  createdBy?: string;
}

// Execution Record
export interface ExecutionRecord {
  id: string;
  workflowId: string;
  versionId: string | null;
  triggerType: 'api' | 'schedule' | 'webhook';
  
  // Input/Output data
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
  
  // Status tracking
  status: ExecutionStatus;
  errorMessage?: string;
  
  // Timestamps
  startedAt: string;
  finishedAt?: string;
  
  // Performance metrics
  metrics?: {
    executionTimeMs: number;
    tokenUsage?: { input: number; output: number };
    nodesExecuted: number;
    parallelExecutionCount?: number;
  };
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// SDK Generation Output
export interface GeneratedSDK {
  language: 'typescript' | 'python';
  
  code: string;
  
  // Usage examples
  examples: {
    basicUsage: string;
    advancedUsage?: string;
  };
  
  // Installation instructions
  installationInstructions: string;
}

// Plugin Definition
export interface PluginDefinition {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  license: 'MIT' | 'Apache-2.0' | 'GPL-3.0';
  
  // Node types provided by plugin
  nodes?: NodeType[];
  
  // Tools/APIs exposed
  tools?: ToolDefinition[];
  
  metadata: {
    dependencies?: string[];
    configurationSchema?: any;
    documentationUrl?: string;
  };
}

// Tool Definition (for plugins)
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: any;
  }>;
  
  // Async function that performs the tool operation
  execute: (parameters: Record<string, any>) => Promise<any>;
}
