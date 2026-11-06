-- =============================================================================
-- EduCash — Fase 2: Migração 01 - Criação do Esquema do Banco de Dados
-- Descrição: Criação das 14 tabelas do modelo lógico, restrições e índices.
-- =============================================================================

-- Extensão para suporte a geração de UUIDs (caso ainda não esteja habilitada)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. TABELA: profiles
-- Descrição: Dados do perfil público/básico do usuário vinculado a auth.users.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT profiles_username_min_length CHECK (char_length(trim(username)) >= 3)
);

-- Índice único case-insensitive para o username
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx 
ON public.profiles (LOWER(trim(username)));

COMMENT ON TABLE public.profiles IS 'Perfis de usuários vinculados ao auth.users com nome de usuário único insensível a maiúsculas.';

-- -----------------------------------------------------------------------------
-- 2. TABELA: user_preferences
-- Descrição: Preferências individuais de tema (1 por usuário: light ou dark).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme text NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_preferences IS 'Preferências individuais de tema do usuário (light ou dark).';

-- -----------------------------------------------------------------------------
-- 3. TABELA: learning_paths
-- Descrição: Trilhas educacionais estruturadas.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    position integer NOT NULL UNIQUE CHECK (position > 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.learning_paths IS 'Trilhas de aprendizagem disponíveis na plataforma.';

-- -----------------------------------------------------------------------------
-- 4. TABELA: lessons
-- Descrição: Lições que compõem uma trilha de aprendizagem.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id uuid NOT NULL REFERENCES public.learning_paths(id) ON DELETE RESTRICT,
    title text NOT NULL,
    description text NOT NULL,
    introduction text NOT NULL,
    practical_example text NOT NULL,
    conclusion text NOT NULL,
    position integer NOT NULL CHECK (position > 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT lessons_path_position_unique UNIQUE (learning_path_id, position)
);

CREATE INDEX IF NOT EXISTS lessons_learning_path_id_idx ON public.lessons(learning_path_id);

COMMENT ON TABLE public.lessons IS 'Lições sequenciais de uma trilha educacional com estrutura pedagógica completa.';

-- -----------------------------------------------------------------------------
-- 5. TABELA: activities
-- Descrição: Atividades avaliativas contidas em uma lição (múltipla escolha, V/F ou correspondência).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE RESTRICT,
    title text NOT NULL,
    description text NOT NULL,
    activity_type text NOT NULL CHECK (activity_type IN ('multiple_choice', 'true_false', 'matching')),
    position integer NOT NULL CHECK (position > 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT activities_lesson_position_unique UNIQUE (lesson_id, position)
);

CREATE INDEX IF NOT EXISTS activities_lesson_id_idx ON public.activities(lesson_id);

COMMENT ON TABLE public.activities IS 'Atividades pedagógicas pertencentes a uma lição.';

-- -----------------------------------------------------------------------------
-- 6. TABELA: activity_options
-- Descrição: Opções ou itens exibidos nas atividades (opções de múltipla escolha e itens de correspondência).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_options (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    option_key text NOT NULL,
    option_text text NOT NULL,
    side text CHECK (side IN ('left', 'right') OR side IS NULL),
    position integer NOT NULL CHECK (position > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT activity_options_activity_key_unique UNIQUE (activity_id, option_key),
    CONSTRAINT activity_options_activity_position_unique UNIQUE (activity_id, position)
);

CREATE INDEX IF NOT EXISTS activity_options_activity_id_idx ON public.activity_options(activity_id);

COMMENT ON TABLE public.activity_options IS 'Opções e itens de atividades com identificadores estáveis.';

-- -----------------------------------------------------------------------------
-- 7. TABELA: activity_answer_keys
-- Descrição: Gabaritos e feedbacks de cada atividade. Estritamente protegida.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_answer_keys (
    activity_id uuid PRIMARY KEY REFERENCES public.activities(id) ON DELETE CASCADE,
    correct_answer jsonb NOT NULL,
    feedback_correct text NOT NULL,
    feedback_incorrect text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.activity_answer_keys IS 'Gabaritos confidenciais de atividades (nunca expostos a consultas client-side).';

-- -----------------------------------------------------------------------------
-- 8. TABELA: activity_attempts
-- Descrição: Histórico auditável de todas as tentativas de submissão de respostas.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    submitted_answer jsonb NOT NULL,
    is_correct boolean NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_attempts_user_activity_idx 
ON public.activity_attempts(user_id, activity_id, created_at DESC);

COMMENT ON TABLE public.activity_attempts IS 'Histórico imutável de todas as tentativas submetidas pelos usuários.';

-- -----------------------------------------------------------------------------
-- 9. TABELA: user_activity_progress
-- Descrição: Registro de primeira conclusão e contagem de tentativas por atividade.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_activity_progress (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    first_completed_at timestamptz NOT NULL DEFAULT now(),
    attempts_count integer NOT NULL DEFAULT 1 CHECK (attempts_count >= 1),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, activity_id)
);

CREATE INDEX IF NOT EXISTS user_activity_progress_user_id_idx ON public.user_activity_progress(user_id);

COMMENT ON TABLE public.user_activity_progress IS 'Estado de conclusão de atividades pelo usuário.';

-- -----------------------------------------------------------------------------
-- 10. TABELA: lesson_progress
-- Descrição: Desbloqueio e data de conclusão de lições (sem booleano redundante).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    unlocked_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_id_idx ON public.lesson_progress(user_id);

COMMENT ON TABLE public.lesson_progress IS 'Progresso de lições com data de desbloqueio e conclusão.';

-- -----------------------------------------------------------------------------
-- 11. TABELA: reward_transactions
-- Descrição: Livro-razão idempotente de recompensas (XP e moedas).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reward_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    xp_amount integer NOT NULL CHECK (xp_amount >= 0),
    coins_amount integer NOT NULL CHECK (coins_amount >= 0),
    transaction_type text NOT NULL CHECK (transaction_type IN ('activity_first_correct', 'lesson_completion')),
    reference_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT reward_transactions_user_idempotency_unique UNIQUE (user_id, transaction_type, reference_id)
);

CREATE INDEX IF NOT EXISTS reward_transactions_user_id_idx ON public.reward_transactions(user_id);

COMMENT ON TABLE public.reward_transactions IS 'Transações de concessão de XP e moedas com chave única de idempotência.';

-- -----------------------------------------------------------------------------
-- 12. TABELA: level_definitions
-- Descrição: Faixas de níveis e limites mínimos de XP.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.level_definitions (
    level integer PRIMARY KEY CHECK (level >= 1),
    name text NOT NULL,
    min_xp integer NOT NULL UNIQUE CHECK (min_xp >= 0)
);

COMMENT ON TABLE public.level_definitions IS 'Definições estáticas de níveis e pontuação mínima de XP.';

-- -----------------------------------------------------------------------------
-- 13. TABELA: achievements
-- Descrição: Conquistas cosméticas disponíveis no sistema.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.achievements IS 'Catálogo de conquistas cosméticas do sistema.';

-- -----------------------------------------------------------------------------
-- 14. TABELA: user_achievements
-- Descrição: Conquistas desbloqueadas por cada usuário (sem duplicação).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_achievements (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id text NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON public.user_achievements(user_id);

COMMENT ON TABLE public.user_achievements IS 'Associação de conquistas desbloqueadas pelos usuários.';

