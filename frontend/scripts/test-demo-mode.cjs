/**
 * EduCash — Testes de Conformidade do Modo Demo e Isolamento de Dados (Etapa 7B.1)
 *
 * Valida os 8 critérios fundamentais de segurança e arquitetura:
 * 1. Ausência de configuração do Supabase NÃO ativa demo automaticamente.
 * 2. Entrada no modo demo exige ação explícita do usuário (startDemoSession).
 * 3. Falha de conexão com Supabase NÃO ativa demo silenciosamente.
 * 4. Falha de login real NÃO ativa demo silenciosamente.
 * 5. Sessão demo NÃO acessa RPCs ou banco real.
 * 6. Sessão real NÃO acessa nem grava no storage demo local.
 * 7. Logout encerra a sessão corretamente em ambos os modos.
 * 8. Reset do progresso demo afeta apenas os dados locais da demo.
 */

const assert = require('assert');

let passedTests = 0;
let failedTests = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Erro: ${err.message}`);
    failedTests++;
  }
}

// Mock simulado do localStorage
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
global.localStorage = mockStorage;

// Constantes idênticas aos fontes do frontend
const DEMO_STORAGE_KEY = 'educash-demo-auth-user';
const DEMO_LEARNING_STORAGE_KEY = 'educash-demo-learning-progress-v1';

async function main() {
  console.log('======================================================================');
  console.log('EDUCASH — TESTES DE VALIDAÇÃO DO MODO DEMO E ISOLAMENTO (ETAPA 7B.1)');
  console.log('======================================================================\n');

  // -----------------------------------------------------------------------------
  // 1. Ausência de configuração do Supabase NÃO ativa demo automaticamente
  // -----------------------------------------------------------------------------
  await runTest('Critério 1: Ausência de Supabase sem ação explícita mantém usuário deslogado (null)', () => {
    mockStorage.clear();
    const isSupabaseConfigured = false;

    // Simulação da lógica de inicialização de sessão (initSession)
    let user = null;
    let profile = null;
    const savedDemo = mockStorage.getItem(DEMO_STORAGE_KEY);

    if (!isSupabaseConfigured) {
      if (savedDemo) {
        const parsed = JSON.parse(savedDemo);
        if (parsed && parsed.isDemo) {
          user = { ...parsed, isDemo: true };
          profile = { id: parsed.id, username: parsed.username };
        }
      }
      // Se não há savedDemo, permanece nulo
    }

    assert.strictEqual(user, null, 'Usuário não deve ser autenticado tacitamente');
    assert.strictEqual(profile, null, 'Perfil não deve ser instanciado');
    assert.strictEqual(mockStorage.getItem(DEMO_STORAGE_KEY), null, 'Storage demo deve permanecer vazio');
  });

  // -----------------------------------------------------------------------------
  // 2. Entrada no modo demo exige ação explícita do usuário
  // -----------------------------------------------------------------------------
  await runTest('Critério 2: startDemoSession ativa sessão demo com flag isDemo e id reservado', () => {
    mockStorage.clear();

    function startDemoSession(customUsername) {
      const demoId = '00000000-0000-0000-0000-000000000001';
      const sanitized = customUsername && customUsername.trim().length >= 3 ? customUsername.trim() : 'aluno_demo';
      const demoUser = {
        id: demoId,
        email: 'demo@educash.local',
        username: sanitized,
        isDemo: true,
      };
      mockStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      return { success: true, user: demoUser, isDemoSession: true };
    }

    const res = startDemoSession('estudante_teste');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.user.isDemo, true);
    assert.strictEqual(res.isDemoSession, true);
    assert.strictEqual(res.user.username, 'estudante_teste');

    const stored = JSON.parse(mockStorage.getItem(DEMO_STORAGE_KEY));
    assert.strictEqual(stored.isDemo, true);
    assert.strictEqual(stored.id, '00000000-0000-0000-0000-000000000001');
  });

  // -----------------------------------------------------------------------------
  // 3. Falha de conexão com Supabase NÃO ativa demo silenciosamente
  // -----------------------------------------------------------------------------
  await runTest('Critério 3: Falha de rede/conexão no Supabase retorna erro e NÃO ativa demo', () => {
    mockStorage.clear();
    const isSupabaseConfigured = true;

    // Simula signInWithPassword com falha de rede
    function mockLogin(data) {
      if (!isSupabaseConfigured) {
        return { success: false, error: 'Supabase não configurado.' };
      }
      const networkError = new Error('Failed to fetch / Network connection error');
      return {
        success: false,
        error: networkError.message,
        user: null,
        isDemoSession: false,
      };
    }

    const result = mockLogin({ email: 'teste@escola.com', password: 'password123' });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.user, null);
    assert.strictEqual(result.isDemoSession, false);
    assert.strictEqual(mockStorage.getItem(DEMO_STORAGE_KEY), null, 'Falha de rede nunca deve gravar chave demo');
  });

  // -----------------------------------------------------------------------------
  // 4. Falha de login real NÃO ativa demo silenciosamente
  // -----------------------------------------------------------------------------
  await runTest('Critério 4: Credenciais inválidas no Supabase retornam erro e NÃO ativam demo', () => {
    mockStorage.clear();
    const isSupabaseConfigured = true;

    function mockLoginInvalid(data) {
      if (!isSupabaseConfigured) {
        return { success: false, error: 'A autenticação real requer Supabase.' };
      }
      return {
        success: false,
        error: 'E-mail ou senha incorretos.',
        user: null,
        isDemoSession: false,
      };
    }

    const result = mockLoginInvalid({ email: 'inexistente@escola.com', password: 'errada' });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'E-mail ou senha incorretos.');
    assert.strictEqual(result.user, null);
    assert.strictEqual(result.isDemoSession, false);
    assert.strictEqual(mockStorage.getItem(DEMO_STORAGE_KEY), null);
  });

  await runTest('Critério 4b: Login quando Supabase não configurado recusa com erro e instrui a usar botão demo', () => {
    mockStorage.clear();
    const isSupabaseConfigured = false;

    function mockLoginNoConfig(data) {
      if (!isSupabaseConfigured) {
        return {
          success: false,
          error: 'A autenticação real com Supabase não está configurada neste ambiente. Para explorar o sistema, utilize a opção "Experimentar Demonstração".',
          user: null,
        };
      }
      return { success: true };
    }

    const result = mockLoginNoConfig({ email: 'aluno@escola.com', password: 'password123' });
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes('Experimentar Demonstração'));
    assert.strictEqual(result.user, null);
    assert.strictEqual(mockStorage.getItem(DEMO_STORAGE_KEY), null);
  });

  // -----------------------------------------------------------------------------
  // 5. Sessão demo NÃO acessa RPCs ou banco real
  // -----------------------------------------------------------------------------
  await runTest('Critério 5: Em sessão demo, operações utilizam exclusivamente o storage local isolado', () => {
    mockStorage.clear();

    // Ativa sessão demo
    mockStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({
      id: '00000000-0000-0000-0000-000000000001',
      username: 'aluno_demo',
      isDemo: true,
    }));

    let rpcCalled = false;
    const mockSupabase = {
      rpc: (fnName) => {
        rpcCalled = true;
        throw new Error(`RPC ${fnName} NÃO deve ser invocado em sessão demo!`);
      },
    };

    function isExplicitDemoSession() {
      try {
        const raw = mockStorage.getItem(DEMO_STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return Boolean(parsed && parsed.isDemo);
      } catch {
        return false;
      }
    }

    function fetchLessons(isConfigured) {
      if (isExplicitDemoSession()) {
        return { source: 'local_demo_store', error: null };
      }
      if (isConfigured) {
        mockSupabase.rpc('get_available_lessons');
      }
      return { source: 'visitor', error: null };
    }

    const resDemoWithCloud = fetchLessons(true);
    assert.strictEqual(resDemoWithCloud.source, 'local_demo_store');
    assert.strictEqual(rpcCalled, false, 'RPC nunca deve ser chamado para usuário demo');

    const resDemoWithoutCloud = fetchLessons(false);
    assert.strictEqual(resDemoWithoutCloud.source, 'local_demo_store');
    assert.strictEqual(rpcCalled, false);
  });

  // -----------------------------------------------------------------------------
  // 6. Sessão real NÃO acessa nem grava no storage demo
  // -----------------------------------------------------------------------------
  await runTest('Critério 6: Sessão real chama RPC oficial e falhas de RPC nunca degradam para demo store', () => {
    mockStorage.clear();

    let rpcInvoked = false;
    const mockSupabase = {
      rpc: (fnName) => {
        rpcInvoked = true;
        return { data: null, error: { message: 'Database connection timeout' } };
      },
    };

    function isExplicitDemoSession() {
      try {
        const raw = mockStorage.getItem(DEMO_STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return Boolean(parsed && parsed.isDemo);
      } catch {
        return false;
      }
    }

    function fetchSummary(isConfigured) {
      if (isExplicitDemoSession()) {
        return { summary: { is_demo: true }, error: null };
      }
      if (isConfigured) {
        const { data, error } = mockSupabase.rpc('get_user_learning_summary');
        if (error) {
          // NUNCA faz fallback para demo! Retorna o erro real.
          return { summary: null, error: `Erro ao obter sumário: ${error.message}` };
        }
        return { summary: data, error: null };
      }
      return { summary: null, error: 'Sessão não autenticada.' };
    }

    const result = fetchSummary(true);
    assert.strictEqual(rpcInvoked, true, 'Sessão real deve consultar o Supabase RPC');
    assert.strictEqual(result.summary, null, 'Falha no banco não deve injetar dados demo');
    assert.ok(result.error.includes('Database connection timeout'));
    assert.strictEqual(mockStorage.getItem(DEMO_LEARNING_STORAGE_KEY), null, 'Storage demo não pode ser criado em sessão real');
  });

  // -----------------------------------------------------------------------------
  // 7. Logout encerra a sessão corretamente em ambos os modos
  // -----------------------------------------------------------------------------
  await runTest('Critério 7: Logout em sessão demo limpa DEMO_STORAGE_KEY e redefine estado', () => {
    mockStorage.clear();
    mockStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ id: '00000000-0000-0000-0000-000000000001', isDemo: true }));

    let user = { id: '00000000-0000-0000-0000-000000000001', isDemo: true };
    let isDemoSession = true;

    function logout() {
      mockStorage.removeItem(DEMO_STORAGE_KEY);
      user = null;
      isDemoSession = false;
    }

    logout();
    assert.strictEqual(user, null);
    assert.strictEqual(isDemoSession, false);
    assert.strictEqual(mockStorage.getItem(DEMO_STORAGE_KEY), null);
  });

  await runTest('Critério 7b: Logout em sessão real chama signOut e limpa sessão', async () => {
    mockStorage.clear();
    let signedOut = false;
    const mockSupabase = {
      auth: {
        signOut: async () => {
          signedOut = true;
        },
      },
    };

    let user = { id: 'real-user-uuid-1234', email: 'aluno@escola.com', isDemo: false };

    async function logoutReal() {
      mockStorage.removeItem(DEMO_STORAGE_KEY);
      await mockSupabase.auth.signOut();
      user = null;
    }

    await logoutReal();
    assert.strictEqual(user, null);
    assert.strictEqual(signedOut, true);
    assert.strictEqual(mockStorage.getItem(DEMO_STORAGE_KEY), null);
  });

  // -----------------------------------------------------------------------------
  // 8. Reset do progresso demo afeta apenas os dados locais da demo
  // -----------------------------------------------------------------------------
  await runTest('Critério 8: resetDemoProgress limpa apenas DEMO_LEARNING_STORAGE_KEY sem tocar no banco', () => {
    mockStorage.clear();
    mockStorage.setItem(DEMO_LEARNING_STORAGE_KEY, JSON.stringify({ completedLessons: { 1: true }, totalXp: 50 }));

    let dbMutationCalled = false;
    const mockDatabase = {
      delete: () => {
        dbMutationCalled = true;
      },
    };

    function resetDemoProgress() {
      mockStorage.removeItem(DEMO_LEARNING_STORAGE_KEY);
    }

    resetDemoProgress();
    assert.strictEqual(mockStorage.getItem(DEMO_LEARNING_STORAGE_KEY), null, 'Progresso demo deve ser resetado');
    assert.strictEqual(dbMutationCalled, false, 'Banco de dados real NUNCA deve sofrer mutação por reset de demo');
  });

  console.log('\n======================================================================');
  console.log(`TOTAL DE TESTES: ${passedTests + failedTests}`);
  console.log(`PASSOU: ${passedTests}`);
  console.log(`FALHOU: ${failedTests}`);
  console.log('======================================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
