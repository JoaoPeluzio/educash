/**
 * EduCash — Serviço de Aprendizagem, Lições e Gamificação (MVP 1)
 *
 * Integra com as funções de banco de dados do Supabase (Fase 2):
 * - `get_available_lessons`
 * - `get_user_learning_summary`
 * - `submit_activity_answer`
 *
 * Inclui motor de demonstração local transparente quando o Supabase Cloud
 * não está conectado, garantindo que o PoC acadêmico funcione perfeitamente
 * sem comprometer a arquitetura oficial.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import {
  LessonSummaryItem,
  LessonDetail,
  LearningSummary,
  ActivitySubmissionResult,
  LevelInfo,
  UserAchievementItem,
} from '../types/learning';
import {
  INITIAL_LESSONS_CATALOG,
  LESSON_DETAILS_MAP,
  DEMO_ANSWER_KEYS,
  APPROVED_LEVELS,
  APPROVED_ACHIEVEMENTS,
} from './learningContent';

export const DEMO_LEARNING_STORAGE_KEY = 'educash-demo-learning-progress-v1';

export function isExplicitDemoSession(): boolean {
  try {
    const raw = localStorage.getItem('educash-demo-auth-user');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.isDemo);
  } catch {
    return false;
  }
}

export interface DemoProgressStore {
  completedActivities: Record<string, boolean>; // activityId -> true
  activityAttempts: Record<string, number>; // activityId -> attempts count
  completedLessons: Record<string, boolean>; // lessonId -> true
  earnedXpTransactions: Record<string, number>; // txKey -> xp
  earnedCoinsTransactions: Record<string, number>; // txKey -> coins
  unlockedAchievements: Record<string, string>; // achievementId -> unlockedAt
}

export function getDemoStore(): DemoProgressStore {
  try {
    const raw = localStorage.getItem(DEMO_LEARNING_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback se corrompido
  }
  return {
    completedActivities: {},
    activityAttempts: {},
    completedLessons: {},
    earnedXpTransactions: {},
    earnedCoinsTransactions: {},
    unlockedAchievements: {},
  };
}

export function saveDemoStore(store: DemoProgressStore): void {
  try {
    localStorage.setItem(DEMO_LEARNING_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignora falha de storage
  }
}

/**
 * Função auxiliar que avalia o desbloqueio sequencial no modo demonstração:
 * - A Lição de posição 1 está sempre desbloqueada.
 * - A Lição de posição N (N > 1) requer que a lição imediatamente anterior (N - 1)
 *   esteja registrada como concluída no store da demo.
 */
export function isLessonUnlockedInDemo(position: number, store: DemoProgressStore): boolean {
  if (position <= 1) return true;
  const prevLessonCatalog = INITIAL_LESSONS_CATALOG.find((l) => l.position === position - 1);
  if (!prevLessonCatalog) return true;
  return Boolean(store.completedLessons[prevLessonCatalog.lesson_id]);
}

/**
 * Retorna as lições da trilha e seus status de desbloqueio
 */
export async function fetchAvailableLessons(): Promise<{
  lessons: LessonSummaryItem[];
  error: string | null;
}> {
  // Se for sessão demo explícita, lê do motor demo local e NUNCA chama Supabase
  if (isExplicitDemoSession()) {
    const store = getDemoStore();
    const lessons: LessonSummaryItem[] = INITIAL_LESSONS_CATALOG.map((item) => {
      const isCompleted = Boolean(store.completedLessons[item.lesson_id]);
      const isUnlocked = isLessonUnlockedInDemo(item.position, store);

      const detail = LESSON_DETAILS_MAP[item.lesson_id];
      const completedCount = detail
        ? detail.activities.filter((a) => store.completedActivities[a.id]).length
        : 0;

      return {
        ...item,
        is_unlocked: isUnlocked,
        is_completed: isCompleted,
        completed_activities_count: completedCount,
      };
    });

    return { lessons, error: null };
  }

  // Se o Supabase estiver configurado e NÃO for demo, utiliza RPC oficial
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('get_available_lessons');
      if (error) {
        return { lessons: [], error: `Erro ao buscar lições: ${error.message}` };
      }
      return { lessons: data as LessonSummaryItem[], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na comunicação com o Supabase.';
      return { lessons: [], error: msg };
    }
  }

  // Visitante sem Supabase e sem sessão demo explícita
  const defaultLessons: LessonSummaryItem[] = INITIAL_LESSONS_CATALOG.map((item, index) => ({
    ...item,
    is_unlocked: index === 0,
    is_completed: false,
    completed_activities_count: 0,
  }));

  return { lessons: defaultLessons, error: null };
}

/**
 * Retorna o sumário de gamificação, progresso e nível do aluno
 */
export async function fetchLearningSummary(currentUsername?: string): Promise<{
  summary: LearningSummary | null;
  error: string | null;
}> {
  // Se for sessão demo explícita, gera sumário a partir do demo store local
  if (isExplicitDemoSession()) {
    const store = getDemoStore();
    const totalXp = Object.values(store.earnedXpTransactions).reduce((a, b) => a + b, 0);
    const totalCoins = Object.values(store.earnedCoinsTransactions).reduce((a, b) => a + b, 0);

    let currentLevel: LevelInfo = APPROVED_LEVELS[0];
    for (const lvl of APPROVED_LEVELS) {
      if (totalXp >= lvl.min_xp) {
        currentLevel = lvl;
      }
    }

    const nextLevel =
      APPROVED_LEVELS.find((lvl) => lvl.min_xp > totalXp) || null;

    // Sincroniza conquistas autoritativas do MVP se os critérios forem atendidos
    const completedActivitiesCount = Object.keys(store.completedActivities).length;
    const completedLessonsCount = Object.keys(store.completedLessons).length;

    let achievementsUpdated = false;
    // 1. primeiros_passos: primeira atividade correta
    if (completedActivitiesCount >= 1 && !store.unlockedAchievements['primeiros_passos']) {
      store.unlockedAchievements['primeiros_passos'] = new Date().toISOString();
      achievementsUpdated = true;
    }
    // 2. aprendiz_dedicado: primeira lição concluída
    if (completedLessonsCount >= 1 && !store.unlockedAchievements['aprendiz_dedicado']) {
      store.unlockedAchievements['aprendiz_dedicado'] = new Date().toISOString();
      achievementsUpdated = true;
    }
    // 3. conhecimento_em_evolucao: três lições concluídas
    if (completedLessonsCount >= 3 && !store.unlockedAchievements['conhecimento_em_evolucao']) {
      store.unlockedAchievements['conhecimento_em_evolucao'] = new Date().toISOString();
      achievementsUpdated = true;
    }
    // 4. guardiao_das_economias: 50 moedas acumuladas
    if (totalCoins >= 50 && !store.unlockedAchievements['guardiao_das_economias']) {
      store.unlockedAchievements['guardiao_das_economias'] = new Date().toISOString();
      achievementsUpdated = true;
    }
    // 5. jornada_completa: todas as 5 lições concluídas
    if (completedLessonsCount >= 5 && !store.unlockedAchievements['jornada_completa']) {
      store.unlockedAchievements['jornada_completa'] = new Date().toISOString();
      achievementsUpdated = true;
    }

    if (achievementsUpdated) {
      saveDemoStore(store);
    }

    const unlockedAchievements: UserAchievementItem[] = Object.keys(
      store.unlockedAchievements
    )
      .filter((id) => APPROVED_ACHIEVEMENTS[id])
      .map((id) => ({
        ...APPROVED_ACHIEVEMENTS[id],
        unlocked_at: store.unlockedAchievements[id],
      }));

    return {
      summary: {
        user_id: '00000000-0000-0000-0000-000000000001',
        username: currentUsername || 'aluno_demo',
        total_xp: totalXp,
        total_coins: totalCoins,
        current_level: currentLevel,
        next_level: nextLevel,
        completed_activities_count: completedActivitiesCount,
        completed_lessons_count: completedLessonsCount,
        achievements_count: unlockedAchievements.length,
        unlocked_achievements: unlockedAchievements,
        is_demo_preview: true,
      },
      error: null,
    };
  }

  // Se o Supabase estiver configurado e NÃO for demo, chama RPC oficial
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('get_user_learning_summary');
      if (error) {
        return { summary: null, error: `Erro ao obter sumário: ${error.message}` };
      }
      const raw = data as any;
      return {
        summary: {
          user_id: raw.user_id,
          username: raw.username || currentUsername || 'Aluno',
          total_xp: raw.total_xp || 0,
          total_coins: raw.total_coins || 0,
          current_level: raw.current_level || { level: 1, name: 'Iniciante', min_xp: 0 },
          next_level: raw.next_level || null,
          completed_activities_count: raw.completed_activities_count || 0,
          completed_lessons_count: raw.completed_lessons_count || 0,
          achievements_count: raw.achievements_count || 0,
          unlocked_achievements: raw.unlocked_achievements || [],
          is_demo_preview: false,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na comunicação com o Supabase.';
      return { summary: null, error: msg };
    }
  }

  return { summary: null, error: 'Sessão não autenticada.' };
}

/**
 * Obtém os detalhes completos de uma lição (textos e atividades, sem gabaritos)
 */
export async function fetchLessonDetails(lessonId: string): Promise<{
  lesson: LessonDetail | null;
  error: string | null;
}> {
  // Se for sessão demo explícita, lê do motor demo local com verificação de desbloqueio sequencial
  if (isExplicitDemoSession()) {
    const target = LESSON_DETAILS_MAP[lessonId];
    if (!target) {
      return { lesson: null, error: 'Lição não encontrada no catálogo.' };
    }

    const store = getDemoStore();
    const isUnlocked = isLessonUnlockedInDemo(target.position, store);

    if (!isUnlocked) {
      return {
        lesson: null,
        error: 'Esta lição está bloqueada. Conclua as lições anteriores para desbloqueá-la.',
      };
    }

    const activities = target.activities.map((act) => ({
      ...act,
      is_completed: Boolean(store.completedActivities[act.id]),
    }));

    return {
      lesson: {
        ...target,
        is_unlocked: true,
        is_completed: Boolean(store.completedLessons[target.id]),
        activities,
      },
      error: null,
    };
  }

  // Se o Supabase estiver configurado e NÃO for demo, busca do banco
  if (isSupabaseConfigured) {
    try {
      // 1. Busca lição
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('id, learning_path_id, title, description, introduction, practical_example, conclusion, position, is_active')
        .eq('id', lessonId)
        .eq('is_active', true)
        .single();

      if (lessonError || !lessonData) {
        return { lesson: null, error: `Lição não encontrada: ${lessonError?.message}` };
      }

      // 2. Busca atividades ativas da lição (NUNCA busca activity_answer_keys!)
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('id, lesson_id, title, description, activity_type, position, is_active')
        .eq('lesson_id', lessonId)
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (activitiesError) {
        return { lesson: null, error: `Erro ao buscar atividades: ${activitiesError.message}` };
      }

      // 3. Busca opções das atividades
      const activityIds = (activitiesData || []).map((a) => a.id);
      let optionsMap: Record<string, any[]> = {};
      if (activityIds.length > 0) {
        const { data: optionsData } = await supabase
          .from('activity_options')
          .select('id, activity_id, option_key, option_text, side, position')
          .in('activity_id', activityIds)
          .order('position', { ascending: true });

        (optionsData || []).forEach((opt) => {
          if (!optionsMap[opt.activity_id]) optionsMap[opt.activity_id] = [];
          optionsMap[opt.activity_id].push(opt);
        });
      }

      // 4. Busca progresso do usuário para marcar atividades já concluídas
      const { data: progressData } = await supabase
        .from('user_activity_progress')
        .select('activity_id')
        .in('activity_id', activityIds);

      const completedMap = new Set((progressData || []).map((p) => p.activity_id));

      const activities = (activitiesData || []).map((act) => ({
        ...act,
        options: optionsMap[act.id] || [],
        is_completed: completedMap.has(act.id),
      })) as any[];

      return {
        lesson: {
          ...lessonData,
          is_unlocked: true,
          is_completed: false,
          activities,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao buscar lição.';
      return { lesson: null, error: msg };
    }
  }

  // Visitante sem autenticação e sem sessão demo explícita
  const target = LESSON_DETAILS_MAP[lessonId];
  if (!target) {
    return { lesson: null, error: 'Lição não encontrada no catálogo.' };
  }

  if (target.position === 1) {
    const activities = target.activities.map((act) => ({
      ...act,
      is_completed: false,
    }));

    return {
      lesson: {
        ...target,
        is_unlocked: true,
        is_completed: false,
        activities,
      },
      error: null,
    };
  }

  return {
    lesson: null,
    error: 'Esta lição está bloqueada. Conclua as lições anteriores para desbloqueá-la.',
  };
}

/**
 * Submete a resposta de uma atividade para validação e recompensas
 */
export async function submitActivityAnswer(
  activityId: string,
  submittedAnswer: unknown
): Promise<{
  result: ActivitySubmissionResult | null;
  error: string | null;
}> {
  // Se for sessão demo explícita, validação espelho das regras oficiais do banco
  if (isExplicitDemoSession()) {
    const store = getDemoStore();
    const answerKey = DEMO_ANSWER_KEYS[activityId];

    if (!answerKey) {
      return { result: null, error: 'Atividade desconhecida no catálogo.' };
    }

    const lessonDetail = LESSON_DETAILS_MAP[answerKey.lessonId];
    if (!lessonDetail) {
      return { result: null, error: 'Lição associada à atividade não foi encontrada.' };
    }

    // Validação estrita de bloqueio sequencial: não permite responder atividades de lições bloqueadas
    const isUnlocked = isLessonUnlockedInDemo(lessonDetail.position, store);
    if (!isUnlocked) {
      return {
        result: null,
        error: 'Acesso negado: a lição atual está bloqueada.',
      };
    }

    let isCorrect = false;
    let feedback = '';

    if (answerKey.activityType === 'multiple_choice') {
      const opt =
        typeof submittedAnswer === 'object' && submittedAnswer !== null
          ? (submittedAnswer as any).selected_option || (submittedAnswer as any).option_key
          : submittedAnswer;

      isCorrect = opt === answerKey.correctAnswer.selected_option;
      feedback = isCorrect ? answerKey.feedbackCorrect : answerKey.feedbackIncorrect;
    } else if (answerKey.activityType === 'true_false') {
      let val: boolean | null = null;
      if (typeof submittedAnswer === 'object' && submittedAnswer !== null) {
        val = (submittedAnswer as any).value;
      } else if (typeof submittedAnswer === 'boolean') {
        val = submittedAnswer;
      } else if (typeof submittedAnswer === 'string') {
        val = submittedAnswer.toLowerCase() === 'true';
      }

      isCorrect = val === answerKey.correctAnswer.value;
      feedback = isCorrect ? answerKey.feedbackCorrect : answerKey.feedbackIncorrect;
    } else if (answerKey.activityType === 'matching') {
      let matches: Record<string, string> = {};
      if (
        typeof submittedAnswer === 'object' &&
        submittedAnswer !== null &&
        'matches' in (submittedAnswer as any)
      ) {
        matches = (submittedAnswer as any).matches;
      } else if (typeof submittedAnswer === 'object' && submittedAnswer !== null) {
        matches = submittedAnswer as Record<string, string>;
      }

      const expected = answerKey.correctAnswer.matches as Record<string, string>;
      const hasAllKeys = Object.keys(expected).every(
        (k) => matches[k] === expected[k]
      );
      const hasSameLength = Object.keys(matches).length === Object.keys(expected).length;

      isCorrect = hasAllKeys && hasSameLength;
      feedback = isCorrect ? answerKey.feedbackCorrect : answerKey.feedbackIncorrect;
    } else {
      return { result: null, error: 'Tipo de atividade desconhecido.' };
    }

    // Incrementa contagem de tentativas (auditado)
    store.activityAttempts[activityId] = (store.activityAttempts[activityId] || 0) + 1;

    let xpEarned = 0;
    let coinsEarned = 0;
    let lessonCompleted = false;
    let lessonBonusXp = 0;
    let lessonBonusCoins = 0;
    const newAchievements: string[] = [];

    if (isCorrect) {
      const isFirstCorrect = !store.completedActivities[activityId];

      if (isFirstCorrect) {
        store.completedActivities[activityId] = true;
        const txKey = `act_${activityId}`;
        store.earnedXpTransactions[txKey] = 10;
        store.earnedCoinsTransactions[txKey] = 5;
        xpEarned = 10;
        coinsEarned = 5;

        // Conquista 1: primeiros_passos (primeira atividade correta)
        if (!store.unlockedAchievements['primeiros_passos']) {
          store.unlockedAchievements['primeiros_passos'] = new Date().toISOString();
          newAchievements.push('primeiros_passos');
        }
      }

      // Verifica conclusão da lição associada (todas as atividades da lição concluídas)
      const totalLessonActs = lessonDetail.activities.length;
      const completedLessonActs = lessonDetail.activities.filter(
        (a) => store.completedActivities[a.id]
      ).length;

      if (completedLessonActs >= totalLessonActs && totalLessonActs > 0) {
        const isFirstLessonComplete = !store.completedLessons[lessonDetail.id];
        if (isFirstLessonComplete) {
          store.completedLessons[lessonDetail.id] = true;
          const lessonTxKey = `lesson_${lessonDetail.id}`;
          store.earnedXpTransactions[lessonTxKey] = 20;
          store.earnedCoinsTransactions[lessonTxKey] = 10;
          lessonCompleted = true;
          lessonBonusXp = 20;
          lessonBonusCoins = 10;

          // Avaliação e desbloqueio das 5 conquistas canônicas
          const completedLessonsCount = Object.keys(store.completedLessons).length;
          const totalCoins = Object.values(store.earnedCoinsTransactions).reduce(
            (a, b) => a + b,
            0
          );

          // Conquista 2: aprendiz_dedicado (primeira lição concluída)
          if (completedLessonsCount >= 1 && !store.unlockedAchievements['aprendiz_dedicado']) {
            store.unlockedAchievements['aprendiz_dedicado'] = new Date().toISOString();
            newAchievements.push('aprendiz_dedicado');
          }

          // Conquista 3: conhecimento_em_evolucao (três lições concluídas)
          if (
            completedLessonsCount >= 3 &&
            !store.unlockedAchievements['conhecimento_em_evolucao']
          ) {
            store.unlockedAchievements['conhecimento_em_evolucao'] = new Date().toISOString();
            newAchievements.push('conhecimento_em_evolucao');
          }

          // Conquista 4: guardiao_das_economias (50 moedas acumuladas)
          if (totalCoins >= 50 && !store.unlockedAchievements['guardiao_das_economias']) {
            store.unlockedAchievements['guardiao_das_economias'] = new Date().toISOString();
            newAchievements.push('guardiao_das_economias');
          }

          // Conquista 5: jornada_completa (todas as 5 lições concluídas)
          if (completedLessonsCount >= 5 && !store.unlockedAchievements['jornada_completa']) {
            store.unlockedAchievements['jornada_completa'] = new Date().toISOString();
            newAchievements.push('jornada_completa');
          }
        }
      }
    }

    saveDemoStore(store);

    return {
      result: {
        is_correct: isCorrect,
        feedback,
        xp_earned: xpEarned,
        coins_earned: coinsEarned,
        lesson_completed: lessonCompleted,
        lesson_bonus_xp: lessonBonusXp,
        lesson_bonus_coins: lessonBonusCoins,
        unlocked_achievements: newAchievements,
      },
      error: null,
    };
  }

  // Se o Supabase estiver configurado e NÃO for demo, utiliza RPC oficial
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('submit_activity_answer', {
        p_activity_id: activityId,
        p_submitted_answer: submittedAnswer as any,
      });

      if (error) {
        return { result: null, error: `Falha na submissão: ${error.message}` };
      }

      return { result: data as ActivitySubmissionResult, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao submeter resposta.';
      return { result: null, error: msg };
    }
  }

  return {
    result: null,
    error: 'Submissão não permitida fora de uma sessão autenticada ou demonstração ativa.',
  };
}

/**
 * Limpa o progresso de demonstração local para permitir reiniciar apresentações acadêmicas
 */
export function resetDemoProgress(): void {
  try {
    localStorage.removeItem(DEMO_LEARNING_STORAGE_KEY);
  } catch {
    // ignora
  }
}
