# Mistério na Escola — O Caso do Arquivo Desaparecido

Sistema de investigação digital para feira tecnológica, com foco em demonstração de banco de dados relacional (PostgreSQL 16+). Stack: React + Vite (frontend), Node.js + Express (backend), PostgreSQL (dados).

Sem login, sem QR Code, sem IA, sem WebSocket, sem medalhas — apenas o fluxo de investigação, resolução do caso e ranking por apelido, como definido no escopo do projeto.

## 1. Estrutura completa de pastas

```
misterio-escola/
├── database/
│   ├── schema.sql        # Criação de tabelas, constraints, índices e views
│   └── seed.sql           # Massa de dados completa do caso
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   ├── suspeitos.routes.js
│   │   │   ├── evidencias.routes.js
│   │   │   ├── depoimentos.routes.js
│   │   │   ├── cameras.routes.js
│   │   │   ├── logs.routes.js
│   │   │   ├── resolucao.routes.js
│   │   │   └── ranking.routes.js
│   │   ├── controllers/
│   │   │   ├── suspeitos.controller.js
│   │   │   ├── evidencias.controller.js
│   │   │   ├── depoimentos.controller.js
│   │   │   ├── cameras.controller.js
│   │   │   ├── logs.controller.js
│   │   │   ├── resolucao.controller.js
│   │   │   └── ranking.controller.js
│   │   ├── services/
│   │   │   ├── suspeitos.service.js
│   │   │   ├── evidencias.service.js
│   │   │   ├── resolucao.service.js
│   │   │   └── ranking.service.js
│   │   ├── repositories/
│   │   │   ├── suspeitos.repository.js
│   │   │   ├── evidencias.repository.js
│   │   │   ├── depoimentos.repository.js
│   │   │   ├── cameras.repository.js
│   │   │   ├── logs.repository.js
│   │   │   └── ranking.repository.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── TelaInicial.jsx
│   │   │   ├── IntroducaoCaso.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Suspeitos.jsx
│   │   │   ├── Evidencias.jsx
│   │   │   ├── Depoimentos.jsx
│   │   │   ├── Cameras.jsx
│   │   │   ├── Logs.jsx
│   │   │   ├── ResolverCaso.jsx
│   │   │   ├── Resultado.jsx
│   │   │   └── Ranking.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── TabBar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── QueryInspector.jsx
│   │   │   ├── StateMessage.jsx
│   │   │   └── Modal.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── suspeitos.service.js
│   │   │   ├── evidencias.service.js
│   │   │   ├── depoimentos.service.js
│   │   │   ├── cameras.service.js
│   │   │   ├── logs.service.js
│   │   │   ├── resolucao.service.js
│   │   │   └── ranking.service.js
│   │   ├── styles/
│   │   │   ├── tokens.css
│   │   │   └── components.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── MANUAL_PGADMIN.md
├── MANUAL_APRESENTACAO_BANCA.md
└── README.md (este arquivo)
```

## 2. Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL 16 ou superior
- pgAdmin 4 (opcional, recomendado para visualizar/gerenciar o banco)

## 3. Comandos de instalação (passo a passo)

### 3.1 Banco de dados

Crie o banco (via pgAdmin ou terminal):

```bash
psql -U postgres -c "CREATE DATABASE misterio_escola WITH ENCODING 'UTF8' TEMPLATE template0;"
```

Execute o schema e depois o seed:

```bash
psql -U postgres -d misterio_escola -f database/schema.sql
psql -U postgres -d misterio_escola -f database/seed.sql
```

(Veja o `MANUAL_PGADMIN.md` para o passo a passo usando apenas a interface gráfica do pgAdmin 4.)

### 3.2 Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com as credenciais do seu PostgreSQL local:

```
PORT=3001
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha_aqui
PGDATABASE=misterio_escola
```

Inicie o servidor:

```bash
npm start
```

O backend sobe em `http://localhost:3001`. Teste com `curl http://localhost:3001/api/health`.

### 3.3 Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O frontend sobe em `http://localhost:5173` (padrão do Vite) e já está configurado para consumir a API em `http://localhost:3001/api` (variável `VITE_API_URL` no `.env`).

Acesse `http://localhost:5173` no navegador.

## 4. Scripts disponíveis

**Backend** (`backend/package.json`):
- `npm start` — inicia o servidor com Node.js puro.
- `npm run dev` — inicia com `node --watch` (recarrega ao salvar arquivos).

**Frontend** (`frontend/package.json`):
- `npm run dev` — ambiente de desenvolvimento (hot reload).
- `npm run build` — gera build de produção em `frontend/dist`.
- `npm run preview` — serve o build de produção localmente.

## 5. Resetar o banco entre demonstrações

Antes de cada nova rodada de testes na feira, é recomendável limpar apenas a tabela de ranking (que é alimentada pelos visitantes), preservando o caso:

```sql
TRUNCATE TABLE ranking RESTART IDENTITY;
```

Para resetar tudo do zero (caso + ranking), basta executar novamente `schema.sql` (que recria as tabelas) seguido de `seed.sql`.
