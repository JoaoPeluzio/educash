/**
 * EduCash — Tela de Redefinição de Senha (Estágio 6)
 * Processamento seguro do link de recuperação do Supabase Auth e atualização via updateUser
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateResetPasswordForm } from '../utils/validators';
import { parseUrlAuthParams } from '../services/supabase';

interface ResetPasswordPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
  onNavigateForgot: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  onSuccess,
  onNavigateLogin,
  onNavigateForgot,
}) => {
  const {
    session,
    isRecoveryMode,
    isConfigured,
    updatePassword,
    isLoading,
    error: authError,
    clearError,
    clearRecoveryMode,
  } = useAuth();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Análise dos parâmetros de erro na URL (ex: otp_expired)
  const urlParams = parseUrlAuthParams();
  const isOtpExpired = urlParams.errorCode === 'otp_expired' || urlParams.errorDescription?.toLowerCase().includes('expired');
  const isAlreadyLoggedInRegular = isConfigured && Boolean(session) && !isRecoveryMode;

  // Validação estrita: exige sessão ativa decorrente do evento de recuperação (ou modo demo explícito)
  const isDemo = !isConfigured;
  const hasValidRecoverySession = isDemo || (isRecoveryMode && Boolean(session));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (submitError) setSubmitError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Defesa em profundidade: impede submissão sem validação de sessão
    if (!hasValidRecoverySession) {
      setSubmitError('Sessão de recuperação inválida, ausente ou expirada. Solicite um novo link.');
      return;
    }

    const validation = validateResetPasswordForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    const result = await updatePassword(formData.password);
    if (result.success) {
      setIsSuccess(true);
      clearRecoveryMode();
      // Limpa os parâmetros de hash/token do histórico da barra de endereço
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else if (result.error) {
      setSubmitError(result.error);
    }
  };

  const displayedError = submitError || authError;

  // Estado de Carregamento da Sessão
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div
            className="w-10 h-10 border-4 border-teal-200 dark:border-teal-800 border-t-teal-700 dark:border-t-teal-400 rounded-full animate-spin mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Validando link de recuperação...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        {/* Caso 1: Sessão de recuperação ausente, inválida ou expirada */}
        {!hasValidRecoverySession ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-2xl mb-4">
              !
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              {isOtpExpired
                ? 'Link de Recuperação Expirado'
                : isAlreadyLoggedInRegular
                ? 'Sessão Regular Ativa'
                : 'Link de Recuperação Inválido'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {isOtpExpired
                ? 'O link para redefinir sua senha expirou por motivos de segurança. Solicite um novo envio de instruções.'
                : isAlreadyLoggedInRegular
                ? 'Você já está conectado como estudante. Para redefinir a senha através do fluxo de recuperação, acesse o link enviado por e-mail.'
                : 'Não identificamos uma sessão ativa de recuperação de senha. O link pode ter sido adulterado, expirado ou já utilizado.'}
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={onNavigateForgot}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-xs transition"
              >
                Solicitar Novo Link de Recuperação
              </button>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition"
              >
                Voltar para o Login
              </button>
            </div>
          </div>
        ) : isSuccess ? (
          /* Caso 2: Senha atualizada com sucesso */
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-teal-700 dark:bg-teal-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-xs">
              ✓
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Senha Redefinida!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Sua nova senha foi salva com sucesso. Você já pode fazer login na sua conta EduCash com as novas credenciais.
            </p>
            <button
              type="button"
              onClick={() => {
                clearRecoveryMode();
                onSuccess();
                onNavigateLogin();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-xs transition"
            >
              Fazer Login Agora
            </button>
          </div>
        ) : (
          /* Caso 3: Formulário de nova senha autorizado */
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-black text-2xl mb-3 shadow-inner">
                🔒
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Criar Nova Senha
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Defina sua nova senha para continuar seus estudos no EduCash.
              </p>
            </div>

            {/* Aviso explícito de modo demonstração quando não integrado a servidor real */}
            {isDemo && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm shrink-0" aria-hidden="true">
                  💡
                </span>
                <div>
                  <strong>Modo de Demonstração Local:</strong> A redefinição de senha é simulada neste ambiente acadêmico e não altera credenciais reais em um servidor de produção.
                </div>
              </div>
            )}

            {displayedError && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3"
              >
                <span className="font-bold text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true">
                  !
                </span>
                <div className="flex-1 leading-snug">{displayedError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Campo Nova Senha */}
              <div>
                <label
                  htmlFor="reset-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                >
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    id="reset-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    autoFocus
                    disabled={isLoading}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo de 6 caracteres"
                    className={`w-full pl-4 pr-13 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                      fieldErrors.password
                        ? 'border-rose-300 dark:border-rose-600 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                        : 'border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                    }`}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby="reset-password-help"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg flex items-center justify-center"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p id="reset-password-help" className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  A senha deve ter no mínimo 6 caracteres.
                </p>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Campo Confirmar Nova Senha */}
              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                >
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita a nova senha digitada"
                    className={`w-full pl-4 pr-13 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                      fieldErrors.confirmPassword
                        ? 'border-rose-300 dark:border-rose-600 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                        : 'border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                    }`}
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg flex items-center justify-center"
                    aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 min-h-[44px] py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 dark:disabled:bg-teal-900/60 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    <span>Atualizando senha...</span>
                  </>
                ) : (
                  <span>Salvar Nova Senha</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-center">
              <button
                type="button"
                onClick={() => {
                  clearRecoveryMode();
                  onNavigateLogin();
                }}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline min-h-[44px] inline-flex items-center px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                ← Voltar para a tela de login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
