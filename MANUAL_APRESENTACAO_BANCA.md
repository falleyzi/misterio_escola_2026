# Manual de Apresentação para a Banca

## Roteiro sugerido (5–7 minutos por avaliador)

1. **Abertura (30s)** — "Este sistema transforma a modelagem de um banco de dados relacional em uma investigação interativa: cada pista que o visitante descobre é resultado direto de uma consulta SQL sobre tabelas reais, normalizadas e relacionadas."

2. **Demonstração ao vivo (2–3 min)** — Peça ao avaliador (ou a um visitante) para abrir a Tela Inicial, clicar em "Iniciar Investigação", ler o briefing e navegar pelos módulos: Suspeitos, Evidências, Depoimentos, Câmeras e Logs.

3. **"Abrir o capô" com o Query Inspector (2 min)** — Em cada módulo, há um painel retrátil no rodapé chamado **Query Inspector**. Ao clicar em "ver SQL desta consulta", ele exibe a query SQL simplificada que efetivamente busca aqueles dados no PostgreSQL. Use isso para mostrar, por exemplo, a query com `JOIN` entre `relacao_evidencia_suspeito`, `suspeitos` e `evidencias` ao abrir o suspeito Lucas Ferreira.

4. **Resolução do caso (1 min)** — Demonstre o fluxo de 4 etapas (Suspeito → Motivo → Método → Evidência decisiva) e mostre a Tela Final com o resultado, pontuação e a solução correta.

5. **Ranking (30s)** — Mostre a tela de Ranking, explicando que ela é alimentada por uma tabela simples (`ranking`) e ordenada via `ORDER BY pontuacao DESC, tempo_segundos ASC`.

6. **Encerramento técnico (1–2 min)** — Abra o pgAdmin (ou um terminal com `psql`) e mostre ao vivo:
   - O diagrama de tabelas (pgAdmin → ERD Tool, disponível ao clicar com o botão direito no schema `public` → ERD For Schema).
   - O trecho do `schema.sql` com as CHECK constraints e o índice único parcial que garante apenas um suspeito culpado.
   - Uma query executada ao vivo, com o mesmo resultado mostrado no Query Inspector do frontend.

## Como destacar Banco de Dados

- Mantenha o pgAdmin aberto em um monitor ou notebook secundário, com o ERD Tool já gerado a partir do schema (Schemas → public → botão direito → ERD For Schema).
- Deixe o Query Inspector sempre visível durante a demonstração — é o elemento que conecta a experiência visual à camada de dados.
- Tenha uma aba do pgAdmin com o Query Tool aberto, pronta para executar consultas ao vivo se solicitado.

## Como destacar SQL e modelagem

Pontos técnicos para mencionar, caso perguntado:

- Tabela associativa N:N (`relacao_evidencia_suspeito`): explica por que uma evidência pode incriminar mais de um suspeito e um suspeito pode ter várias evidências associadas — modelagem correta em vez de campos de texto com listas separadas por vírgula (o que violaria a 1ª Forma Normal).
- Chave estrangeira opcional com propósito (`logs_servidor.id_suspeito_responsavel`): é NULL de propósito quando o log usa a conta compartilhada manutencao_ti, forçando o investigador a cruzar dados de outras tabelas — uma decisão de design ligada à própria mecânica do jogo.
- Índice único parcial (`uq_suspeitos_unico_culpado`): garante, no nível do banco, que exista no máximo um suspeito com e_culpado = TRUE, sem precisar de um trigger.
- Views (`vw_evidencias_com_suspeitos`, `vw_ranking_top10`, `vw_linha_tempo_servidor`): demonstram uso de views para simplificar consultas recorrentes.
- CHECK constraints: usadas no lugar de ENUM (comum no MySQL, mas no PostgreSQL prefere-se CHECK ou tabelas de domínio para maior flexibilidade).

## Como impressionar os avaliadores

- Deixe a aplicação rodando em loop no estande, mesmo sem visitante, com a tela de Ranking visível.
- Tenha as credenciais de acesso ao pgAdmin já salvas/conectadas antes da apresentação, para não perder tempo logando durante a banca.
- Distribua entre os 4 integrantes da equipe o conhecimento de pelo menos uma camada (banco, backend, frontend) para que qualquer um possa responder perguntas técnicas com profundidade.
