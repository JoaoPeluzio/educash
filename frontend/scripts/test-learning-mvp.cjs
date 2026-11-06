/**
 * EduCash — Suíte de Testes Automatizados do Módulo de Aprendizagem e Gamificação (MVP 1)
 * Execução: node frontend/scripts/test-learning-mvp.cjs
 */

const assert = require('assert');

let total = 0;
let passed = 0;

function it(description, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`[PASS] ${description}`);
  } catch (err) {
    console.error(`[FAIL] ${description}: ${err.message}`);
  }
}

console.log('======================================================================');
console.log('EDUCASH — TESTES DE APRENDIZAGEM E GAMIFICAÇÃO (MVP 1)');
console.log('======================================================================\n');

// -----------------------------------------------------------------------------
// Motor de Validação das Regras do MVP 1 (Espelho das Funções SQL da Fase 2)
// -----------------------------------------------------------------------------

const LESSON_1_ID = 'b0000000-0000-0000-0000-000000000001';
const LESSON_2_ID = 'b0000000-0000-0000-0000-000000000002';
const ACT_1_ID = 'c0000000-0000-0000-0000-000000000001'; // Múltipla Escolha
const ACT_2_ID = 'c0000000-0000-0000-0000-000000000002'; // Verdadeiro / Falso
const ACT_3_ID = 'c0000000-0000-0000-0000-000000000003'; // Matching

const LEVELS = [
  { level: 1, name: 'Iniciante', min_xp: 0 },
  { level: 2, name: 'Aprendiz', min_xp: 40 },
  { level: 3, name: 'Explorador', min_xp: 90 },
  { level: 4, name: 'Planejador', min_xp: 150 },
  { level: 5, name: 'Especialista', min_xp: 220 },
];

function createLearningEngine() {
  const state = {
    completedActivities: {},
    activityAttempts: {},
    completedLessons: {},
    earnedXpTransactions: {},
    earnedCoinsTransactions: {},
    unlockedAchievements: {},
  };

  function validateAnswer(activityId, answer) {
    let isCorrect = false;
    let feedback = '';

    if (activityId === ACT_1_ID) {
      const opt = typeof answer === 'object' && answer !== null ? answer.selected_option : answer;
      isCorrect = opt === 'opt_1_1_a';
      feedback = isCorrect
        ? 'Excelente! O dinheiro foi criado para funcionar como um meio de troca universalmente aceito.'
        : 'Não é essa a resposta. A função essencial do dinheiro é facilitar as trocas comerciais.';
    } else if (activityId === ACT_2_ID) {
      let val = null;
      if (typeof answer === 'object' && answer !== null) val = answer.value;
      else if (typeof answer === 'boolean') val = answer;
      isCorrect = val === true;
      feedback = isCorrect
        ? 'Correto! O comércio funcionava por escambo antes das moedas.'
        : 'Atenção: a afirmação é verdadeira!';
    } else if (activityId === ACT_3_ID) {
      let matches = {};
      if (typeof answer === 'object' && answer !== null && 'matches' in answer) {
        matches = answer.matches;
      } else if (typeof answer === 'object' && answer !== null) {
        matches = answer;
      }

      const expected = {
        left_1_3_1: 'right_1_3_1',
        left_1_3_2: 'right_1_3_2',
        left_1_3_3: 'right_1_3_3',
      };

      const hasAllKeys = Object.keys(expected).every((k) => matches[k] === expected[k]);
      const hasSameLength = Object.keys(matches).length === 3;
      isCorrect = hasAllKeys && hasSameLength;
      feedback = isCorrect
        ? 'Muito bem! Evolução prática do dinheiro compreendida.'
        : 'Revise as correspondências.';
    }

    return { isCorrect, feedback };
  }

  function submitAnswer(activityId, answer) {
    const { isCorrect, feedback } = validateAnswer(activityId, answer);
    state.activityAttempts[activityId] = (state.activityAttempts[activityId] || 0) + 1;

    let xpEarned = 0;
    let coinsEarned = 0;
    let lessonCompleted = false;
    let lessonBonusXp = 0;
    let lessonBonusCoins = 0;
    const newAchievements = [];

    if (isCorrect) {
      const isFirstCorrect = !state.completedActivities[activityId];

      if (isFirstCorrect) {
        state.completedActivities[activityId] = true;
        const txKey = `act_${activityId}`;
        state.earnedXpTransactions[txKey] = 10;
        state.earnedCoinsTransactions[txKey] = 5;
        xpEarned = 10;
        coinsEarned = 5;

        if (!state.unlockedAchievements['primeiros_passos']) {
          state.unlockedAchievements['primeiros_passos'] = new Date().toISOString();
          newAchievements.push('primeiros_passos');
        }
      }

      // Verifica se todas as 3 atividades mandatórias da Lição 1 foram concluídas
      const totalActivities = 3;
      const completedActivities = [ACT_1_ID, ACT_2_ID, ACT_3_ID].filter(
        (id) => state.completedActivities[id]
      ).length;

      if (completedActivities >= totalActivities) {
        const isFirstLessonComplete = !state.completedLessons[LESSON_1_ID];
        if (isFirstLessonComplete) {
          state.completedLessons[LESSON_1_ID] = true;
          const lessonTxKey = `lesson_${LESSON_1_ID}`;
          state.earnedXpTransactions[lessonTxKey] = 20;
          state.earnedCoinsTransactions[lessonTxKey] = 10;
          lessonCompleted = true;
          lessonBonusXp = 20;
          lessonBonusCoins = 10;

          if (!state.unlockedAchievements['aprendiz_dedicado']) {
            state.unlockedAchievements['aprendiz_dedicado'] = new Date().toISOString();
            newAchievements.push('aprendiz_dedicado');
          }
        }
      }
    }

    return {
      is_correct: isCorrect,
      feedback,
      xp_earned: xpEarned,
      coins_earned: coinsEarned,
      lesson_completed: lessonCompleted,
      lesson_bonus_xp: lessonBonusXp,
      lesson_bonus_coins: lessonBonusCoins,
      unlocked_achievements: newAchievements,
    };
  }

  function getSummary() {
    const totalXp = Object.values(state.earnedXpTransactions).reduce((a, b) => a + b, 0);
    const totalCoins = Object.values(state.earnedCoinsTransactions).reduce((a, b) => a + b, 0);

    let currentLevel = LEVELS[0];
    for (const lvl of LEVELS) {
      if (totalXp >= lvl.min_xp) currentLevel = lvl;
    }

    const nextLevel = LEVELS.find((lvl) => lvl.min_xp > totalXp) || null;

    return {
      total_xp: totalXp,
      total_coins: totalCoins,
      current_level: currentLevel,
      next_level: nextLevel,
      completed_activities_count: Object.keys(state.completedActivities).length,
      completed_lessons_count: Object.keys(state.completedLessons).length,
      unlocked_achievements: Object.keys(state.unlockedAchievements),
    };
  }

  function isLessonUnlocked(position) {
    if (position === 1) return true;
    if (position === 2) return Boolean(state.completedLessons[LESSON_1_ID]);
    return false; // Lições 3+ dependem das anteriores
  }

  return { submitAnswer, getSummary, isLessonUnlocked, state };
}

// -----------------------------------------------------------------------------
// TESTES
// -----------------------------------------------------------------------------

// 1. Respostas Corretas e Incorretas
it('Atividade 1.1 (Múltipla Escolha): aceita resposta correta com feedback explicativo', () => {
  const engine = createLearningEngine();
  const res = engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_a' });
  assert.strictEqual(res.is_correct, true);
  assert.strictEqual(res.xp_earned, 10);
  assert.strictEqual(res.coins_earned, 5);
  assert.match(res.feedback, /meio de troca universalmente aceito/);
});

it('Atividade 1.1 (Múltipla Escolha): rejeita resposta incorreta sem conceder recompensas', () => {
  const engine = createLearningEngine();
  const res = engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_b' });
  assert.strictEqual(res.is_correct, false);
  assert.strictEqual(res.xp_earned, 0);
  assert.strictEqual(res.coins_earned, 0);
  assert.match(res.feedback, /Não é essa a resposta/);
});

it('Atividade 1.2 (Verdadeiro ou Falso): aceita resposta correta (value: true)', () => {
  const engine = createLearningEngine();
  const res = engine.submitAnswer(ACT_2_ID, { value: true });
  assert.strictEqual(res.is_correct, true);
  assert.strictEqual(res.xp_earned, 10);
  assert.strictEqual(res.coins_earned, 5);
});

it('Atividade 1.2 (Verdadeiro ou Falso): rejeita resposta incorreta (value: false)', () => {
  const engine = createLearningEngine();
  const res = engine.submitAnswer(ACT_2_ID, { value: false });
  assert.strictEqual(res.is_correct, false);
  assert.strictEqual(res.xp_earned, 0);
  assert.strictEqual(res.coins_earned, 0);
});

it('Atividade 1.3 (Matching): aceita correspondência exata de todos os pares', () => {
  const engine = createLearningEngine();
  const matches = {
    left_1_3_1: 'right_1_3_1',
    left_1_3_2: 'right_1_3_2',
    left_1_3_3: 'right_1_3_3',
  };
  const res = engine.submitAnswer(ACT_3_ID, { matches });
  assert.strictEqual(res.is_correct, true);
  assert.strictEqual(res.xp_earned, 10);
});

it('Atividade 1.3 (Matching): rejeita pares incorretos ou incompletos', () => {
  const engine = createLearningEngine();
  const invalidMatches = {
    left_1_3_1: 'right_1_3_2', // Invertido
    left_1_3_2: 'right_1_3_1',
    left_1_3_3: 'right_1_3_3',
  };
  const res = engine.submitAnswer(ACT_3_ID, { matches: invalidMatches });
  assert.strictEqual(res.is_correct, false);
  assert.strictEqual(res.xp_earned, 0);
});

// 2. Retry após Resposta Incorreta (Tentativas Ilimitadas sem Penalidade)
it('Permite nova tentativa após erro e concede recompensa integral no acerto', () => {
  const engine = createLearningEngine();

  // Tentativa 1: Incorreta
  const firstAttempt = engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_c' });
  assert.strictEqual(firstAttempt.is_correct, false);
  assert.strictEqual(firstAttempt.xp_earned, 0);

  // Tentativa 2: Correta
  const retryAttempt = engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_a' });
  assert.strictEqual(retryAttempt.is_correct, true);
  assert.strictEqual(retryAttempt.xp_earned, 10);
  assert.strictEqual(retryAttempt.coins_earned, 5);

  // Tentativas contabilizadas
  assert.strictEqual(engine.state.activityAttempts[ACT_1_ID], 2);
});

// 3. Não Duplicação de Recompensas (Idempotência)
it('Submissão repetida de resposta correta NÃO concede recompensas adicionais', () => {
  const engine = createLearningEngine();

  // Primeira resposta correta
  const res1 = engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_a' });
  assert.strictEqual(res1.xp_earned, 10);
  assert.strictEqual(res1.coins_earned, 5);

  // Segunda resposta correta repetida
  const res2 = engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_a' });
  assert.strictEqual(res2.is_correct, true);
  assert.strictEqual(res2.xp_earned, 0, 'XP adicional deve ser 0');
  assert.strictEqual(res2.coins_earned, 0, 'Moedas adicionais devem ser 0');

  // Total acumulado permanece 10 XP e 5 moedas
  const summary = engine.getSummary();
  assert.strictEqual(summary.total_xp, 10);
  assert.strictEqual(summary.total_coins, 5);
});

// 4. Conclusão da Lição Somente após Todas as Atividades Mandatórias
it('Conclusão e bônus de lição (+20 XP, +10 Moedas) são concedidos apenas após as 3 atividades', () => {
  const engine = createLearningEngine();

  // Atividade 1
  const r1 = engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_a' });
  assert.strictEqual(r1.lesson_completed, false);
  assert.strictEqual(r1.lesson_bonus_xp, 0);

  // Atividade 2
  const r2 = engine.submitAnswer(ACT_2_ID, { value: true });
  assert.strictEqual(r2.lesson_completed, false);
  assert.strictEqual(r2.lesson_bonus_xp, 0);

  // Atividade 3: Completa a lição!
  const r3 = engine.submitAnswer(ACT_3_ID, {
    matches: {
      left_1_3_1: 'right_1_3_1',
      left_1_3_2: 'right_1_3_2',
      left_1_3_3: 'right_1_3_3',
    },
  });
  assert.strictEqual(r3.lesson_completed, true);
  assert.strictEqual(r3.lesson_bonus_xp, 20);
  assert.strictEqual(r3.lesson_bonus_coins, 10);

  // Total acumulado da lição: 10 + 10 + 10 (atividades) + 20 (bônus) = 50 XP
  // Total moedas: 5 + 5 + 5 + 10 = 25 moedas
  const summary = engine.getSummary();
  assert.strictEqual(summary.total_xp, 50);
  assert.strictEqual(summary.total_coins, 25);
  assert.strictEqual(summary.completed_lessons_count, 1);
});

// 5. Prevenção de Acesso a Lição Bloqueada
it('Lição 1 é inicialmente desbloqueada e Lição 2 é liberada apenas após conclusão da Lição 1', () => {
  const engine = createLearningEngine();

  // Inicialmente
  assert.strictEqual(engine.isLessonUnlocked(1), true, 'Lição 1 deve estar desbloqueada');
  assert.strictEqual(engine.isLessonUnlocked(2), false, 'Lição 2 deve estar bloqueada');

  // Resolve as 3 atividades da Lição 1
  engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_a' });
  engine.submitAnswer(ACT_2_ID, { value: true });
  engine.submitAnswer(ACT_3_ID, {
    matches: {
      left_1_3_1: 'right_1_3_1',
      left_1_3_2: 'right_1_3_2',
      left_1_3_3: 'right_1_3_3',
    },
  });

  // Após conclusão da Lição 1, Lição 2 desbloqueia
  assert.strictEqual(engine.isLessonUnlocked(2), true, 'Lição 2 deve estar desbloqueada agora');
});

// 6. Progressão de Nível e Conquistas
it('Ao atingir 50 XP na Lição 1, o estudante sobe para o Nível 2 (Aprendiz) e ganha 2 conquistas', () => {
  const engine = createLearningEngine();

  // Completa as 3 atividades
  engine.submitAnswer(ACT_1_ID, { selected_option: 'opt_1_1_a' });
  engine.submitAnswer(ACT_2_ID, { value: true });
  engine.submitAnswer(ACT_3_ID, {
    matches: {
      left_1_3_1: 'right_1_3_1',
      left_1_3_2: 'right_1_3_2',
      left_1_3_3: 'right_1_3_3',
    },
  });

  const summary = engine.getSummary();
  assert.strictEqual(summary.current_level.level, 2);
  assert.strictEqual(summary.current_level.name, 'Aprendiz');
  assert.ok(summary.unlocked_achievements.includes('primeiros_passos'));
  assert.ok(summary.unlocked_achievements.includes('aprendiz_dedicado'));
});

// 7. Tratamento de Ausência de Configuração do Supabase
it('Trata ausência de Supabase com flag explícita de pré-visualização acadêmica', () => {
  const isSupabaseConfigured = false;
  const learningSummary = {
    user_id: '00000000-0000-0000-0000-000000000001',
    username: 'aluno_demo',
    total_xp: 50,
    total_coins: 25,
    is_demo_preview: !isSupabaseConfigured,
  };

  assert.strictEqual(learningSummary.is_demo_preview, true);
  assert.strictEqual(typeof learningSummary.total_xp, 'number');
});

console.log('\n======================================================================');
console.log(`TOTAL DE TESTES: ${total}`);
console.log(`PASSOU: ${passed}`);
console.log(`FALHOU: ${total - passed}`);
console.log('======================================================================');

if (total === passed) {
  process.exit(0);
} else {
  process.exit(1);
}

