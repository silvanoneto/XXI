/**
 * Controlador de UI (sidebar, fonte)
 * Single Responsibility: Controles de interface
 */
class UIController {
    constructor(stateManager) {
        this.state = stateManager;
        this.sidebar = document.querySelector(Config.selectors.sidebar);
    }

    toggleSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.toggle("visible");
            this.sidebar.classList.toggle("hidden");
        }
    }

    closeSidebarOnMobile() {
        // Fecha apenas em mobile/tablet
        if (window.innerWidth <= Config.ui.mobileBreakpoint && this.sidebar) {
            this.sidebar.classList.remove("visible");
            this.sidebar.classList.add("hidden");
        }
    }

    // Fecha sidebar em qualquer tela após selecionar item
    closeSidebar() {
        if (this.sidebar && window.innerWidth <= Config.ui.mobileBreakpoint) {
            this.sidebar.classList.remove("visible");
            this.sidebar.classList.add("hidden");
        }
    }

    increaseFontSize() {
        this.state.setFontSize(this.state.fontSize + Config.ui.fontSize.step);
    }

    decreaseFontSize() {
        this.state.setFontSize(this.state.fontSize - Config.ui.fontSize.step);
    }

    cycleTheme() {
        const themes = ['original', 'sepia', 'white', 'cyber'];
        const currentTheme = document.body.getAttribute('data-theme') || 'original';
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        if (nextTheme === 'original') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', nextTheme);
        }
        
        // Salva preferência
        localStorage.setItem('theme', nextTheme);
        
        // Atualiza texto do botão
        const btn = document.getElementById('theme-btn');
        if (btn) {
            const labels = {
                'original': '🎨',
                'sepia': '📜',
                'white': '📄',
                'cyber': '💚'
            };
            btn.textContent = labels[nextTheme];
            const titles = {
                'original': 'Tema: Original',
                'sepia': 'Tema: Sépia',
                'white': 'Tema: Branco',
                'cyber': 'Tema: Cibernético'
            };
            btn.title = titles[nextTheme];
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'original';
        if (savedTheme !== 'original') {
            document.body.setAttribute('data-theme', savedTheme);
        }
        
        // Atualiza botão
        const btn = document.getElementById('theme-btn');
        if (btn) {
            const labels = {
                'original': '🎨',
                'sepia': '📜',
                'white': '📄',
                'cyber': '💚'
            };
            btn.textContent = labels[savedTheme];
            const titles = {
                'original': 'Tema: Original',
                'sepia': 'Tema: Sépia',
                'white': 'Tema: Branco',
                'cyber': 'Tema: Cibernético'
            };
            btn.title = titles[savedTheme];
        }
    }
}
