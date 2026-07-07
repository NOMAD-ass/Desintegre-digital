DROP DATABASE IF EXISTS login; 
CREATE DATABASE IF NOT EXISTS login; 
USE login; 

CREATE TABLE cadastro ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    email VARCHAR(250) NOT NULL UNIQUE, 
    senha VARCHAR(250) NOT NULL, 
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

-- Adicionado o ponto e vírgula no fina da linha abaixo:
INSERT INTO cadastro ( email, senha, data_criacao ) 
VALUES ( 'Arthr@59685.gmail.com', 'password123', DEFAULT ); 

SELECT id, email, senha FROM cadastro WHERE email = 'Arthr@59685.gmail.com';
