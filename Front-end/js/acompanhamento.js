const API_BASE = "https://desintegre-digital-production.up.railway.app";

document.addEventListener("DOMContentLoaded", () => {
    // ===== BLOQUEIO: só continua se o usuário estiver logado =====
    const bloqueioLogin = document.getElementById("bloqueioLogin");
    const conteudoAcompanhamento = document.getElementById("conteudoAcompanhamento");
    const btnAbrirLoginBloqueio = document.getElementById("btnAbrirLoginBloqueio");
    const modalAuth = document.getElementById("modalAuth");

    function usuarioEstaLogado() {
        return !!localStorage.getItem("usuario");
    }

    if (!usuarioEstaLogado()) {
        bloqueioLogin.classList.remove("hidden");
        conteudoAcompanhamento.classList.add("hidden");

        btnAbrirLoginBloqueio.addEventListener("click", () => {
            modalAuth.classList.add("aberto");
            document.body.style.overflow = "hidden";
        });

        // Fica de olho no localStorage: assim que o login/cadastro for
        // concluído no modal (isso é feito no inicial.js), a página libera o
        // conteúdo sem precisar recarregar.
        const verificadorLogin = setInterval(() => {
            if (usuarioEstaLogado()) {
                clearInterval(verificadorLogin);
                bloqueioLogin.classList.add("hidden");
                conteudoAcompanhamento.classList.remove("hidden");
            }
        }, 500);

        return; // Não inicializa o resto da página enquanto não estiver logado
    }

    conteudoAcompanhamento.classList.remove("hidden");

    // ===== PÁGINA NORMAL (usuário já logado) =====
    const input = document.getElementById("inputProtocolo");
    const botaoBuscar = document.getElementById("btnBuscarProtocolo");
    const feedback = document.getElementById("feedback-acompanhamento");
    const resultado = document.getElementById("resultadoPedido");
    const areaCertificado = document.getElementById("areaCertificado");
    const botaoCertificado = document.getElementById("btnEmitirCertificado");
    const certificadoGerado = document.getElementById("certificadoGerado");
    const botaoBaixar = document.getElementById("btnBaixarCertificado");

    let pedidoAtualId = null;
    let pedidoAtualDados = null;

    botaoBuscar.addEventListener("click", buscarPedido);
    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") buscarPedido();
    });

    async function buscarPedido() {
        const protocolo = input.value.trim().replace("#", "").replace(/^0+/, "");
        if (!protocolo) return mostrarErro("Digite o número do protocolo.");

        esconderErro();
        resultado.classList.add("hidden");
        areaCertificado.classList.add("hidden");
        certificadoGerado.classList.add("hidden");

        try {
            const resposta = await fetch(`${API_BASE}/pedidos/${protocolo}`);
            const dados = await resposta.json();

            if (!resposta.ok) {
                return mostrarErro(dados.erro || "Protocolo não encontrado.");
            }

            preencherResultado(dados);
        } catch (erro) {
            mostrarErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
        }
    }

    function preencherResultado(pedido) {
        pedidoAtualId = pedido.id;
        pedidoAtualDados = pedido;

        document.getElementById("infoProtocolo").textContent = "#" + String(pedido.id).padStart(6, "0");
        document.getElementById("infoNome").textContent = pedido.nome;

        let servicos = [];
        try {
            servicos = JSON.parse(pedido.servicos_selecionados);
        } catch (e) {}
        document.getElementById("infoServicos").textContent = servicos.join(", ") || "-";

        document.getElementById("infoData").textContent = new Date(pedido.data_criacao).toLocaleDateString("pt-BR");

        // Atualiza o stepper visual
        const ordem = ["recebido", "em_andamento", "concluido"];
        const indiceAtual = ordem.indexOf(pedido.status);
        document.querySelectorAll(".step").forEach((el) => {
            const indiceEl = ordem.indexOf(el.dataset.step);
            el.classList.remove("ativo", "concluido");
            if (indiceEl < indiceAtual) el.classList.add("concluido");
            else if (indiceEl === indiceAtual) el.classList.add("ativo");
        });

        resultado.classList.remove("hidden");

        if (pedido.status === "concluido") {
            areaCertificado.classList.remove("hidden");
            verificarCertificadoOficial(pedido.id);
        }
    }

    // Confere se a equipe já anexou o PDF oficial do certificado pra esse
    // pedido (feito pelo painel administrativo). Se sim, mostra o link de
    // download direto em vez de depender só do PDF gerado no navegador.
    async function verificarCertificadoOficial(pedidoId) {
        const certificadoOficial = document.getElementById("certificadoOficial");
        const linkCertificadoOficial = document.getElementById("linkCertificadoOficial");
        certificadoOficial.classList.add("hidden");

        try {
            const resposta = await fetch(`${API_BASE}/certificados/pedido/${pedidoId}`);
            if (!resposta.ok) return;

            const certificado = await resposta.json();
            if (certificado.arquivo_pdf) {
                linkCertificadoOficial.href = `${API_BASE}/certificados/pedido/${pedidoId}/arquivo`;
                certificadoOficial.classList.remove("hidden");
            }
        } catch (erro) {
            // Se não conseguir verificar, simplesmente não mostra o link oficial
            // (o cliente ainda pode gerar o PDF automático abaixo).
        }
    }

    botaoCertificado.addEventListener("click", async () => {
        if (!pedidoAtualId) return;

        botaoCertificado.disabled = true;
        botaoCertificado.textContent = "Emitindo...";

        try {
            const resposta = await fetch(`${API_BASE}/certificados/pedido/${pedidoAtualId}`, { method: "POST" });
            const dados = await resposta.json();

            if (!resposta.ok) {
                return mostrarErro(dados.erro || "Não foi possível emitir o certificado.");
            }

            document.getElementById("codigoCertificado").textContent = dados.dados.codigo;
            certificadoGerado.classList.remove("hidden");
            botaoBaixar.dataset.codigo = dados.dados.codigo;
            botaoBaixar.dataset.emissao = dados.dados.data_emissao;
            botaoBaixar.dataset.tipo = dados.dados.tipo_destruicao;
        } catch (erro) {
            mostrarErro("Não foi possível conectar ao servidor.");
        } finally {
            botaoCertificado.disabled = false;
            botaoCertificado.textContent = "Emitir certificado";
        }
    });

    botaoBaixar.addEventListener("click", () => {
        gerarPdfCertificado({
            codigo: botaoBaixar.dataset.codigo,
            emissao: botaoBaixar.dataset.emissao,
            tipo: botaoBaixar.dataset.tipo,
            pedido: pedidoAtualDados,
        });
    });

    function gerarPdfCertificado({ codigo, emissao, tipo, pedido }) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: "mm", format: "a4" });

        const larguraPagina = doc.internal.pageSize.getWidth();
        const centroX = larguraPagina / 2;

        // Moldura decorativa
        doc.setDrawColor(42, 167, 134);
        doc.setLineWidth(1);
        doc.rect(10, 10, larguraPagina - 20, 277);

        // Cabeçalho
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(20, 20, 40);
        doc.text("DESINTEGRE DIGITAL", centroX, 35, { align: "center" });

        doc.setFontSize(13);
        doc.setTextColor(90, 90, 90);
        doc.text("Certificado de Destruição de Dados", centroX, 44, { align: "center" });

        doc.setDrawColor(200, 200, 200);
        doc.line(30, 50, larguraPagina - 30, 50);

        // Corpo
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);

        const linhas = [
            ["Código do certificado:", codigo || "-"],
            ["Cliente:", pedido?.nome || "-"],
            ["Protocolo do pedido:", "#" + String(pedido?.id).padStart(6, "0")],
            ["Tipo de destruição:", tipo || "-"],
            ["Quantidade de dispositivos:", pedido?.qtd_hd ? String(pedido.qtd_hd) : "Não informado"],
            ["Data da solicitação:", pedido?.data_criacao ? new Date(pedido.data_criacao).toLocaleDateString("pt-BR") : "-"],
            ["Data de emissão do certificado:", emissao ? new Date(emissao).toLocaleDateString("pt-BR") : "-"],
        ];

        let y = 65;
        linhas.forEach(([rotulo, valor]) => {
            doc.setFont("helvetica", "bold");
            doc.text(rotulo, 30, y);
            doc.setFont("helvetica", "normal");
            doc.text(String(valor), 100, y);
            y += 10;
        });

        // Texto legal
        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);
        const textoLegal =
            "Este documento certifica que os dispositivos de armazenamento descritos acima foram " +
            "submetidos ao processo de destruição de dados informado, seguindo os procedimentos de " +
            "segurança da Desintegre Digital, tornando os dados neles contidos irrecuperáveis.";
        const textoQuebrado = doc.splitTextToSize(textoLegal, larguraPagina - 60);
        doc.text(textoQuebrado, 30, y + 8);

        // Verificação
        doc.setFontSize(9);
        doc.setTextColor(130, 130, 130);
        doc.text(
            "A autenticidade deste certificado pode ser verificada com o código acima junto à Desintegre Digital.",
            centroX,
            270,
            { align: "center" }
        );

        doc.save(`certificado_${codigo || pedidoAtualId}.pdf`);
    }

    function mostrarErro(texto) {
        feedback.textContent = texto;
        feedback.className = "feedback erro";
    }

    function esconderErro() {
        feedback.className = "feedback hidden";
    }
});
