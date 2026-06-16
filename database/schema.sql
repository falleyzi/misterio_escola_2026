-- =====================================================================
-- MISTÉRIO NA ESCOLA: O CASO DO ARQUIVO DESAPARECIDO
-- schema.sql — PostgreSQL 16+
-- Execução: psql -U postgres -d misterio_escola -f schema.sql
-- (ou via pgAdmin 4: Query Tool, abrir este arquivo e executar)
-- =====================================================================

-- ATENÇÃO: este script assume que o banco "misterio_escola" já existe.
-- Para criar o banco, execute antes (fora de uma transação/conexão a outro banco):
--   CREATE DATABASE misterio_escola WITH ENCODING 'UTF8' TEMPLATE template0;

DROP TABLE IF EXISTS ranking CASCADE;
DROP TABLE IF EXISTS logs_servidor CASCADE;
DROP TABLE IF EXISTS logs_acesso_predio CASCADE;
DROP TABLE IF EXISTS registros_cameras CASCADE;
DROP TABLE IF EXISTS cameras CASCADE;
DROP TABLE IF EXISTS depoimentos CASCADE;
DROP TABLE IF EXISTS relacao_evidencia_suspeito CASCADE;
DROP TABLE IF EXISTS evidencias CASCADE;
DROP TABLE IF EXISTS suspeitos CASCADE;

-- ---------------------------------------------------------------------
-- 1. SUSPEITOS
-- ---------------------------------------------------------------------
CREATE TABLE suspeitos (
  id_suspeito              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome                     VARCHAR(120)  NOT NULL,
  cargo_funcao             VARCHAR(120)  NOT NULL,
  foto_url                 VARCHAR(255),
  tem_credencial_servidor  BOOLEAN       NOT NULL DEFAULT FALSE,
  descricao_perfil         TEXT          NOT NULL,
  alibi_declarado          TEXT          NOT NULL,
  motivo_suspeita          TEXT          NOT NULL,
  e_culpado                BOOLEAN       NOT NULL DEFAULT FALSE,
  criado_em                TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Garante, via índice único parcial, que no máximo 1 suspeito seja o culpado
CREATE UNIQUE INDEX uq_suspeitos_unico_culpado
  ON suspeitos (e_culpado)
  WHERE e_culpado = TRUE;

-- ---------------------------------------------------------------------
-- 2. EVIDENCIAS
-- ---------------------------------------------------------------------
CREATE TABLE evidencias (
  id_evidencia       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo             VARCHAR(10)   NOT NULL UNIQUE,
  tipo               VARCHAR(30)   NOT NULL,
  titulo             VARCHAR(180)  NOT NULL,
  descricao          TEXT          NOT NULL,
  nivel_importancia  VARCHAR(10)   NOT NULL DEFAULT 'media',
  data_hora_evento   TIMESTAMP,
  arquivo_midia_url  VARCHAR(255),
  criado_em          TIMESTAMP     NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_evidencias_tipo CHECK (
    tipo IN ('log_portaria','log_servidor','camera','depoimento',
             'documento','item_fisico','log_vpn','historico_academico')
  ),
  CONSTRAINT chk_evidencias_nivel CHECK (
    nivel_importancia IN ('baixa','media','alta','decisiva')
  )
);

CREATE INDEX idx_evidencias_data ON evidencias (data_hora_evento);
CREATE INDEX idx_evidencias_tipo ON evidencias (tipo);
CREATE INDEX idx_evidencias_nivel ON evidencias (nivel_importancia);

-- ---------------------------------------------------------------------
-- 3. RELACAO_EVIDENCIA_SUSPEITO (N:N)
-- ---------------------------------------------------------------------
CREATE TABLE relacao_evidencia_suspeito (
  id_evidencia   INTEGER NOT NULL REFERENCES evidencias(id_evidencia)
                   ON DELETE RESTRICT ON UPDATE CASCADE,
  id_suspeito    INTEGER NOT NULL REFERENCES suspeitos(id_suspeito)
                   ON DELETE RESTRICT ON UPDATE CASCADE,
  tipo_relacao   VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_evidencia, id_suspeito),
  CONSTRAINT chk_res_tipo_relacao CHECK (
    tipo_relacao IN ('incrimina','exclui','neutra','reforca_alibi','refuta_alibi')
  )
);

CREATE INDEX idx_res_suspeito ON relacao_evidencia_suspeito (id_suspeito);

-- ---------------------------------------------------------------------
-- 4. DEPOIMENTOS
-- ---------------------------------------------------------------------
CREATE TABLE depoimentos (
  id_depoimento             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_suspeito               INTEGER NOT NULL REFERENCES suspeitos(id_suspeito)
                              ON DELETE RESTRICT ON UPDATE CASCADE,
  data_hora_depoimento      TIMESTAMP NOT NULL,
  texto_depoimento          TEXT NOT NULL,
  eh_alibi                  BOOLEAN NOT NULL DEFAULT FALSE,
  id_evidencia_relacionada  INTEGER REFERENCES evidencias(id_evidencia)
                              ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_depoimentos_suspeito ON depoimentos (id_suspeito);

-- ---------------------------------------------------------------------
-- 5. CAMERAS
-- ---------------------------------------------------------------------
CREATE TABLE cameras (
  id_camera    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo       VARCHAR(10)   NOT NULL UNIQUE,
  localizacao  VARCHAR(150)  NOT NULL,
  descricao    TEXT
);

-- ---------------------------------------------------------------------
-- 6. REGISTROS_CAMERAS
-- ---------------------------------------------------------------------
CREATE TABLE registros_cameras (
  id_registro               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_camera                 INTEGER NOT NULL REFERENCES cameras(id_camera)
                              ON DELETE RESTRICT ON UPDATE CASCADE,
  id_evidencia               INTEGER REFERENCES evidencias(id_evidencia)
                              ON DELETE SET NULL ON UPDATE CASCADE,
  data_hora                 TIMESTAMP NOT NULL,
  descricao_cena            TEXT NOT NULL,
  imagem_url                VARCHAR(255),
  id_suspeito_identificado  INTEGER REFERENCES suspeitos(id_suspeito)
                              ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_registros_data ON registros_cameras (data_hora);
CREATE INDEX idx_registros_camera ON registros_cameras (id_camera);

-- ---------------------------------------------------------------------
-- 7. LOGS_ACESSO_PREDIO
-- ---------------------------------------------------------------------
CREATE TABLE logs_acesso_predio (
  id_log_predio  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_suspeito    INTEGER REFERENCES suspeitos(id_suspeito)
                   ON DELETE SET NULL ON UPDATE CASCADE,
  data_hora      TIMESTAMP NOT NULL,
  tipo_evento    VARCHAR(10) NOT NULL,
  descricao      TEXT,
  CONSTRAINT chk_logpredio_tipo CHECK (tipo_evento IN ('entrada','saida','alarme'))
);

CREATE INDEX idx_logpredio_data ON logs_acesso_predio (data_hora);

-- ---------------------------------------------------------------------
-- 8. LOGS_SERVIDOR
-- ---------------------------------------------------------------------
CREATE TABLE logs_servidor (
  id_log_servidor          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_suspeito_responsavel  INTEGER REFERENCES suspeitos(id_suspeito)
                             ON DELETE SET NULL ON UPDATE CASCADE,
  data_hora_inicio         TIMESTAMP NOT NULL,
  data_hora_fim            TIMESTAMP,
  usuario_autenticado      VARCHAR(60) NOT NULL,
  endereco_ip              VARCHAR(45) NOT NULL,
  tipo_rede                VARCHAR(10) NOT NULL,
  acao_realizada           VARCHAR(30) NOT NULL,
  caminho_arquivo          VARCHAR(255),
  status                   VARCHAR(10) NOT NULL DEFAULT 'sucesso',
  CONSTRAINT chk_logserv_rede CHECK (tipo_rede IN ('interna','vpn')),
  CONSTRAINT chk_logserv_acao CHECK (
    acao_realizada IN ('login','navegacao_diretorio','exclusao_arquivo','logout')
  ),
  CONSTRAINT chk_logserv_status CHECK (status IN ('sucesso','negado'))
);

CREATE INDEX idx_logserv_data ON logs_servidor (data_hora_inicio);

-- ---------------------------------------------------------------------
-- 9. RANKING
-- ---------------------------------------------------------------------
CREATE TABLE ranking (
  id_ranking         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_investigador  VARCHAR(80) NOT NULL,
  acertou            BOOLEAN NOT NULL,
  pontuacao          INTEGER NOT NULL DEFAULT 0,
  tempo_segundos     INTEGER NOT NULL,
  criado_em          TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_ranking_pontuacao CHECK (pontuacao >= 0),
  CONSTRAINT chk_ranking_tempo CHECK (tempo_segundos >= 0)
);

CREATE INDEX idx_ranking_pontuacao ON ranking (pontuacao DESC);

-- ---------------------------------------------------------------------
-- VIEWS
-- ---------------------------------------------------------------------

-- View: evidências com a lista de suspeitos relacionados (facilita o endpoint de detalhe)
CREATE VIEW vw_evidencias_com_suspeitos AS
SELECT
  e.id_evidencia,
  e.codigo,
  e.tipo,
  e.titulo,
  e.descricao,
  e.nivel_importancia,
  e.data_hora_evento,
  res.id_suspeito,
  s.nome AS nome_suspeito,
  res.tipo_relacao
FROM evidencias e
LEFT JOIN relacao_evidencia_suspeito res ON res.id_evidencia = e.id_evidencia
LEFT JOIN suspeitos s ON s.id_suspeito = res.id_suspeito;

-- View: top 10 do ranking
CREATE VIEW vw_ranking_top10 AS
SELECT nome_investigador, acertou, pontuacao, tempo_segundos, criado_em
FROM ranking
ORDER BY pontuacao DESC, tempo_segundos ASC
LIMIT 10;

-- View: linha do tempo unificada de logs do servidor (uso interno/depuração e apresentação)
CREATE VIEW vw_linha_tempo_servidor AS
SELECT
  data_hora_inicio AS data_hora,
  usuario_autenticado,
  endereco_ip,
  tipo_rede,
  acao_realizada,
  caminho_arquivo,
  status,
  id_suspeito_responsavel
FROM logs_servidor
ORDER BY data_hora_inicio;
