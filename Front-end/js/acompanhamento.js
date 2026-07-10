const API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("inputProtocolo");
    const botaoBuscar = document.getElementById("btnBuscarProtocolo");
    const feedback = document.getElementById("feedback-acompanhamento");
    const resultado = document.getElementById("resultadoPedido");
    const areaCertificado = document.getElementById("areaCertificado");
    const botaoCertificado = document.getElementById("btnEmitirCertificado");
    const certificadoGerado = document.getElementById("certificadoGerado");

    let pedidoAtualId = null;

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
        } catch (erro) {
            mostrarErro("Não foi possível conectar ao servidor.");
        } finally {
            botaoCertificado.disabled = false;
            botaoCertificado.textContent = "Emitir certificado";
        }
    });

    function mostrarErro(texto) {
        feedback.textContent = texto;
        feedback.className = "feedback erro";
    }

    function esconderErro() {
        feedback.className = "feedback hidden";
    }
});
