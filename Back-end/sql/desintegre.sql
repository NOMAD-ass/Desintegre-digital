-- Banco de dados da Desintegre Digital

DROP DATABASE IF EXISTS desintegre_digital; 

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


CREATE TABLE IF NOT EXISTS messagens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(250) NOT NULL,
    assunto VARCHAR(250) NOT NULL,
    mensagem TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
)

-- Não existe INSERT de teste aqui de propósito: como a senha precisa
-- estar em formato hash (bcrypt), o jeito certo de criar o primeiro
-- usuário de teste é chamando a própria rota da API:
--
-- POST http://localhost:3000/api/cadastro
-- Body (JSON): { "nome": "Teste", "email": "teste@email.com", "senha": "123456" }
--
-- Isso garante que a senha salva no banco já nasce no formato certo.
