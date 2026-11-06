-- =============================================================================
-- EduCash — Fase 2: Migração 03 - Funções de Banco de Dados e Lógica de Negócio
-- Descrição: Implementação atômica e segura das funções do backend:
--            - submit_activity_answer (submissão e validação segura)
--            - check_and_unlock_achievements (desbloqueio de conquistas)
--            - is_lesson_unlocked (verificação de desbloqueio sequencial)
--            - get_user_learning_summary (sumário de progresso e gamificação)
--            - get_available_lessons (status e desbloqueio de lições)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- FUNÇÃO AUXILIAR: is_lesson_unlocked
-- Verifica se uma lição está desbloqueada para um usuário.
-- Regras:
-- - Lição de posição 1 está sempre desbloqueada.
-- - Lição de posição N (N > 1) requer que a lição anterior (N - 1) na mesma
--   trilha tenha sido concluída (completed_at NOT NULL) pelo usuário.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_lesson_unlocked(
    p_user_id uuid,
    p_lesson_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_path_id uuid;
    v_position integer;
    v_prev_lesson_id uuid;
    v_prev_completed boolean;
BEGIN
    -- Busca posição e trilha da lição informada
    SELECT learning_path_id, position 
    INTO v_path_id, v_position
    FROM public.lessons
    WHERE id = p_lesson_id AND is_active = true;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- A primeira lição está sempre desbloqueada
    IF v_position = 1 THEN
        RETURN true;
    END IF;

    -- Localiza a lição imediatamente anterior na mesma trilha
    SELECT id INTO v_prev_lesson_id
    FROM public.lessons
    WHERE learning_path_id = v_path_id 
      AND position = v_position - 1
      AND is_active = true;

    IF NOT FOUND THEN
        -- Se não há lição anterior registrada, desbloqueia por segurança de integridade
        RETURN true;
    END IF;

    -- Verifica se a lição anterior foi concluída pelo usuário
    SELECT (completed_at IS NOT NULL) INTO v_prev_completed
    FROM public.lesson_progress
    WHERE user_id = p_user_id AND lesson_id = v_prev_lesson_id;

    RETURN COALESCE(v_prev_completed, false);
END;
$$;

-- Função interna: revogado acesso de clientes e perfis públicos para evitar
-- enumeração ou inspeção arbitrária do progresso de terceiros.
REVOKE ALL ON FUNCTION public.is_lesson_unlocked(uuid, uuid) FROM PUBLIC, authenticated, anon;
COMMENT ON FUNCTION public.is_lesson_unlocked IS 'Função estritamente interna de apoio para verificação sequencial de lições.';

-- -----------------------------------------------------------------------------
-- FUNÇÃO AUXILIAR: check_and_unlock_achievements
-- Avalia as 5 regras de conquistas cosméticas do EduCash e as desbloqueia de
-- forma idempotente.
-- Regras:
-- 1. primeiros_passos: Primeira atividade correta.
-- 2. aprendiz_dedicado: Primeira lição concluída.
-- 3. conhecimento_em_evolucao: Três lições concluídas.
-- 4. guardiao_das_economias: 50 moedas acumuladas.
-- 5. jornada_completa: Todas as cinco lições concluídas.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_and_unlock_achievements(
    p_user_id uuid
)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_correct_activities_count integer;
    v_completed_lessons_count integer;
    v_total_coins integer;
    v_newly_unlocked text[] := ARRAY[]::text[];
BEGIN
    -- Defesa em profundidade: rejeita chamadas em nome de outro usuário quando em contexto autenticado
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Operação não autorizada para outro usuário'
            USING ERRCODE = '42501';
    END IF;

    -- Contagem de atividades concluídas com sucesso
    SELECT count(*) INTO v_correct_activities_count
    FROM public.user_activity_progress
    WHERE user_id = p_user_id;

    -- Contagem de lições concluídas
    SELECT count(*) INTO v_completed_lessons_count
    FROM public.lesson_progress
    WHERE user_id = p_user_id AND completed_at IS NOT NULL;

    -- Total de moedas acumuladas no livro-razão
    SELECT COALESCE(SUM(coins_amount), 0) INTO v_total_coins
    FROM public.reward_transactions
    WHERE user_id = p_user_id;

    -- Conquista 1: primeiros_passos (primeira atividade correta)
    IF v_correct_activities_count >= 1 THEN
        INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, 'primeiros_passos', now())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
        
        IF FOUND THEN
            v_newly_unlocked := array_append(v_newly_unlocked, 'primeiros_passos');
        END IF;
    END IF;

    -- Conquista 2: aprendiz_dedicado (primeira lição concluída)
    IF v_completed_lessons_count >= 1 THEN
        INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, 'aprendiz_dedicado', now())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
            v_newly_unlocked := array_append(v_newly_unlocked, 'aprendiz_dedicado');
        END IF;
    END IF;

    -- Conquista 3: conhecimento_em_evolucao (três lições concluídas)
    IF v_completed_lessons_count >= 3 THEN
        INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, 'conhecimento_em_evolucao', now())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
            v_newly_unlocked := array_append(v_newly_unlocked, 'conhecimento_em_evolucao');
        END IF;
    END IF;

    -- Conquista 4: guardiao_das_economias (50 moedas acumuladas)
    IF v_total_coins >= 50 THEN
        INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, 'guardiao_das_economias', now())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
            v_newly_unlocked := array_append(v_newly_unlocked, 'guardiao_das_economias');
        END IF;
    END IF;

    -- Conquista 5: jornada_completa (todas as 5 lições concluídas)
    IF v_completed_lessons_count >= 5 THEN
        INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (p_user_id, 'jornada_completa', now())
        ON CONFLICT (user_id, achievement_id) DO NOTHING;

        IF FOUND THEN
            v_newly_unlocked := array_append(v_newly_unlocked, 'jornada_completa');
        END IF;
    END IF;

    RETURN v_newly_unlocked;
END;
$$;

-- Função interna: revogado acesso de clientes para impedir acionamento arbitrário de conquistas
REVOKE ALL ON FUNCTION public.check_and_unlock_achievements(uuid) FROM PUBLIC, authenticated, anon;
COMMENT ON FUNCTION public.check_and_unlock_achievements IS 'Função estritamente interna acionada pela submissão de respostas para desbloqueio de conquistas.';

-- -----------------------------------------------------------------------------
-- FUNÇÃO PRINCIPAL: submit_activity_answer
-- Processamento seguro, atômico e transacional de submissão de respostas.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_activity_answer(
    p_activity_id uuid,
    p_submitted_answer jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id uuid;
    v_activity record;
    v_lesson record;
    v_answer_key record;
    v_is_unlocked boolean;
    v_is_correct boolean := false;
    v_feedback text;
    
    -- Controle de recompensas de atividade (+10 XP, +5 moedas)
    v_xp_earned integer := 0;
    v_coins_earned integer := 0;
    v_is_first_correct boolean := false;

    -- Controle de conclusão de lição (+20 XP, +10 moedas)
    v_total_lesson_activities integer := 0;
    v_completed_lesson_activities integer := 0;
    v_lesson_completed boolean := false;
    v_lesson_bonus_xp integer := 0;
    v_lesson_bonus_coins integer := 0;
    v_next_lesson_id uuid;

    -- Conquistas desbloqueadas nesta submissão
    v_unlocked_achievements text[] := ARRAY[]::text[];

    -- Variáveis auxiliares para validação de tipo de atividade
    v_sub_opt text;
    v_cor_opt text;
    v_sub_bool boolean;
    v_cor_bool boolean;
    v_matching_sub jsonb;
    v_matching_cor jsonb;
    v_sub_key text;
    v_sub_val text;
    v_cor_val text;
    v_key_count_sub integer;
    v_key_count_cor integer;
    v_valid_keys_count integer;
BEGIN
    -- 1. Obter usuário autenticado estritamente via auth.uid()
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Acesso não autorizado: usuário não autenticado'
            USING ERRCODE = '42501';
    END IF;

    -- Validação do parâmetro de resposta
    IF p_submitted_answer IS NULL THEN
        RAISE EXCEPTION 'Resposta submetida não pode ser nula'
            USING ERRCODE = '22023';
    END IF;

    -- 2. Verificar existência e atividade da questão
    SELECT a.id, a.lesson_id, a.activity_type, a.position, a.is_active
    INTO v_activity
    FROM public.activities a
    WHERE a.id = p_activity_id AND a.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Atividade não encontrada ou inativa'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Verificar lição e status de desbloqueio sequencial
    SELECT l.id, l.learning_path_id, l.position, l.is_active
    INTO v_lesson
    FROM public.lessons l
    WHERE l.id = v_activity.lesson_id AND l.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lição associada não encontrada ou inativa'
            USING ERRCODE = 'P0002';
    END IF;

    -- Bloqueio transacional advisory (em nível de transação) por usuário e lição.
    -- Garante a serialização de submissões simultâneas do mesmo usuário na mesma lição,
    -- resolvendo condições de corrida mesmo na primeira submissão quando ainda não existe
    -- uma linha prévia em lesson_progress para SELECT ... FOR UPDATE.
    PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text), hashtext(v_lesson.id::text));

    -- Garante que lição inicial esteja registrada em lesson_progress
    INSERT INTO public.lesson_progress (user_id, lesson_id, unlocked_at)
    VALUES (v_user_id, v_lesson.id, now())
    ON CONFLICT (user_id, lesson_id) DO NOTHING;

    -- Bloqueio pessimista (FOR UPDATE) na linha de progresso da lição para este usuário,
    -- serializando submissões concorrentes do mesmo usuário na mesma lição e prevenindo condições de corrida
    PERFORM 1 FROM public.lesson_progress
    WHERE user_id = v_user_id AND lesson_id = v_lesson.id
    FOR UPDATE;

    v_is_unlocked := public.is_lesson_unlocked(v_user_id, v_lesson.id);
    IF NOT v_is_unlocked THEN
        RAISE EXCEPTION 'Acesso negado: a lição atual está bloqueada para este usuário'
            USING ERRCODE = '42501';
    END IF;

    -- 4. Recuperar gabarito protegido
    SELECT ak.correct_answer, ak.feedback_correct, ak.feedback_incorrect
    INTO v_answer_key
    FROM public.activity_answer_keys ak
    WHERE ak.activity_id = p_activity_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Gabarito confidencial não configurado para esta atividade'
            USING ERRCODE = 'P0002';
    END IF;

    -- 5. Validar a resposta submetida conforme o tipo aprovado
    IF v_activity.activity_type = 'multiple_choice' THEN
        -- Aceita objeto {"selected_option": "..."} ou string direta
        IF jsonb_typeof(p_submitted_answer) = 'object' THEN
            v_sub_opt := p_submitted_answer->>'selected_option';
            IF v_sub_opt IS NULL THEN
                v_sub_opt := p_submitted_answer->>'option_key';
            END IF;
        ELSE
            v_sub_opt := trim(both '"' from p_submitted_answer::text);
        END IF;

        v_cor_opt := v_answer_key.correct_answer->>'selected_option';
        IF v_cor_opt IS NULL THEN
            v_cor_opt := trim(both '"' from v_answer_key.correct_answer::text);
        END IF;

        -- Validação de existência da opção na atividade
        PERFORM 1 FROM public.activity_options 
        WHERE activity_id = p_activity_id AND option_key = v_sub_opt;
        
        IF NOT FOUND THEN
            v_is_correct := false;
        ELSE
            v_is_correct := (v_sub_opt = v_cor_opt);
        END IF;

    ELSIF v_activity.activity_type = 'true_false' THEN
        -- Aceita booleano direto ou objeto {"value": boolean}
        IF jsonb_typeof(p_submitted_answer) = 'object' THEN
            v_sub_bool := (p_submitted_answer->>'value')::boolean;
        ELSIF jsonb_typeof(p_submitted_answer) = 'boolean' THEN
            v_sub_bool := p_submitted_answer::text::boolean;
        ELSE
            v_sub_bool := (trim(both '"' from p_submitted_answer::text) ILIKE 'true');
        END IF;

        IF jsonb_typeof(v_answer_key.correct_answer) = 'object' THEN
            v_cor_bool := (v_answer_key.correct_answer->>'value')::boolean;
        ELSE
            v_cor_bool := (trim(both '"' from v_answer_key.correct_answer::text) ILIKE 'true');
        END IF;

        v_is_correct := (v_sub_bool = v_cor_bool);

    ELSIF v_activity.activity_type = 'matching' THEN
        -- Validação estrita de pares de correspondência
        -- Formato esperado: objeto JSON mapping chave-esquerda => chave-direita
        IF jsonb_typeof(p_submitted_answer) = 'object' AND (p_submitted_answer ? 'matches') THEN
            v_matching_sub := p_submitted_answer->'matches';
        ELSE
            v_matching_sub := p_submitted_answer;
        END IF;

        IF jsonb_typeof(v_answer_key.correct_answer) = 'object' AND (v_answer_key.correct_answer ? 'matches') THEN
            v_matching_cor := v_answer_key.correct_answer->'matches';
        ELSE
            v_matching_cor := v_answer_key.correct_answer;
        END IF;

        -- Se a estrutura submetida não for um objeto JSON válido
        IF jsonb_typeof(v_matching_sub) <> 'object' THEN
            v_is_correct := false;
        ELSE
            SELECT count(*) INTO v_key_count_sub FROM jsonb_object_keys(v_matching_sub);
            SELECT count(*) INTO v_key_count_cor FROM jsonb_object_keys(v_matching_cor);

            -- Deve conter exatamente a mesma quantidade de pares (rejeita faltantes ou adicionais)
            IF v_key_count_sub <> v_key_count_cor OR v_key_count_cor = 0 THEN
                v_is_correct := false;
            ELSE
                v_is_correct := true;
                
                -- Valida cada par chave/valor
                FOR v_sub_key IN SELECT jsonb_object_keys(v_matching_cor)
                LOOP
                    v_cor_val := v_matching_cor->>v_sub_key;
                    v_sub_val := v_matching_sub->>v_sub_key;

                    -- Chave ausente ou valor divergente
                    IF v_sub_val IS NULL OR v_sub_val <> v_cor_val THEN
                        v_is_correct := false;
                        EXIT;
                    END IF;

                    -- Verifica se os identificadores pertencem a opções reais da atividade
                    SELECT count(*) INTO v_valid_keys_count
                    FROM public.activity_options
                    WHERE activity_id = p_activity_id 
                      AND option_key IN (v_sub_key, v_sub_val);

                    IF v_valid_keys_count < 2 THEN
                        v_is_correct := false;
                        EXIT;
                    END IF;
                END LOOP;
            END IF;
        END IF;
    ELSE
        RAISE EXCEPTION 'Tipo de atividade desconhecido: %', v_activity.activity_type
            USING ERRCODE = '22023';
    END IF;

    -- Seleciona feedback apropriado
    IF v_is_correct THEN
        v_feedback := v_answer_key.feedback_correct;
    ELSE
        v_feedback := v_answer_key.feedback_incorrect;
    END IF;

    -- 6. Registrar a tentativa auditável no histórico imutável
    INSERT INTO public.activity_attempts (
        user_id,
        activity_id,
        submitted_answer,
        is_correct
    )
    VALUES (
        v_user_id,
        p_activity_id,
        p_submitted_answer,
        v_is_correct
    );

    -- 7. Processar recompensas e progresso de atividade
    IF v_is_correct THEN
        -- Verifica se o usuário já havia acertado esta atividade anteriormente
        SELECT true INTO v_is_first_correct
        FROM public.user_activity_progress
        WHERE user_id = v_user_id AND activity_id = p_activity_id;

        IF v_is_first_correct IS NULL THEN
            -- Primeira resposta correta: grava progresso
            INSERT INTO public.user_activity_progress (
                user_id,
                activity_id,
                first_completed_at,
                attempts_count
            )
            VALUES (
                v_user_id,
                p_activity_id,
                now(),
                1
            )
            ON CONFLICT (user_id, activity_id) DO NOTHING;

            -- Concede recompensa de primeira resposta correta (+10 XP, +5 moedas)
            -- A restrição UNIQUE garante idempotência estrita mesmo sob concorrência
            INSERT INTO public.reward_transactions (
                user_id,
                xp_amount,
                coins_amount,
                transaction_type,
                reference_id
            )
            VALUES (
                v_user_id,
                10,
                5,
                'activity_first_correct',
                p_activity_id
            )
            ON CONFLICT (user_id, transaction_type, reference_id) DO NOTHING;

            IF FOUND THEN
                v_xp_earned := 10;
                v_coins_earned := 5;
            END IF;
        ELSE
            -- Resposta correta repetida: incrementa contador de tentativas sem recompensa extra
            UPDATE public.user_activity_progress
            SET attempts_count = attempts_count + 1,
                updated_at = now()
            WHERE user_id = v_user_id AND activity_id = p_activity_id;

            v_xp_earned := 0;
            v_coins_earned := 0;
        END IF;

        -- 8. Verificar conclusão da lição
        -- Conta total de atividades ativas da lição
        SELECT count(*) INTO v_total_lesson_activities
        FROM public.activities
        WHERE lesson_id = v_lesson.id AND is_active = true;

        -- Conta atividades da lição concluídas com sucesso pelo usuário
        SELECT count(*) INTO v_completed_lesson_activities
        FROM public.user_activity_progress uap
        JOIN public.activities a ON a.id = uap.activity_id
        WHERE uap.user_id = v_user_id 
          AND a.lesson_id = v_lesson.id 
          AND a.is_active = true;

        -- Todas as 3 atividades mandatórias foram concluídas
        IF v_completed_lesson_activities >= v_total_lesson_activities AND v_total_lesson_activities > 0 THEN
            -- Atualiza ou marca completion_time
            UPDATE public.lesson_progress
            SET completed_at = COALESCE(completed_at, now()),
                updated_at = now()
            WHERE user_id = v_user_id AND lesson_id = v_lesson.id;

            -- Concede bônus de conclusão da lição (+20 XP, +10 moedas) com idempotência
            INSERT INTO public.reward_transactions (
                user_id,
                xp_amount,
                coins_amount,
                transaction_type,
                reference_id
            )
            VALUES (
                v_user_id,
                20,
                10,
                'lesson_completion',
                v_lesson.id
            )
            ON CONFLICT (user_id, transaction_type, reference_id) DO NOTHING;

            IF FOUND THEN
                v_lesson_completed := true;
                v_lesson_bonus_xp := 20;
                v_lesson_bonus_coins := 10;

                -- Desbloqueia automaticamente a próxima lição na trilha (posição + 1)
                SELECT id INTO v_next_lesson_id
                FROM public.lessons
                WHERE learning_path_id = v_lesson.learning_path_id
                  AND position = v_lesson.position + 1
                  AND is_active = true;

                IF v_next_lesson_id IS NOT NULL THEN
                    INSERT INTO public.lesson_progress (
                        user_id,
                        lesson_id,
                        unlocked_at
                    )
                    VALUES (
                        v_user_id,
                        v_next_lesson_id,
                        now()
                    )
                    ON CONFLICT (user_id, lesson_id) DO NOTHING;
                END IF;
            ELSE
                -- Lição já havia sido concluída anteriormente
                v_lesson_completed := false;
            END IF;
        END IF;
    ELSE
        -- Resposta incorreta: incrementa tentativas caso já exista registro
        UPDATE public.user_activity_progress
        SET attempts_count = attempts_count + 1,
            updated_at = now()
        WHERE user_id = v_user_id AND activity_id = p_activity_id;
    END IF;

    -- 9. Verificar e desbloquear conquistas elegíveis
    v_unlocked_achievements := public.check_and_unlock_achievements(v_user_id);

    -- 10. Retornar resposta formatada
    RETURN jsonb_build_object(
        'is_correct', v_is_correct,
        'feedback', v_feedback,
        'xp_earned', v_xp_earned,
        'coins_earned', v_coins_earned,
        'lesson_completed', v_lesson_completed,
        'lesson_bonus_xp', v_lesson_bonus_xp,
        'lesson_bonus_coins', v_lesson_bonus_coins,
        'unlocked_achievements', to_jsonb(v_unlocked_achievements)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_activity_answer(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_activity_answer(uuid, jsonb) TO authenticated;

COMMENT ON FUNCTION public.submit_activity_answer IS 'Submissão e validação atômica de respostas de atividades, garantindo idempotência e integridade das recompensas.';

-- -----------------------------------------------------------------------------
-- FUNÇÃO DE CONSULTA: get_user_learning_summary
-- Retorna o sumário de progresso e gamificação do usuário autenticado.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_learning_summary()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id uuid;
    v_username text;
    v_total_xp integer := 0;
    v_total_coins integer := 0;
    v_current_level record;
    v_next_level record;
    v_completed_activities integer := 0;
    v_completed_lessons integer := 0;
    v_user_achievements jsonb;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Acesso não autorizado: usuário não autenticado'
            USING ERRCODE = '42501';
    END IF;

    -- Obtém username do perfil
    SELECT username INTO v_username
    FROM public.profiles
    WHERE id = v_user_id;

    -- Soma recompensas acumuladas
    SELECT 
        COALESCE(SUM(xp_amount), 0),
        COALESCE(SUM(coins_amount), 0)
    INTO v_total_xp, v_total_coins
    FROM public.reward_transactions
    WHERE user_id = v_user_id;

    -- Determina nível atual
    SELECT level, name, min_xp
    INTO v_current_level
    FROM public.level_definitions
    WHERE min_xp <= v_total_xp
    ORDER BY min_xp DESC
    LIMIT 1;

    IF v_current_level IS NULL THEN
        SELECT 1 AS level, 'Iniciante' AS name, 0 AS min_xp INTO v_current_level;
    END IF;

    -- Determina próximo nível
    SELECT level, name, min_xp
    INTO v_next_level
    FROM public.level_definitions
    WHERE min_xp > v_total_xp
    ORDER BY min_xp ASC
    LIMIT 1;

    -- Contagem de atividades e lições concluídas
    SELECT count(*) INTO v_completed_activities
    FROM public.user_activity_progress
    WHERE user_id = v_user_id;

    SELECT count(*) INTO v_completed_lessons
    FROM public.lesson_progress
    WHERE user_id = v_user_id AND completed_at IS NOT NULL;

    -- Lista de conquistas desbloqueadas
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', a.id,
                'name', a.name,
                'description', a.description,
                'unlocked_at', ua.unlocked_at
            ) ORDER BY ua.unlocked_at ASC
        ),
        '[]'::jsonb
    ) INTO v_user_achievements
    FROM public.user_achievements ua
    JOIN public.achievements a ON a.id = ua.achievement_id
    WHERE ua.user_id = v_user_id;

    RETURN jsonb_build_object(
        'user_id', v_user_id,
        'username', v_username,
        'total_xp', v_total_xp,
        'total_coins', v_total_coins,
        'current_level', jsonb_build_object(
            'level', v_current_level.level,
            'name', v_current_level.name,
            'min_xp', v_current_level.min_xp
        ),
        'next_level', CASE 
            WHEN v_next_level.level IS NOT NULL THEN jsonb_build_object(
                'level', v_next_level.level,
                'name', v_next_level.name,
                'min_xp', v_next_level.min_xp
            )
            ELSE NULL 
        END,
        'completed_activities_count', v_completed_activities,
        'completed_lessons_count', v_completed_lessons,
        'achievements_count', jsonb_array_length(v_user_achievements),
        'unlocked_achievements', v_user_achievements
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_learning_summary() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_learning_summary() TO authenticated;

COMMENT ON FUNCTION public.get_user_learning_summary IS 'Retorna o resumo de aprendizado e recompensas do usuário autenticado de forma somente-leitura.';

-- -----------------------------------------------------------------------------
-- FUNÇÃO DE CONSULTA: get_available_lessons
-- Retorna as lições da trilha com status de desbloqueio e progresso.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_available_lessons()
RETURNS TABLE (
    lesson_id uuid,
    learning_path_id uuid,
    title text,
    description text,
    position integer,
    is_unlocked boolean,
    is_completed boolean,
    completed_activities_count integer,
    total_activities_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Acesso não autorizado: usuário não autenticado'
            USING ERRCODE = '42501';
    END IF;

    RETURN QUERY
    SELECT 
        l.id AS lesson_id,
        l.learning_path_id,
        l.title,
        l.description,
        l.position,
        public.is_lesson_unlocked(v_user_id, l.id) AS is_unlocked,
        COALESCE(lp.completed_at IS NOT NULL, false) AS is_completed,
        (
            SELECT count(*)::integer 
            FROM public.user_activity_progress uap
            JOIN public.activities a ON a.id = uap.activity_id
            WHERE uap.user_id = v_user_id AND a.lesson_id = l.id AND a.is_active = true
        ) AS completed_activities_count,
        (
            SELECT count(*)::integer 
            FROM public.activities a
            WHERE a.lesson_id = l.id AND a.is_active = true
        ) AS total_activities_count
    FROM public.lessons l
    LEFT JOIN public.lesson_progress lp 
        ON lp.lesson_id = l.id AND lp.user_id = v_user_id
    WHERE l.is_active = true
    ORDER BY l.position ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_available_lessons() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_available_lessons() TO authenticated;

COMMENT ON FUNCTION public.get_available_lessons IS 'Retorna a lista segura de lições e seus status de desbloqueio para o usuário autenticado.';

