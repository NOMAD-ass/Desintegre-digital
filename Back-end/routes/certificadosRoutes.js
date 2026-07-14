import { Router } from "express";
import path from "path";
import Certificado from "../classes/Certificado.js";
import { autenticar, verificarAdmin } from "../middlewares/autenticar.js";
import uploadCertificado, { PASTA_UPLOADS } from "../js/uploadCertificado.js";

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

// ===== BUSCAR CERTIFICADO DE UM PEDIDO (consulta pública) =====
// GET /certificados/pedido/:pedidoId
// Usada pela página de acompanhamento pra saber se já existe certificado
// (e se o admin já anexou o PDF oficial) pra aquele pedido.
router.get("/pedido/:pedidoId", async (req, res) => {
    try {
        const certificado = await Certificado.buscarPorPedido(req.params.pedidoId);
        if (!certificado) return res.status(404).json({ erro: "Nenhum certificado emitido para este pedido ainda." });
        res.json(certificado);
    } catch (erro) {
        console.log("Erro ao buscar certificado do pedido:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar certificado." });
    }
});

// ===== ADMIN: ENVIAR (UPLOAD) O PDF OFICIAL DO CERTIFICADO =====
// POST /certificados/pedido/:pedidoId/upload  (multipart/form-data, campo "certificado")
// Só administradores logados podem enviar o PDF.
router.post(
    "/pedido/:pedidoId/upload",
    autenticar,
    verificarAdmin,
    (req, res) => {
        uploadCertificado.single("certificado")(req, res, async (erroUpload) => {
            if (erroUpload) {
                return res.status(400).json({ erro: erroUpload.message || "Erro ao enviar o arquivo." });
            }
            if (!req.file) {
                return res.status(400).json({ erro: "Nenhum arquivo PDF foi enviado." });
            }

            try {
                const certificado = await Certificado.anexarPdf(req.params.pedidoId, req.file.filename);
                res.json({ mensagem: "Certificado em PDF enviado com sucesso!", dados: certificado });
            } catch (erro) {
                console.log("Erro ao anexar PDF ao certificado:", erro);
                res.status(erro.status || 500).json({ erro: erro.message || "Erro interno ao anexar o certificado." });
            }
        });
    }
);

// ===== BAIXAR O PDF OFICIAL DO CERTIFICADO DE UM PEDIDO =====
// GET /certificados/pedido/:pedidoId/arquivo
// Rota pública: quem tem o link (mostrado na página de acompanhamento
// pro dono do pedido) pode baixar o certificado oficial em PDF.
router.get("/pedido/:pedidoId/arquivo", async (req, res) => {
    try {
        const certificado = await Certificado.buscarPorPedido(req.params.pedidoId);
        if (!certificado || !certificado.arquivo_pdf) {
            return res.status(404).json({ erro: "Ainda não há um certificado em PDF anexado para este pedido." });
        }

        const caminhoArquivo = path.join(PASTA_UPLOADS, certificado.arquivo_pdf);
        res.download(caminhoArquivo, `certificado_${certificado.codigo}.pdf`, (erro) => {
            if (erro && !res.headersSent) {
                console.log("Erro ao enviar arquivo do certificado:", erro);
                res.status(404).json({ erro: "Arquivo do certificado não encontrado no servidor." });
            }
        });
    } catch (erro) {
        console.log("Erro ao baixar certificado:", erro);
        res.status(500).json({ erro: "Erro interno ao baixar certificado." });
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
router.get("/", autenticar, verificarAdmin, async (req, res) => {
    try {
        res.json(await Certificado.listarTodos());
    } catch (erro) {
        console.log("Erro ao listar certificados:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar certificados." });
    }
});

export default router;
