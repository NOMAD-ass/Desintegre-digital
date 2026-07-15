// Endereço do backend usado no login/cadastro. Trocar pela URL do Railway quando fizer o deploy.
const API_URL = "https://desintegre-digital-production.up.railway.app/api";

class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
  }

  addClickEvent() {
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
  }

  init() {
    this.addClickEvent();
    return this;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o menu responsivo
  const mobileNavbar = new MobileNavbar(".mobile-menu", ".nav-list", ".nav-list li");
  mobileNavbar.init();

  // Lógica do botão de tema alternando suas imagens originais e logos correspondentes
  const botao = document.querySelector('#botaoTema');
  const icone = document.querySelector('#iconeTema');
  const logo = document.querySelector('.logo-img'); // <--- Seleciona a imagem da sua logo

  if (botao && icone) {
    botao.addEventListener('click', () => {
      icone.classList.add('rodar-icone');

      setTimeout(() => {
        icone.classList.remove('rodar-icone');
      }, 500);

      if (document.body.classList.contains('tema-claro')) {
        // MUDANDO PARA O TEMA ESCURO
        document.body.classList.remove('tema-claro');
        document.body.classList.add('tema-escuro');
        icone.src = "../icon/lua.png";
        
        // Se a logo existir, define o caminho da logo para o tema escuro (logo branca/original)
        if (logo) {
          logo.src = "../img/logo2.png"; // <-- Ajuste o caminho da sua logo escura/original aqui se necessário
        }
      } else {
        // MUDANDO PARA O TEMA CLARO
        document.body.classList.remove('tema-escuro');
        document.body.classList.add('tema-claro');
        icone.src = "../icon/sol.png";
        
        // Se a logo existir, define o caminho da logo para o tema claro (logo roxa/escura)
        if (logo) {
          logo.src = "../img/logo2-claro.png"; // <-- Ajuste o caminho da sua nova logo clara aqui
        }
      }
    });
  }

  // =========================================
  // LOGIN / CADASTRO (modal)
  // =========================================
  inicializarAuth();
});

function inicializarAuth() {
    // ----- Elementos principais -----
    const botaoLogin = document.getElementById("botaoLogin");
    const modal = document.getElementById("modalAuth");
    const fecharModal = document.getElementById("fecharModalAuth");

    const painelLogin = document.getElementById("painelLogin");
    const painelCadastro = document.getElementById("painelCadastro");
    const irParaCadastro = document.getElementById("irParaCadastro");
    const irParaLogin = document.getElementById("irParaLogin");

    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");
    const mensagemLogin = document.getElementById("mensagemLogin");
    const mensagemCadastro = document.getElementById("mensagemCadastro");

    // ----- Opção "Entrar como administrador" -----
    const loginComoAdmin = document.getElementById("loginComoAdmin");
    const loginEmailInput = document.getElementById("loginEmail");
    const labelLoginEmail = document.getElementById("labelLoginEmail");

    if (loginComoAdmin && loginEmailInput && labelLoginEmail) {
        loginComoAdmin.addEventListener("change", () => {
            if (loginComoAdmin.checked) {
                // Login fixo: usuário e senha "admin" - por isso o campo
                // deixa de exigir formato de e-mail.
                loginEmailInput.type = "text";
                loginEmailInput.placeholder = "admin";
                labelLoginEmail.textContent = "Usuário";
            } else {
                loginEmailInput.type = "email";
                loginEmailInput.placeholder = "seu@email.com";
                labelLoginEmail.textContent = "E-mail";
            }
        });
    }

    if (!modal || !botaoLogin) return; // Página sem modal de login, não faz nada

    // ----- ABRIR / FECHAR MODAL -----
    function abrirModal() {
        // Se já estiver logado, o botão funciona como "sair" em vez de abrir o modal
        if (obterUsuarioLogado()) {
            const usuario = obterUsuarioLogado();
            const sair = confirm(`Você está logado como ${usuario.nome}. Deseja sair?`);
            if (sair) fazerLogout();
            return;
        }

        mostrarPainelLogin();
        modal.classList.add("aberto");
        document.body.style.overflow = "hidden";
    }

    function fecharModalAuth() {
        modal.classList.remove("aberto");
        document.body.style.overflow = "";
        limparMensagens();
    }

    botaoLogin.addEventListener("click", abrirModal);
    fecharModal.addEventListener("click", fecharModalAuth);

    // Fecha ao clicar fora da caixa (no fundo escurecido)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModalAuth();
    });

    // Fecha com a tecla ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("aberto")) {
            fecharModalAuth();
        }
    });

    // ----- TROCAR ENTRE OS DOIS PAINÉIS (LOGIN <-> CADASTRO) -----
    function mostrarPainelLogin() {
        painelCadastro.classList.add("modal-painel-oculto");
        painelLogin.classList.remove("modal-painel-oculto");
        limparMensagens();
    }

    function mostrarPainelCadastro() {
        painelLogin.classList.add("modal-painel-oculto");
        painelCadastro.classList.remove("modal-painel-oculto");
        limparMensagens();
    }

    irParaCadastro.addEventListener("click", mostrarPainelCadastro);
    irParaLogin.addEventListener("click", mostrarPainelLogin);

    // ----- MENSAGENS DE ERRO / SUCESSO -----
    function mostrarMensagem(elemento, tipo, texto) {
        elemento.textContent = texto;
        elemento.className = "modal-mensagem " + tipo; // "erro" ou "sucesso"
    }

    function limparMensagens() {
        mensagemLogin.className = "modal-mensagem";
        mensagemLogin.textContent = "";
        mensagemCadastro.className = "modal-mensagem";
        mensagemCadastro.textContent = "";
    }

    // ----- SESSÃO (localStorage) -----
    function salvarSessao(token, usuario) {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario));
    }

    function obterUsuarioLogado() {
        const dados = localStorage.getItem("usuario");
        return dados ? JSON.parse(dados) : null;
    }

    function fazerLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        atualizarBotaoLogin();
    }

    function atualizarBotaoLogin() {
        const usuario = obterUsuarioLogado();
        botaoLogin.textContent = usuario ? `Olá, ${usuario.nome.split(" ")[0]}` : "Login";
    }

    atualizarBotaoLogin(); // Estado inicial ao carregar a página

    // ----- ENVIO DO FORMULÁRIO DE LOGIN -----
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        limparMensagens();

        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;

        if (!email || !senha) {
            mostrarMensagem(mensagemLogin, "erro", "Preencha e-mail e senha.");
            return;
        }

        const botao = formLogin.querySelector("button[type=submit]");
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
                mostrarMensagem(mensagemLogin, "erro", dados.erro || "Não foi possível entrar.");
                return;
            }

            // Login administrativo: manda direto pro painel /admin em vez
            // de só fechar o modal.
            if (loginComoAdmin && loginComoAdmin.checked) {
                if (!dados.usuario.admin) {
                    mostrarMensagem(mensagemLogin, "erro", "Usuário ou senha administrativa incorretos.");
                    return;
                }

                localStorage.setItem("admin_token", dados.token);
                localStorage.setItem("admin_usuario", JSON.stringify(dados.usuario));

                mostrarMensagem(mensagemLogin, "sucesso", "Login administrativo realizado! Redirecionando...");
                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 800);
                return;
            }

            salvarSessao(dados.token, dados.usuario);
            atualizarBotaoLogin();
            mostrarMensagem(mensagemLogin, "sucesso", "Login realizado! Redirecionando...");

            setTimeout(fecharModalAuth, 1200);
        } catch (erro) {
            // Provavelmente o backend não está rodando
            mostrarMensagem(
                mensagemLogin,
                "erro",
                "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
            );
        } finally {
            botao.disabled = false;
            botao.textContent = "Entrar";
        }
    });

    // ----- ENVIO DO FORMULÁRIO DE CADASTRO -----
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();
        limparMensagens();

        const nome = document.getElementById("cadastroNome").value.trim();
        const email = document.getElementById("cadastroEmail").value.trim();
        const senha = document.getElementById("cadastroSenha").value;
        const confirmarSenha = document.getElementById("cadastroConfirmarSenha").value;

        if (!nome || !email || !senha || !confirmarSenha) {
            mostrarMensagem(mensagemCadastro, "erro", "Preencha todos os campos.");
            return;
        }
        if (senha.length < 6) {
            mostrarMensagem(mensagemCadastro, "erro", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (senha !== confirmarSenha) {
            mostrarMensagem(mensagemCadastro, "erro", "As senhas não coincidem.");
            return;
        }

        const botao = formCadastro.querySelector("button[type=submit]");
        botao.disabled = true;
        botao.textContent = "Criando conta...";

        try {
            const resposta = await fetch(`${API_URL}/cadastro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                mostrarMensagem(mensagemCadastro, "erro", dados.erro || "Não foi possível cadastrar.");
                return;
            }

            salvarSessao(dados.token, dados.usuario);
            atualizarBotaoLogin();
            mostrarMensagem(mensagemCadastro, "sucesso", "Conta criada com sucesso!");

            setTimeout(fecharModalAuth, 1200);
        } catch (erro) {
            mostrarMensagem(
                mensagemCadastro,
                "erro",
                "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
            );
        } finally {
            botao.disabled = false;
            botao.textContent = "Criar conta";
        }
    });
}
