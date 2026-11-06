/**
 * EduCash — Área Protegida / Demonstração de Sessão Ativa (Fase 3)
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const DashboardPlaceholderPage: React.FC = () => {
  const { user, profile, logout, isConfigured, createProfile } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    if (!newUsername.trim()) {
      setInputError('Informe um nome de usuário.');
      return;
    }
    setIsSubmitting(true);
    const result = await createProfile(newUsername);
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setInputError(result.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Banner de Boas-Vindas */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 shadow-sm relative overflow-hidden mb-8">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-50 mb-4 border border-white/20">
            <span>Área do Aluno • Fase 3 Concluída</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Olá, <span className="text-emerald-200">{profile?.username || user?.username || 'Aluno'}</span>!
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Sua autenticação foi realizada com sucesso. Sua sessão está persistida e protegida através do cliente Supabase.
          </p>
        </div>

        {/* Círculo decorativo */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Alerta e Formulário de Conclusão do Perfil de Estudante */}
      {!profile && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 mb-8 text-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xl shrink-0">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Defina seu Nome de Usuário
              </h2>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Sua conta está autenticada, mas ainda não possui um perfil de estudante criado.
                Escolha um nome de usuário único para salvar seu progresso. Seu nome de usuário nunca será gerado a partir do seu e-mail.
              </p>

              <form onSubmit={handleCreateProfile} className="space-y-3 max-w-md">
                <div>
                  <label htmlFor="create-username" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nome de Usuário (3 a 30 caracteres)
                  </label>
                  <input
                    id="create-username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => {
                      setNewUsername(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="ex: aluno_nota10"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  {inputError && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {inputError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Nome de Usuário'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cartões de Status da Autenticação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Cartão 1: Perfil do Aluno */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
            Perfil do Aluno
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Nome de Usuário:</span>
              <span className="font-semibold text-slate-900">
                @{profile?.username || user?.username || 'não definido'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">E-mail:</span>
              <span className="font-medium text-slate-800 truncate block">
                {user?.email || 'não informado'}
              </span>
            </div>
          </div>
        </div>

        {/* Cartão 2: Sessão e Segurança */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
            Status da Sessão
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Identificador de Usuário:</span>
              <code className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {user?.id ? `${user.id.substring(0, 13)}...` : 'desconhecido'}
              </code>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Ambiente:</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {isConfigured ? 'Supabase Conectado' : 'Simulação Local / Demo'}
              </span>
            </div>
          </div>
        </div>

        {/* Cartão 3: Próxima Etapa (Fase 4) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
            Próxima Entrega
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Na <strong>Fase 4</strong>, este painel dará acesso às 5 lições pedagógicas, 15 atividades avaliativas e ao sistema de recompensas (XP e moedas).
          </p>
          <div className="mt-3 inline-flex items-center text-xs font-bold text-emerald-700">
            Fase 4: Lições & Atividades →
          </div>
        </div>
      </div>

      {/* Ações da Conta */}
      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Encerrar sessão</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ao sair, suas credenciais serão removidas do navegador com segurança.
          </p>
        </div>
        <button
          onClick={() => logout()}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 transition"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

