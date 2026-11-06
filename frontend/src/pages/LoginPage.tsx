/**
 * EduCash — Tela de Login de Aluno (Estágio 6)
 * Suporte a tema escuro, alternância de visibilidade de senha e tokens visuais
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateLoginForm } from '../utils/validators';
import { FlaskConical } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateRegister: () => void;
  onNavigateForgot: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgot,
}) => {
  const { login, isLoading, error: authError, clearError, isConfigured, startDemoSession } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    const result = await login(formData);
    if (result.success) {
      onSuccess();
    } else if (result.error) {
      setSubmitError(result.error);
    }
  };

  const displayedError = submitError || authError;

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-black text-2xl mb-3 shadow-inner">
            $
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Acessar minha conta
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Entre com seu e-mail e senha para continuar suas lições.
          </p>
        </div>

        {/* Alerta quando Supabase não está configurado */}
        {!isConfigured && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex flex-col gap-2.5 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <strong className="font-bold">Supabase não configurado neste ambiente</strong>
            </div>
            <p className="leading-relaxed">
              O login com credenciais reais requer Supabase ativo. Para avaliar o sistema agora, clique abaixo e entre na demonstração interativa.
            </p>
            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                const res = await startDemoSession();
                if (res.success) onSuccess();
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Experimentar Demonstração →
            </button>
          </div>
        )}

        {/* Alerta de erro geral */}
        {displayedError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3"
          >
            <span className="font-bold text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true">!</span>
            <div className="flex-1 leading-snug">{displayedError}</div>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Campo E-mail */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              E-mail do Aluno
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo: aluno@escola.com"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                fieldErrors.email
                  ? 'border-rose-300 dark:border-rose-600 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                  : 'border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="login-email-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Campo Senha */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Senha
              </label>
              <button
                type="button"
                onClick={onNavigateForgot}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline min-h-[44px] inline-flex items-center px-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className={`w-full pl-4 pr-13 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                  fieldErrors.password
                    ? 'border-rose-300 dark:border-rose-600 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
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
            {fieldErrors.password && (
              <p id="login-password-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 min-h-[44px] py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 dark:disabled:bg-teal-900/60 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar no EduCash</span>
            )}
          </button>

          {/* Opção de demonstração quando configurado */}
          {isConfigured && (
            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  const res = await startDemoSession();
                  if (res.success) onSuccess();
                }}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 hover:underline min-h-[44px] inline-flex items-center px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Ou experimentar demonstração sem login
              </button>
            </div>
          )}
        </form>

        {/* Rodapé do Cartão */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Ainda não tem uma conta?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline min-h-[44px] inline-flex items-center px-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cadastre-se gratuitamente
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
