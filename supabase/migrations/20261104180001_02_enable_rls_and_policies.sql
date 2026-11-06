-- =============================================================================
-- EduCash — Fase 2: Migração 02 - Habilitação de RLS e Políticas de Segurança
-- Descrição: Ativação de Row Level Security (RLS) nas 14 tabelas, definição
--            de políticas restritivas e criação de view segura para usernames.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. HABILITAÇÃO DE ROW LEVEL SECURITY EM TODAS AS TABELAS
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. VIEW SEGURA PARA NOMES DE USUÁRIO PÚBLICOS
-- Expõe apenas 'id' e 'username', protegendo campos privados.
-- security_invoker = true garante que o RLS da tabela subjacente 'profiles'
-- seja rigorosamente respeitado pelo PostgreSQL 15+, evitando bypass de RLS.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.public_profiles 
WITH (security_barrier = true, security_invoker = true) AS
SELECT 
    id, 
    username
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated;

COMMENT ON VIEW public.public_profiles IS 'Visão de perfis públicos com security_invoker e security_barrier ativos para respeitar o RLS da tabela base.';

-- -----------------------------------------------------------------------------
-- FUNÇÃO SEGURA: get_public_username
-- Permite que usuários autenticados resolvam o nome de exibição de um usuário
-- específico a partir de seu ID, sem autorizar varredura ou raspagem em massa.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_public_username(p_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT username FROM public.profiles WHERE id = p_user_id;
$$;

REVOKE ALL ON FUNCTION public.get_public_username(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_username(uuid) TO authenticated;

COMMENT ON FUNCTION public.get_public_username(uuid) IS 'Consulta pontual e segura do nome de usuário público sem expor dados privados.';

-- -----------------------------------------------------------------------------
-- 3. POLÍTICAS: profiles
-- Usuário só pode ler, atualizar ou inserir seu próprio registro de perfil.
-- -----------------------------------------------------------------------------
CREATE POLICY "profiles_select_own" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 4. POLÍTICAS: user_preferences
-- Usuário gerencia apenas suas próprias preferências.
-- -----------------------------------------------------------------------------
CREATE POLICY "user_preferences_select_own" 
ON public.user_preferences 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_insert_own" 
ON public.user_preferences 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_update_own" 
ON public.user_preferences 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 5. POLÍTICAS: Conteúdo Educacional Compartilhado (Somente Leitura para Ativos)
-- Alunos autenticados podem apenas consultar itens ativos. Modificações negadas.
-- -----------------------------------------------------------------------------

-- learning_paths
CREATE POLICY "learning_paths_select_active" 
ON public.learning_paths 
FOR SELECT 
TO authenticated 
USING (is_active = true);

-- lessons
CREATE POLICY "lessons_select_active" 
ON public.lessons 
FOR SELECT 
TO authenticated 
USING (is_active = true);

-- activities
CREATE POLICY "activities_select_active" 
ON public.activities 
FOR SELECT 
TO authenticated 
USING (is_active = true);

-- activity_options
CREATE POLICY "activity_options_select_active" 
ON public.activity_options 
FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.activities a 
        WHERE a.id = activity_options.activity_id AND a.is_active = true
    )
);

-- -----------------------------------------------------------------------------
-- 6. POLÍTICAS: activity_answer_keys (Gabaritos Protegidos)
-- NENHUMA política SELECT/INSERT/UPDATE/DELETE para 'authenticated'.
-- O RLS bloqueia qualquer tentativa de leitura direta por clientes.
-- Acesso exclusivo via funções com SECURITY DEFINER executadas no banco.
-- -----------------------------------------------------------------------------
-- (Nenhuma política criada para authenticated = Acesso negado por padrão)

-- -----------------------------------------------------------------------------
-- 7. POLÍTICAS: Registros Pessoais Sensíveis (Somente Leitura Própria)
-- Inserções e atualizações diretas via client são bloqueadas por RLS.
-- O preenchimento ocorre exclusivamente através da função atômica 'submit_activity_answer'.
-- -----------------------------------------------------------------------------

-- activity_attempts
CREATE POLICY "activity_attempts_select_own" 
ON public.activity_attempts 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- user_activity_progress
CREATE POLICY "user_activity_progress_select_own" 
ON public.user_activity_progress 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- lesson_progress
CREATE POLICY "lesson_progress_select_own" 
ON public.lesson_progress 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- reward_transactions
CREATE POLICY "reward_transactions_select_own" 
ON public.reward_transactions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- user_achievements
CREATE POLICY "user_achievements_select_own" 
ON public.user_achievements 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 8. POLÍTICAS: Catálogos Estáticos (Níveis e Conquistas)
-- Leitura pública para todos os usuários autenticados.
-- -----------------------------------------------------------------------------

-- level_definitions
CREATE POLICY "level_definitions_select_all" 
ON public.level_definitions 
FOR SELECT 
TO authenticated 
USING (true);

-- achievements
CREATE POLICY "achievements_select_all" 
ON public.achievements 
FOR SELECT 
TO authenticated 
USING (true);

