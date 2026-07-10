import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoutes.js";
import mensagensRoutes from "../routes/mensagensRoutes.js";
import pedidosRoutes from "../routes/pedidosRoutes.js";
import certificadosRoutes from "../routes/certificadosRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Todas as rotas de autenticação ficam sob /api
// -> POST /api/cadastro
// -> POST /api/login
app.use("/api", authRoutes);

// Rotas do formulário de contato (o front-end já chama esse caminho)
// -> POST   /contatos      (enviar mensagem)
// -> GET    /contatos      (listar todas)
// -> GET    /contatos/:id  (buscar uma)
// -> PUT    /contatos/:id  (marcar como respondida)
// -> DELETE /contatos/:id  (excluir)
app.use("/contatos", mensagensRoutes);

// Rotas do formulário de solicitação (formulario.html)
// -> POST   /pedidos      (nova solicitação de coleta/destruição)
// -> GET    /pedidos      (listar todas)
// -> GET    /pedidos/:id  (buscar uma - acompanhamento)
// -> PUT    /pedidos/:id  (atualizar status)
// -> DELETE /pedidos/:id  (excluir)
app.use("/pedidos", pedidosRoutes);

// Rotas de certificado
// -> POST /certificados/pedido/:pedidoId  (emitir certificado de um pedido concluído)
// -> GET  /certificados/verificar/:codigo (consulta pública de autenticidade)
// -> GET  /certificados                   (listar todos)
app.use("/certificados", certificadosRoutes);

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor online em http://localhost:${PORTA}`);
});
