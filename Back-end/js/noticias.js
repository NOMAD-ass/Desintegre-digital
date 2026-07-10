// =========================================
// 1. ALTERNAR TEMA (claro/escuro)
// =========================================
function alterar_tema() {
    const body = document.body;
    body.classList.toggle('escuro');
    // Salva a preferência no localStorage
    localStorage.setItem('tema', body.classList.contains('escuro') ? 'escuro' : 'claro');
}

// Ao carregar a página, aplica o tema salvo
document.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'escuro') {
        document.body.classList.add('escuro');
    }
});

// =========================================
// 2. DADOS DAS NOTÍCIAS (fictícios)
// =========================================
const noticias = [
    {
        id: 1,
        titulo: 'Lançamento do novo sistema quântico',
        resumo: 'A Desintegre Digital anuncia o primeiro computador quântico acessível para empresas. Promete revolucionar a computação.',
        imagem: 'https://picsum.photos/id/1/600/400',
        link: '#'
    },
    {
        id: 2,
        titulo: 'Inteligência Artificial na segurança',
        resumo: 'Novo algoritmo detecta ameaças em tempo real com 99,9% de precisão, garantindo proteção avançada.',
        imagem: 'https://picsum.photos/id/26/600/400',
        link: '#'
    },
    {
        id: 3,
        titulo: 'Realidade aumentada no varejo',
        resumo: 'Clientes podem experimentar produtos virtualmente antes de comprar, melhorando a experiência de compra.',
        imagem: 'https://picsum.photos/id/27/600/400',
        link: '#'
    },
    {
        id: 4,
        titulo: '5G e IoT transformam cidades',
        resumo: 'Com a chegada do 5G, cidades inteligentes se tornam realidade com dispositivos conectados em massa.',
        imagem: 'https://picsum.photos/id/29/600/400',
        link: '#'
    }
];

// =========================================
// 3. EXIBIR NOTÍCIAS
// =========================================
function exibir_noticias() {
    const container = document.getElementById('conteudo');
    if (!container) return;

    // Limpa o container antes de adicionar (evita duplicação)
    container.innerHTML = '';

    noticias.forEach(noticia => {
        // Cria o article com a classe 'noticia' (estilizada no CSS)
        const article = document.createElement('article');
        article.className = 'noticia';

        // Imagem (com clique para abrir lightbox)
        const img = document.createElement('img');
        img.src = noticia.imagem;
        img.alt = noticia.titulo;
        img.loading = 'lazy';
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => abrir_lightbox(noticia.imagem));

        // Título
        const h2 = document.createElement('h2');
        h2.textContent = noticia.titulo;

        // Resumo
        const p = document.createElement('p');
        p.textContent = noticia.resumo;

        // Link "Leia mais"
        const a = document.createElement('a');
        a.href = noticia.link;
        a.textContent = 'Leia mais...';

        // Monta o artigo
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(p);
        article.appendChild(a);

        // Adiciona ao container
        container.appendChild(article);
    });
}

// =========================================
// 4. LIGHTBOX
// =========================================
function abrir_lightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lightbox || !img) return;

    img.src = src;
    lightbox.style.display = 'flex';    // mostra o lightbox (estava oculto com display:none)
    document.body.style.overflow = 'hidden'; // impede rolagem
}

function fechar_lightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // restaura rolagem
}

// Fecha lightbox ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fechar_lightbox();
    }
});

// =========================================
// 5. INICIALIZAÇÃO ADICIONAL (opcional)
// =========================================
// Se quiser garantir que o lightbox esteja oculto ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
});