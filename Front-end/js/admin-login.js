const API_URL = "https://desintegre-digital-production.up.railway.app/api";

document.addEventListener("DOMContentLoaded", () => {
    // Se já tiver uma sessão de admin válida, pula direto pro painel.
    if (localStorage.getItem("admin_token") && localStorage.getItem("admin_usuario")) {
        window.location.href = "admin.html";
        return;
    }

    const form = document.getElementById("formAdminLogin");
    const mensagem = document.getElementById("mensagemAdminLogin");
    const botao = document.getElementById("botaoEntrarAdmin");

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        esconderMensagem();

        const email = document.getElementById("adminEmail").value.trim();
        const senha = document.getElementById("adminSenha").value;

        if (!email || !senha) {
            return mostrarMensagem("Preencha e-mail e senha.", "erro");
        }

        botao.disabled = true;
        botao.textContent = "Entrando...";

        try {
            const resposta = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                return mostrarMensagem(dados.erro || "Não foi possível entrar.", "erro");
            }

            if (!dados.usuario.admin) {
                return mostrarMensagem("Esta conta não tem permissão de administrador.", "erro");
            }

            localStorage.setItem("admin_token", dados.token);
            localStorage.setItem("admin_usuario", JSON.stringify(dados.usuario));

            window.location.href = "admin.html";
        } catch (erro) {
            mostrarMensagem("Não foi possível conectar ao servidor.", "erro");
        } finally {
            botao.disabled = false;
            botao.textContent = "Entrar";
        }
    });

    function mostrarMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.className = `feedback ${tipo}`;
    }

    function esconderMensagem() {
        mensagem.className = "feedback hidden";
    }
});
