// ===== DADOS MOCKADOS (inclui os três serviços com status variados) =====
const todosServicos = [
    {
        id: 1,
        titulo: 'Trituração e Fragmentação',
        icone: '⚙️🔨',
        descricao: 'Destruição física de 15 HDs e 10 SSDs.',
        status: 'finalizado',   // finalizado para ter botão de download
        data: '2026-06-10',
        detalhes: 'Processo realizado com sucesso. Certificado emitido.'
    },
    {
        id: 2,
        titulo: 'Overwriting (Sobrescrita)',
        icone: '💾🔄',
        descricao: 'Sobrescrita de 8 servidores com 3 passes.',
        status: 'andamento',    // não finalizado → botão desabilitado
        data: '2026-06-12',
        detalhes: 'Em andamento...'
    },
    {
        id: 3,
        titulo: 'Desmagnetização de Fitas LTO',
        icone: '🧲⚡',
        descricao: 'Desmagnetização de 40 fitas LTO-8.',
        status: 'finalizado',   // finalizado → botão habilitado
        data: '2026-06-05',
        detalhes: 'Serviço concluído com sucesso. Laudo anexo.'
    }
];

// Filtra apenas os finalizados (para exibir na tabela)
let laudosDisponiveis = todosServicos.filter(s => s.status === 'finalizado');

// ===== ELEMENTOS =====
const tbody = document.getElementById('tbodyLaudos');
const semLaudosMsg = document.getElementById('semLaudos');

// ===== FUNÇÃO PARA GERAR LAUDO =====
function gerarLaudo(servico) {
    return `LAUDO DE SERVIÇO - DESINTEGRE DIGITAL
======================================
ID do Pedido   : ${servico.id}
Serviço        : ${servico.titulo}
Data de Conclusão: ${servico.data}
Status         : FINALIZADO

Descrição:
${servico.detalhes}

Este laudo atesta que o serviço foi executado conforme os padrões de segurança e qualidade da empresa.
Assinado digitalmente por Desintegre Digital.`;
}

// ===== FUNÇÃO PARA BAIXAR LAUDO E REMOVER DA LISTA =====
function baixarLaudo(servico) {
    const texto = gerarLaudo(servico);
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laudo_servico_${servico.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    // Remove o serviço da lista (finaliza o acesso)
    laudosDisponiveis = laudosDisponiveis.filter(s => s.id !== servico.id);
    renderizarLaudos();
}

// ===== RENDERIZA A TABELA =====
function renderizarLaudos() {
    tbody.innerHTML = '';
    if (laudosDisponiveis.length === 0) {
        semLaudosMsg.style.display = 'block';
        document.querySelector('.laudos-tabela-wrapper').style.display = 'none';
        return;
    }
    semLaudosMsg.style.display = 'none';
    document.querySelector('.laudos-tabela-wrapper').style.display = 'block';

    laudosDisponiveis.forEach(servico => {
        const tr = document.createElement('tr');
        // Verifica se é finalizado (todos na lista são, mas pode usar a propriedade)
        const isFinalizado = servico.status === 'finalizado';
        tr.innerHTML = `
            <td>#${servico.id}</td>
            <td><span class="icone-tabela">${servico.icone}</span> ${servico.titulo}</td>
            <td>${servico.descricao}</td>
            <td>${servico.data}</td>
            <td><span class="status-badge-tabela">${isFinalizado ? 'Finalizado' : 'Em andamento'}</span></td>
            <td>
                <button class="btn-download-laudo" data-id="${servico.id}" ${!isFinalizado ? 'disabled' : ''}>
                    ${isFinalizado ? '📥 Baixar' : '⏳ Aguarde'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Eventos de download (apenas para os botões habilitados)
    document.querySelectorAll('.btn-download-laudo:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const servico = laudosDisponiveis.find(s => s.id === id);
            if (servico) baixarLaudo(servico);
        });
    });
}

// ===== INICIALIZA =====
renderizarLaudos();

// (Opcional) Exibe o nome do usuário (simulado)
document.getElementById('usuarioLaudo').textContent = 'Olá, ' + (localStorage.getItem('userEmail') || 'cliente@email.com');