# Desintegre Digital — Backend

## Tecnologias
- Node.js + Express
- MySQL (via `mysql2`)
- bcryptjs (hash de senha)
- jsonwebtoken (token de sessão)

## Estrutura
```
Back-end/
  classes/        -> regras de negócio (Usuario.js, Mensagem.js)
  routes/         -> rotas da API (authRoutes.js, mensagensRoutes.js)
  js/
    db.js         -> conexão com o MySQL
    server.js     -> ponto de entrada do servidor
  sql/
    desintegre.sql -> script de criação do banco
  .env.example    -> modelo de variáveis de ambiente
```

## Como rodar localmente

1. **Instalar o MySQL** (se ainda não tiver) e criar o banco rodando o script:
   ```
   sql/desintegre.sql
   ```
   (pode colar o conteúdo no MySQL Workbench, DBeaver, ou `mysql -u root -p < sql/desintegre.sql`)

2. **Configurar as variáveis de ambiente**:
   - Copie `.env.example` para um novo arquivo chamado `.env`
   - Preencha `DB_USER`, `DB_PASSWORD` etc. com os dados do seu MySQL local
   - Troque `JWT_SECRET` por qualquer texto aleatório

3. **Instalar as dependências**:
   ```
   cd Back-end
   npm install
   ```

4. **Rodar o servidor**:
   ```
   npm start
   ```
   Ou, para reiniciar sozinho a cada alteração:
   ```
   npm run dev
   ```

5. O servidor sobe em `http://localhost:3000`.

## Endpoints — Login / Cadastro

### `POST /api/cadastro`
Cria um novo usuário.
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "123456"
}
```
Resposta (201):
```json
{
  "mensagem": "Cadastro realizado com sucesso!",
  "token": "...",
  "usuario": { "id": 1, "nome": "Maria Silva", "email": "maria@email.com" }
}
```

### `POST /api/login`
Autentica um usuário existente.
```json
{
  "email": "maria@email.com",
  "senha": "123456"
}
```
Resposta (200): mesmo formato do cadastro.

Erros comuns: `400` (campo faltando), `401` (email/senha errados), `409` (email já cadastrado).

## Endpoints — Mensagens (formulário de contato)

### `POST /contatos`
Cria uma nova mensagem (usado pelo formulário em `contatos.html`).
```json
{
  "nome": "João Pereira",
  "email": "joao@email.com",
  "telefone": "(31) 99999-9999",
  "assunto": "Orçamento",
  "mensagem": "Preciso destruir 20 HDs de servidores antigos."
}
```
Resposta (201): a mensagem salva, incluindo `id` e `data_criacao`.

### `GET /contatos`
Lista todas as mensagens (mais recentes primeiro). Pensado para um futuro painel administrativo.

### `GET /contatos/:id`
Busca uma mensagem específica pelo id.

### `PUT /contatos/:id`
Marca uma mensagem como respondida (ou não).
```json
{ "respondida": true }
```

### `DELETE /contatos/:id`
Exclui uma mensagem.

## Endpoints — Pedidos (formulário de solicitação em `formulario.html`)

### `POST /pedidos`
Cria uma nova solicitação de coleta/destruição.
```json
{
  "nome": "Empresa XPTO",
  "email": "contato@xpto.com",
  "telefone": "(31) 99999-9999",
  "qtd_hd": 5,
  "marcas_hd": "2x Seagate 1TB",
  "entrega_metodo": "Física",
  "entrega_unidade": "Belo Horizonte - MG",
  "servicos_selecionados": ["Trituração e Fragmentação", "Overwriting"],
  "mensagem": "Urgente"
}
```
Resposta (201): o pedido criado, incluindo o `id` (número de protocolo mostrado ao usuário).

- `GET /pedidos` — lista todos.
- `GET /pedidos/:id` — busca um (usado numa futura página de acompanhamento).
- `PUT /pedidos/:id` `{ "status": "concluido" }` — atualiza o status (`recebido` → `em_andamento` → `concluido`).
- `DELETE /pedidos/:id` — exclui.

## Endpoints — Certificados

### `POST /certificados/pedido/:pedidoId`
Emite o certificado de um pedido. **Só funciona se o pedido já estiver com `status = "concluido"`** — primeiro atualize o status com `PUT /pedidos/:id`, depois gere o certificado.

Resposta (201):
```json
{
  "mensagem": "Certificado emitido com sucesso!",
  "dados": {
    "id": 1,
    "pedido_id": 7,
    "codigo": "DD-2026-00007-A1B2C3D4",
    "tipo_destruicao": "Trituração e Fragmentação, Overwriting",
    "data_emissao": "2026-07-10T12:00:00.000Z"
  }
}
```

### `GET /certificados/verificar/:codigo`
Consulta pública — qualquer pessoa com o código do certificado (ex: escaneando um QR Code no papel do certificado) pode conferir se ele é autêntico e ver os dados do pedido.

### `GET /certificados`
Lista todos os certificados emitidos (painel administrativo).

