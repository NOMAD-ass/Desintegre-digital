document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formularioDispositivo");
    if (!form) return;

    const enderecosWrapper = document.getElementById("enderecos-wrapper");
    const radiosEntrega = document.querySelectorAll('input[name="entrega"]');

    // Mostra o campo de unidade só quando "Física" está selecionado
    function alternarEnderecos() {
        const selecionado = document.querySelector('input[name="entrega"]:checked');
        enderecosWrapper.classList.toggle("hidden", !selecionado || selecionado.value !== "Física");
    }
    radiosEntrega.forEach((r) => r.addEventListener("change", alternarEnderecos));
    alternarEnderecos();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeid").value.trim();
        const email = document.getElementById("emailid").value.trim();
        const telefone = document.getElementById("foneid").value.trim();
        const mensagem = document.getElementById("mensagemid").value.trim();
        const qtd_hd = document.getElementById("qtd_hd").value.trim();
        const marcas_hd = document.getElementById("marcas_hd").value.trim();

        const servicos = Array.from(document.querySelectorAll('input[name="servicos[]"]:checked')).map((c) => c.value);
        const entrega = document.querySelector('input[name="entrega"]:checked');
        const unidade = document.getElementById("unidade").value;

        // ----- Validações -----
        if (!nome) return mostrarErro("Preencha o campo Nome.");
        if (!email || !email.includes("@") || !email.includes(".")) return mostrarErro("Informe um e-mail válido.");
        if (servicos.length === 0) return mostrarErro("Selecione pelo menos um serviço.");
        if (!entrega) return mostrarErro("Escolha como deseja entregar os dispositivos.");
        if (entrega.value === "Física" && !unidade) return mostrarErro("Selecione uma unidade para retirada.");
        if (qtd_hd && (isNaN(qtd_hd) || parseInt(qtd_hd) < 1)) return mostrarErro("Quantidade de HDs inválida.");

        const botao = document.getElementById("btn-enviar-formulario");
        const textoBotao = document.getElementById("btn-texto-formulario");
        const loadingBotao = document.getElementById("btn-loading-formulario");
        botao.disabled = true;
        textoBotao.classList.add("hidden");
        loadingBotao.classList.remove("hidden");
        esconderErro();

        try {
            // Se o cliente estiver logado, o pedido é enviado já vinculado
            // à conta dele - assim ele aparece sozinho na página de
            // acompanhamento, sem precisar do número do protocolo.
            const token = localStorage.getItem("token");
            const cabecalhos = { "Content-Type": "application/json" };
            if (token) cabecalhos["Authorization"] = `Bearer ${token}`;

            const resposta = await fetch("https://desintegre-digital-production.up.railway.app/pedidos", {
                method: "POST",
                headers: cabecalhos,
                body: JSON.stringify({
                    nome,
                    email,
                    telefone,
                    mensagem,
                    qtd_hd: qtd_hd || null,
                    marcas_hd,
                    entrega_metodo: entrega.value,
                    entrega_unidade: entrega.value === "Física" ? unidade : null,
                    servicos_selecionados: servicos,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                mostrarErro(dados.erro || "Não foi possível enviar. Tente novamente.");
                return;
            }

            form.reset();
            alternarEnderecos();
            document.getElementById("protocolo-numero").textContent = "#" + String(dados.dados.id).padStart(6, "0");
            document.getElementById("modal-protocolo").classList.remove("hidden");
        } catch (erro) {
            mostrarErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
        } finally {
            botao.disabled = false;
            textoBotao.classList.remove("hidden");
            loadingBotao.classList.add("hidden");
        }
    });

    function mostrarErro(texto) {
        const el = document.getElementById("feedback-formulario");
        el.textContent = texto;
        el.className = "feedback erro";
    }

    function esconderErro() {
        document.getElementById("feedback-formulario").className = "feedback hidden";
    }
});

function fecharModalProtocolo() {
    document.getElementById("modal-protocolo").classList.add("hidden");
}
