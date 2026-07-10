import executarQuery from "../js/db.js";

class Pedido {
    // Cria uma nova solicitação de coleta/destruição (vinda de formulario.html)
    static async criar({ nome, email, telefone, mensagem, qtd_hd, marcas_hd, entrega_metodo, entrega_unidade, servicos_selecionados, usuario_id = null }) {
        const query = `
            INSERT INTO pedidos
                (usuario_id, nome, email, telefone, mensagem, qtd_hd, marcas_hd, entrega_metodo, entrega_unidade, servicos_selecionados)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const resultado = await executarQuery(query, [
            usuario_id,
            nome,
            email,
            telefone || null,
            mensagem || null,
            qtd_hd || null,
            marcas_hd || null,
            entrega_metodo,
            entrega_unidade || null,
            JSON.stringify(servicos_selecionados || []),
        ]);

        return Pedido.buscarPorId(resultado.insertId);
    }

    static async listarTodos() {
        const query = `SELECT * FROM pedidos ORDER BY data_criacao DESC`;
        return executarQuery(query);
    }

    static async buscarPorId(id) {
        const query = `SELECT * FROM pedidos WHERE id = ?`;
        const resultado = await executarQuery(query, [id]);
        return resultado[0] || null;
    }

    // Atualiza o status do processo (recebido -> em_andamento -> concluido)
    static async atualizarStatus(id, status) {
        const query = `UPDATE pedidos SET status = ? WHERE id = ?`;
        await executarQuery(query, [status, id]);
        return Pedido.buscarPorId(id);
    }

    static async deletar(id) {
        const query = `DELETE FROM pedidos WHERE id = ?`;
        const resultado = await executarQuery(query, [id]);
        return resultado.affectedRows > 0;
    }
}

export default Pedido;
