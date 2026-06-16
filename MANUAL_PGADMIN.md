# Manual de Execução com pgAdmin 4

Este manual mostra como configurar o banco de dados do projeto usando exclusivamente a interface gráfica do pgAdmin 4 (sem precisar digitar comandos no terminal).

## Passo 1 — Conectar ao servidor PostgreSQL

1. Abra o pgAdmin 4.
2. No painel esquerdo ("Browser"), clique com o botão direito em **Servers** → **Register** → **Server...**.
3. Na aba **General**, dê um nome de sua escolha (ex: `Local`).
4. Na aba **Connection**, preencha:
   - **Host name/address**: `localhost`
   - **Port**: `5432`
   - **Username**: `postgres` (ou o usuário do seu PostgreSQL)
   - **Password**: a senha definida na instalação do PostgreSQL
5. Clique em **Save**.

## Passo 2 — Criar o banco de dados

1. Expanda o servidor recém-conectado.
2. Clique com o botão direito em **Databases** → **Create** → **Database...**.
3. Em **Database**, digite: `misterio_escola`.
4. Em **Encoding**, mantenha `UTF8`.
5. Clique em **Save**.

## Passo 3 — Executar o script de criação das tabelas (schema.sql)

1. Clique no banco `misterio_escola` recém-criado para selecioná-lo.
2. No menu superior, clique no ícone **Query Tool** (ou vá em **Tools** → **Query Tool**).
3. No Query Tool, clique no ícone de pasta (Open File) e selecione o arquivo `database/schema.sql` deste projeto.
4. Clique no botão **Execute/Run** (ícone de "play" ▶ ou tecla F5).
5. Verifique na aba **Messages**, na parte inferior, se apareceram apenas mensagens de sucesso (`CREATE TABLE`, `CREATE INDEX`, `CREATE VIEW`), sem erros.

## Passo 4 — Executar o script de massa de dados (seed.sql)

1. Ainda no Query Tool (ou abra um novo, com o banco `misterio_escola` selecionado), abra o arquivo `database/seed.sql`.
2. Clique em **Execute/Run**.
3. Confirme na aba **Messages** que apareceram mensagens `INSERT 0 N` para cada tabela, sem erros.

## Passo 5 — Conferir os dados

No painel esquerdo, expanda:

```
misterio_escola → Schemas → public → Tables
```

Você deve ver as tabelas: `suspeitos`, `evidencias`, `relacao_evidencia_suspeito`, `depoimentos`, `cameras`, `registros_cameras`, `logs_acesso_predio`, `logs_servidor`, `ranking`.

Para visualizar os dados de uma tabela, clique com o botão direito sobre ela → **View/Edit Data** → **All Rows**.

Você também pode expandir **Views** (dentro de `public`) para ver `vw_evidencias_com_suspeitos`, `vw_ranking_top10` e `vw_linha_tempo_servidor` — views já incluídas no schema para facilitar consultas de apresentação.

## Passo 6 — Testar uma query de exemplo

No Query Tool, cole e execute:

```sql
SELECT s.nome, e.codigo, e.titulo, res.tipo_relacao
FROM relacao_evidencia_suspeito res
JOIN suspeitos s ON s.id_suspeito = res.id_suspeito
JOIN evidencias e ON e.id_evidencia = res.id_evidencia
WHERE s.nome = 'Lucas Ferreira'
ORDER BY e.codigo;
```

Você deve ver as evidências relacionadas a Lucas Ferreira (EVD-02, EVD-03, EVD-04, EVD-08, EVD-12, EVD-13), cada uma com o tipo de relação correspondente.

## Passo 7 — Conectar o backend a este banco

No arquivo `backend/.env` (copiado de `.env.example`), confirme que os dados de conexão coincidem com os usados no pgAdmin (host, porta, usuário, senha, nome do banco `misterio_escola`).

## Resetando o banco para uma nova demonstração

Para limpar apenas o ranking dos visitantes, no Query Tool execute:

```sql
TRUNCATE TABLE ranking RESTART IDENTITY;
```

Para recriar tudo do zero, execute novamente `schema.sql` (ele já contém `DROP TABLE IF EXISTS ... CASCADE` no início) seguido de `seed.sql`.
