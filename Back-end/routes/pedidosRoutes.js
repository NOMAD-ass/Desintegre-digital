import { Router } from "express";
import Pedido from "../classes/Pedido.js";
import { autenticar, verificarAdmin } from "../middlewares/autenticar.js";

const router = Router();

// ===== CRIAR (usado pelo formulario.html) =====
// POST /pedidos
router.post("/", async (req, res) => {
    try {
        const { nome, email, telefone, mensagem, qtd_hd, marcas_hd, entrega_metodo, entrega_unidade, servicos_selecionados } = req.body;

        if (!nome || !email || !entrega_metodo) {
            return res.status(400).json({ erro: "Preencha nome, email e o método de entrega." });
        }
        if (!Array.isArray(servicos_selecionados) || servicos_selecionados.length === 0) {
            return res.status(400).json({ erro: "Selecione ao menos um serviço." });
        }

        const novoPedido = await Pedido.criar({
            nome, email, telefone, mensagem, qtd_hd, marcas_hd, entrega_metodo, entrega_unidade, servicos_selecionados,
        });

        res.status(201).json({ mensagem: "Solicitação registrada com sucesso!", dados: novoPedido });
    } catch (erro) {
        console.log("Erro ao criar pedido:", erro);
        res.status(500).json({ erro: "Erro interno ao registrar a solicitação." });
    }
});

// ===== LISTAR TODOS (painel administrativo) =====
// GET /pedidos
router.get("/", autenticar, verificarAdmin, async (req, res) => {
    try {
        res.json(await Pedido.listarTodos());
    } catch (erro) {
        console.log("Erro ao listar pedidos:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar pedidos." });
    }
});

// ===== BUSCAR UM (usado na página de acompanhamento) =====
// GET /pedidos/:id
router.get("/:id", async (req, res) => {
    try {
        const pedido = await Pedido.buscarPorId(req.params.id);
        if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado." });
        res.json(pedido);
    } catch (erro) {
        console.log("Erro ao buscar pedido:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar pedido." });
    }
});

// ===== ATUALIZAR STATUS (recebido / em_andamento / concluido) =====
// PUT /pedidos/:id  { status: "concluido" }
router.put("/:id", autenticar, verificarAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const statusValidos = ["recebido", "em_andamento", "concluido"];

        if (!statusValidos.includes(status)) {
            return res.status(400).json({ erro: `Status inválido. Use um de: ${statusValidos.join(", ")}.` });
        }

        const existente = await Pedido.buscarPorId(req.params.id);
        if (!existente) return res.status(404).json({ erro: "Pedido não encontrado." });

        const atualizado = await Pedido.atualizarStatus(req.params.id, status);
        res.json({ mensagem: "Status atualizado com sucesso!", dados: atualizado });
    } catch (erro) {
        console.log("Erro ao atualizar pedido:", erro);
        res.status(500).json({ erro: "Erro interno ao atualizar pedido." });
    }
});

// ===== EXCLUIR =====
// DELETE /pedidos/:id
router.delete("/:id", autenticar, verificarAdmin, async (req, res) => {
    try {
        const excluido = await Pedido.deletar(req.params.id);
        if (!excluido) return res.status(404).json({ erro: "Pedido não encontrado." });
        res.json({ mensagem: "Pedido excluído com sucesso!" });
    } catch (erro) {
        console.log("Erro ao excluir pedido:", erro);
        res.status(500).json({ erro: "Erro interno ao excluir pedido." });
    }
});

export default router;
