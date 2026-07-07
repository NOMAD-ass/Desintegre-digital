
// ===== DADOS DOS SERVIÇOS (mesmos do HTML, mas com mais detalhes) =====
const servicosData = [
    {
        id: 1,
        titulo: 'Trituração e Fragmentação',
        icone: '⚙️🔨',
        descricao: 'Destruição física de dispositivos, garantindo que nenhum dado seja recuperado.',
        detalhes: 'Utilizamos equipamentos de última geração para triturar HDs, SSDs, fitas e outros dispositivos, transformando-os em partículas irrecuperáveis. Processo certificado conforme normas ambientais e de segurança.',
        status: 'disponivel'
    },
    {
        id: 2,
        titulo: 'Overwriting (Sobrescrita)',
        icone: '💾🔄',
        descricao: 'Sobrescrita segura de dados com múltiplos passes, seguindo padrões internacionais.',
        detalhes: 'Aplicamos métodos como DoD 5220.22-M, Gutmann e outros, sobrescrevendo os dados com padrões aleatórios para garantir que nenhuma informação original possa ser recuperada. Ideal para servidores e mídias magnéticas.',
        status: 'disponivel'
    },
    {
        id: 3,
        titulo: 'Desmagnetização',
        icone: '🧲⚡',
        descricao: 'Uso de campos magnéticos intensos para apagar completamente mídias magnéticas.',
        detalhes: 'Equipamentos de alto desempenho geram campos magnéticos capazes de desorganizar os domínios magnéticos de fitas e discos, apagando todos os dados de forma instantânea e irreversível.',
        status: 'disponivel'
    }
];

// ===== ELEMENTOS =====
const btnVejaTodos = document.getElementById('btnVejaTodos');

// ===== CRIAÇÃO DO LIGHTBOX/MODAL =====
function criarLightbox() {
    // Verifica se o lightbox já existe para não duplicar
    if (document.getElementById('lightboxServicos')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lightboxServicos';
    overlay.className = 'lightbox-overlay';

    const conteudo = document.createElement('div');
    conteudo.className = 'lightbox-conteudo';

    // Botão fechar
    const fechar = document.createElement('button');
    fechar.className = 'lightbox-fechar';
    fechar.innerHTML = '&times;';
    fechar.addEventListener('click', fecharLightbox);

    // Título
    const titulo = document.createElement('h2');
    titulo.className = 'lightbox-titulo';
    titulo.textContent = '📦 Nossos Serviços';

    // Container dos cards dentro do modal
    const grid = document.createElement('div');
    grid.className = 'servicos-modal-grid';

    // Preenche com os serviços
    servicosData.forEach(servico => {
        const card = document.createElement('div');
        card.className = 'modal-card-servico';
        card.innerHTML = `
            <div class="modal-servico-icone">${servico.icone}</div>
            <h3>${servico.titulo}</h3>
            <p class="modal-servico-desc">${servico.descricao}</p>
            <p class="modal-servico-detalhes">${servico.detalhes}</p>
            <div class="modal-servico-status">
                <span class="status-badge status-disponivel">✅ Disponível</span>
            </div>
            <button class="btn-solicitar" onclick="alert('Solicitação enviada para ${servico.titulo}')">Solicitar</button>
        `;
        grid.appendChild(card);
    });

    // Monta o lightbox
    conteudo.appendChild(fechar);
    conteudo.appendChild(titulo);
    conteudo.appendChild(grid);
    overlay.appendChild(conteudo);

    // Fecha ao clicar no overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) fecharLightbox();
    });

    document.body.appendChild(overlay);
}

function abrirLightbox() {
    criarLightbox();
    const overlay = document.getElementById('lightboxServicos');
    if (overlay) {
        overlay.classList.add('aberto');
        document.body.style.overflow = 'hidden';
    }
}

function fecharLightbox() {
    const overlay = document.getElementById('lightboxServicos');
    if (overlay) {
        overlay.classList.remove('aberto');
        document.body.style.overflow = '';
    }
}

// ===== EVENTO DO BOTÃO "VEJA TODOS" =====
if (btnVejaTodos) {
    btnVejaTodos.addEventListener('click', abrirLightbox);
}

// ===== FECHA COM TECLA ESC =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharLightbox();
});

// ===== (OPCIONAL) ESTILOS DINÂMICOS PARA O MODAL =====
// Se preferir, pode incluir esses estilos no CSS principal.
const styleModal = document.createElement('style');
styleModal.textContent = `
    .lightbox-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(6px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1.5rem;
    }
    .lightbox-overlay.aberto {
        display: flex;
    }
    .lightbox-conteudo {
        background: #fff;
        max-width: 1000px;
        width: 100%;
        border-radius: 28px;
        padding: 2.5rem;
        box-shadow: 0 30px 80px rgba(0,0,0,0.35);
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
        animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .lightbox-fechar {
        position: absolute;
        top: 1.2rem;
        right: 1.5rem;
        font-size: 2.2rem;
        background: none;
        border: none;
        color: #aaa;
        cursor: pointer;
        transition: color 0.2s;
    }
    .lightbox-fechar:hover {
        color: #333;
    }
    .lightbox-titulo {
        color: var(--primary-color);
        font-size: 2rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    .servicos-modal-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 2rem;
    }
    .modal-card-servico {
        background: #f8fafc;
        border-radius: 20px;
        padding: 1.5rem;
        text-align: center;
        border: 1px solid #e2e8f0;
        transition: transform 0.2s;
    }
    .modal-card-servico:hover {
        transform: translateY(-4px);
        border-color: var(--secondary-color);
    }
    .modal-servico-icone {
        font-size: 3rem;
        margin-bottom: 0.8rem;
    }
    .modal-card-servico h3 {
        font-size: 1.3rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }
    .modal-servico-desc {
        font-size: 0.95rem;
        color: #4a5568;
        margin-bottom: 0.8rem;
    }
    .modal-servico-detalhes {
        font-size: 0.85rem;
        color: #666;
        line-height: 1.5;
        margin-bottom: 1rem;
    }
    .modal-servico-status {
        margin-bottom: 1rem;
    }
    .status-badge {
        display: inline-block;
        padding: 0.2rem 0.8rem;
        border-radius: 50px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        color: #fff;
        background: var(--secondary-color);
    }
    .status-disponivel {
        background: var(--secondary-color);
    }
    .btn-solicitar {
        background: var(--primary-color);
        color: #fff;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        font-family: var(--font-family);
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    }
    .btn-solicitar:hover {
        background: var(--tertiary-color);
    }
    @media (max-width: 600px) {
        .servicos-modal-grid {
            grid-template-columns: 1fr;
        }
        .lightbox-conteudo {
            padding: 1.5rem;
        }
    }
`;
document.head.appendChild(styleModal);