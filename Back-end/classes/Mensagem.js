import executarQuery from "../js/db.js";

class Mensagem {
    constructor(id, nome, email, telefone, assunto, mensagem, respondida, data_criacao) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.assunto = assunto;
        this.mensagem = mensagem;
        this.respondida = respondida;
        this.data_criacao = data_criacao;
    }

    // Salva uma nova mensagem vinda do formulário de contato
    static async criar({ nome, email, telefone, assunto, mensagem }) {
        const query = `
            INSERT INTO mensagens (nome, email, telefone, assunto, mensagem)
            VALUES (?, ?, ?, ?, ?)
        `;
        const resultado = await executarQuery(query, [
            nome,
            email,
            telefone || null,
            assunto,
            mensagem,
        ]);

        return Mensagem.buscarPorId(resultado.insertId);
    }

    // Lista todas as mensagens, mais recentes primeiro (para um painel administrativo)
    static async listarTodas() {
        const query = `SELECT * FROM mensagens ORDER BY data_criacao DESC`;
        return executarQuery(query);
    }

    static async buscarPorId(id) {
        const query = `SELECT * FROM mensagens WHERE id = ?`;
        const resultado = await executarQuery(query, [id]);
        return resultado[0] || null;
    }

    // Usado, por exemplo, pra marcar como "já respondida" no painel administrativo
    static async atualizar(id, { respondida }) {
        const query = `UPDATE mensagens SET respondida = ? WHERE id = ?`;
        await executarQuery(query, [respondida ? 1 : 0, id]);
        return Mensagem.buscarPorId(id);
    }

    static async deletar(id) {
        const query = `DELETE FROM mensagens WHERE id = ?`;
        const resultado = await executarQuery(query, [id]);
        return resultado.affectedRows > 0;
    }
}

export default Mensagem;
