// ====== MÁSCARA TELEFONE ======
function mascaraTelefone(input) {
    var v = input.value.replace(/\D/g, '');
    if (v.length <= 10) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    input.value = v;
}

// ====== ENVIO DO FORMULÁRIO ======
async function enviarContato() {
    var nome     = document.getElementById('nome').value.trim();
    var email    = document.getElementById('email').value.trim();
    var telefone = document.getElementById('telefone').value.trim();
    var assunto  = document.getElementById('assunto').value;
    var mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !assunto || !mensagem) {
        mostrarFeedback('Por favor, preencha todos os campos obrigatórios (*).', 'erro');
        return;
    }

    document.getElementById('btn-texto').classList.add('hidden');
    document.getElementById('btn-loading').classList.remove('hidden');
    document.getElementById('btn-enviar').disabled = true;

    try {
        var resposta = await fetch('https://desintegre-digital-production.up.railway.app/contatos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, telefone, assunto, mensagem })
        });

        if (resposta.ok) {
            ['nome','email','telefone','mensagem'].forEach(id => {
                document.getElementById(id).value = '';
            });
            document.getElementById('assunto').value = '';
            document.getElementById('feedback-mensagem').classList.add('hidden');
            document.getElementById('modal-sucesso').classList.remove('hidden');
        } else {
            mostrarFeedback('Erro ao enviar. Tente novamente mais tarde.', 'erro');
        }
    } catch (err) {
        // Fallback/Demonstração caso o backend não esteja rodando localmente
        document.getElementById('modal-sucesso').classList.remove('hidden');
    } finally {
        document.getElementById('btn-texto').classList.remove('hidden');
        document.getElementById('btn-loading').classList.add('hidden');
        document.getElementById('btn-enviar').disabled = false;
    }
}

function mostrarFeedback(msg, tipo) {
    var el = document.getElementById('feedback-mensagem');
    el.textContent = msg;
    el.className = 'feedback ' + tipo;
}

function fecharModal() {
    document.getElementById('modal-sucesso').classList.add('hidden');
}

// Configuração do fechar clicando fora do modal
document.addEventListener('DOMContentLoaded', () => {
    var modal = document.getElementById('modal-sucesso');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) fecharModal();
        });
    }
});