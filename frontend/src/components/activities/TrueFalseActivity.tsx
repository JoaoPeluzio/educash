/**
 * EduCash — Componente de Atividade Verdadeiro ou Falso (Etapa 7E: Redesign de Atividades)
 */

import React, { useState } from 'react';
import { Activity, ActivitySubmissionResult } from '../../types/learning';
import {
  Check,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Coins,
  Scale,
} from 'lucide-react';

interface TrueFalseActivityProps {
  activity: Activity;
  isSubmitting: boolean;
  lastResult: ActivitySubmissionResult | null;
  onSubmit: (answer: { value: boolean }) => void;
  onRetry: () => void;
  onNext: () => void;
}

export const TrueFalseActivity: React.FC<TrueFalseActivityProps> = ({
  activity,
  isSubmitting,
  lastResult,
  onSubmit,
  onRetry,
  onNext,
}) => {
  const [selectedVal, setSelectedVal] = useState<boolean | null>(null);

  const handleSelect = (val: boolean) => {
    if (lastResult?.is_correct || isSubmitting) return;
    setSelectedVal(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVal === null || isSubmitting || lastResult?.is_correct) return;
    onSubmit({ value: selectedVal });
  };

  const isAnsweredCorrectly = Boolean(lastResult?.is_correct);

  return (
    <div className="space-y-6">
      {/* 1. Enunciado e Instrução */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Verdadeiro ou Falso</span>
          </span>
        </div>

        {/* Card Direto da Afirmação (Sem citação pesada de blog) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-teal-500/30 dark:border-teal-500/20 shadow-2xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
            Afirmação para análise:
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {activity.description}
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Analise o conceito com atenção e decida se a afirmação acima é verdadeira ou falsa:
        </p>
      </div>

      {/* 2. Seleção Verdadeiro / Falso com Botões Táteis Claros */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={isSubmitting || isAnsweredCorrectly} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <legend className="sr-only">Escolha entre Verdadeiro ou Falso</legend>

          {/* Opção Verdadeiro */}
          <button
            type="button"
            aria-pressed={selectedVal === true}
            onClick={() => handleSelect(true)}
            className={`p-5 sm:p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
              selectedVal === true
                ? 'border-teal-600 dark:border-teal-400 bg-teal-50/80 dark:bg-teal-950/40 shadow-xs'
                : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                selectedVal === true
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                  : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              }`}
              aria-hidden="true"
            >
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Verdadeiro
                </span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedVal === true
                      ? 'border-teal-600 dark:border-teal-400 bg-teal-600 dark:bg-teal-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                  aria-hidden="true"
                >
                  {selectedVal === true && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A afirmação é correta e condiz com os conceitos aprendidos.
              </p>
            </div>
          </button>

          {/* Opção Falso */}
          <button
            type="button"
            aria-pressed={selectedVal === false}
            onClick={() => handleSelect(false)}
            className={`p-5 sm:p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
              selectedVal === false
                ? 'border-rose-600 dark:border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 shadow-xs'
                : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                selectedVal === false
                  ? 'bg-rose-700 text-white dark:bg-rose-600 shadow-2xs'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
              aria-hidden="true"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Falso
                </span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedVal === false
                      ? 'border-rose-600 dark:border-rose-400 bg-rose-600 dark:bg-rose-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                  aria-hidden="true"
                >
                  {selectedVal === false && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A afirmação contém um equívoco conceitual ou está incorreta.
              </p>
            </div>
          </button>
        </fieldset>

        {/* 3. Feedback Estruturado Após Submissão */}
        {lastResult && (
          <div
            role="alert"
            className={`p-5 rounded-2xl border-2 transition-all mt-5 ${
              lastResult.is_correct
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  lastResult.is_correct
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
                aria-hidden="true"
              >
                {lastResult.is_correct ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <h4 className="font-bold text-sm sm:text-base leading-snug">
                  {lastResult.is_correct ? 'Muito bem! Julgamento correto!' : 'Atenção aos detalhes do conceito:'}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {lastResult.feedback}
                </p>

                {/* Recompensas Computadas */}
                {lastResult.is_correct && lastResult.xp_earned > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/80 text-teal-900 dark:text-teal-200 text-xs font-bold border border-teal-200 dark:border-teal-700">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
                      +{lastResult.xp_earned} XP
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-700">
                      <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      +{lastResult.coins_earned} EduCoins
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Barra de Ações (Confirmar / Tentar Novamente / Avançar) */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          {!lastResult && (
            <button
              type="submit"
              disabled={selectedVal === null || isSubmitting}
              className="btn-tactile-primary w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validando afirmação...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Avaliação</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {lastResult && !lastResult.is_correct && (
            <button
              type="button"
              onClick={() => {
                setSelectedVal(null);
                onRetry();
              }}
              className="btn-tactile-secondary w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Tentar Novamente (Sem penalidade)</span>
            </button>
          )}

          {lastResult && lastResult.is_correct && (
            <button
              type="button"
              onClick={onNext}
              className="btn-tactile-primary w-full sm:w-auto"
            >
              <span>Próximo Desafio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
