import { Router } from "express";
import Certificado from "../classes/Certificado.js";

const router = Router();

// ===== GERAR CERTIFICADO DE UM PEDIDO CONCLUÍDO =====
// POST /certificados/pedido/:pedidoId
router.post("/pedido/:pedidoId", async (req, res) => {
    try {
        const certificado = await Certificado.gerar(req.params.pedidoId);
        res.status(201).json({ mensagem: "Certificado emitido com sucesso!", dados: certificado });
    } catch (erro) {
        console.log("Erro ao gerar certificado:", erro);
        res.status(erro.status || 500).json({ erro: erro.message || "Erro interno ao gerar certificado." });
    }
});

// ===== CONSULTA PÚBLICA DE AUTENTICIDADE =====
// GET /certificados/verificar/:codigo
// Qualquer pessoa com o código do certificado pode conferir se é válido.
router.get("/verificar/:codigo", async (req, res) => {
    try {
        const certificado = await Certificado.buscarPorCodigo(req.params.codigo);
        if (!certificado) {
            return res.status(404).json({ valido: false, erro: "Certificado não encontrado." });
        }
        res.json({ valido: true, dados: certificado });
    } catch (erro) {
        console.log("Erro ao verificar certificado:", erro);
        res.status(500).json({ erro: "Erro interno ao verificar certificado." });
    }
});

// ===== LISTAR TODOS (painel administrativo) =====
// GET /certificados
router.get("/", async (req, res) => {
    try {
        res.json(await Certificado.listarTodos());
    } catch (erro) {
        console.log("Erro ao listar certificados:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar certificados." });
    }
});

export default router;
