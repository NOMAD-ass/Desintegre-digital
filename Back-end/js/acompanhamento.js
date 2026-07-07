// ===== DADOS DOS TRÊS SERVIÇOS OFERECIDOS =====
const servicos = [
    {
        id: 1,
        titulo: 'Trituração e Fragmentação',
        icone: '⚙️🔨',
        descricao: 'Destruição física de 15 HDs e 10 SSDs, com certificado de destruição.',
        status: 'avaliacao',   // avaliacao, andamento, finalizado
        data: '2026-06-10',
        detalhes: 'Processo realizado em ambiente controlado. Todos os dispositivos foram triturados seguindo a norma NBR 15.000. O laudo técnico será emitido após a conclusão da auditoria.'
    },
    {
        id: 2,
        titulo: 'Overwriting (Sobrescrita)',
        icone: '💾🔄',
        descricao: 'Sobrescrita de 8 servidores com 3 passes (padrão DoD 5220.22-M).',
        status: 'andamento',
        data: '2026-06-12',
        detalhes: 'Atualmente em execução o segundo passe. Previsão de término para 20/06/2026. Acompanhe o progresso pelo painel.'
    },
    {
        id: 3,
        titulo: 'Desmagnetização de Fitas LTO',
        icone: '🧲⚡',
        descricao: 'Desmagnetização de 40 fitas LTO-8 utilizando equipamento de campo intenso.',
        status: 'finalizado',
        data: '2026-06-05',
        detalhes: 'Serviço concluído com sucesso. Todas as fitas foram desmagnetizadas e descartadas conforme política ambiental. Laudo anexo.'
    }
];

// ===== FUNÇÕES AUXILIARES =====
function traduzirStatus(status) {
    const mapa = {
        'avaliacao': 'Avaliação',
        'andamento': 'Em andamento',
        'finalizado': 'Finalizado'
    };
    return mapa[status] || status;
}

function classeStatus(status) {
    return 'status-' + status;
}

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
}

// ===== ATUALIZA RESUMO =====
function atualizarResumo() {
    const total = servicos.length;
    const andamento = servicos.filter(s => s.status === 'andamento').length;
    const finalizados = servicos.filter(s => s.status === 'finalizado').length;
    document.getElementById('totalServicos').textContent = total;
    document.getElementById('emAndamento').textContent = andamento;
    document.getElementById('finalizados').textContent = finalizados;
}

// ===== RENDERIZA CARDS =====
const container = document.getElementById('servicosContainer');

function renderizarCards() {
    container.innerHTML = '';
    servicos.forEach(servico => {
        const isFinalizado = servico.status === 'finalizado';
        const card = document.createElement('div');
        card.className = 'card-servico';
        card.innerHTML = `
            <div class="card-header">
                <h3><span class="icone">${servico.icone}</span> ${servico.titulo}</h3>
                <span class="status-badge ${classeStatus(servico.status)}">${traduzirStatus(servico.status)}</span>
            </div>
            <p class="card-desc">${servico.descricao}</p>
            <div class="card-meta">📅 ${servico.data} · ID #${servico.id}</div>
            <div class="card-actions">
                <button class="btn btn-detalhes" data-id="${servico.id}">🔍 Detalhes</button>
                ${isFinalizado ? `<button class="btn btn-download" data-id="${servico.id}">📥 Baixar Laudo</button>` 
                                : `<button class="btn btn-download" disabled>⏳ Aguarde</button>`}
            </div>
        `;
        container.appendChild(card);
    });

    // Eventos dos botões "Detalhes"
    document.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const servico = servicos.find(s => s.id === id);
            if (servico) abrirLightbox(servico);
        });
    });

    // Eventos dos botões "Baixar Laudo" (apenas habilitados)
    document.querySelectorAll('.btn-download:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const servico = servicos.find(s => s.id === id);
            if (servico) baixarLaudo(servico);
        });
    });

    atualizarResumo();
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const fecharBtn = document.getElementById('fecharLightbox');
const lbTitulo = document.getElementById('lbTitulo');
const lbStatus = document.getElementById('lbStatus');
const lbDesc = document.getElementById('lbDesc');
const lbMeta = document.getElementById('lbMeta');
const lbActions = document.getElementById('lbActions');

function abrirLightbox(servico) {
    lbTitulo.textContent = servico.titulo;
    lbStatus.textContent = traduzirStatus(servico.status);
    lbStatus.className = 'lightbox-status ' + classeStatus(servico.status);
    lbDesc.textContent = servico.detalhes;
    lbMeta.textContent = `📅 Data do pedido: ${servico.data} · ID #${servico.id}`;

    lbActions.innerHTML = '';
    if (servico.status === 'finalizado') {
        const btn = document.createElement('button');
        btn.className = 'btn btn-download';
        btn.textContent = '📥 Baixar Laudo';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            baixarLaudo(servico);
        });
        lbActions.appendChild(btn);
    } else {
        const msg = document.createElement('p');
        msg.style.fontSize = '0.9rem';
        msg.style.color = '#777';
        msg.textContent = '⏳ O laudo estará disponível quando o serviço for finalizado.';
        lbActions.appendChild(msg);
    }

    lightbox.classList.add('aberto');
    document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
    lightbox.classList.remove('aberto');
    document.body.style.overflow = '';
}

fecharBtn.addEventListener('click', fecharLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) fecharLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharLightbox();
});

// ===== INICIALIZA =====
renderizarCards();