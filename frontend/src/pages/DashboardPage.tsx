/**
 * EduCash — Painel Principal do Aluno e Trilha de Aprendizagem (Etapa 7D: Redesign do Dashboard)
 * 
 * Experiência visual inspirada no Duolingo e interfaces modernas de fintech juvenil (10 a 18 anos):
 * progressão por stepping stones, clareza visual, cards táteis e feedback motivador sem infantilização.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LessonSummaryItem, LearningSummary } from '../types/learning';
import {
  fetchAvailableLessons,
  fetchLearningSummary,
  resetDemoProgress,
} from '../services/learningService';
import { APPROVED_ACHIEVEMENTS } from '../services/learningContent';
import {
  Sparkles,
  Coins,
  Trophy,
  Target,
  Check,
  Play,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  FlaskConical,
  RefreshCw,
  LogOut,
  User,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface DashboardPageProps {
  onStartLesson: (lessonId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onStartLesson }) => {
  const { user, profile, logout, isDemoSession, createProfile } = useAuth();

  const [lessons, setLessons] = useState<LessonSummaryItem[]>([]);
  const [summary, setSummary] = useState<LearningSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados para definição do username caso ainda não configurado
  const [newUsername, setNewUsername] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const [lessonsRes, summaryRes] = await Promise.all([
      fetchAvailableLessons(),
      fetchLearningSummary(profile?.username || user?.username),
    ]);

    if (lessonsRes.error) {
      setErrorMsg(lessonsRes.error);
    } else {
      setLessons(lessonsRes.lessons);
    }

    if (summaryRes.summary) {
      setSummary(summaryRes.summary);
    }

    setIsLoading(false);
  }, [profile?.username, user?.username]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    if (!newUsername.trim()) {
      setInputError('Informe um nome de usuário.');
      return;
    }
    setIsSubmittingProfile(true);
    const result = await createProfile(newUsername);
    setIsSubmittingProfile(false);
    if (!result.success && result.error) {
      setInputError(result.error);
    } else {
      loadDashboardData();
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Deseja reiniciar o progresso da demonstração local?')) {
      resetDemoProgress();
      loadDashboardData();
    }
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza de que deseja encerrar a sessão?')) {
      logout();
    }
  };

  const displayUsername = profile?.username || user?.username || 'Estudante';
  const completedLessonsCount = lessons.filter((l) => l.is_completed).length;
  const totalLessonsCount = lessons.length || 5;
  const progressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  // Próxima lição a ser cursada ou concluída
  const currentActiveLesson = lessons.find((l) => l.is_unlocked && !l.is_completed);
  const isAllCompleted = lessons.length > 0 && completedLessonsCount === totalLessonsCount;

  // Cálculo da evolução do nível (Gamificação canônica: 0, 40, 90, 150, 220 XP)
  const currentXp = summary?.total_xp || 0;
  const minXpCurrent = summary?.current_level?.min_xp || 0;
  const minXpNext = summary?.next_level?.min_xp || 40;
  const xpNeeded = Math.max(minXpNext - minXpCurrent, 1);
  const xpProgress = summary?.next_level
    ? Math.min(Math.max(Math.round(((currentXp - minXpCurrent) / xpNeeded) * 100), 0), 100)
    : 100;
  const xpRemaining = summary?.next_level
    ? Math.max(summary.next_level.min_xp - currentXp, 0)
    : 0;

  // Mapa de IDs de conquistas desbloqueadas para lookup O(1)
  const unlockedAchievementIds = new Set(
    (summary?.unlocked_achievements || []).map((a) => a.id)
  );

  // Mapeamento semântico de ícones para as 5 conquistas aprovadas do MVP
  const getAchievementIcon = (id: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked
      ? 'w-5 h-5 text-amber-600 dark:text-amber-400'
      : 'w-5 h-5 text-slate-400 dark:text-slate-500';

    switch (id) {
      case 'primeiros_passos':
        return <Sparkles className={iconClass} />;
      case 'aprendiz_dedicado':
        return <BookOpen className={iconClass} />;
      case 'conhecimento_em_evolucao':
        return <Compass className={iconClass} />;
      case 'guardiao_das_economias':
        return <Coins className={iconClass} />;
      case 'jornada_completa':
        return <Trophy className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. Alerta de Demonstração / Preview Acadêmico */}
      {isDemoSession && (
        <div
          role="status"
          className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold block text-sm text-amber-950 dark:text-amber-100">
                Modo de Demonstração Interativa
              </span>
              <p className="text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                Você está utilizando uma sessão local com dados isolados no navegador.
                As regras de XP, desbloqueio e moedas operam fielmente para avaliação do sistema.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-amber-900/70 font-semibold text-xs shrink-0 self-end sm:self-auto transition min-h-[44px] focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar Demonstração</span>
          </button>
        </div>
      )}

      {/* 2. Formulário de Conclusão de Perfil (se sem username cadastrado) */}
      {!profile && (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/70 rounded-2xl p-6 text-slate-800 dark:text-slate-100 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                Defina seu Nome de Usuário
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Sua conta está autenticada, mas ainda não possui um nome de usuário único.
                Por segurança e privacidade, seu nome nunca é gerado a partir do seu e-mail.
              </p>

              <form onSubmit={handleCreateProfile} className="space-y-3 max-w-md">
                <div>
                  <label
                    htmlFor="dash-username"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Nome de Usuário (3 a 30 caracteres)
                  </label>
                  <input
                    id="dash-username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => {
                      setNewUsername(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="ex: aluno_nota10"
                    disabled={isSubmittingProfile}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  {inputError && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {inputError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="btn-tactile-primary text-xs sm:text-sm"
                >
                  {isSubmittingProfile ? 'Salvando...' : 'Salvar Nome de Usuário'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Área de Boas-Vindas Contextual e Ação de Destaque (Continuar Aprendendo) */}
      <section
        className="rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden border border-teal-600/30"
        aria-label="Boas-vindas ao Aluno"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-teal-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Trilha de Educação Financeira</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Olá, <span className="text-teal-200">@{displayUsername}</span>!
            </h1>
            <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed">
              Bem-vindo à sua jornada no EduCash. Avance pelas lições sequenciais, responda às atividades avaliativas
              e conquiste sua autonomia financeira com segurança.
            </p>
          </div>

          {/* Card Proeminente "Continuar Aprendendo" / Resumo de Próxima Ação */}
          <div className="shrink-0 bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 min-w-[280px] max-w-sm flex flex-col justify-between gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-200 uppercase tracking-wider">
                {isAllCompleted ? 'Trilha Completa' : 'Próxima Lição'}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-100 bg-white/10 px-2.5 py-0.5 rounded-full">
                <Trophy className="w-3 h-3 text-amber-300" />
                Nível {summary?.current_level?.level || 1}
              </span>
            </div>

            {currentActiveLesson ? (
              <>
                <div>
                  <span className="text-xs text-teal-200 font-medium">Lição {currentActiveLesson.position} de 5</span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{currentActiveLesson.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onStartLesson(currentActiveLesson.lesson_id)}
                  className="w-full btn-tactile bg-white hover:bg-slate-50 active:bg-slate-100 text-teal-800 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm focus:ring-teal-400"
                >
                  <span>Continuar Aprendendo</span>
                  <ArrowRight className="w-4 h-4 text-teal-700" />
                </button>
              </>
            ) : isAllCompleted ? (
              <>
                <div>
                  <span className="text-xs text-teal-200 font-medium">Todas as 5 lições finalizadas</span>
                  <h3 className="text-sm font-bold text-white">Parabéns pela sua conquista!</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onStartLesson(lessons[0]?.lesson_id || '1')}
                  className="w-full btn-tactile bg-white hover:bg-slate-50 active:bg-slate-100 text-teal-800 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm focus:ring-teal-400"
                >
                  <span>Revisar Lição 1</span>
                  <BookOpen className="w-4 h-4 text-teal-700" />
                </button>
              </>
            ) : (
              <div className="text-xs text-teal-200 py-2">Carregando próximas lições...</div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Resumo de Progresso — Indicadores Principais (HUD) */}
      <section aria-label="Indicadores de Progresso" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Nível Atual */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nível Atual
            </span>
            <span className="block text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 truncate">
              {summary?.current_level?.name || 'Iniciante'}
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Fase {summary?.current_level?.level || 1} de 5
            </span>
          </div>
        </div>

        {/* Card 2: Pontos de XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pontos de XP
            </span>
            <span className="block text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums truncate">
              {currentXp} XP
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Experiência acumulada
            </span>
          </div>
        </div>

        {/* Card 3: EduCoins */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              EduCoins
            </span>
            <span className="block text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums truncate">
              {summary?.total_coins || 0}
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Moedas virtuais
            </span>
          </div>
        </div>

        {/* Card 4: Conclusão Geral */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lições Concluídas
            </span>
            <span className="block text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums truncate">
              {completedLessonsCount} / {totalLessonsCount}
            </span>
            <span className="block text-[11px] text-teal-700 dark:text-teal-300 font-semibold">
              {progressPercent}% da trilha
            </span>
          </div>
        </div>
      </section>

      {/* 5. Nível e Evolução — Barra de Progresso */}
      <section
        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3"
        aria-label="Evolução de Nível"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {summary?.next_level ? (
                <>Rumo ao Nível {summary.next_level.level}: {summary.next_level.name}</>
              ) : (
                <>Nível Máximo Alcançado • Especialista Financeiro</>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {summary?.next_level ? (
                <>Faltam {xpRemaining} XP para alcançar a próxima graduação.</>
              ) : (
                <>Você atingiu a graduação máxima da trilha educacional EduCash.</>
              )}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums self-end sm:self-auto bg-slate-100 dark:bg-slate-700/70 px-3 py-1 rounded-full">
            {summary?.next_level ? (
              <>{currentXp} / {summary.next_level.min_xp} XP ({xpProgress}%)</>
            ) : (
              <>{currentXp} XP (100%)</>
            )}
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
          <div
            className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </section>

      {/* 6. Trilha de Aprendizagem (Elemento Central da Interface — Stepping Stones) */}
      <section aria-label="Trilha de Aprendizagem" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Trilha de Educação Financeira
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progressão sequencial obrigatória dividida em 5 lições essenciais
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full self-start sm:self-auto border border-slate-200/70 dark:border-slate-700">
            {completedLessonsCount} de {totalLessonsCount} finalizadas
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">Carregando conteúdo da trilha...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm">
            {errorMsg}
          </div>
        ) : (
          /* Trilha de Stepping Stones com Conector Vertical */
          <div className="relative pl-12 sm:pl-16 space-y-6 before:absolute before:left-5 sm:before:left-6 before:top-6 before:bottom-6 before:w-1 before:bg-slate-200 dark:before:bg-slate-700">
            {lessons.map((lesson) => {
              const isLocked = !lesson.is_unlocked;
              const isCompleted = lesson.is_completed;
              const isAvailable = lesson.is_unlocked && !lesson.is_completed;

              return (
                <div key={lesson.lesson_id} className="relative">
                  {/* Nó / Stepping Stone da Trilha */}
                  <div
                    className={`absolute -left-12 sm:-left-16 top-4 sm:top-5 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${
                      isCompleted
                        ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-xs ring-4 ring-teal-100 dark:ring-teal-950/80 border-2 border-white dark:border-slate-800'
                        : isAvailable
                        ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md ring-4 ring-teal-200 dark:ring-teal-900 border-2 border-white dark:border-slate-800'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 ring-4 ring-slate-100 dark:ring-slate-900 border border-slate-300/60 dark:border-slate-700'
                    }`}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                    ) : isAvailable ? (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                    ) : (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </div>

                  {/* Cartão de Conteúdo da Lição */}
                  <article
                    className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:border-teal-300 dark:hover:border-teal-700'
                        : isAvailable
                        ? 'bg-white dark:bg-slate-800 border-2 border-teal-500 dark:border-teal-400 shadow-sm ring-4 ring-teal-500/10'
                        : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Lição {lesson.position} de 5
                          </span>

                          {isCompleted && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              Concluída
                            </span>
                          )}

                          {isAvailable && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-bold shadow-2xs">
                              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                              Disponível Agora
                            </span>
                          )}

                          {isLocked && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-medium">
                              <Lock className="w-3 h-3 text-slate-400" />
                              Bloqueada
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                          {lesson.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                          {lesson.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                          <span>Estrutura: 3 atividades interativas (Múltipla Escolha, V/F e Correspondência)</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-teal-700 dark:text-teal-300 font-semibold">+50 XP e +25 EduCoins totais</span>
                        </div>
                      </div>

                      {/* Botão de Ação Tátil Contextual */}
                      <div className="shrink-0 pt-2 md:pt-0">
                        {isCompleted ? (
                          <button
                            type="button"
                            onClick={() => onStartLesson(lesson.lesson_id)}
                            className="btn-tactile-secondary text-xs sm:text-sm w-full sm:w-auto"
                            aria-label={`Revisar lição ${lesson.position}: ${lesson.title}`}
                          >
                            <BookOpen className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                            <span>Revisar Lição</span>
                          </button>
                        ) : isAvailable ? (
                          <button
                            type="button"
                            onClick={() => onStartLesson(lesson.lesson_id)}
                            className="btn-tactile-primary text-xs sm:text-sm w-full sm:w-auto"
                            aria-label={`Iniciar lição ${lesson.position}: ${lesson.title}`}
                          >
                            <span>Iniciar Lição</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                            <Lock className="w-4 h-4 shrink-0" />
                            <span>Requer Lição {lesson.position - 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. Seção de Conquistas (Desbloqueadas e Bloqueadas) */}
      <section
        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-4"
        aria-label="Conquistas e Emblemas do Aluno"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Conquistas Pedagógicas ({unlockedAchievementIds.size} de {Object.keys(APPROVED_ACHIEVEMENTS).length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Emblemas concedidos automaticamente ao atingir marcos de estudo e dedicação
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.values(APPROVED_ACHIEVEMENTS).map((ach) => {
            const isUnlocked = unlockedAchievementIds.has(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-800/80 shadow-2xs'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                  aria-hidden="true"
                >
                  {getAchievementIcon(ach.id, isUnlocked)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {ach.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0 ${
                        isUnlocked
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Conquistada</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>Bloqueada</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Rodapé de Sessão */}
      <section
        className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs"
        aria-label="Ações da Sessão"
      >
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
            {isDemoSession ? 'Sessão de Demonstração Interativa' : 'Sessão Conectada'}
          </span>
          <span className="text-slate-500 dark:text-slate-400 mt-0.5 block">
            {isDemoSession
              ? 'Conectado no modo de demonstração. O progresso está armazenado localmente neste navegador.'
              : `Conectado como @${displayUsername}. Suas conquistas e progresso estão salvos na nuvem com segurança.`}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-tactile-secondary text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-xs sm:text-sm self-start sm:self-auto shrink-0 focus:ring-rose-500"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>{isDemoSession ? 'Encerrar Demonstração' : 'Encerrar Sessão'}</span>
        </button>
      </section>
    </div>
  );
};
