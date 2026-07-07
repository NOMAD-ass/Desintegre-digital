// ====== CONTROLE DE EXIBIÇÃO DO SELECT DE ENDEREÇO ======
document.addEventListener('DOMContentLoaded', function() {
    var radios = document.querySelectorAll('input[name="entrega"]');
    var enderecosWrapper = document.getElementById('enderecos-wrapper');

    function toggleEnderecos() {
        var selecionado = document.querySelector('input[name="entrega"]:checked');
        if (selecionado && selecionado.value === 'Física') {
            enderecosWrapper.style.display = 'block';
        } else {
            enderecosWrapper.style.display = 'none';
        }
    }

    radios.forEach(function(radio) {
        radio.addEventListener('change', toggleEnderecos);
    });

    toggleEnderecos(); // inicializa
});

// ====== FUNÇÃO DE ENVIO (VALIDAÇÃO) ======
function Enviar() {
    // Capturar valores
    var nome = document.getElementById("nomeid").value.trim();
    var telefone = document.getElementById("foneid").value.trim();
    var email = document.getElementById("emailid").value.trim();
    var mensagem = document.getElementById("mensagemid").value.trim();

    // Validar nome
    if (nome === "") {
        alert("Por favor, preencha o campo Nome.");
        document.getElementById("nomeid").focus();
        return false;
    }

    // Validar email
    if (email === "") {
        alert("Por favor, preencha o campo Email.");
        document.getElementById("emailid").focus();
        return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
        alert("Por favor, insira um email válido (ex: nome@dominio.com).");
        document.getElementById("emailid").focus();
        return false;
    }

    // Validar telefone (opcional)
    if (telefone !== "") {
        var numeros = telefone.replace(/\D/g, '');
        if (numeros.length < 10) {
            alert("Por favor, insira um telefone válido com DDD (mínimo 10 dígitos).");
            document.getElementById("foneid").focus();
            return false;
        }
    }

    // Validar serviços (pelo menos um)
    var checkboxes = document.querySelectorAll('input[name="servicos[]"]:checked');
    if (checkboxes.length === 0) {
        alert("Por favor, selecione pelo menos um serviço.");
        return false;
    }

    // Validar método de entrega
    var entregaSelecionada = document.querySelector('input[name="entrega"]:checked');
    if (!entregaSelecionada) {
        alert("Por favor, escolha como deseja entregar os HDs.");
        return false;
    }

    var metodo = entregaSelecionada.value;
    var unidade = '';
    if (metodo === 'Física') {
        var selectUnidade = document.getElementById('unidade');
        if (selectUnidade.value === "") {
            alert("Por favor, selecione uma unidade para retirada.");
            selectUnidade.focus();
            return false;
        }
        unidade = selectUnidade.value;
    }

    // Montar lista de serviços
    var servicosSelecionados = [];
    checkboxes.forEach(function(cb) {
        servicosSelecionados.push(cb.value);
    });
    var listaServicos = servicosSelecionados.join(", ");

    // Construir mensagem final
    var msg = "Obrigado sr(a) " + nome + "!\n\n";
    msg += "Seus dados foram encaminhados com sucesso.\n\n";
    msg += "Telefone: " + (telefone || "não informado") + "\n";
    msg += "Email: " + email + "\n";
    msg += "Serviços selecionados: " + listaServicos + "\n";
    msg += "Entrega: " + metodo + "\n";
    if (metodo === 'Física') {
        msg += "Unidade: " + unidade + "\n";
    }
    msg += "Mensagem: " + (mensagem || "nenhuma") + "\n";

    alert(msg);

    // Aqui você pode enviar o formulário ou resetar
    // document.forms["meu_form"].submit();
    return true;
}