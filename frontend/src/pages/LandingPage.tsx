/**
 * EduCash — Landing Page Pública (Estágio 6 / Redesign 7C)
 * Apresentação educacional, trilha de aprendizagem, modalidades e gamificação
 * Inspirado nos princípios visuais e motivacionais do Duolingo e fintechs juvenis
 */

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Puzzle,
  Trophy,
  Clock,
  Target,
  ShieldCheck,
  CheckCircle2,
  ArrowLeftRight,
  Coins,
  Medal,
  Gamepad2,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { INITIAL_LESSONS_CATALOG, APPROVED_LEVELS } from '../services/learningContent';

interface LandingPageProps {
  onNavigateRegister: () => void;
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateRegister,
  onNavigateLogin,
  onNavigateDashboard,
}) => {
  const { user, isConfigured, startDemoSession } = useAuth();

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-12">
      {/* 1. SEÇÃO HERO */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-teal-800 dark:text-teal-200 mb-6 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
          <span>Educação Financeira para Crianças e Jovens (10 a 18 anos)</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.15] mb-6">
          Aprenda a cuidar do seu dinheiro de forma{' '}
          <span className="text-teal-600 dark:text-teal-400">
            prática, divertida e real
          </span>
        </h1>

        {/* Subtítulo Objetivo */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
          O <strong className="font-semibold text-slate-900 dark:text-white">EduCash</strong> transforma conceitos de finanças pessoais em lições interativas, desafios práticos e conquistas gamificadas para ajudar você a alcançar seus objetivos.
        </p>

        {/* Botões de Chamada para Ação (CTAs Táteis) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          {user ? (
            <button
              type="button"
              onClick={onNavigateDashboard}
              className="btn-tactile-primary w-full sm:w-auto px-8 py-3.5 text-base"
            >
              <span>Acessar Trilha de Lições</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : isConfigured ? (
            <>
              <button
                type="button"
                onClick={onNavigateRegister}
                className="btn-tactile-primary w-full sm:w-auto px-8 py-3.5 text-base"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Começar Jornada Gratuita</span>
              </button>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="btn-tactile-secondary w-full sm:w-auto px-7 py-3.5 text-base"
              >
                <span>Já tenho conta (Entrar)</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await startDemoSession();
                  if (res.success) onNavigateDashboard();
                }}
                className="btn-tactile-secondary w-full sm:w-auto px-6 py-3.5 text-base text-slate-600 dark:text-slate-300"
                title="Experimente o sistema sem necessidade de cadastro"
              >
                <Gamepad2 className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span>Ver Demonstração</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={async () => {
                  const res = await startDemoSession();
                  if (res.success) onNavigateDashboard();
                }}
                className="btn-tactile-primary w-full sm:w-auto px-8 py-3.5 text-base"
              >
                <Gamepad2 className="w-5 h-5" aria-hidden="true" />
                <span>Experimentar Demonstração Interativa</span>
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supabase não configurado neste ambiente • Demonstração com dados locais isolados
              </p>
            </div>
          )}
        </div>

        {/* Destaques Rápidos em Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-black text-teal-700 dark:text-teal-400">5</div>
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lições Essenciais</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Da origem do dinheiro ao orçamento pessoal.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">3</div>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Puzzle className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tipos de Desafios</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Múltipla escolha, V/F e associação de pares.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-black text-amber-500 dark:text-amber-400">XP & Moedas</div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Coins className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Gamificação Real</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Conquiste níveis, insígnias e EduCoins.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Educacional</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Ambiente seguro, gratuito e sem riscos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA A APRENDIZAGEM */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
            Metodologia EduCash
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Como os estudantes aprendem na prática
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
            Combinamos leitura acessível, estudos de caso com situações reais e atividades interativas com correção instantânea.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Conteúdo Direto */}
          <div className="flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-teal-300 dark:hover:border-teal-700/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Conceitos e Exemplos Reais
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
              Textos pedagógicos objetivos e histórias cotidianas (como a gestão da mesada e escolhas de consumo) para conectar a teoria à realidade dos jovens.
            </p>
          </div>

          {/* Card 2: Desafios Interativos */}
          <div className="flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4">
              <Puzzle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Três Modalidades de Atividades
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
              Fixação através de testes de múltipla escolha com cenários reais, checagem rápida de verdadeiro ou falso e associação dinâmica de pares conceituais.
            </p>
          </div>

          {/* Card 3: Feedback e Recompensa */}
          <div className="flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-amber-300 dark:hover:border-amber-700/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Evolução Gamificada
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
              Cada resposta correta oferece feedback explicativo imediato, premia com pontos de experiência (XP) e moedas virtuais (EduCoins) para subir de nível.
            </p>
          </div>
        </div>
      </section>

      {/* 3. VISÃO GERAL DA TRILHA DE APRENDIZAGEM */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
            Currículo Pedagógico
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            As 5 Lições da Trilha do EduCash
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
            Uma progressão pensada para acompanhar o estudante do conhecimento básico sobre o dinheiro até a elaboração do seu primeiro orçamento.
          </p>
        </div>

        <div className="space-y-4">
          {INITIAL_LESSONS_CATALOG.map((lesson) => (
            <div
              key={lesson.lesson_id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-teal-300 dark:hover:border-teal-700/80 transition-colors gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 font-extrabold text-base flex items-center justify-center">
                  0{lesson.position}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lesson.title}
                    </h3>
                    {lesson.position === 1 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Disponível Inicialmente
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    {lesson.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>5 a 10 min</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-bold">
                  <Target className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>3 Desafios</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MODALIDADES DE ATIVIDADES EM DETALHE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Exercícios pensados para o público jovem
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
              Nada de decorar fórmulas chatas. O EduCash desafia o aluno através de três formatos dinâmicos:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Modalidade 1
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  Múltipla Escolha
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Decisões cotidianas com alternativas comentadas para entender as consequências das escolhas financeiras.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Feedback didático explicando o porquê de cada resposta.</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Modalidade 2
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  Verdadeiro ou Falso
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Desmistificação de crenças populares sobre economia, dívidas, consumo e prioridades financeiras.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Resolução ágil e confirmação de aprendizado em tempo real.</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Modalidade 3
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  Associação de Pares
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Conexão entre conceitos essenciais (reserva, juros, poupança, despesa) e seus significados práticos.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <Puzzle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Interface interativa com destaque visual e pareamento dinâmico.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GAMIFICAÇÃO & NÍVEIS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
            Recompensas Pedagógicas
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Evolua e suba de nível a cada conquista
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
            O aprendizado se torna recompensador conforme você acumula XP e EduCoins nas lições.
          </p>
        </div>

        {/* Níveis de Maestria */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {APPROVED_LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-extrabold text-sm mx-auto flex items-center justify-center mb-2">
                {lvl.level}
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{lvl.name}</div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {lvl.min_xp} XP mín.
              </div>
            </div>
          ))}
        </div>

        {/* Benefícios da Gamificação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-teal-950 dark:text-teal-100 text-base">EduCoins Virtuais</h3>
              <p className="text-xs sm:text-sm text-teal-900/80 dark:text-teal-300/80 mt-1 leading-relaxed">
                Cada atividade acertada e lição concluída recompensa seu cofre virtual de moedas educacionais, demonstrando seu progresso palpável.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Medal className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-950 dark:text-indigo-100 text-base">Insígnias de Conquista</h3>
              <p className="text-xs sm:text-sm text-indigo-900/80 dark:text-indigo-300/80 mt-1 leading-relaxed">
                Desbloqueie conquistas oficiais como <em>Primeiros passos</em>, <em>Aprendiz dedicado</em> e <em>Jornada completa</em> ao avançar na trilha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CHAMADA FINAL (CTA) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center border border-slate-800 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
            Comece a cuidar do seu futuro financeiro hoje!
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Cadastre-se gratuitamente em menos de 1 minuto, acesse a Lição 1 e dê seus primeiros passos rumo à autonomia e consciência financeira.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {user ? (
              <button
                type="button"
                onClick={onNavigateDashboard}
                className="btn-tactile-primary w-full sm:w-auto px-8 py-3.5 text-base"
              >
                <span>Ir para Meu Painel de Aluno</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : isConfigured ? (
              <>
                <button
                  type="button"
                  onClick={onNavigateRegister}
                  className="btn-tactile-primary w-full sm:w-auto px-8 py-3.5 text-base"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Criar Conta de Aluno Grátis</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="btn-tactile-secondary w-full sm:w-auto px-8 py-3.5 text-base"
                >
                  <span>Já tenho cadastro (Entrar)</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  const res = await startDemoSession();
                  if (res.success) onNavigateDashboard();
                }}
                className="btn-tactile-primary w-full sm:w-auto px-8 py-3.5 text-base"
              >
                <Gamepad2 className="w-5 h-5" aria-hidden="true" />
                <span>Experimentar Demonstração Interativa</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 7. NOTA DE ESCOPO PEDAGÓGICO (Sem duplicar rodapé estrutural do AppShell) */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 max-w-2xl mx-auto px-4 leading-relaxed">
        Plataforma educacional para estudo de finanças pessoais por crianças e adolescentes (10 a 18 anos) • Sem transações financeiras reais.
      </div>
    </div>
  );
};
