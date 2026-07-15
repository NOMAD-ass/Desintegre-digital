
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS certificados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL UNIQUE,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    tipo_destruicao VARCHAR(255) NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);


USE railway;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS is_admin TINYINT(1) NOT NULL DEFAULT 0;

ALTER TABLE certificados
    ADD COLUMN IF NOT EXISTS arquivo_pdf VARCHAR(255) NULL;