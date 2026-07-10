import { Router } from "express";
import Mensagem from "../classes/Mensagem.js";

const router = Router();

// ===== CRIAR (usado pelo formulário em contatos.html) =====
// POST /contatos  { nome, email, telefone, assunto, mensagem }
router.post("/", async (req, res) => {
    try {
        const { nome, email, telefone, assunto, mensagem } = req.body;

        if (!nome || !email || !assunto || !mensagem) {
            return res.status(400).json({
                erro: "Preencha nome, email, assunto e mensagem.",
            });
        }

        const novaMensagem = await Mensagem.criar({ nome, email, telefone, assunto, mensagem });

        res.status(201).json({
            mensagem: "Mensagem enviada com sucesso!",
            dados: novaMensagem,
        });
    } catch (erro) {
        console.log("Erro ao criar mensagem:", erro);
        res.status(500).json({ erro: "Erro interno ao enviar mensagem. Tente novamente." });
    }
});

// ===== LISTAR TODAS (para um futuro painel administrativo) =====
// GET /contatos
router.get("/", async (req, res) => {
    try {
        const mensagens = await Mensagem.listarTodas();
        res.json(mensagens);
    } catch (erro) {
        console.log("Erro ao listar mensagens:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar mensagens." });
    }
});

// ===== BUSCAR UMA MENSAGEM =====
// GET /contatos/:id
router.get("/:id", async (req, res) => {
    try {
        const mensagem = await Mensagem.buscarPorId(req.params.id);
        if (!mensagem) {
            return res.status(404).json({ erro: "Mensagem não encontrada." });
        }
        res.json(mensagem);
    } catch (erro) {
        console.log("Erro ao buscar mensagem:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar mensagem." });
    }
});

// ===== ATUALIZAR (ex: marcar como respondida) =====
// PUT /contatos/:id  { respondida: true }
router.put("/:id", async (req, res) => {
    try {
        const existente = await Mensagem.buscarPorId(req.params.id);
        if (!existente) {
            return res.status(404).json({ erro: "Mensagem não encontrada." });
        }

        const atualizada = await Mensagem.atualizar(req.params.id, {
            respondida: req.body.respondida,
        });

        res.json({ mensagem: "Mensagem atualizada com sucesso!", dados: atualizada });
    } catch (erro) {
        console.log("Erro ao atualizar mensagem:", erro);
        res.status(500).json({ erro: "Erro interno ao atualizar mensagem." });
    }
});

// ===== EXCLUIR =====
// DELETE /contatos/:id
router.delete("/:id", async (req, res) => {
    try {
        const excluida = await Mensagem.deletar(req.params.id);
        if (!excluida) {
            return res.status(404).json({ erro: "Mensagem não encontrada." });
        }
        res.json({ mensagem: "Mensagem excluída com sucesso!" });
    } catch (erro) {
        console.log("Erro ao excluir mensagem:", erro);
        res.status(500).json({ erro: "Erro interno ao excluir mensagem." });
    }
});

export default router;
