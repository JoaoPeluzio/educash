/**
 * EduCash — Componente de Atividade de Múltipla Escolha (Etapa 7E: Redesign de Atividades)
 */

import React, { useState } from 'react';
import { Activity, ActivitySubmissionResult } from '../../types/learning';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Coins,
  HelpCircle,
} from 'lucide-react';

interface MultipleChoiceActivityProps {
  activity: Activity;
  isSubmitting: boolean;
  lastResult: ActivitySubmissionResult | null;
  onSubmit: (answer: { selected_option: string }) => void;
  onRetry: () => void;
  onNext: () => void;
}

export const MultipleChoiceActivity: React.FC<MultipleChoiceActivityProps> = ({
  activity,
  isSubmitting,
  lastResult,
  onSubmit,
  onRetry,
  onNext,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('');

  const handleSelect = (key: string) => {
    if (lastResult?.is_correct || isSubmitting) return;
    setSelectedKey(key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey || isSubmitting || lastResult?.is_correct) return;
    onSubmit({ selected_option: selectedKey });
  };

  const isAnsweredCorrectly = Boolean(lastResult?.is_correct);

  return (
    <div className="space-y-6">
      {/* 1. Enunciado e Instrução */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Múltipla Escolha</span>
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {activity.description}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Selecione a única alternativa correta e confirme sua resposta para avançar:
        </p>
      </div>

      {/* 2. Lista de Alternativas */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={isSubmitting || isAnsweredCorrectly} className="space-y-3">
          <legend className="sr-only">Opções de resposta para o desafio de múltipla escolha</legend>
          {activity.options.map((option, idx) => {
            const isSelected = selectedKey === option.option_key;
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelect(option.option_key)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 group min-h-[56px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                  isSelected
                    ? 'border-teal-600 dark:border-teal-400 bg-teal-50/80 dark:bg-teal-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-750'
                }`}
              >
                {/* Letra identificadora */}
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors mt-0.5 ${
                    isSelected
                      ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                  }`}
                  aria-hidden="true"
                >
                  {letter}
                </span>

                {/* Texto da alternativa */}
                <span className="flex-1 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 pt-1 leading-relaxed">
                  {option.option_text}
                </span>

                {/* Indicador de Seleção (Radio Visual) */}
                <span
                  className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-teal-600 dark:border-teal-400 bg-teal-600 dark:bg-teal-500'
                      : 'border-slate-300 dark:border-slate-600 bg-transparent'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
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
                  {lastResult.is_correct ? 'Muito bem! Resposta correta!' : 'Quase lá! Vamos revisar o conceito:'}
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
              disabled={!selectedKey || isSubmitting}
              className="btn-tactile-primary w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verificando resposta...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Resposta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {lastResult && !lastResult.is_correct && (
            <button
              type="button"
              onClick={() => {
                setSelectedKey('');
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
