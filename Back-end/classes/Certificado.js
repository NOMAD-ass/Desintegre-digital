import crypto from "crypto";
import executarQuery from "../js/db.js";
import Pedido from "./Pedido.js";

class Certificado {
    // Gera o certificado de um pedido - só é permitido quando o pedido
    // já está com status "concluido" (destruição finalizada)
    static async gerar(pedidoId) {
        const pedido = await Pedido.buscarPorId(pedidoId);
        if (!pedido) {
            const erro = new Error("Pedido não encontrado.");
            erro.status = 404;
            throw erro;
        }
        if (pedido.status !== "concluido") {
            const erro = new Error("O pedido ainda não foi concluído. O certificado só pode ser emitido após a destruição ser finalizada.");
            erro.status = 400;
            throw erro;
        }

        const existente = await Certificado.buscarPorPedido(pedidoId);
        if (existente) return existente; // Evita gerar dois certificados pro mesmo pedido

        const ano = new Date().getFullYear();
        const sufixo = crypto.randomBytes(4).toString("hex").toUpperCase();
        const codigo = `DD-${ano}-${String(pedido.id).padStart(5, "0")}-${sufixo}`;

        const servicos = JSON.parse(pedido.servicos_selecionados || "[]");
        const tipoDestruicao = servicos.join(", ") || "Não especificado";

        const query = `
            INSERT INTO certificados (pedido_id, codigo, tipo_destruicao)
            VALUES (?, ?, ?)
        `;
        const resultado = await executarQuery(query, [pedidoId, codigo, tipoDestruicao]);

        return Certificado.buscarPorId(resultado.insertId);
    }

    static async buscarPorId(id) {
        const query = `SELECT * FROM certificados WHERE id = ?`;
        const resultado = await executarQuery(query, [id]);
        return resultado[0] || null;
    }

    static async buscarPorPedido(pedidoId) {
        const query = `SELECT * FROM certificados WHERE pedido_id = ?`;
        const resultado = await executarQuery(query, [pedidoId]);
        return resultado[0] || null;
    }

    // Consulta pública de autenticidade: qualquer pessoa com o código
    // consegue conferir se o certificado é válido (rastreabilidade)
    static async buscarPorCodigo(codigo) {
        const query = `
            SELECT c.*, p.nome AS cliente_nome, p.qtd_hd, p.data_criacao AS pedido_data
            FROM certificados c
            JOIN pedidos p ON p.id = c.pedido_id
            WHERE c.codigo = ?
        `;
        const resultado = await executarQuery(query, [codigo]);
        return resultado[0] || null;
    }

    static async listarTodos() {
        const query = `SELECT * FROM certificados ORDER BY data_emissao DESC`;
        return executarQuery(query);
    }
}

export default Certificado;
