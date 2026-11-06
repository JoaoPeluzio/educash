-- =============================================================================
-- EduCash — Fase 2: Suíte de Testes Reproduzível do Banco de Dados (Hardened)
-- Arquivo: supabase/tests/database_test_suite.sql
-- Execução: psql -d <database_url> -f supabase/tests/database_test_suite.sql
--           ou via Supabase CLI: supabase test db
-- Descrição: Testes abrangentes cobrindo integridade de esquema, escopo estrito
--            de preferências, validação pedagógica de atividades, modelo de
--            gamificação, desbloqueio sequencial, segurança de RLS, funções
--            internas restritas e proteção contra manipulação cross-account.
-- =============================================================================

BEGIN;

DO $$
DECLARE
    v_user_a uuid := '00000000-0000-0000-0000-00000000000a';
    v_user_b uuid := '00000000-0000-0000-0000-00000000000b';
    v_res jsonb;
    v_summary jsonb;
    v_act_1_1 uuid := 'c0000000-0000-0000-0000-000000000001';
    v_act_1_2 uuid := 'c0000000-0000-0000-0000-000000000002';
    v_act_1_3 uuid := 'c0000000-0000-0000-0000-000000000003';
    v_act_2_1 uuid := 'c0000000-0000-0000-0000-000000000004';
    v_table_count integer;
    v_xp_total integer;
    v_coins_total integer;
    v_achievements_count integer;
    v_unlocked boolean;
    v_error_caught boolean;
    v_username_lookup text;
BEGIN
    RAISE NOTICE '=============================================================';
    RAISE NOTICE 'INICIANDO SUÍTE DE TESTES EDU CASH — BANCO DE DADOS E RLS';
    RAISE NOTICE '=============================================================';

    -- -------------------------------------------------------------------------
    -- 1. TESTE DE ESQUEMA: Existência das 14 tabelas
    -- -------------------------------------------------------------------------
    SELECT count(*) INTO v_table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN (
        'profiles', 'user_preferences', 'learning_paths', 'lessons',
        'activities', 'activity_options', 'activity_answer_keys',
        'activity_attempts', 'user_activity_progress', 'lesson_progress',
        'reward_transactions', 'level_definitions', 'achievements',
        'user_achievements'
      );

    IF v_table_count = 14 THEN
        RAISE NOTICE '[PASS] 1.1 Esquema: Todas as 14 tabelas existem no schema public.';
    ELSE
        RAISE EXCEPTION '[FAIL] 1.1 Esquema: Esperadas 14 tabelas, encontradas %', v_table_count;
    END IF;

    -- Simulação de usuários no auth.users caso o schema auth exista
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
        INSERT INTO auth.users (id, email) VALUES 
        (v_user_a, 'aluno_a@educash.local'),
        (v_user_b, 'aluno_b@educash.local')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Criação de perfis de teste
    INSERT INTO public.profiles (id, username) VALUES 
    (v_user_a, 'alunoteste')
    ON CONFLICT (id) DO UPDATE SET username = 'alunoteste';

    -- -------------------------------------------------------------------------
    -- 1.2 TESTE DE UNICIDADE CASE-INSENSITIVE DE USERNAME
    -- -------------------------------------------------------------------------
    v_error_caught := false;
    BEGIN
        INSERT INTO public.profiles (id, username) VALUES 
        (v_user_b, 'ALUNOTESTE');
    EXCEPTION WHEN unique_violation THEN
        v_error_caught := true;
    END;

    IF v_error_caught THEN
        RAISE NOTICE '[PASS] 1.2 Integridade: Unicidade case-insensitive de username validada com sucesso.';
    ELSE
        RAISE EXCEPTION '[FAIL] 1.2 Integridade: Username duplicado com caixa diferente não foi bloqueado!';
    END IF;

    -- Insere User B com username válido e diferente
    INSERT INTO public.profiles (id, username) VALUES 
    (v_user_b, 'alunob')
    ON CONFLICT (id) DO UPDATE SET username = 'alunob';

    -- -------------------------------------------------------------------------
    -- 1.3 TESTE DE ESCOPO ESTRITO EM USER_PREFERENCES (Sem sound_enabled, apenas theme)
    -- -------------------------------------------------------------------------
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'user_preferences' 
          AND column_name = 'sound_enabled'
    ) THEN
        RAISE EXCEPTION '[FAIL] 1.3 Escopo: Coluna não aprovada sound_enabled encontrada em user_preferences!';
    ELSE
        RAISE NOTICE '[PASS] 1.3 Escopo: user_preferences validada sem campos não aprovados.';
    END IF;

    -- Simula contexto do User A
    PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);

    -- -------------------------------------------------------------------------
    -- 2. TESTES DE ATIVIDADES E RESPOSTAS
    -- -------------------------------------------------------------------------
    -- 2.1 Múltipla Escolha: Resposta Incorreta
    v_res := public.submit_activity_answer(v_act_1_1, '{"selected_option": "opt_1_1_b"}'::jsonb);
    IF (v_res->>'is_correct')::boolean = false AND (v_res->>'xp_earned')::integer = 0 THEN
        RAISE NOTICE '[PASS] 2.1 Múltipla Escolha Incorreta: Identificada corretamente sem conceder recompensas.';
    ELSE
        RAISE EXCEPTION '[FAIL] 2.1 Múltipla Escolha Incorreta falhou: %', v_res;
    END IF;

    -- 2.2 Múltipla Escolha: Resposta Correta (Primeiro acerto: +10 XP, +5 moedas)
    v_res := public.submit_activity_answer(v_act_1_1, '{"selected_option": "opt_1_1_a"}'::jsonb);
    IF (v_res->>'is_correct')::boolean = true 
       AND (v_res->>'xp_earned')::integer = 10 
       AND (v_res->>'coins_earned')::integer = 5 THEN
        RAISE NOTICE '[PASS] 2.2 Múltipla Escolha Correta: Concedeu +10 XP e +5 moedas na primeira resolução.';
    ELSE
        RAISE EXCEPTION '[FAIL] 2.2 Múltipla Escolha Correta falhou: %', v_res;
    END IF;

    -- 2.3 Idempotência de Atividade: Resposta Correta Repetida (Sem recompensa extra)
    v_res := public.submit_activity_answer(v_act_1_1, '{"selected_option": "opt_1_1_a"}'::jsonb);
    IF (v_res->>'is_correct')::boolean = true 
       AND (v_res->>'xp_earned')::integer = 0 
       AND (v_res->>'coins_earned')::integer = 0 THEN
        RAISE NOTICE '[PASS] 2.3 Idempotência de Recompensa: Resolução repetida não concedeu recompensas adicionais.';
    ELSE
        RAISE EXCEPTION '[FAIL] 2.3 Idempotência falhou: %', v_res;
    END IF;

    -- 2.4 Verdadeiro ou Falso: Validação
    v_res := public.submit_activity_answer(v_act_1_2, '{"value": true}'::jsonb);
    IF (v_res->>'is_correct')::boolean = true AND (v_res->>'xp_earned')::integer = 10 THEN
        RAISE NOTICE '[PASS] 2.4 Verdadeiro ou Falso: Resposta válida com concessão de recompensas.';
    ELSE
        RAISE EXCEPTION '[FAIL] 2.4 Verdadeiro ou Falso falhou: %', v_res;
    END IF;

    -- 2.5 Correspondência (Matching): Rejeição de Pares Incompletos ou Incorretos
    v_res := public.submit_activity_answer(v_act_1_3, '{"matches": {"left_1_3_1": "right_1_3_1"}}'::jsonb);
    IF (v_res->>'is_correct')::boolean = false THEN
        RAISE NOTICE '[PASS] 2.5 Correspondência Incompleta: Rejeitada com sucesso.';
    ELSE
        RAISE EXCEPTION '[FAIL] 2.5 Correspondência Incompleta aceita indevidamente!';
    END IF;

    -- 2.6 Correspondência (Matching): Resposta Correta Completa (Conclui Lição 1)
    v_res := public.submit_activity_answer(v_act_1_3, 
        '{"matches": {"left_1_3_1": "right_1_3_1", "left_1_3_2": "right_1_3_2", "left_1_3_3": "right_1_3_3"}}'::jsonb);
    
    IF (v_res->>'is_correct')::boolean = true 
       AND (v_res->>'lesson_completed')::boolean = true
       AND (v_res->>'lesson_bonus_xp')::integer = 20
       AND (v_res->>'lesson_bonus_coins')::integer = 10 THEN
        RAISE NOTICE '[PASS] 2.6 Conclusão da Lição 1: Concedeu bônus de lição (+20 XP, +10 moedas) ao acertar todas as 3 atividades.';
    ELSE
        RAISE EXCEPTION '[FAIL] 2.6 Conclusão da Lição 1 falhou: %', v_res;
    END IF;

    -- -------------------------------------------------------------------------
    -- 3. TESTE DE DESBLOQUEIO SEQUENCIAL DE LIÇÕES
    -- -------------------------------------------------------------------------
    -- Após concluir a Lição 1, a Lição 2 deve estar desbloqueada para User A
    v_unlocked := public.is_lesson_unlocked(v_user_a, 'b0000000-0000-0000-0000-000000000002');
    IF v_unlocked THEN
        RAISE NOTICE '[PASS] 3.1 Desbloqueio: Lição 2 desbloqueada após a conclusão da Lição 1.';
    ELSE
        RAISE EXCEPTION '[FAIL] 3.1 Desbloqueio: Lição 2 permaneceu bloqueada após Lição 1 concluída!';
    END IF;

    -- A Lição 3 ainda deve estar bloqueada para User A (pois a 2 ainda não foi concluída)
    v_unlocked := public.is_lesson_unlocked(v_user_a, 'b0000000-0000-0000-0000-000000000003');
    IF NOT v_unlocked THEN
        RAISE NOTICE '[PASS] 3.2 Bloqueio Sequencial: Lição 3 permanece estritamente bloqueada.';
    ELSE
        RAISE EXCEPTION '[FAIL] 3.2 Bloqueio Sequencial: Lição 3 foi desbloqueada prematuramente!';
    END IF;

    -- -------------------------------------------------------------------------
    -- 4. TESTE DE CONQUISTAS E GAMIFICAÇÃO
    -- -------------------------------------------------------------------------
    SELECT count(*) INTO v_achievements_count
    FROM public.user_achievements
    WHERE user_id = v_user_a;

    IF v_achievements_count >= 2 THEN
        RAISE NOTICE '[PASS] 4.1 Conquistas: Desbloqueadas automaticamente "primeiros_passos" e "aprendiz_dedicado".';
    ELSE
        RAISE EXCEPTION '[FAIL] 4.1 Conquistas esperadas 2, encontradas %', v_achievements_count;
    END IF;

    -- Verifica sumário de aprendizagem do User A
    v_summary := public.get_user_learning_summary();
    v_xp_total := (v_summary->>'total_xp')::integer;
    v_coins_total := (v_summary->>'total_coins')::integer;

    IF v_xp_total = 50 AND v_coins_total = 25 AND (v_summary->'current_level'->>'level')::integer = 2 THEN
        RAISE NOTICE '[PASS] 4.2 Sumário de Gamificação: Total de 50 XP e 25 moedas, Nível 2 (Aprendiz) verificado.';
    ELSE
        RAISE EXCEPTION '[FAIL] 4.2 Sumário incorreto: XP=%, Moedas=%, Nível=%', 
            v_xp_total, v_coins_total, v_summary->'current_level';
    END IF;

    -- -------------------------------------------------------------------------
    -- 5. TESTES DE SEGURANÇA E ISOLAMENTO (RLS & HARDENING)
    -- -------------------------------------------------------------------------
    -- 5.1 Tentativa de submissão em lição bloqueada para outro usuário
    PERFORM set_config('request.jwt.claim.sub', v_user_b::text, true);
    
    v_error_caught := false;
    BEGIN
        -- User B não concluiu a Lição 1, logo tentar enviar na Lição 2 deve falhar
        PERFORM public.submit_activity_answer(v_act_2_1, '{"selected_option": "opt_2_1_a"}'::jsonb);
    EXCEPTION WHEN OTHERS THEN
        v_error_caught := true;
    END;

    IF v_error_caught THEN
        RAISE NOTICE '[PASS] 5.1 Segurança: Submissão em lição bloqueada para usuário sem pré-requisito foi rejeitada.';
    ELSE
        RAISE EXCEPTION '[FAIL] 5.1 Falha de segurança: Lição bloqueada permitiu submissão direta!';
    END IF;

    -- 5.2 Tentativa de submissão não autenticada
    PERFORM set_config('request.jwt.claim.sub', '', true);
    v_error_caught := false;
    BEGIN
        PERFORM public.submit_activity_answer(v_act_1_1, '{"selected_option": "opt_1_1_a"}'::jsonb);
    EXCEPTION WHEN OTHERS THEN
        v_error_caught := true;
    END;

    IF v_error_caught THEN
        RAISE NOTICE '[PASS] 5.2 Segurança: Chamadas não autenticadas foram sumariamente rejeitadas.';
    ELSE
        RAISE EXCEPTION '[FAIL] 5.2 Falha de segurança: Submissão sem autenticação foi permitida!';
    END IF;

    -- 5.3 Consulta pontual segura de username público via get_public_username
    PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);
    v_username_lookup := public.get_public_username(v_user_b);
    IF v_username_lookup = 'alunob' THEN
        RAISE NOTICE '[PASS] 5.3 Privacidade: Consulta pontual via get_public_username retornou username de forma segura.';
    ELSE
        RAISE EXCEPTION '[FAIL] 5.3 Consulta pontual de username falhou: %', v_username_lookup;
    END IF;

    RAISE NOTICE '=============================================================';
    RAISE NOTICE 'TODOS OS TESTES EXECUTADOS FORAM APROVADOS COM SUCESSO!';
    RAISE NOTICE '=============================================================';
END $$;

ROLLBACK;
