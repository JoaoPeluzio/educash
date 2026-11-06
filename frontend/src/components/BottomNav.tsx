/**
 * EduCash — Barra de Navegação Inferior Mobile (Estágio 2: Shell da Aplicação)
 * Atualizada na Etapa 7C com tokens do Design System, ícones lucide-react e suporte a safe-area
 */

import React from 'react';
import { BookOpen, Home, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NavViewType } from './Navbar';

interface BottomNavProps {
  currentView: NavViewType;
  onNavigate: (view: NavViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const isAprenderActive = currentView === 'dashboard' || currentView === 'lesson';
  const isInicioActive = currentView === 'home';

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-md z-40 transition-colors pb-[max(env(safe-area-inset-bottom,0px),0.25rem)]"
      aria-label="Navegação Inferior Mobile"
    >
      <div className="grid grid-cols-3 max-w-md mx-auto px-2">
        {/* Item: Aprender */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[56px] min-w-[44px] py-1.5 text-xs transition relative rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            isAprenderActive
              ? 'text-teal-700 dark:text-teal-300 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100'
          }`}
          aria-current={isAprenderActive ? 'page' : undefined}
          aria-label="Ir para a Trilha de Aprendizagem"
        >
          {isAprenderActive && (
            <span className="absolute top-0 inset-x-6 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />
          )}
          <BookOpen
            className="w-5 h-5 mb-1 shrink-0"
            strokeWidth={isAprenderActive ? 2.5 : 2}
            aria-hidden="true"
          />
          <span className="text-[11px] leading-tight">Aprender</span>
        </button>

        {/* Item: Início */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-h-[56px] min-w-[44px] py-1.5 text-xs transition relative rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            isInicioActive
              ? 'text-teal-700 dark:text-teal-300 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100'
          }`}
          aria-current={isInicioActive ? 'page' : undefined}
          aria-label="Ir para a Página Inicial"
        >
          {isInicioActive && (
            <span className="absolute top-0 inset-x-6 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />
          )}
          <Home
            className="w-5 h-5 mb-1 shrink-0"
            strokeWidth={isInicioActive ? 2.5 : 2}
            aria-hidden="true"
          />
          <span className="text-[11px] leading-tight">Início</span>
        </button>

        {/* Item: Sair */}
        <button
          type="button"
          onClick={async () => {
            await logout();
            onNavigate('home');
          }}
          className="flex flex-col items-center justify-center min-h-[56px] min-w-[44px] py-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium hover:text-rose-600 dark:hover:text-rose-400 transition rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
          aria-label="Encerrar sessão da conta"
        >
          <LogOut className="w-5 h-5 mb-1 shrink-0" strokeWidth={2} aria-hidden="true" />
          <span className="text-[11px] leading-tight">Sair</span>
        </button>
      </div>
    </nav>
  );
};

