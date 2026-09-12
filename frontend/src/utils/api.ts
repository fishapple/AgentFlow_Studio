/**
 * API Utility Functions - HTTP client wrapper for AgentFlow Studio
 */

import axios, { AxiosError } from 'axios';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add custom headers for tracing/debugging
    if (import.meta.env.DEV) {
      config.headers['X-Request-ID'] = crypto.randomUUID();
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token logic would go here
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint
        const response = await axios.post('/auth/refresh', { 
          refresh: refreshToken 
        });

        // Update auth token
        localStorage.setItem('access_token', response.data.access_token);
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear all data and redirect to login
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    // Handle other errors
    const errorMsg = error.response?.data?.detail || 'Something went wrong';
    console.error('❌ API Error:', errorMsg);
    
    return Promise.reject(error);
  }
);

/**
 * Workflow operations
 */
export const workflowAPI = {
  /**
   * Create a new workflow
   */
  create: (name: string, description?: string) => 
    apiClient.post('/workflows', { name, description }),

  /**
   * Get workflow details
   */
  get: (workflowId: string) => 
    apiClient.get(`/workflows/${workflowId}`),

  /**
   * Update workflow
   */
  update: (workflowId: string, data: Partial<{
    name: string;
    description: string;
    isPublic: boolean;
    status: string;
  }>) => 
    apiClient.put(`/workflows/${workflowId}`, data),

  /**
   * Delete workflow
   */
  delete: (workflowId: string) => 
    apiClient.delete(`/workflows/${workflowId}`),

  /**
   * List all workflows with pagination
   */
  list: (params?: {
    page?: number;
    limit?: number;
    statusFilter?: string;
    isPublicOnly?: boolean;
  }) => 
    apiClient.get('/workflows', { params }),

  /**
   * Create workflow version (Git-style)
   */
  createVersion: (workflowId: string, name: string, definition: Record<string, unknown>) => 
    apiClient.post(`/workflows/${workflowId}/versions`, { name, definition }),

  /**
   * List workflow versions
   */
  listVersions: (workflowId: string) => 
    apiClient.get(`/workflows/${workflowId}/versions`),

  /**
   * Compare two versions
   */
  compareVersions: (workflowId: string, fromVersion: number, toVersion: number) => 
    apiClient.get(
      `/workflows/${workflowId}/versions/${fromVersion}/${toVersion}/diff`
    ),
};

/**
 * Execution operations
 */
export const executionAPI = {
  /**
   * Trigger workflow execution
   */
  trigger: (workflowId: string, inputData?: Record<string, unknown>) => 
    apiClient.post('/executions', { workflowId, inputData }),

  /**
   * Get execution status and results
   */
  get: (executionId: string) => 
    apiClient.get(`/executions/${executionId}`),

  /**
   * List executions with filtering
   */
  list: (params?: {
    workflowId?: string;
    statusFilter?: 'all' | 'success' | 'failed' | 'running';
    page?: number;
    limit?: number;
  }) => 
    apiClient.get('/executions', { params }),

  /**
   * Get execution logs
   */
  getLogs: (executionId: string) => 
    apiClient.get(`/executions/${executionId}/logs`),

  /**
   * Cancel running execution
   */
  cancel: (executionId: string) => 
    apiClient.post(`/executions/${executionId}/cancel`),
};

/**
 * Plugin operations
 */
export const pluginAPI = {
  /**
   * Install a new plugin
   */
  install: (pluginId: string, version?: string) => 
    apiClient.post('/plugins', { pluginId, version }),

  /**
   * List installed plugins
   */
  listInstalled: () => 
    apiClient.get('/plugins/installed'),

  /**
   * List available plugins from marketplace
   */
  listAvailable: (category?: string) => 
    apiClient.get(`/plugins${category ? `?category=${category}` : ''}`),

  /**
   * Uninstall plugin
   */
  uninstall: (pluginId: string) => 
    apiClient.delete(`/plugins/${pluginId}`),

  /**
   * Register custom node type for plugin
   */
  registerNode: (pluginId: string, nodeDefinition: Record<string, unknown>) => 
    apiClient.post(`/plugins/${pluginId}/nodes`, { nodeDefinition }),
};

/**
 * User authentication operations
 */
export const authAPI = {
  /**
   * Login with credentials
   */
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),

  /**
   * Register new user
   */
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => 
    apiClient.post('/auth/register', data),

  /**
   * Logout current session
   */
  logout: () => 
    apiClient.post('/auth/logout'),

  /**
   * Get current user profile
   */
  getProfile: () => 
    apiClient.get('/auth/me'),
};

// Export the axios instance for advanced use cases
export default { client: apiClient };
