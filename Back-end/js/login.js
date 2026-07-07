document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const lembrarCheck = document.getElementById('lembrar');

    // ====== RESTAURA EMAIL SALVO ======
    const emailSalvo = localStorage.getItem('emailSalvo');
    if (emailSalvo) {
        emailInput.value = emailSalvo;
        lembrarCheck.checked = true;
    }

    // ====== FUNÇÃO PARA EXIBIR MENSAGENS ======
    function mostrarMensagem(tipo, texto) {
        // Remove mensagem anterior
        const antiga = document.querySelector('.mensagem-login');
        if (antiga) antiga.remove();

        const div = document.createElement('div');
        div.className = 'mensagem-login';
        div.style.backgroundColor = tipo === 'sucesso' ? '#d4edda' : '#f8d7da';
        div.style.color = tipo === 'sucesso' ? '#155724' : '#721c24';
        div.style.border = `1px solid ${tipo === 'sucesso' ? '#c3e6cb' : '#f5c6cb'}`;
        div.textContent = texto;

        // Insere antes do botão (ou onde preferir)
        const botao = form.querySelector('button');
        form.insertBefore(div, botao);
    }

    // ====== VALIDAÇÃO E ENVIO ======
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        // 1. Campos vazios
        if (!email || !senha) {
            mostrarMensagem('erro', 'Preencha todos os campos.');
            return;
        }

        // 2. Email válido?
        if (!email.includes('@') || !email.includes('.')) {
            mostrarMensagem('erro', 'Insira um e-mail válido (ex: nome@dominio.com).');
            return;
        }

        // 3. Senha mínima
        if (senha.length < 6) {
            mostrarMensagem('erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // ====== SIMULAÇÃO DE AUTENTICAÇÃO ======
        // (substitua por requisição fetch real)
        const credenciais = {
            email: 'admin@empresa.com',
            senha: '123456'
        };

        if (email === credenciais.email && senha === credenciais.senha) {
            mostrarMensagem('sucesso', 'Login realizado! Redirecionando...');

            if (lembrarCheck.checked) {
                localStorage.setItem('emailSalvo', email);
            } else {
                localStorage.removeItem('emailSalvo');
            }

            setTimeout(() => {
                // Redirecionar para dashboard
                alert('Bem-vindo, ' + email + '! (simulação)');
                // window.location.href = '/dashboard';
            }, 1500);
        } else {
            mostrarMensagem('erro', 'E-mail ou senha incorretos.');
            senhaInput.value = '';
            senhaInput.focus();
        }
    });

    // ====== LIMPA MENSAGEM AO DIGITAR ======
    emailInput.addEventListener('input', () => {
        const msg = document.querySelector('.mensagem-login');
        if (msg) msg.remove();
    });
    senhaInput.addEventListener('input', () => {
        const msg = document.querySelector('.mensagem-login');
        if (msg) msg.remove();
    });
});