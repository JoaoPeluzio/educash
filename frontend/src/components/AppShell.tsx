/**
 * EduCash — Shell Estrutural da Aplicação (Estágio 2: Navegação Global e Shell)
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Navbar, NavViewType } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  currentView: NavViewType;
  onNavigate: (view: NavViewType) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentView, onNavigate, children }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Barra Lateral Desktop (renderizada quando há usuário autenticado) */}
      {user && (
        <Sidebar
          currentView={currentView}
          onNavigate={onNavigate}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Cabeçalho Global Superior */}
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Área de Conteúdo Principal */}
      <main
        className={`flex-1 flex flex-col justify-center ${
          user ? 'md:pl-64 pb-20 md:pb-8' : ''
        }`}
      >
        {children}
      </main>

      {/* Barra de Navegação Inferior Mobile (renderizada quando há usuário autenticado) */}
      {user && <BottomNav currentView={currentView} onNavigate={onNavigate} />}

      {/* Rodapé Padrão */}
      <footer
        className={`border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors ${
          user ? 'md:pl-64 hidden sm:block' : ''
        }`}
      >
        EduCash — Educação Financeira para Jovens (Senac ADS • Projeto Integrador)
      </footer>
    </div>
  );
};

