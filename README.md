# Mistério na Escola — O Caso do Arquivo Desaparecido

Sistema de investigação digital criado para a **Feira de Banco de Dados** da escola. O visitante assume o papel de detetive: interroga suspeitos, analisa evidências, assiste depoimentos e revisa câmeras de segurança até resolver o caso.

Desenvolvido em grupo com o objetivo de tornar a apresentação de banco de dados algo interativo — em vez de só mostrar tabelas e queries numa tela, o visitante *joga* e sem perceber está interagindo com um PostgreSQL real por baixo.

A feira foi um sucesso. O projeto foi muito bem recebido pela banca.

---

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express (arquitetura em camadas: routes → controllers → services → repositories)
- **Banco de dados:** PostgreSQL 16

---

## Estrutura do projeto

```
misterio-escola/
├── database/
│   ├── schema.sql        # Tabelas, constraints, índices e views
│   └── seed.sql          # Dados completos do caso
├── backend/
│   └── src/
│       ├── config/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       └── repositories/
├── frontend/
│   └── src/
│       ├── pages/        # 11 páginas
│       ├── components/   # Header, TabBar, Badge, Modal...
│       └── services/     # Integração com a API
├── MANUAL_PGADMIN.md
├── MANUAL_APRESENTACAO_BANCA.md
└── README.md
```

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 16+

### 1. Banco de dados

Crie o banco e execute os arquivos na ordem:

```bash
psql -U postgres -c "CREATE DATABASE misterio_escola;"
psql -U postgres -d misterio_escola -f database/schema.sql
psql -U postgres -d misterio_escola -f database/seed.sql
```

Se preferir usar interface gráfica, tem um passo a passo no `MANUAL_PGADMIN.md`.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com suas credenciais do PostgreSQL:

```
PORT=3001
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha
PGDATABASE=misterio_escola
```

```bash
npm start
```

Sobe em `http://localhost:3001`. Pra confirmar que tá funcionando: `curl http://localhost:3001/api/health`

> A parte que mais deu trabalho foi exatamente essa — a conexão com o banco. Variáveis de ambiente erradas, porta diferente, usuário sem permissão. Se travar aqui, confere o `.env` com calma antes de qualquer outra coisa.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abre em `http://localhost:5173` e já aponta pra API em `localhost:3001` automaticamente.

---

## Resetar o banco entre sessões

Na feira precisávamos resetar o ranking entre um visitante e outro. O comando que usamos:

```sql
TRUNCATE TABLE ranking RESTART IDENTITY;
```

Pra resetar tudo do zero (caso + ranking):

```bash
psql -U postgres -d misterio_escola -f database/schema.sql
psql -U postgres -d misterio_escola -f database/seed.sql
```

---

## Rotas da API

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/api/suspeitos` | Lista os suspeitos |
| GET | `/api/evidencias` | Lista as evidências |
| GET | `/api/depoimentos` | Lista os depoimentos |
| GET | `/api/cameras` | Retorna as gravações |
| GET | `/api/logs` | Logs do sistema |
| POST | `/api/resolucao` | Submete a resolução do caso |
| GET/POST | `/api/ranking` | Consulta e atualiza o ranking |

---

Projeto desenvolvido como trabalho final do curso Técnico em Desenvolvimento de Sistemas — São Paulo, 2026.
