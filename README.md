# EduCash — Educação Financeira para Crianças e Adolescentes

O **EduCash** é uma aplicação web educacional voltada ao ensino de educação financeira para crianças e adolescentes de 10 a 18 anos. Este repositório contém a Prova de Conceito (PoC) acadêmica desenvolvida para a segunda entrega do Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas (ADS) do Senac.

---

## Sumário

1. [Stack Tecnológica](#1-stack-tecnológica)
2. [Estrutura do Projeto](#2-estrutura-do-projeto)
3. [Pré-requisitos](#3-pré-requisitos)
4. [Instalação e Configuração Local](#4-instalação-e-configuração-local)
5. [Autenticação do Aluno e Modo Demonstração](#5-autenticação-do-aluno-e-modo-demonstração)
6. [Arquitetura de Banco de Dados e Backend (Supabase/PostgreSQL)](#6-arquitetura-de-banco-de-dados-e-backend-supabasepostgresql)
7. [Variáveis de Ambiente e Segurança](#7-variáveis-de-ambiente-e-segurança)
8. [Execução Local e Scripts Disponíveis](#8-execução-local-e-scripts-disponíveis)
9. [Suíte de Testes Automatizados](#9-suíte-de-testes-automatizados)
10. [Experiência de Aprendizagem e Gamificação (MVP 1)](#10-experiência-de-aprendizagem-e-gamificação-mvp-1)
11. [Configuração de Hospedagem (Netlify SPA)](#11-configuração-de-hospedagem-netlify-spa)
12. [Limitações Conhecidas e Considerações de Publicação](#12-limitações-conhecidas-e-considerações-de-publicação)

---

## 1. Stack Tecnológica

- **Frontend:** React 18, Vite 6, TypeScript 5.6
- **Estilização:** Tailwind CSS 3.4 (com PostCSS e Autoprefixer)
- **Cliente Backend:** `@supabase/supabase-js` (versão oficial 2.x)
- **Backend e Banco de Dados:** PostgreSQL 15+ gerenciado via Supabase
- **Controle de Acesso:** Row Level Security (RLS) e Funções PL/pgSQL Transacionais
- **Controle de Versão:** Git (repositório planejado no GitHub)
- **Hospedagem Planejada:** Netlify

---

## 2. Estrutura do Projeto

```text
educash/
├── docs/                       # Documentação técnica e artefatos acadêmicos
│   └── DATABASE.md             # Especificação completa da arquitetura do banco e RLS
├── supabase/                   # Migrações, funções e testes do banco de dados
│   ├── migrations/
│   │   ├── 20261104180000_01_create_schema.sql
│   │   ├── 20261104180001_02_enable_rls_and_policies.sql
│   │   ├── 20261104180002_03_create_functions.sql
│   │   └── 20261104180003_04_seed_data.sql
│   ├── tests/
│   │   ├── database_test_suite.sql  # Suíte reproduzível para execução via psql / Supabase CLI
│   │   └── validate_migrations.cjs  # Validação estática de esquema, RLS e dados pedagógicos
│   └── seed.sql                # Carga inicial canônica de dados
├── frontend/                   # Aplicação web React + Vite + TypeScript
│   ├── public/
│   │   ├── _redirects          # Regra de fallback SPA para o Netlify
│   │   └── favicon.svg         # Favicon oficial vetorial do EduCash
│   ├── scripts/
│   │   ├── test-validators.cjs        # Testes de validação de formulários de autenticação
│   │   ├── test-recovery-callback.cjs # Testes de recuperação de senha e callbacks de reset
│   │   ├── test-learning-mvp.cjs      # Testes de motor pedagógico, idempotência e gamificação
│   │   ├── test-design-system.cjs     # Testes de conformidade do Design System e contrastes
│   │   ├── test-demo-mode.cjs         # Testes de isolamento e sessão do modo demonstração
│   │   └── test-demo-parity.cjs       # Testes de paridade pedagógica demo vs seed SQL
│   ├── src/
│   │   ├── assets/             # Recursos visuais estáticos
│   │   ├── components/         # Componentes de UI reutilizáveis (Navbar, Sidebar, BottomNav, AppShell, etc.)
│   │   ├── features/
│   │   │   └── auth/           # Provedor e Contexto de Autenticação (AuthContext)
│   │   ├── hooks/              # Custom React Hooks (useAuth, useTheme)
│   │   ├── layouts/            # Estruturas de layout da aplicação
│   │   ├── pages/              # Páginas da aplicação (LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, DashboardPage, LessonPage)
│   │   ├── services/           # Cliente Supabase, perfil, motor pedagógico (learningService) e conteúdo canônico (learningContent)
│   │   ├── styles/             # Estilos globais (globals.css) e tokens semânticos (designSystem.ts)
│   │   ├── types/              # Definições TypeScript (auth.ts, database.ts, learning.ts)
│   │   ├── utils/              # Funções utilitárias e validadores (validators.ts, theme.ts)
│   │   ├── App.tsx             # Componente raiz com roteamento e controle de visão
│   │   ├── main.tsx            # Ponto de entrada da aplicação React
│   │   └── vite-env.d.ts       # Tipagem das variáveis de ambiente do Vite
│   ├── .env.example            # Modelo seguro de variáveis de ambiente para o frontend
│   ├── index.html              # Template HTML principal
│   ├── package.json            # Dependências e scripts do frontend
│   ├── postcss.config.js       # Configuração do PostCSS
│   ├── tailwind.config.js      # Configuração do Tailwind CSS
│   ├── tsconfig.json           # Configuração raiz do TypeScript
│   ├── tsconfig.app.json       # Configuração TypeScript da aplicação
│   ├── tsconfig.node.json      # Configuração TypeScript do ambiente Node/Vite
│   └── vite.config.ts          # Configuração do bundler Vite
├── .env.example                # Modelo de variáveis de ambiente na raiz
├── .gitignore                  # Regras de exclusão do Git
├── netlify.toml                # Configuração de build e redirecionamento SPA no Netlify
└── README.md                   # Documentação principal do projeto
```

---

## 3. Pré-requisitos

- **Node.js** (versão 18.x LTS ou superior; testado com Node.js v24.x)
- **npm** (versão 9.x ou superior)
- **Git** (para controle de versão local)

---

## 4. Instalação e Configuração Local

1. Entre no diretório `frontend`:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo de variáveis de ambiente locais com base no modelo:

```bash
cp .env.example .env
```

---

## 5. Autenticação do Aluno e Modo Demonstração

O EduCash possui dois modos de operação claramente desacoplados: a **Autenticação Real (Supabase)** e o **Modo Demonstração Local**, garantindo usabilidade completa mesmo em ambientes de avaliação sem conexão com banco de dados remoto.

### 5.1 Autenticação Real (Produção / Supabase)

Implementada com a biblioteca oficial `@supabase/supabase-js` em conformidade com as políticas de integridade e segurança do PostgreSQL:

- **Cadastro (Registro):**
  - Campos: E-mail, Senha, Confirmação de Senha e Nome de Usuário (`username`).
  - O e-mail é a credencial exclusiva de autenticação; o `username` é a identidade pública utilizada nas lições, HUD e painel.
  - Validação estrita: `username` com no mínimo 3 caracteres (respeitando a restrição `profiles_username_min_length`), contendo apenas caracteres alfanuméricos, sublinhado e hífen.
  - Unicidade *case-insensitive* garantida pelo índice `profiles_username_lower_idx`.
  - Senha com no mínimo 6 caracteres (padrão Supabase Auth).
- **Login e Logout:**
  - Autenticação via e-mail e senha com feedback imediato de erro em português.
  - Redirecionamento automático para a Área do Aluno (`DashboardPage`).
  - Logout seguro com encerramento de sessão no Supabase e limpeza do estado em memória.
- **Gerenciamento e Persistência de Sessão Real:**
  - Persistência gerenciada pelo SDK do Supabase no `localStorage` sob a chave:
    `educash-auth-session`
  - Restauração automática de sessão ao recarregar a página (`supabase.auth.onAuthStateChange`).
  - Atualização automática de tokens JWT e tratamento de sessões expiradas.
- **Criação de Perfil e Preferências:**
  - Criação garantida do registro em `profiles` vinculado a `auth.uid() = id`, respeitando a política RLS `profiles_insert_own`.
  - Inicialização das preferências do aluno em `user_preferences` com tema padrão `'light'`.
- **Recuperação e Redefinição de Senha:**
  - Solicitação de redefinição via e-mail (`supabase.auth.resetPasswordForEmail`).
  - Captura do fluxo de callback via hash de recuperação e redefinição de senha na página `ResetPasswordPage`.
- **Rotas Protegidas:**
  - Componente `<ProtectedRoute />` que resguarda a área logada e a execução de lições, exibindo tela explicativa com atalho para login caso o usuário não esteja autenticado.

### 5.2 Comportamento sem Variáveis de Ambiente Supabase

Quando as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` não estão configuradas (ou contêm valores de exemplo):

- O cliente Supabase opera em modo desconfigurado (`isSupabaseConfigured = false`).
- A aplicação inicializa no estado desautenticado (`user = null`), apresentando a Landing Page pública para visitantes.
- As páginas de Login, Cadastro e Recuperação de Senha exibem alertas contextuais informando que a autenticação em nuvem não está disponível no momento e direcionam o usuário para a experiência de demonstração.
- **Sem fallback automático ou silencioso:** Submeter o formulário de login real sem backend configurado não loga o usuário compulsoriamente como demonstração. A entrada no modo demo exige escolha voluntária e explícita do usuário.

### 5.3 Modo Demonstração Local (Demo Mode)

O Modo Demonstração permite a experiência pedagógica interativa completa sem depender de conexão com a nuvem ou configuração prévia de backend:

- **Ativação Explícita pelo Usuário:**
  - Acionado exclusivamente mediante clique deliberado do usuário em botões específicos:
    - *"Ver Demonstração"* na Landing Page (`LandingPage.tsx`).
    - *"Ou experimentar demonstração sem login"* na página de Login (`LoginPage.tsx`).
    - *"Ou experimentar demonstração sem cadastro"* na página de Cadastro (`RegisterPage.tsx`).
  - O clique invoca a função `startDemoSession()` exposta pelo `AuthContext`.
- **Identidade da Sessão Demo:**
  - Identificador único canônico (UUID fixo): `'00000000-0000-0000-0000-000000000001'`.
  - Nome de usuário: `aluno_demo`.
  - E-mail: `aluno.demo@educash.local`.
  - Nome completo: `Aluno Demonstração`.
  - Flag de sessão: `isDemo: true`.
- **Chaves de Armazenamento no LocalStorage:**
  - Sessão de autenticação demo:
    `educash-demo-auth-user`
  - Progresso pedagógico e gamificação demo:
    `educash-demo-learning-progress-v1`
- **Isolamento Estrito e Fidelidade:**
  - Zero chamadas de rede ou consultas externas.
  - Execução cliente simulada no `learningService.ts`, calculando pontuações (+10 XP e +5 moedas por acerto, +20 XP e +10 moedas de bônus por conclusão), histórico de tentativas e desbloqueio sequencial das lições.
  - Ao clicar em "Sair" (**Logout**), a chave `educash-demo-auth-user` é removida e a aplicação retorna ao estado visitante (`user = null`).

---

## 6. Arquitetura de Banco de Dados e Backend (Supabase/PostgreSQL)

O modelo de dados implementa 14 tabelas com integridade relacional estrita:

1. `profiles`: Dados básicos vinculados ao `auth.users(id)` com username único insensível a maiúsculas.
2. `user_preferences`: Configurações de tema (`light` / `dark`) do usuário.
3. `learning_paths`: Trilhas de aprendizagem disponíveis.
4. `lessons`: 5 lições pedagógicas sequenciais com introdução, exemplo prático e conclusão.
5. `activities`: 15 atividades avaliativas (múltipla escolha, verdadeiro ou falso e correspondência).
6. `activity_options`: Opções e pares de correspondência com identificadores estáveis.
7. `activity_answer_keys`: Gabaritos confidenciais (completamente inacessíveis a consultas client-side).
8. `activity_attempts`: Histórico imutável de submissões para auditoria.
9. `user_activity_progress`: Registro de primeiro acerto e contagem de tentativas.
10. `lesson_progress`: Desbloqueio e data de conclusão (`completed_at`).
11. `reward_transactions`: Livro-razão contábil com chave única de idempotência para XP e moedas.
12. `level_definitions`: 5 faixas de níveis (Iniciante a Especialista).
13. `achievements`: 5 conquistas cosméticas do sistema.
14. `user_achievements`: Associação de conquistas desbloqueadas por usuário.

Para detalhes completos de tabelas, relacionamentos e regras, consulte [docs/DATABASE.md](docs/DATABASE.md).

---

## 7. Variáveis de Ambiente e Segurança

No arquivo `.env` (baseado em `.env.example`), são utilizadas as variáveis recomendadas pela Supabase:

| Variável | Descrição |
| :--- | :--- |
| `VITE_SUPABASE_URL` | URL pública da API do Supabase (ex.: `https://<project-ref>.supabase.co`). |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública do cliente Supabase (**Publishable Key** / **Anon Key**). |

### Diretrizes Obrigatórias de Segurança:
- **Apenas chaves públicas no cliente:** A chave anônima/pública opera em conjunto com as políticas de Row Level Security (RLS).
- **Nunca exponha a chave administrativa (`service_role`):** A chave de serviço desabilita o RLS e **jamais** deve ser adicionada a arquivos `.env` do frontend ou incluída no código-fonte.

---

## 8. Execução Local e Scripts Disponíveis

A partir do diretório `frontend/`:

- Iniciar servidor de desenvolvimento:
  ```bash
  npm run dev
  ```
- Checagem estática de tipagem TypeScript:
  ```bash
  npm run lint
  ```
- Executar todos os testes automatizados do frontend (93 testes):
  ```bash
  npm test
  ```
- Executar suítes específicas de teste do frontend:
  - Autenticação e recuperação (`test-validators` e `test-recovery-callback`): `npm run test:auth`
  - Motor pedagógico e gamificação (`test-learning-mvp`): `npm run test:learning`
  - Design system, tokens e contrastes (`test-design-system`): `npm run test:design`
  - Isolamento e sessão do modo demonstração (`test-demo-mode`): `npm run test:demo`
  - Paridade pedagógica demo vs seed SQL (`test-demo-parity`): `npm run test:parity`
- Build de produção:
  ```bash
  npm run build
  ```
- Pré-visualização local do build de produção:
  ```bash
  npm run preview
  ```

A partir da raiz do repositório:

- Validação estática de banco de dados, migrações SQL e integridade de sementes (70 checagens):
  ```bash
  node supabase/tests/validate_migrations.cjs
  ```

---

## 9. Suíte de Testes Automatizados

O EduCash possui uma cobertura de testes automatizados com execução rápida e determinística (sem dependência de serviços externos):

### 9.1 Testes Automatizados de Frontend (93 Testes)

Executados a partir do diretório `frontend/` ou pela raiz:

```bash
npm test --prefix frontend
```

A suíte cobre 93 testes distribuídos em 6 arquivos de verificação:

1. **Validação de Formulários (`test-validators.cjs` — 26 testes):**
   - Validações de e-mail, requisitos de senha (mínimo de 6 caracteres), restrições de nome de usuário (mínimo de 3 caracteres, apenas alfanuméricos, sublinhado e hífen) e correspondência de confirmação de senha.
2. **Recuperação de Senha e Callbacks (`test-recovery-callback.cjs` — 21 testes):**
   - Captura e parsing de hash fragments do Supabase (`#access_token=...&type=recovery`), extração de códigos de erro, validação de nova senha e tradução amigável de mensagens de retorno.
3. **Motor Pedagógico e Gamificação (`test-learning-mvp.cjs` — 12 testes):**
   - Ciclo de submissão de respostas, pontuação idempotente (+10 XP e +5 moedas por primeiro acerto), cálculo do bônus de conclusão de lição (+20 XP e +10 moedas), tentativas ilimitadas sem penalidade e regras de avanço de nível.
4. **Design System e Acessibilidade (`test-design-system.cjs` — 11 testes):**
   - Conformidade de tokens semânticos, contrastes WCAG AA em botões táteis primários (estados normal: 5,47:1, hover: 4,52:1 e active: 7,58:1), tamanho mínimo de toque de 44 × 44 px e consistência com tema escuro.
5. **Modo Demonstração Local (`test-demo-mode.cjs` — 10 testes):**
   - Inicialização explícita via `startDemoSession()`, validação do identificador UUID canônico (`00000000-0000-0000-0000-000000000001`), persistência sob `educash-demo-auth-user`, isolamento em relação ao backend e restauração de sessão.
6. **Paridade Pedagógica Demo vs SQL (`test-demo-parity.cjs` — 13 testes):**
   - Comparação estrita entre o conteúdo frontend (`learningContent.ts`) e o arquivo canônico de migração (`20261104180003_04_seed_data.sql`), validando títulos, introduções, exemplos práticos, conclusões, enunciados das 15 atividades, alternativas, pares e feedbacks explicativos.

### 9.2 Validação Estática do Banco de Dados (70 Checagens)

Executada a partir da raiz com:

```bash
node supabase/tests/validate_migrations.cjs
```

Realiza 70 checagens estáticas automatizadas cobrindo:
- Sintaxe e integridade estrutural das 4 migrações SQL.
- Existência e amarração relacional das 14 tabelas do esquema.
- Habilitação compulsória de Row Level Security (RLS) em 100% das tabelas.
- Políticas de isolamento do aluno e confidencialidade estrita do gabarito (`activity_answer_keys`).
- Definição da função transacional segura `submit_activity_answer` (PL/pgSQL).
- Idempotência contábil na tabela `reward_transactions` via restrição única de eventos.
- Integridade e ordem sequencial das 5 lições e 15 atividades no arquivo de carga (`seed_data.sql`).

---

## 10. Experiência de Aprendizagem e Gamificação (MVP 1)

O **MVP 1** disponibiliza a trilha completa de 5 lições pedagógicas e 15 atividades avaliativas, com 100% de paridade entre o banco de dados Supabase e o modo demonstração local:

### 10.1 Painel do Aluno (Dashboard)
- Identificação pelo `@username` do aluno com proteção de privacidade.
- HUD com Nível atual (com barra de progresso de XP até o próximo nível), saldo de EduCoins e total de XP acumulado.
- Trilha com as 5 lições sequenciais: indicação visual clara de status (disponível, bloqueada ou concluída).
- Alternância instantânea de tema claro (*light*) e tema escuro (*dark*).

### 10.2 Trilha Curricular das 5 Lições
Cada lição possui narrativa adaptada para a faixa etária (10 a 18 anos), composta por introdução contextual, exemplo prático do cotidiano com os personagens Sofia e Lucas, 3 atividades interativas e conclusão sintetizadora:

1. **Lição 1 — "O que é dinheiro?":**
   - Conceito: Origem da moeda, superação do escambo e as 3 funções essenciais do dinheiro (meio de troca, medida de valor e reserva de valor).
   - Atividades: Múltipla escolha (função do dinheiro), Verdadeiro ou Falso (história do escambo) e Correspondência (dinheiro metal, papel e digital).
2. **Lição 2 — "Necessidades e desejos":**
   - Conceito: Diferenciação entre necessidades básicas e desejos de consumo, consumo consciente e critérios de priorização.
   - Atividades: Múltipla escolha (conceito de essencial), Verdadeiro ou Falso (adiamento de desejos) e Correspondência (classificação de itens do dia a dia).
3. **Lição 3 — "Como economizar?":**
   - Conceito: O hábito de poupar com propósito, pequenas economias no cotidiano e a formação de reservas financeiras.
   - Atividades: Múltipla escolha (regra da poupança imediata), Verdadeiro ou Falso (reserva de emergência) e Correspondência (métodos de economia).
4. **Lição 4 — "Planejando meus gastos":**
   - Conceito: Controle de entradas e saídas financeiras, registro contínuo e a regra de planejamento 50/30/20 adaptada para jovens.
   - Atividades: Múltipla escolha (propósito do planejamento), Verdadeiro ou Falso (controle de despesas pequenas) e Correspondência (divisão das categorias de gastos).
5. **Lição 5 — "Meu primeiro orçamento":**
   - Conceito: Elaboração prática do orçamento familiar e pessoal, superávit versus déficit orçamentário e equilíbrio financeiro.
   - Atividades: Múltipla escolha (equação de receitas e despesas), Verdadeiro ou Falso (ajustes no orçamento) e Correspondência (situações financeiras e ações adequadas).

### 10.3 Formatos de Atividade e Mecânicas de Gamificação
- **Três Formatos Interativos:**
  - *Múltipla Escolha (`multiple_choice`):* 4 alternativas contextuais com seleção única.
  - *Verdadeiro ou Falso (`true_false`):* Avaliação crítica de afirmações do cotidiano.
  - *Associação de Pares (`matching`):* Conexão visual e semântica entre conceitos e definições.
- **Validação com Feedback Imediato:** Explicação didática detalhada em cada submissão, orientando o aprendizado a partir do erro sem punição.
- **Tentativas Ilimitadas:** O estudante pode tentar quantas vezes precisar até alcançar a resposta correta.
- **Recompensas Idempotentes:**
  - +10 XP e +5 EduCoins pelo primeiro acerto em cada atividade.
  - +20 XP e +10 EduCoins de bônus pela conclusão da lição.
  - Tentativas subsequentes não duplicam créditos no livro-razão (`reward_transactions`).
- **Desbloqueio Progressivo:** A conclusão bem-sucedida de uma lição desbloqueia automaticamente a lição subsequente na trilha.

---

## 11. Configuração de Hospedagem (Netlify SPA)

O repositório está configurado para deploy contínuo no Netlify:
- `netlify.toml`: Define o diretório de build (`frontend`), comando (`npm run build`), diretório de publicação (`dist`) e regra de redirecionamento `/* -> /index.html` (status 200).
- `frontend/public/_redirects`: Regra de fallback copiada para o build final.
- Cabeçalhos de segurança recomendados (CSP compatível com Supabase, X-Frame-Options, X-Content-Type-Options e Referrer-Policy).

---

## 12. Limitações Conhecidas e Considerações de Publicação

Para total transparência sobre a entrega do MVP 1:

1. **Validação E2E com Supabase Cloud:**
   - A integração ponta a ponta com a nuvem Supabase depende do provisionamento de um projeto remoto e do preenchimento das variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no painel de hospedagem.
   - Em ambiente local sem conexão externa ativa, a conformidade da aplicação é plenamente assegurada pelo Modo Demonstração e pela suíte de 93 testes automatizados e 70 validações de migração.
2. **Envio de E-mails Transacionais:**
   - O disparo de e-mails para recuperação de senha (`supabase.auth.resetPasswordForEmail`) depende da integração de um provedor SMTP próprio (ex.: SendGrid, Resend, Amazon SES) no dashboard do Supabase. O serviço gratuito padrão possui cotas reduzidas de envio por hora.
3. **Auditoria Visual e Renderização em Dispositivos Físicos:**
   - As auditorias visuais, limites de contraste WCAG AA e áreas mínimas de toque (44 × 44 px) foram validadas via testes automatizados no Node.js e inspeção de código estático. A avaliação sensorial definitiva em telas sensíveis ao toque e dispositivos físicos variados é recomendada após a publicação no Netlify.
4. **Ícone Oficial e Favicon:**
   - O projeto inclui o ícone oficial vetorial implementado em `frontend/public/favicon.svg` com total fidelidade à identidade visual da marca. A geração de arquivos rasterizados legados adicionais (`favicon.ico` multi-resolução e `apple-touch-icon.png`) permanece como recomendação cosmética para ciclos futuros.
5. **Tamanho do Pacote JavaScript (Vite Chunk Notice):**
   - O build de produção gera um pacote JS principal de aproximadamente 593 kB (incluindo React, biblioteca Supabase, motor pedagógico e ícones Lucide). Embora exceda ligeiramente a recomendação informativa de 500 kB do Vite, opera de maneira veloz e fluida. A adoção de carregamento sob demanda (*code-splitting*) via `React.lazy` pode ser avaliada em versões posteriores.
