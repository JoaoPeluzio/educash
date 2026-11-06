/**
 * EduCash — Tela de Cadastro de Estudante (Estágio 6)
 * Suporte a tema escuro, alternância de visibilidade de senha e tokens visuais
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateRegisterForm } from '../utils/validators';
import { RegisterFormData } from '../types/auth';
import { FlaskConical } from 'lucide-react';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateLogin,
}) => {
  const { register, isLoading, error: authError, clearError, isConfigured, startDemoSession } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setSuccessMessage(null);

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      if (result.message) {
        setSuccessMessage(result.message);
      } else {
        onSuccess();
      }
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
            Criar conta de estudante
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cadastre-se para aprender finanças de forma prática e interativa.
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
              O cadastro de contas reais requer conexão com o Supabase. Para testar e avaliar a experiência de aprendizagem agora, acesse a demonstração interativa.
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

        {/* Alerta de erro */}
        {displayedError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3"
          >
            <span className="font-bold text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true">!</span>
            <div className="flex-1 leading-snug">{displayedError}</div>
          </div>
        )}

        {/* Alerta de sucesso quando exige confirmação de email */}
        {successMessage ? (
          <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-center">
            <div className="w-10 h-10 rounded-full bg-teal-700 dark:bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 font-bold">
              ✓
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Conta Criada!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition"
            >
              Ir para o Login
            </button>
          </div>
        ) : (
          /* Formulário de Registro */
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Nome de Usuário (Username) */}
            <div>
              <label
                htmlFor="register-username"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
              >
                Nome de Usuário (Público)
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                autoComplete="username"
                autoFocus
                disabled={isLoading}
                value={formData.username}
                onChange={handleChange}
                placeholder="ex: lucas_silva"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                  fieldErrors.username
                    ? 'border-rose-300 dark:border-rose-600 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby="register-username-help"
              />
              <p id="register-username-help" className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Mínimo de 3 caracteres. Letras, números, _ ou -. (Insensível a maiúsculas).
              </p>
              {fieldErrors.username && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
              >
                E-mail
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
                placeholder="ex: aluno@escola.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                  fieldErrors.email
                    ? 'border-rose-300 dark:border-rose-600 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
              >
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a senha digitada"
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
                  <span>Cadastrando...</span>
                </>
              ) : (
                <span>Concluir Cadastro</span>
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
                  Ou experimentar demonstração sem cadastro
                </button>
              </div>
            )}
          </form>
        )}

        {/* Rodapé do Cartão */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Já tem uma conta criada?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline min-h-[44px] inline-flex items-center px-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
