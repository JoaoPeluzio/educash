# EduCash — Arquitetura de Banco de Dados, Segurança e Backend (Fase 2 - Auditada e Endurecida)

Este documento detalha o modelo de dados, as políticas de segurança (RLS), as funções transacionais, a estratégia de concorrência e a carga pedagógica da Fase 2 do **EduCash**.

---

## 1. Visão Geral da Arquitetura

O backend do EduCash é fundamentado diretamente no **PostgreSQL** por meio do ecossistema **Supabase**, utilizando migrações SQL versionadas, controle estrito de acessos em nível de linha (*Row Level Security* - RLS) e funções procedurais em PL/pgSQL para as regras críticas de negócio e gamificação.

- **Banco de Dados:** PostgreSQL 15+ (gerenciado via Supabase).
- **Abordagem de Migrações:** Arquivos SQL sequenciais em `supabase/migrations/`.
- **Controle de Acesso:** RLS ativado nas 14 tabelas do sistema.
- **Validação e Recompensas:** Encapsuladas em funções com `SECURITY DEFINER`, executadas exclusivamente no banco, sem depender de regras no client-side.

---

## 2. Estrutura das 14 Tabelas e Relacionamentos

```mermaid
erDiagram
    users ||--|| profiles : "id (auth.users)"
    profiles ||--|| user_preferences : "user_id"
    learning_paths ||--|{ lessons : "learning_path_id"
    lessons ||--|{ activities : "lesson_id"
    activities ||--|{ activity_options : "activity_id"
    activities ||--|| activity_answer_keys : "activity_id"
    profiles ||--o{ activity_attempts : "user_id"
    activities ||--o{ activity_attempts : "activity_id"
    profiles ||--o{ user_activity_progress : "user_id"
    activities ||--o{ user_activity_progress : "activity_id"
    profiles ||--o{ lesson_progress : "user_id"
    lessons ||--o{ lesson_progress : "lesson_id"
    profiles ||--o{ reward_transactions : "user_id"
    achievements ||--o{ user_achievements : "achievement_id"
    profiles ||--o{ user_achievements : "user_id"
```

### Detalhamento das Entidades

1. **`profiles`**: Dados cadastrais do usuário vinculados a `auth.users(id)` (`ON DELETE CASCADE`). Possui índice único case-insensitive em `LOWER(trim(username))`.
2. **`user_preferences`**: Configurações individuais de tema (`theme` com valores restritos a `'light'` ou `'dark'`), relação 1:1 com `profiles(id)`.
3. **`learning_paths`**: Trilhas de aprendizagem disponíveis, ordenadas por posição única.
4. **`lessons`**: Lições de uma trilha contendo introdução, exemplo prático e conclusão pedagógica.
5. **`activities`**: Atividades avaliativas (tipos: `multiple_choice`, `true_false`, `matching`).
6. **`activity_options`**: Opções e pares de correspondência com identificadores estáveis (`option_key`).
7. **`activity_answer_keys`**: Gabaritos confidenciais e feedbacks detalhados (acesso bloqueado a consultas client-side).
8. **`activity_attempts`**: Registro imutável de todas as tentativas de resposta para fins de auditoria e métricas.
9. **`user_activity_progress`**: Estado de acerto de cada atividade pelo usuário, contendo data do primeiro acerto e total de tentativas.
10. **`lesson_progress`**: Progresso de lições com data de desbloqueio e data de conclusão (`completed_at`).
11. **`reward_transactions`**: Livro-razão contábil de concessão de XP e moedas, com restrição única de idempotência (`user_id`, `transaction_type`, `reference_id`).
12. **`level_definitions`**: Catálogo dos 5 níveis com pontuação mínima de XP.
13. **`achievements`**: Catálogo das 5 conquistas cosméticas do sistema.
14. **`user_achievements`**: Associação única de conquistas desbloqueadas pelos usuários.

---

## 3. Ordem de Execução das Migrações e Carga Canônica

As migrações estão localizadas em `supabase/migrations/` e devem ser executadas na seguinte ordem:

1. `20261104180000_01_create_schema.sql`:
   - Ativa extensão `pgcrypto`.
   - Cria as 14 tabelas, restrições `CHECK`, chaves estrangeiras com regras apropriadas de exclusão e índices para consultas frequentes.
2. `20261104180001_02_enable_rls_and_policies.sql`:
   - Habilita RLS em todas as 14 tabelas.
   - Cria a view protegida `public_profiles` com `security_barrier = true` e `security_invoker = true`.
   - Implementa a função segura `get_public_username(p_user_id)` para consulta pontual de nomes públicos.
   - Configura políticas restritivas para tabelas compartilhadas e isolamento estrito de dados pessoais.
3. `20261104180002_03_create_functions.sql`:
   - Cria a função transacional `submit_activity_answer` protegida contra concorrência via `FOR UPDATE`.
   - Implementa funções internas restritas `is_lesson_unlocked` e `check_and_unlock_achievements` com permissões de execução de clientes revogadas.
   - Cria funções públicas seguras de consulta `get_user_learning_summary` e `get_available_lessons`.
4. `20261104180003_04_seed_data.sql`:
   - Carga canônica oficial contendo a trilha fundamental, 5 lições pedagógicas, 15 atividades completas com opções e gabaritos, 5 níveis e 5 conquistas.

O arquivo `supabase/seed.sql` é mantido como ponto de extensão canônico reservado para dados locais opcionais de teste, sem duplicar a carga da migração 04.

---

## 4. Estratégia de Segurança, RLS e Endurecimento (Hardening)

### Conteúdo Educacional Compartilhado
- Alunos autenticados possuem permissão apenas de `SELECT` em trilhas, lições, atividades e opções onde `is_active = true`.
- Modificações diretas (`INSERT`, `UPDATE`, `DELETE`) são terminantemente bloqueadas.

### Gabaritos Confidenciais (`activity_answer_keys`)
- A tabela possui RLS habilitado sem nenhuma política de acesso para `authenticated` ou `anon`. Consultas vindas diretamente do cliente resultam em conjunto vazio ou acesso negado.
- Os gabaritos são lidos unicamente no servidor por meio da função `submit_activity_answer` (`SECURITY DEFINER`).

### Registros Pessoais
- Usuários autenticados podem consultar apenas suas próprias linhas (`auth.uid() = user_id`).
- Escritas diretas em `reward_transactions`, `user_activity_progress`, `lesson_progress` e `user_achievements` são bloqueadas; todo incremento de pontuação e desbloqueio passa compulsoriamente pela função `submit_activity_answer`.

### Modelo de Segurança da View `public_profiles` e Resolução de Username
- **`security_invoker = true`**: Configurado expressamente no PostgreSQL 15+. Garante que a view não atue como um túnel para burlar as restrições da tabela base `profiles`.
- **`security_barrier = true`**: Impede que o otimizador de consultas execute funções fornecidas pelo usuário antes da filtragem da view.
- **Função `get_public_username(p_user_id uuid)`**: Permite consultar o nome público de um colega sem permitir a raspagem ou enumeração em massa da tabela de perfis.

### Restrição de Funções Internas (`is_lesson_unlocked` e `check_and_unlock_achievements`)
- Ambas as funções tiveram seus privilégios de execução **revogados para `PUBLIC`, `authenticated` e `anon`**.
- Como são auxiliares, são executadas unicamente pelo contexto interno de `submit_activity_answer` e `get_available_lessons`.
- `check_and_unlock_achievements` inclui checagem defensiva de identidade (`auth.uid() = p_user_id`), impedindo qualquer manipulação de conquistas entre contas.

### Concorrência e Transacionalidade em `submit_activity_answer`
- A função adquire inicialmente um bloqueio transacional advisory (`PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text), hashtext(v_lesson.id::text));`).
- Esse bloqueio serializa requisições simultâneas do mesmo usuário na mesma lição no nível de transação, mesmo antes que qualquer linha de progresso da lição exista no banco de dados (resolvendo a limitação de que `SELECT ... FOR UPDATE` não bloqueia tuplas inexistentes).
- Complementarmente, aplica-se o bloqueio pessimista `SELECT ... FOR UPDATE` sobre a linha em `lesson_progress`.
- A restrição `UNIQUE (user_id, transaction_type, reference_id)` em `reward_transactions` reforça a idempotência contra duplicidade de pontos e moedas.

---

## 5. Regras de Gamificação e Conteúdo Pedagógico

### Recompensas
- **Primeiro acerto de atividade:** +10 XP e +5 moedas.
- **Acertos repetidos:** 0 XP e 0 moedas (idempotência garantida).
- **Conclusão de lição (3 atividades mandatórias acertadas):** +20 XP e +10 moedas (apenas uma vez).
- **Teto máximo acumulável:** 250 XP e 125 moedas (15 atividades * 10 XP = 150 XP + 5 lições * 20 XP = 100 XP; 15 * 5 = 75 moedas + 5 * 10 = 50 moedas).

### Níveis de Progressão
| Nível | Nome | XP Mínimo |
| :---: | :--- | :---: |
| 1 | Iniciante | 0 |
| 2 | Aprendiz | 40 |
| 3 | Explorador | 90 |
| 4 | Planejador | 150 |
| 5 | Especialista | 220 |

### Conquistas Cosméticas
1. `primeiros_passos`: Primeira atividade correta.
2. `aprendiz_dedicado`: Primeira lição concluída com sucesso.
3. `conhecimento_em_evolucao`: Três lições concluídas.
4. `guardiao_das_economias`: 50 moedas acumuladas.
5. `jornada_completa`: Todas as 5 lições concluídas.

---

## 6. Como Executar os Testes de Banco de Dados

### 6.1 Validação Estática Completa (69 checagens automatizadas)
Executável imediatamente a partir da raiz do repositório:

```bash
node supabase/tests/validate_migrations.cjs
```

### 6.2 Suíte de Testes de Integração com Banco Ativo
Em um ambiente local com Supabase CLI e Docker instalados, ou conectado a uma instância de desenvolvimento do PostgreSQL:

```bash
# Execução direta via psql:
psql -d "postgres://postgres:postgres@localhost:54322/postgres" -f supabase/tests/database_test_suite.sql

# Ou via Supabase CLI (quando disponível):
supabase test db
```
O script de teste roda dentro de uma transação e executa `ROLLBACK` ao término, garantindo que nenhum dado espúrio permaneça gravado.
