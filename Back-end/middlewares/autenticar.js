import jwt from "jsonwebtoken";

const SEGREDO_JWT = process.env.JWT_SECRET || "chave-temporaria-trocar-no-env";

// Confere se veio um token válido no header "Authorization: Bearer <token>".
// Se estiver tudo certo, guarda os dados do usuário em req.usuario.
export function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
        return res.status(401).json({ erro: "Token não informado. Faça login novamente." });
    }

    const token = cabecalho.split(" ")[1];

    try {
        const payload = jwt.verify(token, SEGREDO_JWT);
        req.usuario = payload; // { id, email, admin }
        next();
    } catch (erro) {
        return res.status(401).json({ erro: "Sessão expirada ou token inválido. Faça login novamente." });
    }
}

// Usar sempre DEPOIS do "autenticar" - garante que só administradores
// passam pra frente (upload de certificado, painel de pedidos, etc).
export function verificarAdmin(req, res, next) {
    if (!req.usuario || !req.usuario.admin) {
        return res.status(403).json({ erro: "Acesso restrito a administradores." });
    }
    next();
}
