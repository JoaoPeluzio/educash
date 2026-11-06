/**
 * EduCash — Página da Lição e Trilha Interativa (Etapa 7E: Redesign da Experiência da Lição)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LessonDetail, ActivitySubmissionResult, LessonSummaryItem } from '../types/learning';
import {
  fetchAvailableLessons,
  fetchLessonDetails,
  submitActivityAnswer,
} from '../services/learningService';
import { APPROVED_ACHIEVEMENTS, INITIAL_LESSONS_CATALOG } from '../services/learningContent';
import { MultipleChoiceActivity } from '../components/activities/MultipleChoiceActivity';
import { TrueFalseActivity } from '../components/activities/TrueFalseActivity';
import { MatchingActivity } from '../components/activities/MatchingActivity';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Sparkles,
  Coins,
  FlaskConical,
  Scale,
  ArrowLeftRight,
  PiggyBank,
} from 'lucide-react';

interface LessonPageProps {
  lessonId: string;
  onBackToDashboard: () => void;
}

export type LessonStep = 'intro' | 'example' | 'activity_1' | 'activity_2' | 'activity_3' | 'conclusion';

interface StepMeta {
  id: LessonStep;
  label: string;
  shortLabel: string;
  category: 'content' | 'activity' | 'finish';
  index: number;
}

const LESSON_STEPS: StepMeta[] = [
  { id: 'intro', label: 'Introdução', shortLabel: 'Intro', category: 'content', index: 1 },
  { id: 'example', label: 'Exemplo Prático', shortLabel: 'Exemplo', category: 'content', index: 2 },
  { id: 'activity_1', label: 'Múltipla Escolha', shortLabel: 'Ativ. 1', category: 'activity', index: 3 },
  { id: 'activity_2', label: 'Verdadeiro ou Falso', shortLabel: 'Ativ. 2', category: 'activity', index: 4 },
  { id: 'activity_3', label: 'Associação', shortLabel: 'Ativ. 3', category: 'activity', index: 5 },
  { id: 'conclusion', label: 'Conclusão', shortLabel: 'Fim', category: 'finish', index: 6 },
];

export const LessonPage: React.FC<LessonPageProps> = ({ lessonId, onBackToDashboard }) => {
  const { isConfigured, isDemoSession } = useAuth();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [availableLessons, setAvailableLessons] = useState<LessonSummaryItem[]>([]);
  const [currentStep, setCurrentStep] = useState<LessonStep>('intro');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Estado de submissão da atividade atual
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResults, setSubmissionResults] = useState<Record<string, ActivitySubmissionResult>>({});
  const [accumulatedSessionRewards, setAccumulatedSessionRewards] = useState<{
    xp: number;
    coins: number;
    achievements: string[];
  }>({
    xp: 0,
    coins: 0,
    achievements: [],
  });

  const refreshAvailableLessons = useCallback(async () => {
    const { lessons: availLessons } = await fetchAvailableLessons();
    if (availLessons && availLessons.length > 0) {
      setAvailableLessons(availLessons);
    }
  }, []);

  const loadLessonData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    const [{ lesson: data, error }, { lessons: availLessons }] = await Promise.all([
      fetchLessonDetails(lessonId),
      fetchAvailableLessons(),
    ]);

    if (error || !data) {
      setLoadError(error || 'Não foi possível carregar o conteúdo da lição.');
    } else {
      setLesson(data);
      if (availLessons) {
        setAvailableLessons(availLessons);
      }
    }
    setIsLoading(false);
  }, [lessonId]);

  useEffect(() => {
    loadLessonData();
  }, [loadLessonData]);

  useEffect(() => {
    if (currentStep === 'conclusion') {
      refreshAvailableLessons();
    }
  }, [currentStep, refreshAvailableLessons]);

  // Submissão de respostas com feedback e persistência
  const handleAnswerSubmit = async (activityId: string, answerPayload: unknown) => {
    setIsSubmitting(true);
    const { result, error } = await submitActivityAnswer(activityId, answerPayload);
    setIsSubmitting(false);

    if (error || !result) {
      alert(error || 'Erro ao processar sua resposta. Tente novamente.');
      return;
    }

    setSubmissionResults((prev) => ({
      ...prev,
      [activityId]: result,
    }));

    if (result.is_correct) {
      setAccumulatedSessionRewards((prev) => ({
        xp: prev.xp + result.xp_earned + (result.lesson_bonus_xp || 0),
        coins: prev.coins + result.coins_earned + (result.lesson_bonus_coins || 0),
        achievements: Array.from(new Set([...prev.achievements, ...(result.unlocked_achievements || [])])),
      }));
      // Atualiza o estado autoritativo de desbloqueio assim que houver acerto
      refreshAvailableLessons();
    }
  };

  const handleRetryActivity = (activityId: string) => {
    setSubmissionResults((prev) => {
      const next = { ...prev };
      delete next[activityId];
      return next;
    });
  };

  const currentStepMeta = LESSON_STEPS.find((s) => s.id === currentStep) || LESSON_STEPS[0];
  const stepProgressPercent = Math.round((currentStepMeta.index / LESSON_STEPS.length) * 100);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Carregando conteúdo da lição...
        </p>
      </div>
    );
  }

  if (loadError || !lesson) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Lição Indisponível</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{loadError}</p>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="btn-tactile-primary text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Painel</span>
        </button>
      </div>
    );
  }

  const act1 = lesson.activities[0];
  const act2 = lesson.activities[1];
  const act3 = lesson.activities[2];

  const isAct1Completed = Boolean(submissionResults[act1?.id]?.is_correct || act1?.is_completed);
  const isAct2Completed = Boolean(submissionResults[act2?.id]?.is_correct || act2?.is_completed);
  const isAct3Completed = Boolean(submissionResults[act3?.id]?.is_correct || act3?.is_completed);

  const currentLessonSummary = availableLessons.find(
    (l) => l.position === lesson.position || l.lesson_id === lesson.id
  );
  const nextLessonPosition = lesson.position + 1;
  const nextLessonSummary =
    availableLessons.find((l) => l.position === nextLessonPosition) ||
    INITIAL_LESSONS_CATALOG.find((l) => l.position === nextLessonPosition);

  // Confirmação autoritativa do desbloqueio da próxima lição (Lições 1 a 4)
  const isNextLessonUnlocked = Boolean(
    availableLessons.find((l) => l.position === nextLessonPosition)?.is_unlocked
  );

  // Confirmação autoritativa da conclusão da Lição 5 (Término da jornada)
  const isLesson5Completed =
    lesson.position === 5 && Boolean(currentLessonSummary?.is_completed);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* 1. Cabeçalho de Navegação e Contexto da Lição */}
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="btn-tactile-secondary text-xs sm:text-sm !py-2 !px-3.5"
            aria-label="Voltar para a Trilha de Aprendizagem"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Voltar para Trilha</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold">
              Lição {lesson.position} de 5
            </span>
            {(isDemoSession || !isConfigured) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                <FlaskConical className="w-3 h-3 text-amber-600" />
                <span>Modo Demo</span>
              </span>
            )}
          </div>
        </div>

        {/* Título Principal e Posição da Lição */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-1">
            Educação Financeira • Lição {lesson.position}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {lesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Barra de Progresso Responsiva (Design System 7E) */}
        <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                Etapa {currentStepMeta.index} de {LESSON_STEPS.length}
              </span>
              <strong className="text-slate-900 dark:text-slate-100 font-bold sm:inline">
                {currentStepMeta.label}
              </strong>
            </div>
            <span className="text-slate-500 dark:text-slate-400 tabular-nums font-bold">
              {stepProgressPercent}% concluído
            </span>
          </div>

          {/* Barra de Progresso Suave */}
          <div className="w-full bg-slate-100 dark:bg-slate-700/70 h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
            <div
              className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 h-full rounded-full transition-all duration-300 ease-out shadow-2xs"
              style={{ width: `${stepProgressPercent}%` }}
              role="progressbar"
              aria-valuenow={stepProgressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Segmentos de Milestones Discretos (Substitui o stepper textual rígido) */}
          <div className="grid grid-cols-6 gap-1.5 pt-0.5">
            {LESSON_STEPS.map((step) => {
              const isCurrent = currentStep === step.id;
              const isPast = step.index < currentStepMeta.index;

              return (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full h-1.5 rounded-full transition-colors ${
                      isCurrent
                        ? 'bg-teal-600 dark:bg-teal-400 ring-2 ring-teal-500/20'
                        : isPast
                        ? 'bg-teal-600/70 dark:bg-teal-500/70'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                  <span
                    className={`text-[10px] leading-tight truncate ${
                      isCurrent
                        ? 'font-bold text-teal-700 dark:text-teal-300'
                        : isPast
                        ? 'text-slate-600 dark:text-slate-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. Conteúdo Central por Etapa */}
      <main className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
        {/* ========================================================================= */}
        {/* ETAPA 1: INTRODUÇÃO PEDAGÓGICA */}
        {/* ========================================================================= */}
        {currentStep === 'intro' && (
          <section className="space-y-6" aria-label="Introdução da Lição">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Etapa 1 de 6 • Conceito Fundamental</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {lesson.title}
            </h2>

            {/* Texto Introdutório */}
            <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/70 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
              {lesson.introduction}
            </div>

            {/* Comparativo Didático Exclusivo da Lição 1 */}
            {lesson.position === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    A Era do Escambo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Troca direta de mercadoria por mercadoria. Se um agricultor trocava trigo por ovelhas,
                    a troca só acontecia se ambos precisassem do que o outro tinha.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
                    <Coins className="w-5 h-5 text-teal-100" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-teal-900 dark:text-teal-200">
                    A Invenção da Moeda
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Criou um meio universalmente aceito na sociedade. Qualquer pessoa aceita a moeda padronizada,
                    facilitando o comércio e o trabalho de todos.
                  </p>
                </div>
              </div>
            )}

            {/* Ação de Avançar */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep('example')}
                className="btn-tactile-primary w-full sm:w-auto"
              >
                <span>Ver Exemplo Prático</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 2: EXEMPLO PRÁTICO DO COTIDIANO */}
        {/* ========================================================================= */}
        {currentStep === 'example' && (
          <section className="space-y-6" aria-label="Exemplo Prático">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-semibold">
              <Lightbulb className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Etapa 2 de 6 • Aplicação no Cotidiano</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {lesson.position === 1 ? 'O Caso Prático: Sofia e Lucas' : `Exemplo Prático: ${lesson.title}`}
            </h2>

            {/* Bloco de Narrativa Prática */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-1">
                Situação Real
              </span>
              <p className="text-sm sm:text-base leading-relaxed">{lesson.practical_example}</p>
            </div>

            {/* Destaque das 3 Funções Essenciais Exclusivas da Lição 1 */}
            {lesson.position === 1 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  As 3 Funções Principais do Dinheiro:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                      1. Meio de Troca
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Permite comprar produtos, lanches e transporte sem a necessidade de escambo.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                      2. Medida de Valor
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Serve como régua comum para comparar preços e saber o valor exato das coisas.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                      <PiggyBank className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      3. Reserva de Valor
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Possibilita guardar hoje para utilizar no futuro e conquistar metas financeiras.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ações de Navegação */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('intro')}
                className="btn-tactile-secondary text-xs sm:text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para Introdução</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('activity_1')}
                className="btn-tactile-primary text-xs sm:text-sm"
              >
                <span>Ir para as Atividades</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 3: ATIVIDADES OBRIGATÓRIAS (1, 2, 3) */}
        {/* ========================================================================= */}

        {/* Atividade 1: Múltipla Escolha */}
        {currentStep === 'activity_1' && act1 && (
          <section aria-label="Atividade 1: Múltipla Escolha" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Desafio 1 de 3 • Múltipla Escolha
                </span>
                {isAct1Completed && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Acertou!</span>
                  </span>
                )}
              </div>
              {isAct1Completed ? (
                submissionResults[act1.id]?.xp_earned && submissionResults[act1.id].xp_earned > 0 ? (
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recompensa obtida: +{submissionResults[act1.id].xp_earned} XP • +{submissionResults[act1.id].coins_earned} Moedas</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Recompensa já resgatada
                  </span>
                )
              ) : (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recompensa: +10 XP • +5 Moedas</span>
                </span>
              )}
            </div>

            <MultipleChoiceActivity
              activity={act1}
              isSubmitting={isSubmitting}
              lastResult={submissionResults[act1.id] || null}
              onSubmit={(ans) => handleAnswerSubmit(act1.id, ans)}
              onRetry={() => handleRetryActivity(act1.id)}
              onNext={() => setCurrentStep('activity_2')}
            />
          </section>
        )}

        {/* Atividade 2: Verdadeiro ou Falso */}
        {currentStep === 'activity_2' && act2 && (
          <section aria-label="Atividade 2: Verdadeiro ou Falso" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Desafio 2 de 3 • Verdadeiro ou Falso
                </span>
                {isAct2Completed && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Acertou!</span>
                  </span>
                )}
              </div>
              {isAct2Completed ? (
                submissionResults[act2.id]?.xp_earned && submissionResults[act2.id].xp_earned > 0 ? (
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recompensa obtida: +{submissionResults[act2.id].xp_earned} XP • +{submissionResults[act2.id].coins_earned} Moedas</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Recompensa já resgatada
                  </span>
                )
              ) : (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recompensa: +10 XP • +5 Moedas</span>
                </span>
              )}
            </div>

            <TrueFalseActivity
              activity={act2}
              isSubmitting={isSubmitting}
              lastResult={submissionResults[act2.id] || null}
              onSubmit={(ans) => handleAnswerSubmit(act2.id, ans)}
              onRetry={() => handleRetryActivity(act2.id)}
              onNext={() => setCurrentStep('activity_3')}
            />
          </section>
        )}

        {/* Atividade 3: Correspondência (Matching) */}
        {currentStep === 'activity_3' && act3 && (
          <section aria-label="Atividade 3: Associação de Conceitos" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Desafio 3 de 3 • Associação de Conceitos
                </span>
                {isAct3Completed && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Acertou!</span>
                  </span>
                )}
              </div>
              {isAct3Completed ? (
                submissionResults[act3.id]?.xp_earned && submissionResults[act3.id].xp_earned > 0 ? (
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recompensa obtida: +{submissionResults[act3.id].xp_earned + (submissionResults[act3.id].lesson_bonus_xp || 0)} XP • +{submissionResults[act3.id].coins_earned + (submissionResults[act3.id].lesson_bonus_coins || 0)} Moedas</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Recompensa já resgatada
                  </span>
                )
              ) : (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recompensa: +10 XP • +5 Moedas (+ Bônus de Lição!)</span>
                </span>
              )}
            </div>

            <MatchingActivity
              activity={act3}
              isSubmitting={isSubmitting}
              lastResult={submissionResults[act3.id] || null}
              onSubmit={(ans) => handleAnswerSubmit(act3.id, ans)}
              onRetry={() => handleRetryActivity(act3.id)}
              onNext={() => setCurrentStep('conclusion')}
            />
          </section>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 4: CONCLUSÃO & RESUMO DA LIÇÃO */}
        {/* ========================================================================= */}
        {currentStep === 'conclusion' && (
          <section className="space-y-6 text-center py-2" aria-label="Conclusão da Lição">
            {/* Ícone de Sucesso */}
            <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-xs">
              <Trophy className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-200 text-xs font-bold mb-2 border border-teal-200 dark:border-teal-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Lição {lesson.position} Concluída com Sucesso!</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Parabéns pelo seu aprendizado!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed">
                {lesson.conclusion}
              </p>
            </div>

            {/* Painel Estruturado de Recompensas */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white shadow-xs max-w-lg mx-auto text-left border border-teal-600/30">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-200 block mb-3">
                Recompensas Registradas na Sessão:
              </span>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                  <div className="text-[11px] text-teal-100 font-medium">Experiência Ganha</div>
                  <div className="text-xl font-black text-white mt-0.5 tabular-nums">
                    +{accumulatedSessionRewards.xp} XP
                  </div>
                  <div className="text-[10px] text-teal-200 mt-0.5">
                    {accumulatedSessionRewards.xp > 0
                      ? '3 atividades + bônus'
                      : 'Recompensas resgatadas anteriormente'}
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                  <div className="text-[11px] text-teal-100 font-medium">EduCoins Ganhos</div>
                  <div className="text-xl font-black text-white mt-0.5 tabular-nums">
                    +{accumulatedSessionRewards.coins}
                  </div>
                  <div className="text-[10px] text-teal-200 mt-0.5">
                    {accumulatedSessionRewards.coins > 0
                      ? 'Moedas computadas'
                      : 'Recompensas resgatadas anteriormente'}
                  </div>
                </div>
              </div>

              {accumulatedSessionRewards.xp === 0 && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-[11px] text-teal-100 leading-relaxed mb-4">
                  Esta foi uma sessão de revisão. Nenhum XP ou moeda adicional foi gerado nesta sessão pois as recompensas desta lição já foram conquistadas em sua primeira conclusão.
                </div>
              )}

              {/* Conquistas Desbloqueadas */}
              {accumulatedSessionRewards.achievements.length > 0 && (
                <div className="border-t border-white/15 pt-3">
                  <span className="text-[11px] text-teal-100 font-semibold block mb-2">
                    Conquistas desbloqueadas nesta sessão:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {accumulatedSessionRewards.achievements.map((ach) => (
                      <span
                        key={ach}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 text-white text-xs font-semibold border border-white/20"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{APPROVED_ACHIEVEMENTS[ach]?.name || ach}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Aviso de Continuidade na Trilha ou Conclusão da Trilha */}
            {lesson.position >= 1 && lesson.position <= 4 ? (
              isNextLessonUnlocked && nextLessonSummary ? (
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 max-w-lg mx-auto text-left flex items-start gap-3 text-xs">
                  <Sparkles className="w-5 h-5 text-teal-700 dark:text-teal-300 shrink-0 mt-0.5" />
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Próxima etapa desbloqueada:</strong> A Lição {nextLessonPosition} (<em>{nextLessonSummary.title}</em>) agora está liberada para estudo no seu painel!
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-lg mx-auto text-left flex items-start gap-3 text-xs">
                  <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Progresso Registrado:</strong> Revise suas atividades ou retorne ao painel para continuar sua jornada de aprendizado.
                  </div>
                </div>
              )
            ) : lesson.position === 5 ? (
              isLesson5Completed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 max-w-lg mx-auto text-left flex items-start gap-3 text-xs">
                  <Trophy className="w-5 h-5 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Jornada Concluída:</strong> Você finalizou todas as 5 lições da Trilha Fundamental de Educação Financeira do EduCash!
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-lg mx-auto text-left flex items-start gap-3 text-xs">
                  <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Progresso Registrado:</strong> Conclua todas as atividades obrigatórias para finalizar a Trilha de Educação Financeira.
                  </div>
                </div>
              )
            ) : null}

            {/* Ação de Retorno ao Dashboard */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="btn-tactile-primary w-full sm:w-auto !px-8 !py-3.5 text-sm"
              >
                <span>Voltar para a Trilha de Aprendizagem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
