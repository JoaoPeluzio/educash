/**
 * EduCash — Tipagens de Autenticação e Usuário (Fase 3)
 */

export interface UserProfile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  isDemo?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  isDemoSession: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

