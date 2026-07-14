-- Migração: painel de administrador + upload de certificado em PDF
-- Rode este script UMA VEZ no banco já existente (não recria as tabelas).

USE desintegre_digital;

-- 1) Marca quais usuários são administradores.
--    Por padrão todo mundo é 0 (comum). Promova um usuário à mão depois.
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS is_admin TINYINT(1) NOT NULL DEFAULT 0;

-- 2) Guarda o nome do arquivo PDF que o admin enviou pra aquele certificado.
--    Fica NULL até o admin fazer o upload.
ALTER TABLE certificados
    ADD COLUMN IF NOT EXISTS arquivo_pdf VARCHAR(255) NULL;

-- 3) Para transformar um usuário já cadastrado em administrador, rode
--    (trocando o e-mail pelo da conta que vai logar no painel /admin):
--
-- UPDATE usuarios SET is_admin = 1 WHERE email = 'admin@desintegredigital.com';
