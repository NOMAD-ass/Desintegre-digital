-- Banco de dados da Desintegre Digital

-- ATENÇÃO: NÃO usar "DROP DATABASE" aqui depois que o projeto já estiver em
-- uso - isso apaga TODOS os usuários e mensagens já cadastrados toda vez que
-- o script for executado de novo. Rode o DROP manualmente (só se quiser
-- mesmo recomeçar do zero), nunca deixe ele automático dentro do script.

CREATE DATABASE IF NOT EXISTS desintegre_digital;
USE desintegre_digital;

-- Tabela de usuários (login / cadastro)
-- A senha NUNCA é salva em texto puro: o backend salva um hash (bcrypt)
-- gerado a partir da senha digitada no cadastro.
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens (formulário de contato da página "contatos.html")
CREATE TABLE IF NOT EXISTS mensagens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(250) NOT NULL,
    telefone VARCHAR(20),
    assunto VARCHAR(250) NOT NULL,
    mensagem TEXT NOT NULL,
    respondida TINYINT(1) NOT NULL DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos (formulário "formulario.html" - solicitação de coleta/destruição)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(250) NOT NULL,
    telefone VARCHAR(20),
    mensagem TEXT,
    qtd_hd INT,
    marcas_hd VARCHAR(500),
    entrega_metodo ENUM('Correios', 'Física', 'Casa') NOT NULL,
    entrega_unidade VARCHAR(150) NULL,
    servicos_selecionados JSON NOT NULL,
    status ENUM('recebido', 'em_andamento', 'concluido') NOT NULL DEFAULT 'recebido',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de certificados (emitidos quando um pedido é concluído)
CREATE TABLE IF NOT EXISTS certificados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL UNIQUE,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    tipo_destruicao VARCHAR(255) NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- Não existe INSERT de teste aqui de propósito: como a senha precisa
-- estar em formato hash (bcrypt), o jeito certo de criar o primeiro
-- usuário de teste é chamando a própria rota da API:
--
-- POST http://localhost:3000/api/cadastro
-- Body (JSON): { "nome": "Teste", "email": "teste@email.com", "senha": "123456" }
--
-- Isso garante que a senha salva no banco já nasce no formato certo.
