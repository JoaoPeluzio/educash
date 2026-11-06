/**
 * EduCash — Barra de Navegação Superior Responsiva (Estágio 2: Shell da Aplicação)
 * Atualizada na Etapa 7C com tokens do Design System, ícones lucide-react e acessibilidade WCAG
 */

import React from 'react';
import { Sun, Moon, LogOut, FlaskConical } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export type NavViewType = 'home' | 'login' | 'register' | 'forgot' | 'reset-password' | 'dashboard' | 'lesson';

interface NavbarProps {
  currentView: NavViewType;
  onNavigate: (view: NavViewType) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isDark: propIsDark,
  onToggleTheme: propOnToggleTheme,
}) => {
  const { user, profile, logout, isDemoSession } = useAuth();
  const themeHook = useTheme();

  const isDark = propIsDark !== undefined ? propIsDark : themeHook.isDark;
  const toggleTheme = propOnToggleTheme !== undefined ? propOnToggleTheme : themeHook.toggleTheme;

  const displayUsername = profile?.username || user?.username || 'Estudante';
  const initialLetter = displayUsername.charAt(0).toUpperCase();

  // Contexto textual da visão atual para o cabeçalho autenticado
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Trilha de Aprendizagem';
      case 'lesson':
        return 'Lição em Andamento';
      case 'home':
        return 'Visão Geral do Projeto';
      default:
        return 'Área do Aluno';
    }
  };

  return (
    <header
      className={`border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-20 transition-colors ${
        user ? 'md:pl-64' : ''
      }`}
      aria-label="Cabeçalho Global"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between">
        {/* Lado Esquerdo: Marca (quando deslogado ou no mobile) OU Título da Visão (quando logado no desktop) */}
        <div className="flex items-center gap-3">
          {/* Logo exibido no mobile para usuários logados, e sempre para visitantes */}
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'home')}
            className={`flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl p-1 text-left min-h-[44px] transition ${
              user ? 'md:hidden' : 'flex'
            }`}
            aria-label="Ir para a página principal do EduCash"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-extrabold text-lg shadow-xs shrink-0">
              $
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  Edu<span className="text-teal-600 dark:text-teal-400">Cash</span>
                </span>
                {!user && (
                  <span className="hidden sm:inline-flex items-center rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 px-2 py-0.5 text-[11px] font-semibold">
                    Aprendizagem Interativa
                  </span>
                )}
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
                Educação Financeira para Jovens
              </p>
            </div>
          </button>

          {/* Título de contexto exibido no desktop quando autenticado */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                {getViewTitle()}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Trilha Principal
              </span>
            </div>
          )}
        </div>

        {/* Lado Direito: Status, Ações de Autenticação e Tema */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5" aria-label="Ações de Usuário">
          {/* Indicador de Demonstração Ativa (sem animações contínuas invasivas) */}
          {isDemoSession && (
            <span
              title="Você está navegando em uma sessão de demonstração com dados locais isolados."
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Modo Demonstração</span>
              <span className="sm:hidden">Demo</span>
            </span>
          )}

          {/* Botão de Alternância de Tema (Claro / Escuro com ícones lucide-react e área >= 44px) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-teal-500"
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
            )}
          </button>

          {/* Usuário Autenticado */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 min-h-[44px] min-w-[44px] rounded-xl text-xs sm:text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  currentView === 'dashboard' || currentView === 'lesson'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={`Logado como @${displayUsername}`}
                aria-label={`Perfil de @${displayUsername}`}
              >
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                  {initialLetter}
                </div>
                <span className="max-w-[100px] sm:max-w-[160px] truncate hidden xs:inline">
                  @{displayUsername}
                </span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onNavigate('home');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-2 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-900 transition focus:outline-none focus:ring-2 focus:ring-rose-500"
                aria-label="Sair da conta"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            /* Visitante / Não Autenticado */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate('login')}
                className={`px-3 sm:px-3.5 py-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-xs sm:text-sm font-bold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  currentView === 'login'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn-tactile-primary min-h-[44px] min-w-[44px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold"
              >
                Criar Conta
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
