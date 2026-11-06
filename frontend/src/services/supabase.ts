/**
 * EduCash — Cliente Oficial Supabase e Camada de Serviços
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { UserProfile } from '../types/auth';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Verifica se as variáveis de ambiente foram configuradas com valores reais (não apenas placeholders de exemplo)
export const isSupabaseConfigured: boolean = Boolean(
  envUrl &&
  envKey &&
  !envUrl.includes('your-project-ref') &&
  !envKey.includes('your-supabase-publishable') &&
  envUrl.startsWith('https://')
);

// URL e chave padrão para inicialização segura em modo offline/demonstração quando não configurado
const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient<Database> = createClient<Database>(
  isSupabaseConfigured ? envUrl! : fallbackUrl,
  isSupabaseConfigured ? envKey! : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'educash-auth-session',
      flowType: 'implicit',
    },
  }
);

/**
 * Normaliza mensagens de erro do Supabase Auth para português amigável
 */
export function translateAuthError(error: { message?: string; status?: number }): string {
  if (!error || !error.message) {
    return 'Ocorreu um erro inesperado durante a autenticação. Tente novamente.';
  }

  const msg = error.message.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'E-mail ou senha incorretos. Verifique seus dados.';
  }

  if (msg.includes('user already registered') || msg.includes('already registered')) {
    return 'Este endereço de e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.';
  }

  if (msg.includes('password should be at least')) {
    return 'A senha deve conter no mínimo 6 caracteres.';
  }

  if (msg.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.';
  }

  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Muitas tentativas em sequência. Aguarde alguns minutos antes de tentar novamente.';
  }

  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Falha na conexão com o servidor. Verifique sua internet ou a configuração do Supabase.';
  }

  if (msg.includes('token has expired') || msg.includes('token expired') || msg.includes('recovery link expired')) {
    return 'O link de recuperação de senha expirou. Por favor, solicite um novo link.';
  }

  if (msg.includes('invalid token') || msg.includes('otp expired') || msg.includes('token is invalid') || msg.includes('session from token')) {
    return 'O link de recuperação de senha é inválido ou já foi utilizado. Solicite um novo link.';
  }

  if (msg.includes('same password') || msg.includes('new password should be different')) {
    return 'A nova senha deve ser diferente da senha anterior.';
  }

  return error.message;
}

/**
 * Utilitário seguro para extração de parâmetros de retorno e erros do Supabase Auth
 */
export interface UrlAuthParams {
  error?: string;
  errorCode?: string;
  errorDescription?: string;
  type?: string;
  hasRecoveryToken?: boolean;
}

export function parseUrlAuthParams(urlHref?: string): UrlAuthParams {
  if (typeof window === 'undefined' && !urlHref) return {};
  try {
    const rawUrl = urlHref || window.location.href;
    const url = new URL(rawUrl);
    const result: UrlAuthParams = {};

    // Parâmetros de hash
    if (url.hash && url.hash.length > 1) {
      const hashParams = new URLSearchParams(url.hash.substring(1));
      if (hashParams.get('error')) result.error = hashParams.get('error')!;
      if (hashParams.get('error_code')) result.errorCode = hashParams.get('error_code')!;
      if (hashParams.get('error_description')) result.errorDescription = hashParams.get('error_description')!;
      if (hashParams.get('type')) result.type = hashParams.get('type')!;
      if (hashParams.has('access_token') && hashParams.get('type') === 'recovery') {
        result.hasRecoveryToken = true;
      }
    }

    // Parâmetros de busca (search)
    if (url.searchParams.get('error')) result.error = url.searchParams.get('error')!;
    if (url.searchParams.get('error_code')) result.errorCode = url.searchParams.get('error_code')!;
    if (url.searchParams.get('error_description')) result.errorDescription = url.searchParams.get('error_description')!;
    if (url.searchParams.get('type')) result.type = url.searchParams.get('type')!;
    
    // Suporte amplo para fluxo PKCE e parâmetros de recuperação
    const isRecoveryParam = url.searchParams.get('recovery') === 'true' || result.type === 'recovery' || url.searchParams.get('type') === 'recovery';
    if (url.searchParams.has('code') && isRecoveryParam) {
      result.hasRecoveryToken = true;
    }
    if (isRecoveryParam && !result.type) {
      result.type = 'recovery';
    }

    return result;
  } catch {
    return {};
  }
}

/**
 * Consulta o perfil do aluno na tabela `profiles`
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[EduCash Auth] Aviso ao buscar perfil:', error.message);
      return null;
    }

    return data as UserProfile | null;
  } catch (err) {
    console.error('[EduCash Auth] Erro de rede ao buscar perfil:', err);
    return null;
  }
}

/**
 * Discrimina se um erro do PostgreSQL 23505 decorre da chave primária (profiles_pkey / id)
 * ou do índice de nome de usuário (profiles_username_lower_idx).
 */
export function identifyProfileConflictType(error: { code?: string; message?: string; details?: string }): 'primary_key' | 'username' | 'unknown' {
  const code = error.code || '';
  const text = ((error.message || '') + ' ' + (error.details || '')).toLowerCase();

  if (code !== '23505' && !text.includes('unique')) {
    return 'unknown';
  }

  // Conflito de chave primária: profiles_pkey, id já existente, ou primary key
  if (
    text.includes('profiles_pkey') ||
    text.includes('(id)=') ||
    text.includes('key (id)') ||
    text.includes('primary key')
  ) {
    return 'primary_key';
  }

  // Conflito de username: índice profiles_username_lower_idx ou menção explícita ao campo username
  if (
    text.includes('profiles_username_lower_idx') ||
    text.includes('lower(trim(username))') ||
    text.includes('lower(btrim(username))') ||
    text.includes('key (username)') ||
    text.includes('username')
  ) {
    return 'username';
  }

  return 'unknown';
}

/**
 * Cria ou garante a existência do perfil na tabela `profiles` e preferências iniciais
 * Respeita a restrição de unicidade case-insensitive e o RLS profiles_insert_own.
 */
export async function ensureUserProfile(userId: string, username: string): Promise<{ profile: UserProfile | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return {
      profile: {
        id: userId,
        username,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    };
  }

  try {
    // 1. Tenta buscar se o perfil já foi criado (ex: por trigger no banco)
    const existing = await fetchUserProfile(userId);
    if (existing) {
      return { profile: existing, error: null };
    }

    // 2. Insere o perfil com auth.uid() do usuário autenticado
    const cleanUsername = username.trim();
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: cleanUsername,
      })
      .select('id, username, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505' || error.message.toLowerCase().includes('unique')) {
        const conflictType = identifyProfileConflictType(error);

        // Caso 1: Conflito de chave primária (profiles_pkey / id)
        // O perfil para este userId já existe (criado em requisição concorrente ou trigger)
        if (conflictType === 'primary_key') {
          const existingProfile = await fetchUserProfile(userId);
          if (existingProfile) {
            return { profile: existingProfile, error: null };
          }
          return {
            profile: null,
            error: 'Identificador de usuário já registrado. Não foi possível carregar o perfil existente.',
          };
        }

        // Caso 2: Conflito real de nome de usuário (profiles_username_lower_idx)
        if (conflictType === 'username') {
          return {
            profile: null,
            error: `O nome de usuário "${cleanUsername}" já está em uso por outro aluno. Escolha um nome diferente.`,
          };
        }

        // Caso 3: Não identificado explicitamente — tenta reconsultar o perfil antes de emitir erro genérico
        const fallbackProfile = await fetchUserProfile(userId);
        if (fallbackProfile) {
          return { profile: fallbackProfile, error: null };
        }

        return {
          profile: null,
          error: `Restrição de unicidade violada ao cadastrar perfil: ${error.message}`,
        };
      }
      return { profile: null, error: translateAuthError(error) };
    }

    // 3. Garante registro em user_preferences com tema padrão
    try {
      await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          theme: 'light',
        })
        .select('user_id')
        .maybeSingle();
    } catch {
      // Ignora erro se preferência já tiver sido inicializada
    }

    return { profile: data as UserProfile, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao inicializar perfil.';
    return { profile: null, error: message };
  }
}

