import bcrypt from "bcryptjs";
import executarQuery from "../js/db.js";

class Usuario {
    constructor(id, nome, email, isAdmin = false) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.isAdmin = !!isAdmin;
    }

    // Busca um usuário pelo e-mail (traz também a senha, usada só
    // internamente para comparar no login - nunca é devolvida ao frontend)
    static async buscarPorEmail(email) {
        const query = `
            SELECT id, nome, email, senha, is_admin
            FROM usuarios
            WHERE email = ?
        `;
        const resultado = await executarQuery(query, [email]);
        return resultado[0] || null;
    }

    // Cria um novo usuário, já salvando a senha com hash (nunca em texto puro)
    // Cadastro público nunca cria admin (is_admin sempre nasce 0) - a
    // promoção a administrador é feita manualmente direto no banco.
    static async cadastrar(nome, email, senha) {
        const senhaHash = await bcrypt.hash(senha, 10);

        const query = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `;
        const resultado = await executarQuery(query, [nome, email, senhaHash]);

        return new Usuario(resultado.insertId, nome, email, false);
    }

    // Compara a senha digitada no login com o hash salvo no banco
    static async validarSenha(senhaDigitada, senhaHashSalva) {
        return bcrypt.compare(senhaDigitada, senhaHashSalva);
    }
}

export default Usuario;
