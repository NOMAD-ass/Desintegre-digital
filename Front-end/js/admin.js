const API_BASE = "https://desintegre-digital-production.up.railway.app";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("admin_token");
    const usuarioTexto = localStorage.getItem("admin_usuario");

    // Sem sessão de admin válida -> manda pro login administrativo.
    if (!token || !usuarioTexto) {
        window.location.href = "admin-login.html";
        return;
    }

    const usuario = JSON.parse(usuarioTexto);
    if (!usuario.admin) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_usuario");
        window.location.href = "admin-login.html";
        return;
    }

    document.getElementById("adminNomeLogado").textContent = usuario.nome;

    document.getElementById("botaoSairAdmin").addEventListener("click", () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_usuario");
        window.location.href = "admin-login.html";
    });

    const listaPedidos = document.getElementById("listaPedidos");
    const filtroStatus = document.getElementById("filtroStatus");
    const mensagemAdmin = document.getElementById("mensagemAdmin");

    document.getElementById("botaoAtualizarLista").addEventListener("click", carregarPedidos);
    filtroStatus.addEventListener("change", carregarPedidos);

    carregarPedidos();

    async function chamarApi(caminho, opcoes = {}) {
        const resposta = await fetch(`${API_BASE}${caminho}`, {
            ...opcoes,
            headers: {
                ...(opcoes.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        });

        if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_usuario");
            window.location.href = "admin-login.html";
            throw new Error("Sessão expirada.");
        }

        return resposta;
    }

    async function carregarPedidos() {
        listaPedidos.innerHTML = `<p class="admin-carregando">Carregando pedidos...</p>`;
        esconderMensagem();

        try {
            const resposta = await chamarApi("/pedidos");
            const pedidos = await resposta.json();

            if (!resposta.ok) {
                listaPedidos.innerHTML = "";
                return mostrarMensagem(pedidos.erro || "Erro ao carregar pedidos.", "erro");
            }

            const filtro = filtroStatus.value;
            const filtrados = filtro === "todos" ? pedidos : pedidos.filter((p) => p.status === filtro);

            renderizarPedidos(filtrados);
        } catch (erro) {
            listaPedidos.innerHTML = "";
            mostrarMensagem("Não foi possível conectar ao servidor.", "erro");
        }
    }

    async function renderizarPedidos(pedidos) {
        if (pedidos.length === 0) {
            listaPedidos.innerHTML = `<p class="admin-carregando">Nenhum pedido encontrado para esse filtro.</p>`;
            return;
        }

        listaPedidos.innerHTML = "";

        for (const pedido of pedidos) {
            const card = document.createElement("div");
            card.className = "admin-pedido-card";

            const rotulosStatus = { recebido: "Recebido", em_andamento: "Em andamento", concluido: "Concluído" };
            const protocolo = "#" + String(pedido.id).padStart(6, "0");

            card.innerHTML = `
                <div class="admin-pedido-info">
                    <div class="admin-pedido-protocolo">${protocolo}</div>
                    <div class="admin-pedido-nome">${escaparHtml(pedido.nome)}</div>
                    <div class="admin-pedido-detalhe">${escaparHtml(pedido.email)}</div>
                    <span class="admin-status-badge ${pedido.status}">${rotulosStatus[pedido.status] || pedido.status}</span>
                </div>
                <div class="admin-pedido-acoes" data-pedido-id="${pedido.id}">
                    <div class="admin-status-controle">
                        <select class="admin-select-status" data-pedido="${pedido.id}">
                            <option value="recebido" ${pedido.status === "recebido" ? "selected" : ""}>Recebido</option>
                            <option value="em_andamento" ${pedido.status === "em_andamento" ? "selected" : ""}>Em andamento</option>
                            <option value="concluido" ${pedido.status === "concluido" ? "selected" : ""}>Concluído</option>
                        </select>
                        <button class="admin-botao-secundario admin-botao-status" data-pedido="${pedido.id}">Salvar status</button>
                    </div>
                    <div class="admin-area-certificado"></div>
                </div>
            `;

            const areaCertificado = card.querySelector(".admin-area-certificado");

            if (pedido.status === "concluido") {
                await montarAreaCertificado(areaCertificado, pedido);
            } else {
                areaCertificado.innerHTML = `<span class="admin-pedido-detalhe">Aguardando conclusão do pedido para anexar certificado.</span>`;
            }

            const botaoStatus = card.querySelector(".admin-botao-status");
            const selectStatus = card.querySelector(".admin-select-status");
            botaoStatus.addEventListener("click", () => atualizarStatusPedido(pedido.id, selectStatus, botaoStatus));

            listaPedidos.appendChild(card);
        }
    }

    async function atualizarStatusPedido(pedidoId, selectStatus, botao) {
        const novoStatus = selectStatus.value;
        esconderMensagem();
        botao.disabled = true;
        const textoOriginal = botao.textContent;
        botao.textContent = "Salvando...";

        try {
            const resposta = await chamarApi(`/pedidos/${pedidoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus }),
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                return mostrarMensagem(dados.erro || "Não foi possível atualizar o status.", "erro");
            }

            mostrarMensagem(`Status do pedido #${String(pedidoId).padStart(6, "0")} atualizado com sucesso!`, "sucesso");
            await carregarPedidos();
        } catch (erro) {
            mostrarMensagem("Não foi possível conectar ao servidor.", "erro");
        } finally {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    }

    async function montarAreaCertificado(container, pedido) {
        container.innerHTML = `<span class="admin-pedido-detalhe">Verificando certificado...</span>`;

        let certificado = null;
        try {
            const resposta = await chamarApi(`/certificados/pedido/${pedido.id}`);
            if (resposta.ok) certificado = await resposta.json();
        } catch (erro) {
            // Segue o fluxo mesmo se der erro na verificação — só não mostra o status existente
        }

        if (certificado && certificado.arquivo_pdf) {
            container.innerHTML = `
                <span class="admin-certificado-status">✅ PDF enviado</span>
                <a class="admin-link-baixar" href="${API_BASE}/certificados/pedido/${pedido.id}/arquivo" target="_blank" rel="noopener">Baixar atual</a>
                <input type="file" accept="application/pdf" data-pedido="${pedido.id}">
                <button class="admin-botao-upload" data-pedido="${pedido.id}">Substituir PDF</button>
            `;
        } else {
            container.innerHTML = `
                <input type="file" accept="application/pdf" data-pedido="${pedido.id}">
                <button class="admin-botao-upload" data-pedido="${pedido.id}">Enviar certificado (PDF)</button>
            `;
        }

        const botaoUpload = container.querySelector(".admin-botao-upload");
        const inputArquivo = container.querySelector("input[type='file']");

        botaoUpload.addEventListener("click", () => enviarCertificado(pedido.id, inputArquivo, botaoUpload, container));
    }

    async function enviarCertificado(pedidoId, inputArquivo, botao, container) {
        const arquivo = inputArquivo.files[0];
        if (!arquivo) return mostrarMensagem("Selecione um arquivo PDF antes de enviar.", "erro");
        if (arquivo.type !== "application/pdf") return mostrarMensagem("O arquivo precisa ser um PDF.", "erro");

        esconderMensagem();
        botao.disabled = true;
        const textoOriginal = botao.textContent;
        botao.textContent = "Enviando...";

        const formData = new FormData();
        formData.append("certificado", arquivo);

        try {
            const resposta = await chamarApi(`/certificados/pedido/${pedidoId}/upload`, {
                method: "POST",
                body: formData,
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                return mostrarMensagem(dados.erro || "Não foi possível enviar o certificado.", "erro");
            }

            mostrarMensagem(`Certificado enviado com sucesso para o pedido #${String(pedidoId).padStart(6, "0")}.`, "sucesso");
            await montarAreaCertificado(container, { id: pedidoId, status: "concluido" });
        } catch (erro) {
            mostrarMensagem("Não foi possível conectar ao servidor.", "erro");
        } finally {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    }

    function mostrarMensagem(texto, tipo) {
        mensagemAdmin.textContent = texto;
        mensagemAdmin.className = `feedback ${tipo}`;
    }

    function esconderMensagem() {
        mensagemAdmin.className = "feedback hidden";
    }

    function escaparHtml(texto) {
        const div = document.createElement("div");
        div.textContent = texto ?? "";
        return div.innerHTML;
    }
});