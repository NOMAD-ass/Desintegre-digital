$(document).ready(function() {

    // ====== BUSCA AUTOMÁTICA AO SAIR DO CEP ======
    $('#txtCep').on('focusout', function() {
        var cep = $(this).val().replace(/\D/g, ''); // remove tudo que não é número

        if (cep.length === 8) {
            var url = 'https://viacep.com.br/ws/' + cep + '/json/';

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (!data.erro) {
                        $('#txtRua').val(data.logradouro);
                        $('#txtBairro').val(data.bairro);
                        $('#txtCidade').val(data.localidade);
                        $('#txtEstado').val(data.uf);
                        $('#txtComplemento').val(data.complemento);
                        // Número e Bloco não são preenchidos automaticamente (usuário digita)
                    } else {
                        alert('CEP não encontrado.');
                        $('#txtCep').val('').focus();
                    }
                },
                error: function() {
                    alert('Erro ao buscar o CEP. Tente novamente.');
                }
            });
        } else {
            if (cep.length > 0 && cep.length !== 8) {
                alert('CEP inválido. Digite 8 dígitos.');
                $(this).val('').focus();
            }
        }
    });

    // ====== BOTÃO "BUSCAR CEP" (opcional, para forçar a busca) ======
    $('#btnBuscar').on('click', function() {
        $('#txtCep').trigger('focusout');
    });

    // ====== EXIBIR RESULTADO (preview) ======
    // Pode ser acionado ao preencher todos os campos ou ao clicar em um botão "Ver dados"
    // Por simplicidade, vamos exibir ao clicar em "Buscar CEP" (já faz)
    // Mas também podemos mostrar ao sair de qualquer campo

    function mostrarResultado() {
        var cep = $('#txtCep').val();
        var rua = $('#txtRua').val();
        var numero = $('#txtNumero').val();
        var bloco = $('#txtBloco').val();
        var bairro = $('#txtBairro').val();
        var cidade = $('#txtCidade').val();
        var estado = $('#txtEstado').val();
        var complemento = $('#txtComplemento').val();

        if (cep || rua || bairro || cidade || estado) {
            $('#resCep').text(cep);
            $('#resRua').text(rua);
            $('#resNumero').text(numero || 'não informado');
            $('#resBloco').text(bloco || 'não informado');
            $('#resBairro').text(bairro);
            $('#resCidade').text(cidade);
            $('#resEstado').text(estado);
            $('#resComplemento').text(complemento || 'nenhum');
            $('#resultado').show();
        }
    }

    // Aciona ao sair de qualquer campo do formulário
    $('.form-endereco input').on('focusout', function() {
        mostrarResultado();
    });

    // Também ao clicar no botão (já chama focusout do CEP, mas vamos garantir)
    $('#btnBuscar').on('click', function() {
        setTimeout(mostrarResultado, 300); // dá tempo para preencher
    });

});