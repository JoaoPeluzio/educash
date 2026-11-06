-- =============================================================================
-- EduCash — Fase 2: Migração 04 - Carga Inicial de Dados Pedagógicos (Seed)
-- Descrição: Inserção dos 5 níveis, 5 conquistas cosméticas, trilha principal,
--            5 lições pedagógicas e 15 atividades com opções e gabaritos confidenciais.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. NÍVEIS DE PROGRESSÃO (5 NÍVEIS)
-- -----------------------------------------------------------------------------
INSERT INTO public.level_definitions (level, name, min_xp) VALUES
(1, 'Iniciante', 0),
(2, 'Aprendiz', 40),
(3, 'Explorador', 90),
(4, 'Planejador', 150),
(5, 'Especialista', 220)
ON CONFLICT (level) DO UPDATE 
SET name = EXCLUDED.name, min_xp = EXCLUDED.min_xp;

-- -----------------------------------------------------------------------------
-- 2. CATÁLOGO DE CONQUISTAS (5 CONQUISTAS COSMÉTICAS)
-- -----------------------------------------------------------------------------
INSERT INTO public.achievements (id, name, description) VALUES
('primeiros_passos', 'Primeiros passos', 'Completou a primeira atividade com resposta correta.'),
('aprendiz_dedicado', 'Aprendiz dedicado', 'Completou com sucesso a primeira lição com todas as atividades obrigatórias.'),
('conhecimento_em_evolucao', 'Conhecimento em evolução', 'Completou com sucesso três lições da trilha educacional.'),
('guardiao_das_economias', 'Guardião das economias', 'Acumulou 50 moedas através de atividades e conclusões de lições.'),
('jornada_completa', 'Jornada completa', 'Concluiu com sucesso todas as cinco lições do programa EduCash.')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- -----------------------------------------------------------------------------
-- 3. TRILHA EDUCACIONAL PRINCIPAL
-- -----------------------------------------------------------------------------
INSERT INTO public.learning_paths (id, title, description, position, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'Educação Financeira Fundamental', 'Aprenda os conceitos essenciais para cuidar bem do seu dinheiro do dia a dia ao futuro.', 1, true)
ON CONFLICT (position) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, is_active = EXCLUDED.is_active;

-- -----------------------------------------------------------------------------
-- 4. LIÇÕES (5 LIÇÕES COM ESTRUTURA PEDAGÓGICA APROVADA)
-- -----------------------------------------------------------------------------
-- Lição 1: O que é o dinheiro?
INSERT INTO public.lessons (
    id, learning_path_id, title, description, introduction, practical_example, conclusion, position, is_active
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'O que é o dinheiro?',
    'Compreenda a origem, a evolução histórica e as funções essenciais do dinheiro na sociedade.',
    'O dinheiro é uma invenção humana criada para facilitar a troca de produtos e serviços. Antes dele, as pessoas dependiam do escambo, trocando mercadorias diretamente.',
    'Imagine que Sofia tem um livro e quer trocá-lo por um jogo. Lucas tem o jogo, mas quer uma bola. Sem o dinheiro, ninguém conseguiria o que quer! Com o dinheiro, Sofia vende o livro para quem quer ler e usa o valor para comprar o jogo de Lucas, facilitando a vida de todos.',
    'O dinheiro cumpre três papéis fundamentais: é meio de troca, medida de valor para comparar preços e reserva de valor para guardar e usar no futuro.',
    1,
    true
) ON CONFLICT (learning_path_id, position) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, introduction = EXCLUDED.introduction,
    practical_example = EXCLUDED.practical_example, conclusion = EXCLUDED.conclusion;

-- Lição 2: Necessidades e Desejos
INSERT INTO public.lessons (
    id, learning_path_id, title, description, introduction, practical_example, conclusion, position, is_active
) VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Necessidades e Desejos',
    'Aprenda a distinguir o que é essencial para viver bem daquilo que são vontades e confortos adicionais.',
    'Necessidades são itens indispensáveis para nossa sobrevivência, saúde e desenvolvimento básico. Desejos são coisas que gostaríamos de ter para maior conforto, diversão ou estilo.',
    'Alimentação equilibrada e moradia são necessidades universais. Um videogame de última geração é um desejo. Importante: para um entregador ou jovem que estuda à distância, uma bicicleta ou computador pode se tornar necessidade de trabalho ou estudo. As prioridades dependem da realidade de cada um!',
    'Não há problema em realizar desejos! O segredo de uma boa saúde financeira é garantir que as necessidades básicas venham em primeiro lugar, planejando os desejos com calma.',
    2,
    true
) ON CONFLICT (learning_path_id, position) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, introduction = EXCLUDED.introduction,
    practical_example = EXCLUDED.practical_example, conclusion = EXCLUDED.conclusion;

-- Lição 3: Como poupar?
INSERT INTO public.lessons (
    id, learning_path_id, title, description, introduction, practical_example, conclusion, position, is_active
) VALUES (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Como poupar?',
    'Descubra como transformar o hábito de guardar dinheiro em conquistas reais e segurança.',
    'Poupar significa guardar com planejamento uma parte dos recursos que você recebe em vez de gastar tudo de imediato. Não é sobre o que sobra, mas sobre priorizar seus objetivos.',
    'Mateus quer comprar um fone de ouvido de R$ 60. Em vez de gastar todo o dinheiro que ganha com lanches rápidos, ele decide separar R$ 10 toda semana. Em apenas 6 semanas ele compra o fone à vista, sem se endividar nem pagar juros.',
    'Poupar com constância cria independência, protege você em emergências inesperadas e permite realizar planos de curto, médio e longo prazo.',
    3,
    true
) ON CONFLICT (learning_path_id, position) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, introduction = EXCLUDED.introduction,
    practical_example = EXCLUDED.practical_example, conclusion = EXCLUDED.conclusion;

-- Lição 4: Planejando meus gastos
INSERT INTO public.lessons (
    id, learning_path_id, title, description, introduction, practical_example, conclusion, position, is_active
) VALUES (
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'Planejando meus gastos',
    'Tenha controle total das suas despesas e elimine desperdícios através do registro financeiro.',
    'O planejamento financeiro consiste em acompanhar todas as entradas e saídas de dinheiro. Registrar gastos diariamente evita a sensação de que o dinheiro sumiu sem você perceber.',
    'Juliana recebia R$ 80 no mês e no meio do período já estava sem saldo. Ao anotar cada cafezinho, doce e passagem durante duas semanas, descobriu que lanchinhos diários somavam R$ 45. Ajustando esses hábitos, sobrou dinheiro para o passeio de fim de semana.',
    'Identificar despesas fixas, variáveis e gastos invisíveis dá a você o poder de fazer escolhas conscientes e evitar dívidas.',
    4,
    true
) ON CONFLICT (learning_path_id, position) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, introduction = EXCLUDED.introduction,
    practical_example = EXCLUDED.practical_example, conclusion = EXCLUDED.conclusion;

-- Lição 5: Meu primeiro orçamento
INSERT INTO public.lessons (
    id, learning_path_id, title, description, introduction, practical_example, conclusion, position, is_active
) VALUES (
    'b0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'Meu primeiro orçamento',
    'Construa e mantenha um orçamento equilibrado com receitas, despesas e poupança.',
    'O orçamento é a ferramenta que organiza suas finanças em um período. Ele confronta tudo o que você ganha (receitas) com tudo o que pretende gastar (despesas) e poupar.',
    'Thiago planejou seu primeiro mês: com R$ 100 de receitas, destinou R$ 50 para necessidades essenciais (transporte e cópias), R$ 30 para desejos (lazer) e R$ 20 direto para a poupança do skate. No fim do mês, todas as contas estavam pagas e o skate mais perto!',
    'Um orçamento sustentável mantém as despesas menores que as receitas, gerando um saldo positivo que garante tranquilidade e liberdade para o seu futuro.',
    5,
    true
) ON CONFLICT (learning_path_id, position) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, introduction = EXCLUDED.introduction,
    practical_example = EXCLUDED.practical_example, conclusion = EXCLUDED.conclusion;

-- -----------------------------------------------------------------------------
-- 5. ATIVIDADES, OPÇÕES E GABARITOS CONFIDENCIAIS (15 ATIVIDADES)
-- -----------------------------------------------------------------------------

-- =============================================================================
-- LIÇÃO 1: ATIVIDADES
-- =============================================================================
-- Atividade 1.1: Múltipla Escolha
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Função do Dinheiro', 'Qual é a principal função do dinheiro na sociedade moderna?', 'multiple_choice', 1, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'opt_1_1_a', 'Servir como meio universal de troca para compra e venda de bens e serviços', NULL, 1),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'opt_1_1_b', 'Ser colecionado exclusivamente como peça histórica sem circulação comercial', NULL, 2),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'opt_1_1_c', 'Eliminar a necessidade de qualquer trabalho ou produção na economia', NULL, 3)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000001', '{"selected_option": "opt_1_1_a"}'::jsonb, 
 'Excelente! O dinheiro foi criado para funcionar como um meio de troca universalmente aceito, superando as limitações do escambo.',
 'Não é essa a resposta. A função essencial do dinheiro é facilitar as trocas comerciais do cotidiano de forma prática e padronizada.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 1.2: Verdadeiro ou Falso
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Origem do Comércio', 'Antes da invenção de moedas e cédulas, o comércio funcionava por meio do escambo (troca direta de mercadorias).', 'true_false', 2, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000002', '{"value": true}'::jsonb,
 'Correto! Durante muitos séculos, pessoas trocavam diretamente grãos, sal, animais e tecidos por outras mercadorias que precisavam.',
 'Atenção: a afirmação é verdadeira! O escambo foi a forma predominante de comércio antes da padronização das primeiras moedas.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 1.3: Correspondência (Matching)
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Evolução do Dinheiro', 'Relacione cada formato histórico de dinheiro à sua respectiva característica:', 'matching', 3, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'left_1_3_1', 'Moedas de metal', 'left', 1),
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'right_1_3_1', 'Primeiras formas padronizadas com peso e valor oficial garantidos', 'right', 2),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', 'left_1_3_2', 'Cédulas de papel', 'left', 3),
('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003', 'right_1_3_2', 'Notas criadas para facilitar o transporte seguro de quantias maiores', 'right', 4),
('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003', 'left_1_3_3', 'Dinheiro digital e Pix', 'left', 5),
('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'right_1_3_3', 'Movimentações eletrônicas instantâneas sem uso de cédulas físicas', 'right', 6)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000003', 
 '{"matches": {"left_1_3_1": "right_1_3_1", "left_1_3_2": "right_1_3_2", "left_1_3_3": "right_1_3_3"}}'::jsonb,
 'Muito bem! Você compreendeu perfeitamente a evolução prática do dinheiro desde as moedas até as transações digitais.',
 'Revise as correspondências. Lembre-se do contexto histórico e prático de cada meio de pagamento.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- =============================================================================
-- LIÇÃO 2: ATIVIDADES
-- =============================================================================
-- Atividade 2.1: Múltipla Escolha
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Diferenciação de Gastos', 'Por que é importante diferenciar necessidades de desejos ao organizar o dinheiro?', 'multiple_choice', 1, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000004', 'opt_2_1_a', 'Para priorizar o essencial e garantir a segurança antes de gastar com vontades secundárias', NULL, 1),
('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000004', 'opt_2_1_b', 'Para proibir terminantemente qualquer gasto com lazer ou entretenimento', NULL, 2),
('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000004', 'opt_2_1_c', 'Porque desejos não trazem satisfação e devem ser sempre ignorados', NULL, 3)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000004', '{"selected_option": "opt_2_1_a"}'::jsonb,
 'Exato! A priorização garante que o que é básico para a vida seja atendido com tranquilidade, permitindo planejar os desejos.',
 'O foco da educação financeira não é proibir a diversão, mas sim assegurar que o essencial seja atendido primeiro.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 2.2: Verdadeiro ou Falso
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Contexto Individual', 'A classificação de um item como necessidade ou desejo pode variar dependendo da realidade e circunstâncias de cada pessoa.', 'true_false', 2, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000005', '{"value": true}'::jsonb,
 'Correto! Um computador ou transporte pode ser ferramenta indispensável para o estudo ou sustento de uma família, enquanto para outros pode ser lazer.',
 'Atenção: essa afirmação é verdadeira! Não existem listas engessadas; a realidade e as necessidades de cada indivíduo devem ser respeitadas.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 2.3: Correspondência (Matching)
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'Prioridades Financeiras', 'Classifique cada item conforme sua prioridade no cotidiano:', 'matching', 3, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000006', 'left_2_3_1', 'Alimentação saudável e água', 'left', 1),
('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000006', 'right_2_3_1', 'Necessidade indispensável para a saúde e sobrevivência', 'right', 2),
('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000006', 'left_2_3_2', 'Material escolar para aulas', 'left', 3),
('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000006', 'right_2_3_2', 'Necessidade educacional fundamental para o desenvolvimento', 'right', 4),
('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000006', 'left_2_3_3', 'Skin cosmética de videogame', 'left', 5),
('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000006', 'right_2_3_3', 'Desejo de lazer que pode aguardar momento oportuno', 'right', 6)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000006',
 '{"matches": {"left_2_3_1": "right_2_3_1", "left_2_3_2": "right_2_3_2", "left_2_3_3": "right_2_3_3"}}'::jsonb,
 'Parabéns! Você soube ponderar o que é essencial à saúde e ao aprendizado diante de itens de lazer puro.',
 'Verifique novamente as correspondências considerando o impacto real de cada item no bem-estar.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- =============================================================================
-- LIÇÃO 3: ATIVIDADES
-- =============================================================================
-- Atividade 3.1: Múltipla Escolha
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003', 'Hábito de Poupar', 'Qual é a estratégia recomendada para criar o hábito constante de poupar dinheiro?', 'multiple_choice', 1, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000007', 'opt_3_1_a', 'Definir uma meta clara e poupar uma quantia regular logo ao receber o dinheiro', NULL, 1),
('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000007', 'opt_3_1_b', 'Gastar sem controle e guardar apenas se por acaso sobrar alguma moeda no fim do mês', NULL, 2),
('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000007', 'opt_3_1_c', 'Esconder o dinheiro em locais inacessíveis para se esquecer de que ele existe', NULL, 3)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000007', '{"selected_option": "opt_3_1_a"}'::jsonb,
 'Excelente! Guardar uma quantia prioritária logo no início (pagar a si mesmo primeiro) é a chave do sucesso financeiro.',
 'Esperar o final do mês para ver se sobra quase nunca funciona. O segredo é estipular a meta e poupar logo no recebimento.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 3.2: Verdadeiro ou Falso
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000003', 'Reserva de Emergência', 'Manter uma reserva de emergência guardada ajuda a enfrentar imprevistos sem precisar contrair dívidas caras.', 'true_false', 2, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000008', '{"value": true}'::jsonb,
 'Correto! A reserva de emergência atua como um escudo protetor contra imprevistos de saúde, remédios ou consertos necessários.',
 'Essa afirmativa é verdadeira! Sem uma reserva de segurança, qualquer emergência cotidiana acaba forçando o uso de empréstimos.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 3.3: Correspondência (Matching)
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000003', 'Prazos de Poupança', 'Associe cada prazo financeiro ao seu objetivo correspondente:', 'matching', 3, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000009', 'left_3_3_1', 'Curto prazo (semanas ou meses)', 'left', 1),
('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000009', 'right_3_3_1', 'Comprar um livro desejado ou pagar um passeio escolar', 'right', 2),
('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000009', 'left_3_3_2', 'Médio prazo (1 a 2 anos)', 'left', 3),
('d0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000009', 'right_3_3_2', 'Fazer um curso técnico ou adquirir um computador de estudos', 'right', 4),
('d0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000009', 'left_3_3_3', 'Longo prazo (vários anos)', 'left', 5),
('d0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000009', 'right_3_3_3', 'Construir reserva de independência ou apoio universitário', 'right', 6)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000009',
 '{"matches": {"left_3_3_1": "right_3_3_1", "left_3_3_2": "right_3_3_2", "left_3_3_3": "right_3_3_3"}}'::jsonb,
 'Muito bem! Planejar o tempo correto para cada sonho ajuda a manter a disciplina e o foco na poupança.',
 'Revise as relações de tempo. Objetivos maiores e mais caros exigem horizontes mais longos de poupança.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- =============================================================================
-- LIÇÃO 4: ATIVIDADES
-- =============================================================================
-- Atividade 4.1: Múltipla Escolha
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000004', 'Registro de Gastos', 'Ao planejar gastos, qual é a principal vantagem de registrar as despesas diárias detalhadamente?', 'multiple_choice', 1, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000010', 'opt_4_1_a', 'Identificar vazamentos de pequenos gastos invisíveis e tomar decisões conscientes de economia', NULL, 1),
('d0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000010', 'opt_4_1_b', 'Fazer com que o dinheiro dobre de valor em conta automaticamente sem nenhum esforço', NULL, 2),
('d0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000010', 'opt_4_1_c', 'Bloquear todo e qualquer tipo de consumo pessoal no comércio local', NULL, 3)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000010', '{"selected_option": "opt_4_1_a"}'::jsonb,
 'Exato! Os pequenos gastos não anotados costumam ser os maiores responsáveis pelo descontrole financeiro no fim do mês.',
 'Anotar os gastos serve para dar consciência e controle sobre o próprio dinheiro, e não para render lucros mágicos.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 4.2: Verdadeiro ou Falso
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000004', 'Gastos Fixos e Variáveis', 'Despesas fixas ocorrem periodicamente com valores previsíveis, enquanto despesas variáveis oscilam conforme o uso ou ocasião.', 'true_false', 2, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000011', '{"value": true}'::jsonb,
 'Correto! Saber a diferença entre despesas fixas e variáveis é essencial para estruturar qualquer planejamento.',
 'Atenção: essa afirmação é verdadeira! Gastos fixos são regulares e previsíveis; gastos variáveis mudam de acordo com o consumo.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 4.3: Correspondência (Matching)
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000004', 'Tipos de Despesas', 'Associe o tipo de gasto ao seu exemplo prático do cotidiano:', 'matching', 3, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000012', 'left_4_3_1', 'Despesa fixa previsível', 'left', 1),
('d0000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000012', 'right_4_3_1', 'Mensalidade do plano de internet ou assinatura de estudos', 'right', 2),
('d0000000-0000-0000-0000-000000000033', 'c0000000-0000-0000-0000-000000000012', 'left_4_3_2', 'Despesa variável cotidiana', 'left', 3),
('d0000000-0000-0000-0000-000000000034', 'c0000000-0000-0000-0000-000000000012', 'right_4_3_2', 'Lanche com colegas de turma no final de semana', 'right', 4),
('d0000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000012', 'left_4_3_3', 'Despesa imprevista', 'left', 5),
('d0000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000012', 'right_4_3_3', 'Conserto de emergência da tela quebrada do celular', 'right', 6)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000012',
 '{"matches": {"left_4_3_1": "right_4_3_1", "left_4_3_2": "right_4_3_2", "left_4_3_3": "right_4_3_3"}}'::jsonb,
 'Excelente! Identificar com clareza cada tipo de despesa facilita a tomada de decisões no seu dia a dia.',
 'Verifique as relações. Pense na frequência de pagamento e na previsibilidade de cada situação.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- =============================================================================
-- LIÇÃO 5: ATIVIDADES
-- =============================================================================
-- Atividade 5.1: Múltipla Escolha
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000005', 'Equilíbrio Orçamentário', 'Em um orçamento pessoal equilibrado e saudável, qual deve ser a relação entre receitas e despesas?', 'multiple_choice', 1, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000037', 'c0000000-0000-0000-0000-000000000013', 'opt_5_1_a', 'As receitas totais devem ser maiores que as despesas, gerando saldo positivo para poupar', NULL, 1),
('d0000000-0000-0000-0000-000000000038', 'c0000000-0000-0000-0000-000000000013', 'opt_5_1_b', 'As despesas devem sempre superar os ganhos com auxílio de dívidas constantes', NULL, 2),
('d0000000-0000-0000-0000-000000000039', 'c0000000-0000-0000-0000-000000000013', 'opt_5_1_c', 'Gastar exatamente até o último centavo para terminar o mês com zero de saldo', NULL, 3)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000013', '{"selected_option": "opt_5_1_a"}'::jsonb,
 'Parabéns! Receitas superiores às despesas criam superávit (sobra saudável), permitindo poupar e investir para o futuro.',
 'O orçamento busca evitar que você gaste mais do que ganha, reservando recursos para proteção e metas futuras.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 5.2: Verdadeiro ou Falso
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000005', 'Flexibilidade do Orçamento', 'O orçamento financeiro é uma ferramenta flexível que pode ser revisada e ajustada conforme suas prioridades mudem.', 'true_false', 2, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000014', '{"value": true}'::jsonb,
 'Correto! O orçamento não é uma prisão, mas um guia orientador que evolui conforme sua renda e seus objetivos mudam.',
 'Essa afirmativa é verdadeira! Um orçamento flexível e realista tem muito mais chances de ser mantido a longo prazo.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

-- Atividade 5.3: Correspondência (Matching)
INSERT INTO public.activities (id, lesson_id, title, description, activity_type, position, is_active) VALUES
('c0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000005', 'Componentes do Orçamento', 'Relacione os elementos fundamentais de uma estrutura orçamentária:', 'matching', 3, true)
ON CONFLICT (lesson_id, position) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO public.activity_options (id, activity_id, option_key, option_text, side, position) VALUES
('d0000000-0000-0000-0000-000000000040', 'c0000000-0000-0000-0000-000000000015', 'left_5_3_1', 'Receitas', 'left', 1),
('d0000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000015', 'right_5_3_1', 'Todo dinheiro que entra (mesada, pequenos serviços, bolsas ou presentes)', 'right', 2),
('d0000000-0000-0000-0000-000000000042', 'c0000000-0000-0000-0000-000000000015', 'left_5_3_2', 'Despesas', 'left', 3),
('d0000000-0000-0000-0000-000000000043', 'c0000000-0000-0000-0000-000000000015', 'right_5_3_2', 'Todo dinheiro que sai para pagar necessidades e desejos', 'right', 4),
('d0000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000015', 'left_5_3_3', 'Superávit (saldo positivo)', 'left', 5),
('d0000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-000000000015', 'right_5_3_3', 'A diferença positiva que sobra quando as receitas superam os gastos', 'right', 6)
ON CONFLICT (activity_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

INSERT INTO public.activity_answer_keys (activity_id, correct_answer, feedback_correct, feedback_incorrect) VALUES
('c0000000-0000-0000-0000-000000000015',
 '{"matches": {"left_5_3_1": "right_5_3_1", "left_5_3_2": "right_5_3_2", "left_5_3_3": "right_5_3_3"}}'::jsonb,
 'Sensacional! Você compreendeu todos os pilares essenciais para montar e gerenciar um orçamento com maestria.',
 'Revise as definições fundamentais: receitas são entradas, despesas são saídas e superávit é o saldo positivo.')
ON CONFLICT (activity_id) DO UPDATE SET correct_answer = EXCLUDED.correct_answer, feedback_correct = EXCLUDED.feedback_correct, feedback_incorrect = EXCLUDED.feedback_incorrect;

