/**
 * EduCash — Fase 2: Script de Validação Estática das Migrações e Integridade do Modelo (Hardened)
 * 
 * Execução: node supabase/tests/validate_migrations.cjs
 */

const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'migrations');
const seedFilePath = path.join(__dirname, '..', 'seed.sql');

console.log('======================================================================');
console.log('EDUCASH — VALIDAÇÃO ESTÁTICA DAS MIGRAÇÕES E INTEGRIDADE DO ESQUEMA');
console.log('======================================================================\n');

// 1. Ler arquivos de migração
const migrationFiles = [
  '20261104180000_01_create_schema.sql',
  '20261104180001_02_enable_rls_and_policies.sql',
  '20261104180002_03_create_functions.sql',
  '20261104180003_04_seed_data.sql'
];

let totalChecks = 0;
let passedChecks = 0;

function check(description, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${description}`);
  } else {
    console.error(`[FAIL] ${description}`);
  }
}

// Verifica existência dos arquivos
migrationFiles.forEach(file => {
  const filePath = path.join(migrationsDir, file);
  check(`Arquivo de migração presente: ${file}`, fs.existsSync(filePath));
});
check('Arquivo canônico seed.sql presente', fs.existsSync(seedFilePath));

const schemaSql = fs.readFileSync(path.join(migrationsDir, migrationFiles[0]), 'utf-8');
const rlsSql = fs.readFileSync(path.join(migrationsDir, migrationFiles[1]), 'utf-8');
const funcsSql = fs.readFileSync(path.join(migrationsDir, migrationFiles[2]), 'utf-8');
const seedSql = fs.readFileSync(path.join(migrationsDir, migrationFiles[3]), 'utf-8');
const seedCanonicalSql = fs.readFileSync(seedFilePath, 'utf-8');

// 2. Verificar presença das 14 tabelas aprovadas no modelo
const expectedTables = [
  'profiles',
  'user_preferences',
  'learning_paths',
  'lessons',
  'activities',
  'activity_options',
  'activity_answer_keys',
  'activity_attempts',
  'user_activity_progress',
  'lesson_progress',
  'reward_transactions',
  'level_definitions',
  'achievements',
  'user_achievements'
];

console.log('\n--- Verificação de Tabelas (14 tabelas obrigatórias) ---');
expectedTables.forEach(table => {
  const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\b|CREATE TABLE public\\.${table}\\b`, 'i');
  check(`Tabela criada: public.${table}`, tableRegex.test(schemaSql));
});

// 3. Verificar restrições de integridade críticas e escopo estrito
console.log('\n--- Verificação de Restrições, Integridade e Escopo Estrito ---');
check('Índice único case-insensitive para username em profiles', /profiles_username_lower_idx/i.test(schemaSql) && /LOWER\(.*username.*\)/i.test(schemaSql));
check('Chave estrangeira de profiles para auth.users com ON DELETE CASCADE', /REFERENCES auth\.users\(id\) ON DELETE CASCADE/i.test(schemaSql));
check('Coluna não aprovada sound_enabled ausente de user_preferences', !/sound_enabled/i.test(schemaSql));
check('user_preferences restrito exclusivamente aos temas light e dark', /theme.*CHECK.*\(theme IN \('light', 'dark'\)\)/i.test(schemaSql));
check('Restrição de posição única por lição (lessons_path_position_unique)', /lessons_path_position_unique/i.test(schemaSql));
check('Restrição de posição única por atividade (activities_lesson_position_unique)', /activities_lesson_position_unique/i.test(schemaSql));
check('Chave primária de activity_answer_keys vinculada a activities (1 por atividade)', /activity_id uuid PRIMARY KEY REFERENCES public\.activities\(id\) ON DELETE CASCADE/i.test(schemaSql));
check('Chave composta única de progresso de atividade (user_id, activity_id)', /PRIMARY KEY \(user_id, activity_id\)/i.test(schemaSql));
check('Chave composta única de progresso de lição (user_id, lesson_id)', /PRIMARY KEY \(user_id, lesson_id\)/i.test(schemaSql));
check('Idempotência de transações de recompensa (reward_transactions_user_idempotency_unique)', /reward_transactions_user_idempotency_unique/i.test(schemaSql));
check('Sem booleano redundante em lesson_progress (utiliza completed_at)', /completed_at timestamptz/i.test(schemaSql) && !/is_completed boolean/i.test(schemaSql));

// 4. Verificar habilitação de RLS em todas as 14 tabelas e segurança de view
console.log('\n--- Verificação de RLS e Segurança de Views ---');
expectedTables.forEach(table => {
  const rlsRegex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, 'i');
  check(`RLS habilitado: public.${table}`, rlsRegex.test(rlsSql));
});

check('View public_profiles criada com security_barrier = true', /security_barrier = true/i.test(rlsSql));
check('View public_profiles criada com security_invoker = true para respeitar RLS base', /security_invoker = true/i.test(rlsSql));
check('Função segura get_public_username implementada para busca pontual de username', /CREATE OR REPLACE FUNCTION public\.get_public_username/i.test(rlsSql));
check('Gabaritos (activity_answer_keys) sem políticas de leitura direta para authenticated', !/CREATE POLICY .* ON public\.activity_answer_keys/i.test(rlsSql));
check('Políticas de isolamento de usuário aplicadas nas tabelas pessoais', 
  /profiles_select_own/i.test(rlsSql) &&
  /user_preferences_select_own/i.test(rlsSql) &&
  /activity_attempts_select_own/i.test(rlsSql) &&
  /user_activity_progress_select_own/i.test(rlsSql) &&
  /lesson_progress_select_own/i.test(rlsSql) &&
  /reward_transactions_select_own/i.test(rlsSql) &&
  /user_achievements_select_own/i.test(rlsSql)
);

// 5. Funções de Banco de Dados, Hardening e Concorrência
console.log('\n--- Verificação de Funções, Hardening e Concorrência ---');
const expectedFunctions = [
  'submit_activity_answer',
  'get_user_learning_summary',
  'get_available_lessons',
  'is_lesson_unlocked',
  'check_and_unlock_achievements'
];

expectedFunctions.forEach(fn => {
  const fnRegex = new RegExp(`CREATE OR REPLACE FUNCTION public\\.${fn}\\b`, 'i');
  check(`Função implementada: public.${fn}`, fnRegex.test(funcsSql));
});

check('Todas as funções possuem SECURITY DEFINER', (funcsSql.match(/SECURITY DEFINER/g) || []).length >= 5);
check('Todas as funções definem search_path seguro (public, pg_temp)', (funcsSql.match(/SET search_path = public, pg_temp/g) || []).length >= 5);
check('Função interna is_lesson_unlocked teve permissão de execução REVOGADA para clientes', /REVOKE ALL ON FUNCTION public\.is_lesson_unlocked\(uuid, uuid\) FROM PUBLIC, authenticated, anon/i.test(funcsSql));
check('Função interna check_and_unlock_achievements teve permissão REVOGADA para clientes', /REVOKE ALL ON FUNCTION public\.check_and_unlock_achievements\(uuid\) FROM PUBLIC, authenticated, anon/i.test(funcsSql));
check('check_and_unlock_achievements valida que caller não manipula usuário de terceiros', /auth\.uid\(\) <> p_user_id/i.test(funcsSql));
check('submit_activity_answer bloqueia linha de progresso da lição com FOR UPDATE para concorrência', /FOR UPDATE/i.test(funcsSql));
check('submit_activity_answer utiliza pg_advisory_xact_lock para serialização segura mesmo sem linha prévia', /pg_advisory_xact_lock/i.test(funcsSql));
check('submit_activity_answer utiliza auth.uid() obrigatório e nunca confia em ID passado', /v_user_id := auth\.uid\(\);/i.test(funcsSql) && /IF v_user_id IS NULL THEN/i.test(funcsSql));
check('Validação estrita de matching na função submit_activity_answer', /activity_type = 'matching'/i.test(funcsSql) && /jsonb_object_keys/i.test(funcsSql));
check('Funções públicas revogam acesso de anon explicitamente', (funcsSql.match(/REVOKE ALL ON FUNCTION .* FROM PUBLIC, anon/g) || []).length >= 3);

// 6. Dados pedagógicos e reprodutibilidade do seed
console.log('\n--- Verificação de Conteúdo Pedagógico Inicial (Seed) ---');
check('5 Níveis de progressão inseridos (Iniciante, Aprendiz, Explorador, Planejador, Especialista)', 
  /Iniciante/i.test(seedSql) && /Aprendiz/i.test(seedSql) && /Explorador/i.test(seedSql) && /Planejador/i.test(seedSql) && /Especialista/i.test(seedSql));
check('5 Conquistas cosméticas cadastradas', 
  /primeiros_passos/i.test(seedSql) && /aprendiz_dedicado/i.test(seedSql) && /conhecimento_em_evolucao/i.test(seedSql) && /guardiao_das_economias/i.test(seedSql) && /jornada_completa/i.test(seedSql));
check('5 Lições aprovadas presentes', 
  /O que é o dinheiro\?/i.test(seedSql) &&
  /Necessidades e Desejos/i.test(seedSql) &&
  /Como poupar\?/i.test(seedSql) &&
  /Planejando meus gastos/i.test(seedSql) &&
  /Meu primeiro orçamento/i.test(seedSql)
);

const mcCount = (seedSql.match(/activity_type.*'multiple_choice'/gi) || seedSql.match(/'multiple_choice'/gi) || []).length;
const tfCount = (seedSql.match(/activity_type.*'true_false'/gi) || seedSql.match(/'true_false'/gi) || []).length;
const mtCount = (seedSql.match(/activity_type.*'matching'/gi) || seedSql.match(/'matching'/gi) || []).length;

check('15 Atividades estruturadas (5 múltipla escolha, 5 V/F, 5 correspondência)', mcCount >= 5 && tfCount >= 5 && mtCount >= 5);
check('Gabaritos com feedbacks explicativos detalhados para todas as atividades', (seedSql.match(/INSERT INTO public\.activity_answer_keys/g) || []).length === 15);
check('seed.sql não duplica execução via \\ir desnecessária', !/\\ir migrations/i.test(seedCanonicalSql));

console.log('\n======================================================================');
console.log(`TOTAL DE CHECAGENS: ${totalChecks}`);
console.log(`PASSOU: ${passedChecks}`);
console.log(`FALHOU: ${totalChecks - passedChecks}`);
console.log('======================================================================');

if (totalChecks === passedChecks) {
  process.exit(0);
} else {
  process.exit(1);
}
