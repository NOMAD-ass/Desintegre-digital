class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
  }

  addClickEvent() {
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
  }

  init() {
    this.addClickEvent();
    return this;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o menu responsivo
  const mobileNavbar = new MobileNavbar(".mobile-menu", ".nav-list", ".nav-list li");
  mobileNavbar.init();

  // Lógica do botão de tema alternando suas imagens originais
  const botao = document.querySelector('#botaoTema');
  const icone = document.querySelector('#iconeTema');
  
  if (botao && icone) {
    botao.addEventListener('click', () => {
      icone.classList.add('rodar-icone');
      
      setTimeout(() => {
        icone.classList.remove('rodar-icone');
      }, 500);

      if (document.body.classList.contains('tema-claro')) {
        document.body.classList.remove('tema-claro');
        document.body.classList.add('tema-escuro');
        icone.src = "../icon/lua.png";
      } else {
        document.body.classList.remove('tema-escuro');
        document.body.classList.add('tema-claro');
        icone.src = "../icon/sol.png";
      }
    });
  }
});