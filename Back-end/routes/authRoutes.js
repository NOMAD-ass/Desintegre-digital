import { Router } from "express";
import jwt from "jsonwebtoken";
import Usuario from "../classes/Usuario.js";

const router = Router();
// Se esquecerem de configurar o .env, usamos uma chave padrão pra não
// derrubar o servidor - mas isso NUNCA deve ir pra produção assim.
const SEGREDO_JWT = process.env.JWT_SECRET || "chave-temporaria-trocar-no-env";

// ===== CADASTRO =====
// POST /api/cadastro  { nome, email, senha }
router.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: "Preencha nome, email e senha." });
        }
        if (senha.length < 6) {
            return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
        }

        const usuarioExistente = await Usuario.buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
        }

        const novoUsuario = await Usuario.cadastrar(nome, email, senha);

        const token = jwt.sign(
            { id: novoUsuario.id, email: novoUsuario.email, admin: novoUsuario.isAdmin },
            SEGREDO_JWT,
            { expiresIn: "2h" }
        );

        res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!",
            token,
            usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, admin: novoUsuario.isAdmin },
        });
    } catch (erro) {
        console.log("Erro no cadastro:", erro);
        res.status(500).json({ erro: "Erro interno ao cadastrar. Tente novamente." });
    }
});

// ===== LOGIN =====
// POST /api/login  { email, senha }
router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Preencha email e senha." });
        }

        const usuario = await Usuario.buscarPorEmail(email);
        if (!usuario) {
            // Mensagem genérica de propósito: não revela se o problema
            // foi o email ou a senha, por segurança.
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        const senhaValida = await Usuario.validarSenha(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, admin: !!usuario.is_admin },
            SEGREDO_JWT,
            { expiresIn: "2h" }
        );

        res.json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, admin: !!usuario.is_admin },
        });
    } catch (erro) {
        console.log("Erro no login:", erro);
        res.status(500).json({ erro: "Erro interno ao entrar. Tente novamente." });
    }
});

export default router;
