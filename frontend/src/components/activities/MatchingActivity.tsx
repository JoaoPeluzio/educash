/**
 * EduCash — Componente de Atividade de Correspondência (Matching) (Etapa 7E: Redesign de Atividades)
 */

import React, { useState, useMemo } from 'react';
import { Activity, ActivitySubmissionResult, ActivityOption } from '../../types/learning';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Coins,
  ArrowLeftRight,
  X,
  Link2,
} from 'lucide-react';

interface MatchingActivityProps {
  activity: Activity;
  isSubmitting: boolean;
  lastResult: ActivitySubmissionResult | null;
  onSubmit: (answer: { matches: Record<string, string> }) => void;
  onRetry: () => void;
  onNext: () => void;
}

export const MatchingActivity: React.FC<MatchingActivityProps> = ({
  activity,
  isSubmitting,
  lastResult,
  onSubmit,
  onRetry,
  onNext,
}) => {
  const leftOptions: ActivityOption[] = useMemo(
    () => activity.options.filter((opt) => opt.side === 'left' || opt.option_key.startsWith('left_')),
    [activity.options]
  );

  const rightOptions: ActivityOption[] = useMemo(
    () => activity.options.filter((opt) => opt.side === 'right' || opt.option_key.startsWith('right_')),
    [activity.options]
  );

  // Mapeamento: leftKey -> rightKey
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeLeftKey, setActiveLeftKey] = useState<string | null>(null);

  // Inverso para verificar quais itens da direita já foram escolhidos
  const usedRightKeys = useMemo(() => new Set(Object.values(matches)), [matches]);

  const matchedPairsCount = Object.keys(matches).length;
  const totalPairsCount = leftOptions.length;
  const allPairsMatched = matchedPairsCount === totalPairsCount && totalPairsCount > 0;
  const isAnsweredCorrectly = Boolean(lastResult?.is_correct);

  const handleLeftClick = (key: string) => {
    if (isAnsweredCorrectly || isSubmitting) return;
    if (activeLeftKey === key) {
      setActiveLeftKey(null);
    } else {
      setActiveLeftKey(key);
    }
  };

  const handleRightClick = (rightKey: string) => {
    if (isAnsweredCorrectly || isSubmitting) return;
    if (!activeLeftKey) return;

    setMatches((prev) => {
      const next = { ...prev };
      // Se este rightKey já estava associado a outro left, remove a associação anterior
      for (const [lKey, rKey] of Object.entries(next)) {
        if (rKey === rightKey) delete next[lKey];
      }
      next[activeLeftKey] = rightKey;
      return next;
    });

    // Avança para o próximo left desemparelhado, se houver
    const remainingLeft = leftOptions.find(
      (opt) => opt.option_key !== activeLeftKey && !matches[opt.option_key]
    );
    setActiveLeftKey(remainingLeft ? remainingLeft.option_key : null);
  };

  const handleClearPair = (leftKey: string) => {
    if (isAnsweredCorrectly || isSubmitting) return;
    setMatches((prev) => {
      const next = { ...prev };
      delete next[leftKey];
      return next;
    });
  };

  const handleResetAllPairs = () => {
    if (isAnsweredCorrectly || isSubmitting) return;
    setMatches({});
    setActiveLeftKey(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allPairsMatched || isSubmitting || isAnsweredCorrectly) return;
    onSubmit({ matches });
  };

  return (
    <div className="space-y-6">
      {/* 1. Enunciado e Instruções Interativas */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Associação de Conceitos</span>
          </span>

          {/* Progresso de Conexão dos Pares */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Pares conectados:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/80 text-teal-900 dark:text-teal-200 font-bold tabular-nums">
              {matchedPairsCount} de {totalPairsCount}
            </span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {activity.description}
        </h3>

        {/* Guia Didático dos 2 Passos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 shadow-2xs">
            <span className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              Clique em um conceito na <strong>Coluna Esquerda</strong>.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 shadow-2xs">
            <span className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              Clique na correspondência certa na <strong>Coluna Direita</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Área de Correspondência em 2 Colunas Responsivas */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* ========================================================================= */}
          {/* COLUNA ESQUERDA: TERMOS / CONCEITOS */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Termos & Conceitos
              </h4>
              {matchedPairsCount > 0 && !isAnsweredCorrectly && !isSubmitting && (
                <button
                  type="button"
                  onClick={handleResetAllPairs}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition min-h-[44px] min-w-[44px] px-2 py-2 inline-flex items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  Limpar todos
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {leftOptions.map((opt, idx) => {
                const isSelected = activeLeftKey === opt.option_key;
                const pairedRightKey = matches[opt.option_key];
                const pairedRight = rightOptions.find((r) => r.option_key === pairedRightKey);

                return (
                  <div
                    key={opt.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-teal-600 dark:border-teal-400 bg-teal-50/90 dark:bg-teal-950/50 shadow-xs ring-2 ring-teal-500/20'
                        : pairedRight
                        ? 'border-teal-300 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={isSubmitting || isAnsweredCorrectly}
                      aria-pressed={isSelected}
                      onClick={() => handleLeftClick(opt.option_key)}
                      className="w-full text-left flex items-start justify-between gap-2.5 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl py-0.5"
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <span
                          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                              : pairedRight
                              ? 'bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-200'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 pt-0.5 leading-snug">
                          {opt.option_text}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-700 text-white dark:bg-teal-600 shrink-0">
                          Aguardando par →
                        </span>
                      )}
                    </button>

                    {/* Destaque do Par Conectado */}
                    {pairedRight && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Link2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                            {pairedRight.option_text}
                          </span>
                        </div>

                        {!isAnsweredCorrectly && !isSubmitting && (
                          <button
                            type="button"
                            onClick={() => handleClearPair(opt.option_key)}
                            aria-label={`Desfazer conexão de ${opt.option_text} com ${pairedRight.option_text}`}
                            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 shrink-0 ml-2 inline-flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-xl transition-colors"
                            title="Desfazer conexão deste par"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Desfazer</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA DIREITA: DEFINIÇÕES / SIGNIFICADOS */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="pb-1.5 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Significados & Aplicações
              </h4>
            </div>

            <div className="space-y-2.5">
              {rightOptions.map((opt, idx) => {
                const isUsed = usedRightKeys.has(opt.option_key);
                const letter = String.fromCharCode(65 + idx);

                // Descobre qual item da esquerda está conectado a este
                const pairedLeftEntry = Object.entries(matches).find(
                  ([, rKey]) => rKey === opt.option_key
                );
                const pairedLeftOpt = pairedLeftEntry
                  ? leftOptions.find((l) => l.option_key === pairedLeftEntry[0])
                  : null;
                const pairedLeftIndex = pairedLeftOpt
                  ? leftOptions.findIndex((l) => l.option_key === pairedLeftOpt.option_key) + 1
                  : null;

                const isTargetForActive = Boolean(activeLeftKey && !isUsed);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitting || isAnsweredCorrectly}
                    onClick={() => handleRightClick(opt.option_key)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      isTargetForActive
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 shadow-xs cursor-pointer ring-2 ring-teal-500/20'
                        : isUsed
                        ? 'border-teal-300 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isUsed
                          ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {letter}
                    </span>

                    <div className="flex-1 space-y-1">
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {opt.option_text}
                      </p>

                      {pairedLeftIndex && (
                        <div className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1 pt-0.5">
                          <span>✓ Conectado ao item {pairedLeftIndex} ({pairedLeftOpt?.option_text})</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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
                  {lastResult.is_correct
                    ? 'Perfeito! Todas as relações conceituais estão corretas!'
                    : 'Atenção aos pares correspondentes:'}
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

        {/* 4. Barra de Ações (Confirmar / Tentar Novamente / Conclusão) */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          {!lastResult && (
            <button
              type="submit"
              disabled={!allPairsMatched || isSubmitting}
              className="btn-tactile-primary w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validando correspondências...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Associações ({matchedPairsCount}/{totalPairsCount})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {lastResult && !lastResult.is_correct && (
            <button
              type="button"
              onClick={() => {
                setMatches({});
                setActiveLeftKey(null);
                onRetry();
              }}
              className="btn-tactile-secondary w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Recomeçar Pares (Sem penalidade)</span>
            </button>
          )}

          {lastResult && lastResult.is_correct && (
            <button
              type="button"
              onClick={onNext}
              className="btn-tactile-primary w-full sm:w-auto"
            >
              <span>Ver Conclusão da Lição e Recompensas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
