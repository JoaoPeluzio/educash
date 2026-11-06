/**
 * EduCash — Componente de Proteção de Rotas / Conteúdo Restrito
 * Padronizado com tokens teal, suporte a tema escuro e acessibilidade
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigateLogin: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onNavigateLogin }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-teal-200 dark:border-teal-800 border-t-teal-700 dark:border-t-teal-400 rounded-full animate-spin mb-4" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verificando sessão do aluno...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acesso Restrito</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Esta área é exclusiva para alunos autenticados. Faça login ou crie sua conta para continuar seus estudos no EduCash.
          </p>
          <button
            type="button"
            onClick={onNavigateLogin}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-xs transition"
          >
            Fazer Login Agora
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
