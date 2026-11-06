/**
 * EduCash — Barra Lateral de Navegação Desktop (Estágio 2: Shell da Aplicação)
 * Atualizada na Etapa 7C com tokens do Design System, ícones lucide-react e acessibilidade WCAG
 */

import React from 'react';
import { BookOpen, Home, Sun, Moon, LogOut, FlaskConical } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NavViewType } from './Navbar';

interface SidebarProps {
  currentView: NavViewType;
  onNavigate: (view: NavViewType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const { user, profile, logout, isDemoSession } = useAuth();

  const isAprenderActive = currentView === 'dashboard' || currentView === 'lesson';
  const isInicioActive = currentView === 'home';

  const displayUsername = profile?.username || user?.username || 'Estudante';
  const initialLetter = displayUsername.charAt(0).toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 z-30 transition-colors"
      aria-label="Navegação Lateral"
    >
      {/* Topo / Logotipo e Identidade da Marca */}
      <div className="h-16 px-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onNavigate(user ? 'dashboard' : 'home')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl p-1 transition min-h-[44px]"
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
            </div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
              Educação Financeira
            </p>
          </div>
        </button>
      </div>

      {/* Seção Principal de Navegação */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Menu Principal
        </div>

        {/* Item: Aprender (Trilha de Lições e Atividades) */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            isAprenderActive
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-l-4 border-teal-600 dark:border-teal-400 font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-100'
          }`}
          aria-current={isAprenderActive ? 'page' : undefined}
        >
          <BookOpen
            className={`w-5 h-5 shrink-0 ${
              isAprenderActive ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400 dark:text-slate-500'
            }`}
            aria-hidden="true"
          />
          <span className="truncate">Aprender</span>
        </button>

        {/* Item: Início (Página Inicial / Institucional) */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            isInicioActive
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-l-4 border-teal-600 dark:border-teal-400 font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-100'
          }`}
          aria-current={isInicioActive ? 'page' : undefined}
        >
          <Home
            className={`w-5 h-5 shrink-0 ${
              isInicioActive ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400 dark:text-slate-500'
            }`}
            aria-hidden="true"
          />
          <span className="truncate">Início</span>
        </button>
      </div>

      {/* Rodapé da Sidebar: Perfil, Tema e Logout */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        {/* Indicador de Demonstração Ativa */}
        {isDemoSession && (
          <div
            title="Sessão de demonstração com dados locais isolados."
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <span className="truncate">Modo Demonstração</span>
          </div>
        )}

        {/* Card do Usuário Autenticado */}
        {user && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {initialLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                @{displayUsername}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user.email || 'Conta de Estudante'}
              </p>
            </div>
          </div>
        )}

        {/* Alternância de Tema */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          <span className="flex items-center gap-2">
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
            <span>{isDark ? 'Tema Claro' : 'Tema Escuro'}</span>
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Botão de Encerramento da Sessão (Logout) */}
        {user && (
          <button
            type="button"
            onClick={async () => {
              await logout();
              onNavigate('home');
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-300 dark:hover:border-rose-900 transition focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Sair da conta"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 shrink-0" aria-hidden="true" />
            <span>Sair da Conta</span>
          </button>
        )}
      </div>
    </aside>
  );
};

