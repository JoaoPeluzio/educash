/**
 * EduCash — Provedor de Estado e Sessão de Autenticação
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, translateAuthError, fetchUserProfile, ensureUserProfile } from '../../services/supabase';
import { AuthUser, UserProfile, RegisterFormData, LoginFormData } from '../../types/auth';
import { isValidUsername } from '../../utils/validators';

export interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  isDemoSession: boolean;
  isRecoveryMode: boolean;
  login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string; message?: string }>;
  startDemoSession: (customUsername?: string) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  clearRecoveryMode: () => void;
  createProfile: (username: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_STORAGE_KEY = 'educash-demo-auth-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Sincroniza o perfil do usuário ativo
   * NUNCA deriva o nome de usuário a partir do e-mail do aluno.
   */
  const loadProfile = useCallback(async (currentUserId: string, fallbackUsername?: string) => {
    if (!isSupabaseConfigured) {
      // Modo demonstração local: valida o fallback sem expor dados de email
      const sanitizedFallback =
        fallbackUsername && isValidUsername(fallbackUsername).valid
          ? fallbackUsername.trim()
          : 'aluno_demo';

      const mockProfile: UserProfile = {
        id: currentUserId,
        username: sanitizedFallback,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(mockProfile);
      return mockProfile;
    }

    const fetchedProfile = await fetchUserProfile(currentUserId);
    if (fetchedProfile) {
      setProfile(fetchedProfile);
      return fetchedProfile;
    }

    // Se o perfil ainda não existe no banco, apenas tenta criar se houver
    // um username explícito e válido nos metadados de autenticação
    if (fallbackUsername && isValidUsername(fallbackUsername).valid) {
      const { profile: createdProfile } = await ensureUserProfile(currentUserId, fallbackUsername.trim());
      if (createdProfile) {
        setProfile(createdProfile);
        return createdProfile;
      }
    }

    // Caso o usuário não possua perfil nem metadata válido, o perfil permanece nulo
    // para que a aplicação trate o estado explicitamente, solicitando a definição do username
    setProfile(null);
    return null;
  }, []);

  /**
   * Inicialização e restauração de sessão persistida
   */
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      setIsLoading(true);

      if (!isSupabaseConfigured) {
        // Restaura usuário demonstrativo APENAS se houver sessão demo explícita prévia
        const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
        if (savedDemo && isMounted) {
          try {
            const parsed = JSON.parse(savedDemo);
            if (parsed && parsed.isDemo) {
              setUser({ id: parsed.id, email: parsed.email, username: parsed.username, isDemo: true });
              setProfile({
                id: parsed.id,
                username: parsed.username,
                created_at: parsed.created_at || new Date().toISOString(),
                updated_at: parsed.updated_at || new Date().toISOString(),
              });
            } else {
              localStorage.removeItem(DEMO_STORAGE_KEY);
              setUser(null);
              setProfile(null);
            }
          } catch {
            localStorage.removeItem(DEMO_STORAGE_KEY);
            setUser(null);
            setProfile(null);
          }
        } else if (isMounted) {
          // Ausência de Supabase NÃO ativa demo automaticamente: permanece visitante
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
        return;
      }

      try {
        // Inicializa o modo de recuperação como desativado.
        setIsRecoveryMode(false);

        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('[EduCash Auth] Sessão inicial:', sessionError.message);
        }

        if (initialSession && isMounted) {
          // Sessão real ativa: remove resquícios de demo
          localStorage.removeItem(DEMO_STORAGE_KEY);
          setSession(initialSession);
          const metaUsername = initialSession.user.user_metadata?.username;
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            username: metaUsername,
            isDemo: false,
          });
          await loadProfile(initialSession.user.id, metaUsername);
        } else if (isMounted) {
          // Sem sessão Supabase: verifica se o usuário optou explicitamente pela demo
          const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
          if (savedDemo) {
            try {
              const parsed = JSON.parse(savedDemo);
              if (parsed && parsed.isDemo) {
                setUser({ id: parsed.id, email: parsed.email, username: parsed.username, isDemo: true });
                setProfile({
                  id: parsed.id,
                  username: parsed.username,
                  created_at: parsed.created_at || new Date().toISOString(),
                  updated_at: parsed.updated_at || new Date().toISOString(),
                });
              } else {
                localStorage.removeItem(DEMO_STORAGE_KEY);
                setUser(null);
                setProfile(null);
              }
            } catch {
              localStorage.removeItem(DEMO_STORAGE_KEY);
              setUser(null);
              setProfile(null);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('[EduCash Auth] Erro ao restaurar sessão:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Listener para eventos de autenticação do Supabase (login, logout, token refresh, recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);

      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      } else if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setIsRecoveryMode(false);
      }

      if (newSession?.user) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        const metaUsername = newSession.user.user_metadata?.username;
        setUser({
          id: newSession.user.id,
          email: newSession.user.email || '',
          username: metaUsername,
          isDemo: false,
        });
        await loadProfile(newSession.user.id, metaUsername);
      } else {
        const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
        if (!savedDemo) {
          setUser(null);
          setProfile(null);
        }
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  /**
   * Inicia sessão explícita de demonstração
   */
  const startDemoSession = useCallback(async (customUsername?: string): Promise<{ success: boolean }> => {
    setIsLoading(true);
    setError(null);

    // Se houver sessão Supabase ativa, desconecta para garantir isolamento
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignora
      }
    }

    const sanitizedUsername =
      customUsername && isValidUsername(customUsername).valid
        ? customUsername.trim()
        : 'aluno_demo';

    const demoId = '00000000-0000-0000-0000-000000000001';
    const demoUser: AuthUser = {
      id: demoId,
      email: 'demo@educash.local',
      username: sanitizedUsername,
      isDemo: true,
    };

    const demoProfile: UserProfile = {
      id: demoId,
      username: sanitizedUsername,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setProfile(demoProfile);
    setSession(null);
    setIsRecoveryMode(false);
    setIsLoading(false);
    return { success: true };
  }, []);

  /**
   * Login com e-mail e senha
   */
  const login = useCallback(async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    // Quando o Supabase não estiver configurado, NÃO ativa demo silenciosamente
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      const errMsg = 'A autenticação real com Supabase não está configurada neste ambiente. Para explorar o sistema, utilize a opção "Experimentar Demonstração".';
      setError(errMsg);
      return { success: false, error: errMsg };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      if (authError) {
        const translated = translateAuthError(authError);
        setError(translated);
        setIsLoading(false);
        return { success: false, error: translated };
      }

      if (authData.user) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        const metaUsername = authData.user.user_metadata?.username;
        setUser({
          id: authData.user.id,
          email: authData.user.email || '',
          username: metaUsername,
          isDemo: false,
        });
        await loadProfile(authData.user.id, metaUsername);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na comunicação com o servidor de autenticação.';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }
  }, [loadProfile]);

  /**
   * Registro de novo aluno
   */
  const register = useCallback(async (data: RegisterFormData): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true);
    setError(null);

    const cleanUsername = data.username.trim();
    const cleanEmail = data.email.trim().toLowerCase();

    // Quando o Supabase não estiver configurado, NÃO cadastra silenciosamente em demo
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      const errMsg = 'O cadastro de contas reais requer conexão com o Supabase, que não está configurada neste ambiente. Para explorar o sistema, utilize a opção "Experimentar Demonstração".';
      setError(errMsg);
      return { success: false, error: errMsg };
    }

    try {
      // 1. Cadastra no Supabase Auth com metadados do perfil
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            username: cleanUsername,
          },
        },
      });

      if (authError) {
        const translated = translateAuthError(authError);
        setError(translated);
        setIsLoading(false);
        return { success: false, error: translated };
      }

      if (authData.user) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        // Se a sessão foi retornada imediatamente (confirmação automática)
        if (authData.session) {
          const { profile: newProfile, error: profileError } = await ensureUserProfile(authData.user.id, cleanUsername);
          
          if (profileError) {
            setError(profileError);
            setIsLoading(false);
            return { success: false, error: profileError };
          }

          setUser({
            id: authData.user.id,
            email: authData.user.email || '',
            username: cleanUsername,
            isDemo: false,
          });
          setProfile(newProfile);
          setIsLoading(false);
          return { success: true };
        } else {
          // Quando o Supabase exige confirmação de e-mail por link
          setIsLoading(false);
          return {
            success: true,
            message: 'Cadastro realizado com sucesso! Enviamos um link de confirmação para o seu e-mail.',
          };
        }
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na comunicação com o servidor de autenticação.';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }
  }, []);

  /**
   * Encerramento da sessão (Logout)
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    localStorage.removeItem(DEMO_STORAGE_KEY);

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[EduCash Auth] Erro ao deslogar:', err);
      }
    }

    setUser(null);
    setProfile(null);
    setSession(null);
    setIsRecoveryMode(false);
    setIsLoading(false);
  }, []);

  /**
   * Recuperação de senha (envio de link)
   */
  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      const errMsg = 'A recuperação de senha real requer conexão com o Supabase. Para avaliar o sistema neste ambiente, utilize a opção "Experimentar Demonstração".';
      setError(errMsg);
      return { success: false, error: errMsg };
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/?recovery=true`,
      });

      if (resetError) {
        const translated = translateAuthError(resetError);
        setError(translated);
        setIsLoading(false);
        return { success: false, error: translated };
      }

      setIsLoading(false);
      return {
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um link com instruções para redefinir sua senha.',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao solicitar recuperação de senha.';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }
  }, []);

  /**
   * Limpa o estado ativo de recuperação de senha
   */
  const clearRecoveryMode = useCallback(() => {
    setIsRecoveryMode(false);
  }, []);

  /**
   * Redefinição de senha do usuário autenticado pela sessão de recuperação
   */
  const updatePassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    // Validação estrita: exige sessão de recuperação ativa no Supabase
    if (isSupabaseConfigured && (!isRecoveryMode || !session)) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Sessão de recuperação inválida, ausente ou expirada. Solicite um novo link.',
      };
    }

    if (!isSupabaseConfigured || user?.isDemo) {
      await new Promise((r) => setTimeout(r, 600));
      setIsLoading(false);
      setIsRecoveryMode(false);
      return { success: true };
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        const translated = translateAuthError(updateError);
        setError(translated);
        setIsLoading(false);
        return { success: false, error: translated };
      }

      setIsLoading(false);
      setIsRecoveryMode(false);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao atualizar a senha.';
      setError(message);
      setIsLoading(false);
      return { success: false, error: message };
    }
  }, [isRecoveryMode, session, user?.isDemo]);

  /**
   * Permite ao estudante definir seu nome de usuário
   */
  const createProfile = useCallback(async (newUsername: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Sessão não encontrada. Faça login para continuar.' };
    }

    const trimmed = newUsername.trim();
    const validation = isValidUsername(trimmed);
    if (!validation.valid) {
      return { success: false, error: validation.message || 'Nome de usuário inválido.' };
    }

    setIsLoading(true);
    setError(null);

    if (user.isDemo || !isSupabaseConfigured) {
      const updatedDemoUser: AuthUser = { ...user, username: trimmed, isDemo: true };
      const updatedProfile: UserProfile = {
        id: user.id,
        username: trimmed,
        created_at: profile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updatedDemoUser));
      setUser(updatedDemoUser);
      setProfile(updatedProfile);
      setIsLoading(false);
      return { success: true };
    }

    try {
      const { profile: created, error: createError } = await ensureUserProfile(user.id, trimmed);
      if (createError || !created) {
        setIsLoading(false);
        setError(createError);
        return { success: false, error: createError || 'Falha ao criar o perfil do estudante.' };
      }

      setProfile(created);
      setUser((prev) => (prev ? { ...prev, username: created.username } : null));
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Erro ao cadastrar nome de usuário.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, [user, profile]);

  const isDemoSession = Boolean(user?.isDemo);

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      isLoading,
      error,
      isConfigured: isSupabaseConfigured,
      isDemoSession,
      isRecoveryMode,
      login,
      register,
      startDemoSession,
      logout,
      resetPassword,
      updatePassword,
      clearRecoveryMode,
      createProfile,
      clearError,
    }),
    [user, profile, session, isLoading, error, isDemoSession, isRecoveryMode, login, register, startDemoSession, logout, resetPassword, updatePassword, clearRecoveryMode, createProfile, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
};
