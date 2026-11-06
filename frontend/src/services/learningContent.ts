/**
 * EduCash — Conteúdo Pedagógico Canônico e Estruturas de Lições (MVP 1)
 * Espelha fielmente o seed oficial de banco de dados (Fase 2: 20261104180003_04_seed_data.sql)
 */

import { LessonSummaryItem, LessonDetail, LevelInfo, UserAchievementItem, ActivityType } from '../types/learning';

export const APPROVED_LEVELS: LevelInfo[] = [
  { level: 1, name: 'Iniciante', min_xp: 0 },
  { level: 2, name: 'Aprendiz', min_xp: 40 },
  { level: 3, name: 'Explorador', min_xp: 90 },
  { level: 4, name: 'Planejador', min_xp: 150 },
  { level: 5, name: 'Especialista', min_xp: 220 },
];

export const APPROVED_ACHIEVEMENTS: Record<string, UserAchievementItem> = {
  primeiros_passos: {
    id: 'primeiros_passos',
    name: 'Primeiros passos',
    description: 'Completou a primeira atividade com resposta correta.',
  },
  aprendiz_dedicado: {
    id: 'aprendiz_dedicado',
    name: 'Aprendiz dedicado',
    description: 'Completou com sucesso a primeira lição com todas as atividades obrigatórias.',
  },
  conhecimento_em_evolucao: {
    id: 'conhecimento_em_evolucao',
    name: 'Conhecimento em evolução',
    description: 'Completou com sucesso três lições da trilha educacional.',
  },
  guardiao_das_economias: {
    id: 'guardiao_das_economias',
    name: 'Guardião das economias',
    description: 'Acumulou 50 moedas através de atividades e conclusões de lições.',
  },
  jornada_completa: {
    id: 'jornada_completa',
    name: 'Jornada completa',
    description: 'Concluiu com sucesso todas as cinco lições do programa EduCash.',
  },
};

/**
 * 5 Lições aprovadas do EduCash (Catálogo Geral da Trilha)
 */
export const INITIAL_LESSONS_CATALOG: LessonSummaryItem[] = [
  {
    lesson_id: 'b0000000-0000-0000-0000-000000000001',
    learning_path_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'O que é dinheiro?',
    description: 'Compreenda a origem, a evolução histórica e as funções essenciais do dinheiro na sociedade.',
    position: 1,
    is_unlocked: true,
    is_completed: false,
    completed_activities_count: 0,
    total_activities_count: 3,
  },
  {
    lesson_id: 'b0000000-0000-0000-0000-000000000002',
    learning_path_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Necessidades e Desejos',
    description: 'Aprenda a distinguir o que é essencial para viver bem daquilo que são vontades e confortos adicionais.',
    position: 2,
    is_unlocked: false,
    is_completed: false,
    completed_activities_count: 0,
    total_activities_count: 3,
  },
  {
    lesson_id: 'b0000000-0000-0000-0000-000000000003',
    learning_path_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Como economizar?',
    description: 'Descubra como transformar o hábito de guardar dinheiro em conquistas reais e segurança.',
    position: 3,
    is_unlocked: false,
    is_completed: false,
    completed_activities_count: 0,
    total_activities_count: 3,
  },
  {
    lesson_id: 'b0000000-0000-0000-0000-000000000004',
    learning_path_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Planejando meus gastos',
    description: 'Tenha controle total das suas despesas e elimine desperdícios através do registro financeiro.',
    position: 4,
    is_unlocked: false,
    is_completed: false,
    completed_activities_count: 0,
    total_activities_count: 3,
  },
  {
    lesson_id: 'b0000000-0000-0000-0000-000000000005',
    learning_path_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Meu primeiro orçamento',
    description: 'Construa e mantenha um orçamento equilibrado com receitas, despesas e poupança.',
    position: 5,
    is_unlocked: false,
    is_completed: false,
    completed_activities_count: 0,
    total_activities_count: 3,
  },
];

/**
 * =============================================================================
 * DETALHES DAS 5 LIÇÕES E 15 ATIVIDADES PEDAGÓGICAS (ESPELHO DO SEED SQL)
 * =============================================================================
 */

// Lição 1: O que é dinheiro?
export const LESSON_1_DETAIL: LessonDetail = {
  id: 'b0000000-0000-0000-0000-000000000001',
  learning_path_id: 'a0000000-0000-0000-0000-000000000001',
  title: 'O que é dinheiro?',
  description: 'Compreenda a origem, a evolução histórica e as três funções essenciais do dinheiro na economia.',
  introduction:
    'O dinheiro é uma invenção humana criada para facilitar a troca de produtos e serviços. Antes dele, as pessoas dependiam do escambo, trocando mercadorias diretamente.',
  practical_example:
    'Imagine que Sofia tem um livro e quer trocá-lo por um jogo. Lucas tem o jogo, mas quer uma bola. Sem o dinheiro, ninguém conseguiria o que quer! Com o dinheiro, Sofia vende o livro para quem quer ler e usa o valor para comprar o jogo de Lucas, facilitando a vida de todos.',
  conclusion:
    'O dinheiro cumpre três papéis fundamentais: é meio de troca, medida de valor para comparar preços e reserva de valor para guardar e usar no futuro.',
  position: 1,
  is_active: true,
  is_unlocked: true,
  is_completed: false,
  activities: [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      lesson_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Função do Dinheiro',
      description: 'Qual é a principal função do dinheiro na sociedade moderna?',
      activity_type: 'multiple_choice',
      position: 1,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000001',
          activity_id: 'c0000000-0000-0000-0000-000000000001',
          option_key: 'opt_1_1_a',
          option_text: 'Servir como meio universal de troca para compra e venda de bens e serviços',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000002',
          activity_id: 'c0000000-0000-0000-0000-000000000001',
          option_key: 'opt_1_1_b',
          option_text: 'Ser colecionado exclusivamente como peça histórica sem circulação comercial',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000003',
          activity_id: 'c0000000-0000-0000-0000-000000000001',
          option_key: 'opt_1_1_c',
          option_text: 'Eliminar a necessidade de qualquer trabalho ou produção na economia',
          position: 3,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      lesson_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Origem do Comércio',
      description: 'Antes da invenção de moedas e cédulas, o comércio funcionava por meio do escambo (troca direta de mercadorias).',
      activity_type: 'true_false',
      position: 2,
      is_active: true,
      options: [
        {
          id: 'd_tf_true',
          activity_id: 'c0000000-0000-0000-0000-000000000002',
          option_key: 'true',
          option_text: 'Verdadeiro',
          position: 1,
        },
        {
          id: 'd_tf_false',
          activity_id: 'c0000000-0000-0000-0000-000000000002',
          option_key: 'false',
          option_text: 'Falso',
          position: 2,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      lesson_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Evolução do Dinheiro',
      description: 'Relacione cada formato histórico de dinheiro à sua respectiva característica:',
      activity_type: 'matching',
      position: 3,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000004',
          activity_id: 'c0000000-0000-0000-0000-000000000003',
          option_key: 'left_1_3_1',
          option_text: 'Moedas de metal',
          side: 'left',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000005',
          activity_id: 'c0000000-0000-0000-0000-000000000003',
          option_key: 'right_1_3_1',
          option_text: 'Primeiras formas padronizadas com peso e valor oficial garantidos',
          side: 'right',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000006',
          activity_id: 'c0000000-0000-0000-0000-000000000003',
          option_key: 'left_1_3_2',
          option_text: 'Cédulas de papel',
          side: 'left',
          position: 3,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000007',
          activity_id: 'c0000000-0000-0000-0000-000000000003',
          option_key: 'right_1_3_2',
          option_text: 'Notas criadas para facilitar o transporte seguro de quantias maiores',
          side: 'right',
          position: 4,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000008',
          activity_id: 'c0000000-0000-0000-0000-000000000003',
          option_key: 'left_1_3_3',
          option_text: 'Dinheiro digital e Pix',
          side: 'left',
          position: 5,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000009',
          activity_id: 'c0000000-0000-0000-0000-000000000003',
          option_key: 'right_1_3_3',
          option_text: 'Movimentações eletrônicas instantâneas sem uso de cédulas físicas',
          side: 'right',
          position: 6,
        },
      ],
    },
  ],
};

// Lição 2: Necessidades e Desejos
export const LESSON_2_DETAIL: LessonDetail = {
  id: 'b0000000-0000-0000-0000-000000000002',
  learning_path_id: 'a0000000-0000-0000-0000-000000000001',
  title: 'Necessidades e Desejos',
  description: 'Aprenda a distinguir o que é essencial para viver bem daquilo que são vontades e confortos adicionais.',
  introduction:
    'Necessidades são itens indispensáveis para nossa sobrevivência, saúde e desenvolvimento básico. Desejos são coisas que gostaríamos de ter para maior conforto, diversão ou estilo.',
  practical_example:
    'Alimentação equilibrada e moradia são necessidades universais. Um videogame de última geração é um desejo. Importante: para um entregador ou jovem que estuda à distância, uma bicicleta ou computador pode se tornar necessidade de trabalho ou estudo. As prioridades dependem da realidade de cada um!',
  conclusion:
    'Não há problema em realizar desejos! O segredo de uma boa saúde financeira é garantir que as necessidades básicas venham em primeiro lugar, planejando os desejos com calma.',
  position: 2,
  is_active: true,
  is_unlocked: false,
  is_completed: false,
  activities: [
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      lesson_id: 'b0000000-0000-0000-0000-000000000002',
      title: 'Diferenciação de Gastos',
      description: 'Por que é importante diferenciar necessidades de desejos ao organizar o dinheiro?',
      activity_type: 'multiple_choice',
      position: 1,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000010',
          activity_id: 'c0000000-0000-0000-0000-000000000004',
          option_key: 'opt_2_1_a',
          option_text: 'Para priorizar o essencial e garantir a segurança antes de gastar com vontades secundárias',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000011',
          activity_id: 'c0000000-0000-0000-0000-000000000004',
          option_key: 'opt_2_1_b',
          option_text: 'Para proibir terminantemente qualquer gasto com lazer ou entretenimento',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000012',
          activity_id: 'c0000000-0000-0000-0000-000000000004',
          option_key: 'opt_2_1_c',
          option_text: 'Porque desejos não trazem satisfação e devem ser sempre ignorados',
          position: 3,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000005',
      lesson_id: 'b0000000-0000-0000-0000-000000000002',
      title: 'Contexto Individual',
      description: 'A classificação de um item como necessidade ou desejo pode variar dependendo da realidade e circunstâncias de cada pessoa.',
      activity_type: 'true_false',
      position: 2,
      is_active: true,
      options: [
        {
          id: 'd_tf_true',
          activity_id: 'c0000000-0000-0000-0000-000000000005',
          option_key: 'true',
          option_text: 'Verdadeiro',
          position: 1,
        },
        {
          id: 'd_tf_false',
          activity_id: 'c0000000-0000-0000-0000-000000000005',
          option_key: 'false',
          option_text: 'Falso',
          position: 2,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000006',
      lesson_id: 'b0000000-0000-0000-0000-000000000002',
      title: 'Prioridades Financeiras',
      description: 'Classifique cada item conforme sua prioridade no cotidiano:',
      activity_type: 'matching',
      position: 3,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000013',
          activity_id: 'c0000000-0000-0000-0000-000000000006',
          option_key: 'left_2_3_1',
          option_text: 'Alimentação saudável e água',
          side: 'left',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000014',
          activity_id: 'c0000000-0000-0000-0000-000000000006',
          option_key: 'right_2_3_1',
          option_text: 'Necessidade indispensável para a saúde e sobrevivência',
          side: 'right',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000015',
          activity_id: 'c0000000-0000-0000-0000-000000000006',
          option_key: 'left_2_3_2',
          option_text: 'Material escolar para aulas',
          side: 'left',
          position: 3,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000016',
          activity_id: 'c0000000-0000-0000-0000-000000000006',
          option_key: 'right_2_3_2',
          option_text: 'Necessidade educacional fundamental para o desenvolvimento',
          side: 'right',
          position: 4,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000017',
          activity_id: 'c0000000-0000-0000-0000-000000000006',
          option_key: 'left_2_3_3',
          option_text: 'Skin cosmética de videogame',
          side: 'left',
          position: 5,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000018',
          activity_id: 'c0000000-0000-0000-0000-000000000006',
          option_key: 'right_2_3_3',
          option_text: 'Desejo de lazer que pode aguardar momento oportuno',
          side: 'right',
          position: 6,
        },
      ],
    },
  ],
};

// Lição 3: Como economizar? (Como poupar?)
export const LESSON_3_DETAIL: LessonDetail = {
  id: 'b0000000-0000-0000-0000-000000000003',
  learning_path_id: 'a0000000-0000-0000-0000-000000000001',
  title: 'Como economizar?',
  description: 'Descubra como transformar o hábito de guardar dinheiro em conquistas reais e segurança.',
  introduction:
    'Poupar significa guardar com planejamento uma parte dos recursos que você recebe em vez de gastar tudo de imediato. Não é sobre o que sobra, mas sobre priorizar seus objetivos.',
  practical_example:
    'Mateus quer comprar um fone de ouvido de R$ 60. Em vez de gastar todo o dinheiro que ganha com lanches rápidos, ele decide separar R$ 10 toda semana. Em apenas 6 semanas ele compra o fone à vista, sem se endividar nem pagar juros.',
  conclusion:
    'Poupar com constância cria independência, protege você em emergências inesperadas e permite realizar planos de curto, médio e longo prazo.',
  position: 3,
  is_active: true,
  is_unlocked: false,
  is_completed: false,
  activities: [
    {
      id: 'c0000000-0000-0000-0000-000000000007',
      lesson_id: 'b0000000-0000-0000-0000-000000000003',
      title: 'Hábito de Poupar',
      description: 'Qual é a estratégia recomendada para criar o hábito constante de poupar dinheiro?',
      activity_type: 'multiple_choice',
      position: 1,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000019',
          activity_id: 'c0000000-0000-0000-0000-000000000007',
          option_key: 'opt_3_1_a',
          option_text: 'Definir uma meta clara e poupar uma quantia regular logo ao receber o dinheiro',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000020',
          activity_id: 'c0000000-0000-0000-0000-000000000007',
          option_key: 'opt_3_1_b',
          option_text: 'Gastar sem controle e guardar apenas se por acaso sobrar alguma moeda no fim do mês',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000021',
          activity_id: 'c0000000-0000-0000-0000-000000000007',
          option_key: 'opt_3_1_c',
          option_text: 'Esconder o dinheiro em locais inacessíveis para se esquecer de que ele existe',
          position: 3,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000008',
      lesson_id: 'b0000000-0000-0000-0000-000000000003',
      title: 'Reserva de Emergência',
      description: 'Manter uma reserva de emergência guardada ajuda a enfrentar imprevistos sem precisar contrair dívidas caras.',
      activity_type: 'true_false',
      position: 2,
      is_active: true,
      options: [
        {
          id: 'd_tf_true',
          activity_id: 'c0000000-0000-0000-0000-000000000008',
          option_key: 'true',
          option_text: 'Verdadeiro',
          position: 1,
        },
        {
          id: 'd_tf_false',
          activity_id: 'c0000000-0000-0000-0000-000000000008',
          option_key: 'false',
          option_text: 'Falso',
          position: 2,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000009',
      lesson_id: 'b0000000-0000-0000-0000-000000000003',
      title: 'Prazos de Poupança',
      description: 'Associe cada prazo financeiro ao seu objetivo correspondente:',
      activity_type: 'matching',
      position: 3,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000022',
          activity_id: 'c0000000-0000-0000-0000-000000000009',
          option_key: 'left_3_3_1',
          option_text: 'Curto prazo (semanas ou meses)',
          side: 'left',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000023',
          activity_id: 'c0000000-0000-0000-0000-000000000009',
          option_key: 'right_3_3_1',
          option_text: 'Comprar um livro desejado ou pagar um passeio escolar',
          side: 'right',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000024',
          activity_id: 'c0000000-0000-0000-0000-000000000009',
          option_key: 'left_3_3_2',
          option_text: 'Médio prazo (1 a 2 anos)',
          side: 'left',
          position: 3,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000025',
          activity_id: 'c0000000-0000-0000-0000-000000000009',
          option_key: 'right_3_3_2',
          option_text: 'Fazer um curso técnico ou adquirir um computador de estudos',
          side: 'right',
          position: 4,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000026',
          activity_id: 'c0000000-0000-0000-0000-000000000009',
          option_key: 'left_3_3_3',
          option_text: 'Longo prazo (vários anos)',
          side: 'left',
          position: 5,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000027',
          activity_id: 'c0000000-0000-0000-0000-000000000009',
          option_key: 'right_3_3_3',
          option_text: 'Construir reserva de independência ou apoio universitário',
          side: 'right',
          position: 6,
        },
      ],
    },
  ],
};

// Lição 4: Planejando meus gastos
export const LESSON_4_DETAIL: LessonDetail = {
  id: 'b0000000-0000-0000-0000-000000000004',
  learning_path_id: 'a0000000-0000-0000-0000-000000000001',
  title: 'Planejando meus gastos',
  description: 'Tenha controle total das suas despesas e elimine desperdícios através do registro financeiro.',
  introduction:
    'O planejamento financeiro consiste em acompanhar todas as entradas e saídas de dinheiro. Registrar gastos diariamente evita a sensação de que o dinheiro sumiu sem você perceber.',
  practical_example:
    'Juliana recebia R$ 80 no mês e no meio do período já estava sem saldo. Ao anotar cada cafezinho, doce e passagem durante duas semanas, descobriu que lanchinhos diários somavam R$ 45. Ajustando esses hábitos, sobrou dinheiro para o passeio de fim de semana.',
  conclusion:
    'Identificar despesas fixas, variáveis e gastos invisíveis dá a você o poder de fazer escolhas conscientes e evitar dívidas.',
  position: 4,
  is_active: true,
  is_unlocked: false,
  is_completed: false,
  activities: [
    {
      id: 'c0000000-0000-0000-0000-000000000010',
      lesson_id: 'b0000000-0000-0000-0000-000000000004',
      title: 'Registro de Gastos',
      description: 'Ao planejar gastos, qual é a principal vantagem de registrar as despesas diárias detalhadamente?',
      activity_type: 'multiple_choice',
      position: 1,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000028',
          activity_id: 'c0000000-0000-0000-0000-000000000010',
          option_key: 'opt_4_1_a',
          option_text: 'Identificar vazamentos de pequenos gastos invisíveis e tomar decisões conscientes de economia',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000029',
          activity_id: 'c0000000-0000-0000-0000-000000000010',
          option_key: 'opt_4_1_b',
          option_text: 'Fazer com que o dinheiro dobre de valor em conta automaticamente sem nenhum esforço',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000030',
          activity_id: 'c0000000-0000-0000-0000-000000000010',
          option_key: 'opt_4_1_c',
          option_text: 'Bloquear todo e qualquer tipo de consumo pessoal no comércio local',
          position: 3,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000011',
      lesson_id: 'b0000000-0000-0000-0000-000000000004',
      title: 'Gastos Fixos e Variáveis',
      description: 'Despesas fixas ocorrem periodicamente com valores previsíveis, enquanto despesas variáveis oscilam conforme o uso ou ocasião.',
      activity_type: 'true_false',
      position: 2,
      is_active: true,
      options: [
        {
          id: 'd_tf_true',
          activity_id: 'c0000000-0000-0000-0000-000000000011',
          option_key: 'true',
          option_text: 'Verdadeiro',
          position: 1,
        },
        {
          id: 'd_tf_false',
          activity_id: 'c0000000-0000-0000-0000-000000000011',
          option_key: 'false',
          option_text: 'Falso',
          position: 2,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000012',
      lesson_id: 'b0000000-0000-0000-0000-000000000004',
      title: 'Tipos de Despesas',
      description: 'Associe o tipo de gasto ao seu exemplo prático do cotidiano:',
      activity_type: 'matching',
      position: 3,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000031',
          activity_id: 'c0000000-0000-0000-0000-000000000012',
          option_key: 'left_4_3_1',
          option_text: 'Despesa fixa previsível',
          side: 'left',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000032',
          activity_id: 'c0000000-0000-0000-0000-000000000012',
          option_key: 'right_4_3_1',
          option_text: 'Mensalidade do plano de internet ou assinatura de estudos',
          side: 'right',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000033',
          activity_id: 'c0000000-0000-0000-0000-000000000012',
          option_key: 'left_4_3_2',
          option_text: 'Despesa variável cotidiana',
          side: 'left',
          position: 3,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000034',
          activity_id: 'c0000000-0000-0000-0000-000000000012',
          option_key: 'right_4_3_2',
          option_text: 'Lanche com colegas de turma no final de semana',
          side: 'right',
          position: 4,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000035',
          activity_id: 'c0000000-0000-0000-0000-000000000012',
          option_key: 'left_4_3_3',
          option_text: 'Despesa imprevista',
          side: 'left',
          position: 5,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000036',
          activity_id: 'c0000000-0000-0000-0000-000000000012',
          option_key: 'right_4_3_3',
          option_text: 'Conserto de emergência da tela quebrada do celular',
          side: 'right',
          position: 6,
        },
      ],
    },
  ],
};

// Lição 5: Meu primeiro orçamento
export const LESSON_5_DETAIL: LessonDetail = {
  id: 'b0000000-0000-0000-0000-000000000005',
  learning_path_id: 'a0000000-0000-0000-0000-000000000001',
  title: 'Meu primeiro orçamento',
  description: 'Construa e mantenha um orçamento equilibrado com receitas, despesas e poupança.',
  introduction:
    'O orçamento é a ferramenta que organiza suas finanças em um período. Ele confronta tudo o que você ganha (receitas) com tudo o que pretende gastar (despesas) e poupar.',
  practical_example:
    'Thiago planejou seu primeiro mês: com R$ 100 de receitas, destinou R$ 50 para necessidades essenciais (transporte e cópias), R$ 30 para desejos (lazer) e R$ 20 direto para a poupança do skate. No fim do mês, todas as contas estavam pagas e o skate mais perto!',
  conclusion:
    'Um orçamento sustentável mantém as despesas menores que as receitas, gerando um saldo positivo que garante tranquilidade e liberdade para o seu futuro.',
  position: 5,
  is_active: true,
  is_unlocked: false,
  is_completed: false,
  activities: [
    {
      id: 'c0000000-0000-0000-0000-000000000013',
      lesson_id: 'b0000000-0000-0000-0000-000000000005',
      title: 'Equilíbrio Orçamentário',
      description: 'Em um orçamento pessoal equilibrado e saudável, qual deve ser a relação entre receitas e despesas?',
      activity_type: 'multiple_choice',
      position: 1,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000037',
          activity_id: 'c0000000-0000-0000-0000-000000000013',
          option_key: 'opt_5_1_a',
          option_text: 'As receitas totais devem ser maiores que as despesas, gerando saldo positivo para poupar',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000038',
          activity_id: 'c0000000-0000-0000-0000-000000000013',
          option_key: 'opt_5_1_b',
          option_text: 'As despesas devem sempre superar os ganhos com auxílio de dívidas constantes',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000039',
          activity_id: 'c0000000-0000-0000-0000-000000000013',
          option_key: 'opt_5_1_c',
          option_text: 'Gastar exatamente até o último centavo para terminar o mês com zero de saldo',
          position: 3,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000014',
      lesson_id: 'b0000000-0000-0000-0000-000000000005',
      title: 'Flexibilidade do Orçamento',
      description: 'O orçamento financeiro é uma ferramenta flexível que pode ser revisada e ajustada conforme suas prioridades mudem.',
      activity_type: 'true_false',
      position: 2,
      is_active: true,
      options: [
        {
          id: 'd_tf_true',
          activity_id: 'c0000000-0000-0000-0000-000000000014',
          option_key: 'true',
          option_text: 'Verdadeiro',
          position: 1,
        },
        {
          id: 'd_tf_false',
          activity_id: 'c0000000-0000-0000-0000-000000000014',
          option_key: 'false',
          option_text: 'Falso',
          position: 2,
        },
      ],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000015',
      lesson_id: 'b0000000-0000-0000-0000-000000000005',
      title: 'Componentes do Orçamento',
      description: 'Relacione os elementos fundamentais de uma estrutura orçamentária:',
      activity_type: 'matching',
      position: 3,
      is_active: true,
      options: [
        {
          id: 'd0000000-0000-0000-0000-000000000040',
          activity_id: 'c0000000-0000-0000-0000-000000000015',
          option_key: 'left_5_3_1',
          option_text: 'Receitas',
          side: 'left',
          position: 1,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000041',
          activity_id: 'c0000000-0000-0000-0000-000000000015',
          option_key: 'right_5_3_1',
          option_text: 'Todo dinheiro que entra (mesada, pequenos serviços, bolsas ou presentes)',
          side: 'right',
          position: 2,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000042',
          activity_id: 'c0000000-0000-0000-0000-000000000015',
          option_key: 'left_5_3_2',
          option_text: 'Despesas',
          side: 'left',
          position: 3,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000043',
          activity_id: 'c0000000-0000-0000-0000-000000000015',
          option_key: 'right_5_3_2',
          option_text: 'Todo dinheiro que sai para pagar necessidades e desejos',
          side: 'right',
          position: 4,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000044',
          activity_id: 'c0000000-0000-0000-0000-000000000015',
          option_key: 'left_5_3_3',
          option_text: 'Superávit (saldo positivo)',
          side: 'left',
          position: 5,
        },
        {
          id: 'd0000000-0000-0000-0000-000000000045',
          activity_id: 'c0000000-0000-0000-0000-000000000015',
          option_key: 'right_5_3_3',
          option_text: 'A diferença positiva que sobra quando as receitas superam os gastos',
          side: 'right',
          position: 6,
        },
      ],
    },
  ],
};

/**
 * Array com os detalhes de todas as 5 lições
 */
export const ALL_LESSONS_DETAILS: LessonDetail[] = [
  LESSON_1_DETAIL,
  LESSON_2_DETAIL,
  LESSON_3_DETAIL,
  LESSON_4_DETAIL,
  LESSON_5_DETAIL,
];

/**
 * Dicionário mapeando IDs (UUID) e posições ('1' a '5') para seus respectivos LessonDetail
 */
export const LESSON_DETAILS_MAP: Record<string, LessonDetail> = {
  [LESSON_1_DETAIL.id]: LESSON_1_DETAIL,
  '1': LESSON_1_DETAIL,
  [LESSON_2_DETAIL.id]: LESSON_2_DETAIL,
  '2': LESSON_2_DETAIL,
  [LESSON_3_DETAIL.id]: LESSON_3_DETAIL,
  '3': LESSON_3_DETAIL,
  [LESSON_4_DETAIL.id]: LESSON_4_DETAIL,
  '4': LESSON_4_DETAIL,
  [LESSON_5_DETAIL.id]: LESSON_5_DETAIL,
  '5': LESSON_5_DETAIL,
};

/**
 * =============================================================================
 * GABARITOS CONFIDENCIAIS E FEEDBACKS DO MOTOR DE DEMONSTRAÇÃO LOCAL
 * =============================================================================
 * Utilizado exclusivamente por learningService.submitActivityAnswer no modo demo.
 * Não é exposto ao componente LessonPage antes da submissão da resposta.
 */
export interface DemoActivityAnswerKey {
  activityId: string;
  lessonId: string;
  activityType: ActivityType;
  correctAnswer: any;
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

export const DEMO_ANSWER_KEYS: Record<string, DemoActivityAnswerKey> = {
  // Lição 1
  'c0000000-0000-0000-0000-000000000001': {
    activityId: 'c0000000-0000-0000-0000-000000000001',
    lessonId: 'b0000000-0000-0000-0000-000000000001',
    activityType: 'multiple_choice',
    correctAnswer: { selected_option: 'opt_1_1_a' },
    feedbackCorrect:
      'Excelente! O dinheiro foi criado para funcionar como um meio de troca universalmente aceito, superando as limitações do escambo.',
    feedbackIncorrect:
      'Não é essa a resposta. A função essencial do dinheiro é facilitar as trocas comerciais do cotidiano de forma prática e padronizada.',
  },
  'c0000000-0000-0000-0000-000000000002': {
    activityId: 'c0000000-0000-0000-0000-000000000002',
    lessonId: 'b0000000-0000-0000-0000-000000000001',
    activityType: 'true_false',
    correctAnswer: { value: true },
    feedbackCorrect:
      'Correto! Durante muitos séculos, pessoas trocavam diretamente grãos, sal, animais e tecidos por outras mercadorias que precisavam.',
    feedbackIncorrect:
      'Atenção: a afirmação é verdadeira! O escambo foi a forma predominante de comércio antes da padronização das primeiras moedas.',
  },
  'c0000000-0000-0000-0000-000000000003': {
    activityId: 'c0000000-0000-0000-0000-000000000003',
    lessonId: 'b0000000-0000-0000-0000-000000000001',
    activityType: 'matching',
    correctAnswer: {
      matches: {
        left_1_3_1: 'right_1_3_1',
        left_1_3_2: 'right_1_3_2',
        left_1_3_3: 'right_1_3_3',
      },
    },
    feedbackCorrect:
      'Muito bem! Você compreendeu perfeitamente a evolução prática do dinheiro desde as moedas até as transações digitais.',
    feedbackIncorrect:
      'Revise as correspondências. Lembre-se do contexto histórico e prático de cada meio de pagamento.',
  },

  // Lição 2
  'c0000000-0000-0000-0000-000000000004': {
    activityId: 'c0000000-0000-0000-0000-000000000004',
    lessonId: 'b0000000-0000-0000-0000-000000000002',
    activityType: 'multiple_choice',
    correctAnswer: { selected_option: 'opt_2_1_a' },
    feedbackCorrect:
      'Exato! A priorização garante que o que é básico para a vida seja atendido com tranquilidade, permitindo planejar os desejos.',
    feedbackIncorrect:
      'O foco da educação financeira não é proibir a diversão, mas sim assegurar que o essencial seja atendido primeiro.',
  },
  'c0000000-0000-0000-0000-000000000005': {
    activityId: 'c0000000-0000-0000-0000-000000000005',
    lessonId: 'b0000000-0000-0000-0000-000000000002',
    activityType: 'true_false',
    correctAnswer: { value: true },
    feedbackCorrect:
      'Correto! Um computador ou transporte pode ser ferramenta indispensável para o estudo ou sustento de uma família, enquanto para outros pode ser lazer.',
    feedbackIncorrect:
      'Atenção: essa afirmação é verdadeira! Não existem listas engessadas; a realidade e as necessidades de cada indivíduo devem ser respeitadas.',
  },
  'c0000000-0000-0000-0000-000000000006': {
    activityId: 'c0000000-0000-0000-0000-000000000006',
    lessonId: 'b0000000-0000-0000-0000-000000000002',
    activityType: 'matching',
    correctAnswer: {
      matches: {
        left_2_3_1: 'right_2_3_1',
        left_2_3_2: 'right_2_3_2',
        left_2_3_3: 'right_2_3_3',
      },
    },
    feedbackCorrect:
      'Parabéns! Você soube ponderar o que é essencial à saúde e ao aprendizado diante de itens de lazer puro.',
    feedbackIncorrect:
      'Verifique novamente as correspondências considerando o impacto real de cada item no bem-estar.',
  },

  // Lição 3
  'c0000000-0000-0000-0000-000000000007': {
    activityId: 'c0000000-0000-0000-0000-000000000007',
    lessonId: 'b0000000-0000-0000-0000-000000000003',
    activityType: 'multiple_choice',
    correctAnswer: { selected_option: 'opt_3_1_a' },
    feedbackCorrect:
      'Excelente! Guardar uma quantia prioritária logo no início (pagar a si mesmo primeiro) é a chave do sucesso financeiro.',
    feedbackIncorrect:
      'Esperar o final do mês para ver se sobra quase nunca funciona. O segredo é estipular a meta e poupar logo no recebimento.',
  },
  'c0000000-0000-0000-0000-000000000008': {
    activityId: 'c0000000-0000-0000-0000-000000000008',
    lessonId: 'b0000000-0000-0000-0000-000000000003',
    activityType: 'true_false',
    correctAnswer: { value: true },
    feedbackCorrect:
      'Correto! A reserva de emergência atua como um escudo protetor contra imprevistos de saúde, remédios ou consertos necessários.',
    feedbackIncorrect:
      'Essa afirmativa é verdadeira! Sem uma reserva de segurança, qualquer emergência cotidiana acaba forçando o uso de empréstimos.',
  },
  'c0000000-0000-0000-0000-000000000009': {
    activityId: 'c0000000-0000-0000-0000-000000000009',
    lessonId: 'b0000000-0000-0000-0000-000000000003',
    activityType: 'matching',
    correctAnswer: {
      matches: {
        left_3_3_1: 'right_3_3_1',
        left_3_3_2: 'right_3_3_2',
        left_3_3_3: 'right_3_3_3',
      },
    },
    feedbackCorrect:
      'Muito bem! Planejar o tempo correto para cada sonho ajuda a manter a disciplina e o foco na poupança.',
    feedbackIncorrect:
      'Revise as relações de tempo. Objetivos maiores e mais caros exigem horizontes mais longos de poupança.',
  },

  // Lição 4
  'c0000000-0000-0000-0000-000000000010': {
    activityId: 'c0000000-0000-0000-0000-000000000010',
    lessonId: 'b0000000-0000-0000-0000-000000000004',
    activityType: 'multiple_choice',
    correctAnswer: { selected_option: 'opt_4_1_a' },
    feedbackCorrect:
      'Exato! Os pequenos gastos não anotados costumam ser os maiores responsáveis pelo descontrole financeiro no fim do mês.',
    feedbackIncorrect:
      'Anotar os gastos serve para dar consciência e controle sobre o próprio dinheiro, e não para render lucros mágicos.',
  },
  'c0000000-0000-0000-0000-000000000011': {
    activityId: 'c0000000-0000-0000-0000-000000000011',
    lessonId: 'b0000000-0000-0000-0000-000000000004',
    activityType: 'true_false',
    correctAnswer: { value: true },
    feedbackCorrect:
      'Correto! Saber a diferença entre despesas fixas e variáveis é essencial para estruturar qualquer planejamento.',
    feedbackIncorrect:
      'Atenção: essa afirmação é verdadeira! Gastos fixos são regulares e previsíveis; gastos variáveis mudam de acordo com o consumo.',
  },
  'c0000000-0000-0000-0000-000000000012': {
    activityId: 'c0000000-0000-0000-0000-000000000012',
    lessonId: 'b0000000-0000-0000-0000-000000000004',
    activityType: 'matching',
    correctAnswer: {
      matches: {
        left_4_3_1: 'right_4_3_1',
        left_4_3_2: 'right_4_3_2',
        left_4_3_3: 'right_4_3_3',
      },
    },
    feedbackCorrect:
      'Excelente! Identificar com clareza cada tipo de despesa facilita a tomada de decisões no seu dia a dia.',
    feedbackIncorrect:
      'Verifique as relações. Pense na frequência de pagamento e na previsibilidade de cada situação.',
  },

  // Lição 5
  'c0000000-0000-0000-0000-000000000013': {
    activityId: 'c0000000-0000-0000-0000-000000000013',
    lessonId: 'b0000000-0000-0000-0000-000000000005',
    activityType: 'multiple_choice',
    correctAnswer: { selected_option: 'opt_5_1_a' },
    feedbackCorrect:
      'Parabéns! Receitas superiores às despesas criam superávit (sobra saudável), permitindo poupar e investir para o futuro.',
    feedbackIncorrect:
      'O orçamento busca evitar que você gaste mais do que ganha, reservando recursos para proteção e metas futuras.',
  },
  'c0000000-0000-0000-0000-000000000014': {
    activityId: 'c0000000-0000-0000-0000-000000000014',
    lessonId: 'b0000000-0000-0000-0000-000000000005',
    activityType: 'true_false',
    correctAnswer: { value: true },
    feedbackCorrect:
      'Correto! O orçamento não é uma prisão, mas um guia orientador que evolui conforme sua renda e seus objetivos mudam.',
    feedbackIncorrect:
      'Essa afirmativa é verdadeira! Um orçamento flexível e realista tem muito mais chances de ser mantido a longo prazo.',
  },
  'c0000000-0000-0000-0000-000000000015': {
    activityId: 'c0000000-0000-0000-0000-000000000015',
    lessonId: 'b0000000-0000-0000-0000-000000000005',
    activityType: 'matching',
    correctAnswer: {
      matches: {
        left_5_3_1: 'right_5_3_1',
        left_5_3_2: 'right_5_3_2',
        left_5_3_3: 'right_5_3_3',
      },
    },
    feedbackCorrect:
      'Sensacional! Você compreendeu todos os pilares essenciais para montar e gerenciar um orçamento com maestria.',
    feedbackIncorrect:
      'Revise as definições fundamentais: receitas são entradas, despesas são saídas e superávit é o saldo positivo.',
  },
};
