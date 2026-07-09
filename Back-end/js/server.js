import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Todas as rotas de autenticação ficam sob /api
// -> POST /api/cadastro
// -> POST /api/login
app.use("/api", authRoutes);

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor online em http://localhost:${PORTA}`);
});
