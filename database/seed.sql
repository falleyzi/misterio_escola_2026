-- =====================================================================
-- MISTÉRIO NA ESCOLA: O CASO DO ARQUIVO DESAPARECIDO
-- seed.sql — Massa de dados (PostgreSQL 16+)
-- Execução: psql -U postgres -d misterio_escola -f seed.sql
-- Execute SEMPRE depois do schema.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- SUSPEITOS (id 1=Eduardo, 2=Lucas, 3=Rosa, 4=Bruno)
-- ---------------------------------------------------------------------
INSERT INTO suspeitos
  (nome, cargo_funcao, foto_url, tem_credencial_servidor, descricao_perfil, alibi_declarado, motivo_suspeita, e_culpado)
VALUES
('Eduardo Tanaka', 'Professor de Redes e Infraestrutura', '/img/suspeitos/eduardo.png', TRUE,
 'Professor há 6 anos, responsável pela manutenção de switches e do servidor COFRE. Possui conta própria com acesso de leitura/escrita ao diretório de avaliações, além de conhecer a senha da conta de serviço manutencao_ti.',
 'Estava em casa desde as 20h30. Passei rapidamente no laboratório às 20h10 para checar o switch e fui embora pouco depois.',
 'O gabarito da prova prática inclui questões sobre uma reconfiguração de rede que ele implementou incorretamente em aula; a divulgação do gabarito exporia esse erro.',
 FALSE),

('Lucas Ferreira', 'Aluno Monitor de TI (3º ano)', '/img/suspeitos/lucas.png', TRUE,
 'Aluno do 3º ano, atua como monitor de TI auxiliando na manutenção de notebooks e na configuração de redes da escola. Possui acesso à conta de serviço manutencao_ti, compartilhada informalmente com o Prof. Eduardo.',
 'Cheguei às 20h45 para configurar os notebooks da feira e fiquei até tarde, sempre no estande de robótica. Nunca fui ao laboratório do servidor essa noite.',
 'Teve nota muito baixa em um simulado anterior cujos critérios de avaliação são idênticos aos do gabarito apagado; apagar o arquivo adiaria a prova e daria tempo para reformulação dos critérios.',
 TRUE),

('Rosa Martins', 'Funcionária da Equipe de Limpeza', '/img/suspeitos/rosa.png', FALSE,
 'Funcionária terceirizada responsável pela limpeza dos laboratórios no período noturno, conforme escala semanal. Não possui credenciais de acesso a sistemas da escola.',
 'Fiz a limpeza do laboratório conforme minha escala, das 21h15 às 22h, e depois fui para outro setor.',
 'Esteve fisicamente no laboratório durante parte da janela do crime, levantando suspeita inicial por proximidade.',
 FALSE),

('Bruno Castro', 'Ex-aluno (matrícula trancada)', '/img/suspeitos/bruno.png', FALSE,
 'Ex-aluno do curso técnico, trancou a matrícula após reprovação. Teve credenciais de servidor e VPN revogadas no momento do trancamento.',
 'Eu nem entrei no prédio, só passei pelo estacionamento dos fundos porque ia buscar um amigo.',
 'Guarda ressentimento da escola e da turma atual, sendo apontado anonimamente como possível responsável por sabotagem.',
 FALSE);

-- ---------------------------------------------------------------------
-- CAMERAS
-- ---------------------------------------------------------------------
INSERT INTO cameras (codigo, localizacao, descricao) VALUES
('CAM-01', 'Entrada Principal', 'Câmera que monitora o acesso principal de alunos e funcionários.'),
('CAM-02', 'Laboratório do Servidor (COFRE)', 'Câmera interna do laboratório onde está o rack do servidor COFRE.'),
('CAM-03', 'Estacionamento dos Fundos', 'Câmera que monitora a área de estacionamento e acesso secundário.');

-- ---------------------------------------------------------------------
-- EVIDENCIAS (14)
-- ---------------------------------------------------------------------
INSERT INTO evidencias (codigo, tipo, titulo, descricao, nivel_importancia, data_hora_evento, arquivo_midia_url) VALUES
('EVD-01', 'log_portaria', 'Logs de catraca da noite do crime',
 'Conjunto de registros de entrada e saída por crachá na portaria principal, cobrindo o período das 18h às 22h31.',
 'alta', '2026-06-10 22:25:00', NULL),

('EVD-02', 'log_servidor', 'Sessão remota suspeita no servidor COFRE',
 'Sessão autenticada com o usuário manutencao_ti, originada de IP interno da rede da escola, entre 21h58 e 22h14, com navegação até /cofre/avaliacoes/3ano/ e exclusão do arquivo PROVA_FINAL_3ANO.bak.',
 'decisiva', '2026-06-10 21:58:00', NULL),

('EVD-03', 'camera', 'Registro CAM-02 às 22h20',
 'A câmera do laboratório do servidor registra uma pessoa saindo do local carregando uma pasta/mochila, 6 minutos após o encerramento da sessão remota suspeita.',
 'decisiva', '2026-06-10 22:20:00', '/midia/cam02_2220.jpg'),

('EVD-04', 'camera', 'Registro CAM-01 às 20h45',
 'A câmera da entrada principal registra a chegada de Lucas Ferreira à escola às 20h45.',
 'media', '2026-06-10 20:45:00', '/midia/cam01_2045.jpg'),

('EVD-05', 'camera', 'Registro CAM-03 às 21h40',
 'A câmera do estacionamento dos fundos registra a presença de Bruno Castro na área externa, sem indicação de entrada no prédio.',
 'media', '2026-06-10 21:40:00', '/midia/cam03_2140.jpg'),

('EVD-06', 'depoimento', 'Depoimento da Coordenadora Marisa Andrade',
 'Relato sobre a reunião de coordenação às 19h30 (criação/revisão do arquivo PROVA_FINAL_3ANO.bak) e sobre a descoberta do desaparecimento às 6h40 do dia seguinte.',
 'baixa', '2026-06-11 06:40:00', NULL),

('EVD-07', 'depoimento', 'Depoimento de Eduardo Tanaka',
 'Eduardo afirma ter saído da escola às 20h15, após uma rápida verificação do switch no laboratório.',
 'alta', '2026-06-10 20:30:00', NULL),

('EVD-08', 'depoimento', 'Depoimento de Lucas Ferreira',
 'Lucas afirma nunca ter entrado no laboratório do servidor na noite do crime, permanecendo sempre no estande de robótica.',
 'alta', '2026-06-10 23:00:00', NULL),

('EVD-09', 'depoimento', 'Depoimento de Rosa Martins',
 'Rosa relata ter feito a limpeza do laboratório conforme escala, das 21h15 às 22h, compatível com seu cartão-ponto.',
 'baixa', '2026-06-10 22:05:00', NULL),

('EVD-10', 'depoimento', 'Depoimento de Bruno Castro',
 'Bruno afirma não ter entrado no prédio, apenas ter passado pelo estacionamento dos fundos.',
 'media', '2026-06-10 21:45:00', NULL),

('EVD-11', 'documento', 'Escala de limpeza assinada',
 'Documento da equipe de limpeza confirmando o turno de Rosa Martins no laboratório entre 21h15 e 22h.',
 'baixa', '2026-06-10 21:00:00', '/midia/escala_limpeza.pdf'),

('EVD-12', 'historico_academico', 'Histórico de notas de Lucas Ferreira',
 'Registro mostrando nota 3,2 obtida por Lucas em simulado cujos critérios de avaliação são idênticos aos do gabarito apagado.',
 'alta', '2026-05-20 00:00:00', NULL),

('EVD-13', 'item_fisico', 'Crachá de Monitoria de TI encontrado na pasta vista na CAM-02',
 'Dentro da pasta carregada pela pessoa registrada na CAM-02 às 22h20, há um crachá temporário de "Monitoria de TI" — modelo emitido exclusivamente para alunos monitores, nunca para professores.',
 'decisiva', '2026-06-10 22:20:00', '/midia/cracha_monitoria.jpg'),

('EVD-14', 'log_vpn', 'Tentativa de acesso VPN negada para Bruno Castro',
 'Registro de tentativa de login VPN com as credenciais revogadas de Bruno Castro às 21h50, com status "negado", confirmando que ele não tinha acesso à rede interna da escola.',
 'alta', '2026-06-10 21:50:00', NULL);

-- ---------------------------------------------------------------------
-- RELACAO_EVIDENCIA_SUSPEITO (18 relações)
-- ---------------------------------------------------------------------
INSERT INTO relacao_evidencia_suspeito (id_evidencia, id_suspeito, tipo_relacao) VALUES
(1, 1, 'refuta_alibi'),
(1, 4, 'exclui'),
(2, 1, 'incrimina'),
(2, 2, 'incrimina'),
(2, 4, 'exclui'),
(3, 2, 'refuta_alibi'),
(3, 1, 'neutra'),
(4, 2, 'neutra'),
(5, 4, 'neutra'),
(7, 1, 'refuta_alibi'),
(8, 2, 'refuta_alibi'),
(9, 3, 'reforca_alibi'),
(11, 3, 'exclui'),
(10, 4, 'reforca_alibi'),
(12, 2, 'incrimina'),
(13, 2, 'incrimina'),
(13, 1, 'exclui'),
(14, 4, 'exclui');

-- ---------------------------------------------------------------------
-- DEPOIMENTOS (4 — apenas suspeitos; coordenadora não é suspeita oficial)
-- ---------------------------------------------------------------------
INSERT INTO depoimentos (id_suspeito, data_hora_depoimento, texto_depoimento, eh_alibi, id_evidencia_relacionada) VALUES
(1, '2026-06-11 08:00:00', 'Passei no laboratório às 20h10 apenas para checar um switch que estava instável. Resolvi rapidamente e fui para casa, chegando por volta das 20h30. Não voltei à escola depois disso.', TRUE, 7),
(2, '2026-06-11 08:30:00', 'Cheguei à escola às 20h45 para preparar os notebooks que seriam usados na feira. Fiquei o tempo todo no estande de robótica, ajudando a montar as demonstrações. Não tive motivo para ir ao laboratório do servidor.', TRUE, 8),
(3, '2026-06-11 09:00:00', 'Faço a limpeza dos laboratórios todas as noites, conforme escala. Na noite de ontem, limpei o laboratório do servidor entre 21h15 e 22h, depois fui para o setor administrativo, onde fiquei até o fim do meu turno.', TRUE, 9),
(4, '2026-06-11 09:30:00', 'Eu não entrei na escola. Só passei pelo estacionamento dos fundos por volta das 21h40 porque ia buscar um amigo que trabalha ali perto. Nem cheguei perto da entrada principal.', TRUE, 10);

-- ---------------------------------------------------------------------
-- REGISTROS_CAMERAS
-- ---------------------------------------------------------------------
INSERT INTO registros_cameras (id_camera, id_evidencia, data_hora, descricao_cena, imagem_url, id_suspeito_identificado) VALUES
(2, NULL, '2026-06-10 20:10:00', 'Professor Eduardo Tanaka entra no laboratório do servidor, aparentemente para verificar o rack de switches.', '/midia/cam02_2010.jpg', 1),
(1, 4, '2026-06-10 20:45:00', 'Lucas Ferreira entra pela portaria principal carregando uma mochila com um chaveiro de personagem característico.', '/midia/cam01_2045.jpg', 2),
(3, 5, '2026-06-10 21:40:00', 'Bruno Castro é visto caminhando próximo ao estacionamento dos fundos, sem se aproximar das entradas do prédio.', '/midia/cam03_2140.jpg', 4),
(2, 3, '2026-06-10 22:20:00', 'Uma pessoa sai do laboratório do servidor carregando uma pasta/mochila com o mesmo chaveiro de personagem visto na CAM-01 às 20h45; dentro da pasta é possível identificar parcialmente um crachá de Monitoria de TI.', '/midia/cam02_2220.jpg', 2);

-- ---------------------------------------------------------------------
-- LOGS_ACESSO_PREDIO
-- ---------------------------------------------------------------------
INSERT INTO logs_acesso_predio (id_suspeito, data_hora, tipo_evento, descricao) VALUES
(NULL, '2026-06-10 18:00:00', 'saida', 'Liberação geral de saída de alunos do período noturno.'),
(1, '2026-06-10 20:08:00', 'entrada', 'Professor Eduardo Tanaka entra na escola.'),
(2, '2026-06-10 20:44:00', 'entrada', 'Aluno Lucas Ferreira entra na escola.'),
(3, '2026-06-10 21:10:00', 'entrada', 'Funcionária Rosa Martins entra para o turno de limpeza.'),
(1, '2026-06-10 22:25:00', 'saida', 'Professor Eduardo Tanaka registra saída pela portaria principal — horário incompatível com o álibi declarado de saída às 20h15.'),
(2, '2026-06-10 23:10:00', 'saida', 'Aluno Lucas Ferreira registra saída pela portaria principal, após o término da montagem da feira.'),
(3, '2026-06-10 23:30:00', 'saida', 'Funcionária Rosa Martins registra saída ao final do turno.'),
(NULL, '2026-06-10 22:31:00', 'alarme', 'Sensor de movimento aciona alarme fora do horário, mas é desativado com o código correto de acesso — indicando que a pessoa possuía autorização válida.');

-- ---------------------------------------------------------------------
-- LOGS_SERVIDOR
-- ---------------------------------------------------------------------
INSERT INTO logs_servidor (id_suspeito_responsavel, data_hora_inicio, data_hora_fim, usuario_autenticado, endereco_ip, tipo_rede, acao_realizada, caminho_arquivo, status) VALUES
(NULL, '2026-06-10 21:58:00', '2026-06-10 21:58:00', 'manutencao_ti', '10.0.1.45', 'interna', 'login', NULL, 'sucesso'),
(NULL, '2026-06-10 22:02:00', '2026-06-10 22:02:00', 'manutencao_ti', '10.0.1.45', 'interna', 'navegacao_diretorio', '/cofre/avaliacoes/3ano/', 'sucesso'),
(NULL, '2026-06-10 22:09:00', '2026-06-10 22:09:00', 'manutencao_ti', '10.0.1.45', 'interna', 'exclusao_arquivo', '/cofre/avaliacoes/3ano/PROVA_FINAL_3ANO.bak', 'sucesso'),
(NULL, '2026-06-10 22:14:00', '2026-06-10 22:14:00', 'manutencao_ti', '10.0.1.45', 'interna', 'logout', NULL, 'sucesso'),
(4, '2026-06-10 21:50:00', '2026-06-10 21:50:00', 'bruno.castro', '203.0.113.77', 'vpn', 'login', NULL, 'negado');

-- ---------------------------------------------------------------------
-- RANKING: deixar vazio (populado em runtime pelos visitantes)
-- ---------------------------------------------------------------------
-- Nenhum INSERT aqui de propósito.
