/**
 * User Type Definitions - AgentFlow Studio user models
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string; // ISO 8601 timestamp
  updated_at?: string;
}

export interface UserProfile extends User {
  avatar_url?: string;
  timezone?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string; // e.g., 'en-US', 'zh-CN'
  notifications_enabled: boolean;
  default_workflow_view: 'canvas' | 'code';
  auto_save_enabled: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  user: User;
}
