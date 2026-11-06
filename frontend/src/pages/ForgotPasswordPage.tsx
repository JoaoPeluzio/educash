/**
 * EduCash — Tela de Recuperação de Senha (Estágio 6)
 * Suporte a tema escuro, tokens visuais e acessibilidade
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateForgotPasswordForm } from '../utils/validators';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateLogin }) => {
  const { resetPassword, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldError(null);
    setFeedbackMessage(null);
    clearError();

    const validation = validateForgotPasswordForm({ email });
    if (!validation.isValid) {
      setFieldError(validation.errors.email || 'Informe um e-mail válido.');
      return;
    }

    const result = await resetPassword(email);
    if (result.success && result.message) {
      setFeedbackMessage(result.message);
    } else if (result.error) {
      setSubmitError(result.error);
    }
  };

  const displayedError = submitError || authError;

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-black text-2xl mb-3 shadow-inner">
            ?
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recuperação de Senha
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Informe seu e-mail cadastrado para receber instruções de redefinição.
          </p>
        </div>

        {displayedError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3"
          >
            <span className="font-bold text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true">!</span>
            <div className="flex-1 leading-snug">{displayedError}</div>
          </div>
        )}

        {feedbackMessage ? (
          <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-center">
            <div className="w-10 h-10 rounded-full bg-teal-700 dark:bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 font-bold">
              ✓
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Solicitação Enviada</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {feedbackMessage}
            </p>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                E-mail Cadastrado
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                disabled={isLoading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                placeholder="ex: aluno@escola.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                  fieldError
                    ? 'border-rose-300 dark:border-rose-600 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? 'forgot-email-error' : undefined}
              />
              {fieldError && (
                <p id="forgot-email-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{fieldError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 min-h-[44px] py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 dark:disabled:bg-teal-900/60 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  <span>Enviando solicitação...</span>
                </>
              ) : (
                <span>Enviar Instruções</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-center">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline min-h-[44px] inline-flex items-center px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            ← Voltar para a tela de login
          </button>
        </div>
      </div>
    </div>
  );
};
