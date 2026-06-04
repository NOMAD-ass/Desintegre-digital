class MobileMenu {
    constructor(mobileMenu, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navLinks = document.querySelector(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        console.log(this);
        this.navLinks.classList.toggle(this.activeClass);
    }

    addClickEvent() {
        this.mobileMenu.addEventListener("click",this.handleClick());
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }

}

const mobileMenu = new MobileMenu(".mobile-menu", ".nav-links", ".nav-links li",);
mobileMenu.init();

