/**
 * EduCash — Validadores de Formulários de Autenticação
 */

import { RegisterFormData, LoginFormData, ForgotPasswordFormData, ResetPasswordFormData, ValidationResult } from '../types/auth';

/**
 * Validação de formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validação de nome de usuário (username)
 * Requisitos:
 * - Mínimo de 3 caracteres (compatível com a restrição CHECK profiles_username_min_length)
 * - Máximo de 30 caracteres
 * - Apenas letras, números, sublinhados (_) e hífens (-)
 * - Unicidade insensível a maiúsculas/minúsculas no banco
 */
export function isValidUsername(username: string): { valid: boolean; message?: string } {
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { valid: false, message: 'O nome de usuário é obrigatório.' };
  }
  
  if (trimmed.length < 3) {
    return { valid: false, message: 'O nome de usuário deve ter pelo menos 3 caracteres.' };
  }
  
  if (trimmed.length > 30) {
    return { valid: false, message: 'O nome de usuário não pode ter mais de 30 caracteres.' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmed)) {
    return { valid: false, message: 'Utilize apenas letras, números, sublinhado (_) ou hífen (-).' };
  }
  
  return { valid: true };
}

/**
 * Validação de senha
 * Requisitos:
 * - Mínimo de 6 caracteres (requisito padrão do Supabase Auth)
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: 'A senha é obrigatória.' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: 'A senha deve conter no mínimo 6 caracteres.' };
  }
  
  return { valid: true };
}

/**
 * Validação completa do formulário de cadastro
 */
export function validateRegisterForm(data: RegisterFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validação de Username
  const usernameCheck = isValidUsername(data.username);
  if (!usernameCheck.valid && usernameCheck.message) {
    errors.username = usernameCheck.message;
  }

  // Validação de Email
  if (!data.email.trim()) {
    errors.email = 'O e-mail é obrigatório.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Informe um endereço de e-mail válido (exemplo: aluno@escola.com).';
  }

  // Validação de Senha
  const passwordCheck = isValidPassword(data.password);
  if (!passwordCheck.valid && passwordCheck.message) {
    errors.password = passwordCheck.message;
  }

  // Validação de Confirmação de Senha
  if (!data.confirmPassword) {
    errors.confirmPassword = 'A confirmação de senha é obrigatória.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'As senhas informadas não coincidem.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validação do formulário de login
 */
export function validateLoginForm(data: LoginFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = 'O e-mail é obrigatório.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Informe um endereço de e-mail válido.';
  }

  if (!data.password) {
    errors.password = 'A senha é obrigatória.';
  } else if (data.password.length < 6) {
    errors.password = 'A senha deve ter no mínimo 6 caracteres.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validação do formulário de recuperação de senha
 */
export function validateForgotPasswordForm(data: ForgotPasswordFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = 'O e-mail é obrigatório.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Informe um endereço de e-mail válido.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validação do formulário de redefinição de senha
 */
export function validateResetPasswordForm(data: ResetPasswordFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const passwordCheck = isValidPassword(data.password);
  if (!passwordCheck.valid && passwordCheck.message) {
    errors.password = passwordCheck.message;
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'A confirmação de senha é obrigatória.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'As senhas informadas não coincidem.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
