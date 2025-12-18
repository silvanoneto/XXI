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
        const themes = ['original', 'white', 'cyber'];
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
                'original': '◐',
                'white': '○',
                'cyber': '◉'
            };
            btn.textContent = labels[nextTheme];
            const titles = {
                'original': 'Tema: Original',
                'white': 'Tema: Branco',
                'cyber': 'Tema: Cibernético'
            };
            btn.title = titles[nextTheme];
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'original';
        // Se o tema salvo era sépia, voltar para original
        const validTheme = savedTheme === 'sepia' ? 'original' : savedTheme;
        if (validTheme !== 'original') {
            document.body.setAttribute('data-theme', validTheme);
        }
        
        // Atualiza botão
        const btn = document.getElementById('theme-btn');
        if (btn) {
            const labels = {
                'original': '◐',
                'white': '○',
                'cyber': '◉'
            };
            btn.textContent = labels[validTheme];
            const titles = {
                'original': 'Tema: Original',
                'white': 'Tema: Branco',
                'cyber': 'Tema: Cibernético'
            };
            btn.title = titles[validTheme];
        }
    }

    cycleFont() {
        const fonts = ['serif', 'modern', 'sans', 'classic'];
        const currentFont = document.body.getAttribute('data-font') || 'serif';
        const currentIndex = fonts.indexOf(currentFont);
        const nextIndex = (currentIndex + 1) % fonts.length;
        const nextFont = fonts[nextIndex];
        
        if (nextFont === 'serif') {
            document.body.removeAttribute('data-font');
        } else {
            document.body.setAttribute('data-font', nextFont);
        }
        
        // Salva preferência
        localStorage.setItem('font', nextFont);
        
        // Atualiza botão
        this.updateFontButton(nextFont);
    }

    updateFontButton(font) {
        const btn = document.getElementById('font-btn');
        if (btn) {
            const labels = {
                'serif': 'Aa',
                'modern': 'Ab',
                'sans': 'Ac',
                'classic': 'Ad'
            };
            const titles = {
                'serif': 'Fonte: Cormorant (Serifada)',
                'modern': 'Fonte: Lora (Moderna)',
                'sans': 'Fonte: Inter (Sem serifa)',
                'classic': 'Fonte: Merriweather (Clássica)'
            };
            btn.textContent = labels[font];
            btn.title = titles[font];
        }
    }

    loadFont() {
        const savedFont = localStorage.getItem('font') || 'serif';
        if (savedFont !== 'serif') {
            document.body.setAttribute('data-font', savedFont);
        }
        this.updateFontButton(savedFont);
    }
}
