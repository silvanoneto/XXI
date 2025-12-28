/**
 * Renderizador da tela inicial
 * Single Responsibility: Apenas renderizar home screen
 */
class HomeRenderer {
    constructor(containerSelector, colors) {
        this.container = document.querySelector(containerSelector);
        this.colors = colors;
        this.currentBook = null;
    }

    render(onStartCallback, bookConfig = null, onSwitchBookCallback = null) {
        this.currentBook = bookConfig;
        this.container.innerHTML = this.createHomeHTML(bookConfig);
        this.attachStartButton(onStartCallback);
        if (onSwitchBookCallback) {
            this.attachBookSwitcher(onSwitchBookCallback);
        }
    }

    createHomeHTML(book) {
        if (!book) {
            return this.createBookSelectorHTML();
        }
        return `
            <div class="home-screen">
                ${this.createSymbolSVG(book.symbol)}
                ${this.createTitle(book.title)}
                ${this.createSubtitle(book.subtitle)}
                ${this.createEpigraph(book.epigraph)}
                ${this.createStartButton()}
                ${this.createFootnote(book.footnote)}
                ${this.createBookSwitcher()}
                ${this.createKeyboardShortcuts()}
            </div>
        `;
    }

    createBookSelectorHTML() {
        return `
            <div class="home-screen book-selector">
                <h1 class="home-title" style="font-size: 2rem; margin-bottom: 2rem;">Escolha um livro</h1>
                <div class="book-cards">
                    <button class="book-card" data-book="paebiru">
                        ${this.createSymbolSVG('paebiru')}
                        <h2>PAÊBIRÚ XXI</h2>
                        <p>Um Ensaio Filosófico</p>
                        <span class="book-meta">21 arquétipos · 3 atos</span>
                    </button>
                    <button class="book-card" data-book="crio">
                        ${this.createSymbolSVG('crio')}
                        <h2>CRIØ</h2>
                        <p>Uma Ontologia Relacional para o Século XXI</p>
                        <span class="book-meta">Filosofia relacional</span>
                    </button>
                </div>
            </div>
        `;
    }

    createBookSwitcher() {
        const otherBook = this.currentBook?.id === 'paebiru' ? 'crio' : 'paebiru';
        const otherTitle = otherBook === 'paebiru' ? 'Paêbirú XXI' : 'CRIØ';
        return `
            <button class="book-switch-btn" data-switch-book="${otherBook}">
                ← Ler ${otherTitle}
            </button>
        `;
    }

    createSymbolSVG(type = 'paebiru') {
        if (type === 'crio') {
            return this.createCrioSymbolSVG();
        }
        return this.createPaebiruSymbolSVG();
    }

    createPaebiruSymbolSVG() {
        return `
            <svg class="home-symbol" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="homeGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#fff9e6"/>
                        <stop offset="100%" stop-color="${this.colors.gold}" stop-opacity="0"/>
                    </radialGradient>
                    <linearGradient id="homeGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${this.colors.gold}"/>
                        <stop offset="50%" stop-color="${this.colors.goldLight}"/>
                        <stop offset="100%" stop-color="${this.colors.gold}"/>
                    </linearGradient>
                </defs>

                <!-- Três círculos (3 Atos) -->
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#homeGold)" stroke-width="0.5" opacity="0.4"/>
                <circle cx="100" cy="100" r="65" fill="none" stroke="url(#homeGold)" stroke-width="0.5" opacity="0.6"/>
                <circle cx="100" cy="100" r="40" fill="none" stroke="url(#homeGold)" stroke-width="0.5" opacity="0.8"/>

                <!-- 21 pontos: 7 em cada círculo -->
                <g fill="${this.colors.gold}" opacity="0.9">
                    <circle cx="100" cy="60" r="3"/><circle cx="134" cy="76" r="3"/>
                    <circle cx="140" cy="115" r="3"/><circle cx="117" cy="138" r="3"/>
                    <circle cx="83" cy="138" r="3"/><circle cx="60" cy="115" r="3"/>
                    <circle cx="66" cy="76" r="3"/>
                </g>
                <g fill="${this.colors.gold}" opacity="0.7">
                    <circle cx="100" cy="35" r="3"/><circle cx="153" cy="58" r="3"/>
                    <circle cx="165" cy="115" r="3"/><circle cx="135" cy="158" r="3"/>
                    <circle cx="65" cy="158" r="3"/><circle cx="35" cy="115" r="3"/>
                    <circle cx="47" cy="58" r="3"/>
                </g>
                <g fill="${this.colors.gold}" opacity="0.5">
                    <circle cx="100" cy="10" r="3"/><circle cx="175" cy="40" r="3"/>
                    <circle cx="190" cy="115" r="3"/><circle cx="155" cy="180" r="3"/>
                    <circle cx="45" cy="180" r="3"/><circle cx="10" cy="115" r="3"/>
                    <circle cx="25" cy="40" r="3"/>
                </g>

                <!-- O 22º - centro luminoso -->
                <circle cx="100" cy="100" r="15" fill="url(#homeGlow)" opacity="0.5"/>
                <circle cx="100" cy="100" r="6" fill="#fffef5" opacity="0.8"/>

                <!-- Linhas conectando ao centro -->
                <g stroke="${this.colors.gold}" stroke-width="0.3" opacity="0.15">
                    <line x1="100" y1="100" x2="100" y2="10"/>
                    <line x1="100" y1="100" x2="175" y2="40"/>
                    <line x1="100" y1="100" x2="190" y2="115"/>
                    <line x1="100" y1="100" x2="155" y2="180"/>
                    <line x1="100" y1="100" x2="45" y2="180"/>
                    <line x1="100" y1="100" x2="10" y2="115"/>
                    <line x1="100" y1="100" x2="25" y2="40"/>
                </g>
            </svg>
        `;
    }

    createCrioSymbolSVG() {
        return `
            <svg class="home-symbol" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="crioGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#fff9e6"/>
                        <stop offset="100%" stop-color="${this.colors.gold}" stop-opacity="0"/>
                    </radialGradient>
                    <linearGradient id="crioGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${this.colors.gold}"/>
                        <stop offset="50%" stop-color="${this.colors.goldLight}"/>
                        <stop offset="100%" stop-color="${this.colors.gold}"/>
                    </linearGradient>
                </defs>

                <!-- Teia relacional - nós interconectados -->
                <circle cx="100" cy="100" r="85" fill="none" stroke="url(#crioGold)" stroke-width="0.5" opacity="0.3"/>

                <!-- Nós principais (relações) -->
                <g fill="${this.colors.gold}">
                    <circle cx="100" cy="30" r="5" opacity="0.8"/>
                    <circle cx="160" cy="70" r="5" opacity="0.8"/>
                    <circle cx="160" cy="130" r="5" opacity="0.8"/>
                    <circle cx="100" cy="170" r="5" opacity="0.8"/>
                    <circle cx="40" cy="130" r="5" opacity="0.8"/>
                    <circle cx="40" cy="70" r="5" opacity="0.8"/>
                </g>

                <!-- Conexões entre nós -->
                <g stroke="${this.colors.gold}" stroke-width="0.8" opacity="0.4">
                    <line x1="100" y1="30" x2="160" y2="70"/>
                    <line x1="160" y1="70" x2="160" y2="130"/>
                    <line x1="160" y1="130" x2="100" y2="170"/>
                    <line x1="100" y1="170" x2="40" y2="130"/>
                    <line x1="40" y1="130" x2="40" y2="70"/>
                    <line x1="40" y1="70" x2="100" y2="30"/>
                    <!-- Diagonais -->
                    <line x1="100" y1="30" x2="100" y2="170"/>
                    <line x1="40" y1="70" x2="160" y2="130"/>
                    <line x1="160" y1="70" x2="40" y2="130"/>
                </g>

                <!-- Centro - vazio relacional -->
                <circle cx="100" cy="100" r="20" fill="url(#crioGlow)" opacity="0.4"/>
                <circle cx="100" cy="100" r="8" fill="none" stroke="${this.colors.gold}" stroke-width="1" opacity="0.6"/>

                <!-- Ø no centro -->
                <text x="100" y="106" text-anchor="middle" fill="${this.colors.gold}" font-size="16" font-family="serif" opacity="0.8">Ø</text>
            </svg>
        `;
    }

    createTitle(title = 'PAÊBIRÚ XXI') {
        return `
            <h1 class="home-title">${title}</h1>
        `;
    }

    createSubtitle(subtitle = 'Um Homo Sapiens Para Um Novo Século') {
        return `
            <p class="home-subtitle">${subtitle}</p>
        `;
    }

    createEpigraph(epigraph = 'Para um mundo onde a sombra não encontra terreno') {
        return `
            <p class="home-epigraph">"${epigraph}"</p>
        `;
    }

    createStartButton() {
        return `
            <button id="start-journey-btn" class="home-start-btn">COMEÇAR A LEITURA</button>
        `;
    }

    createFootnote(footnote = '21 arquétipos · 3 atos · 1 caminho') {
        return `
            <p class="home-footnote">${footnote}</p>
        `;
    }

    createKeyboardShortcuts() {
        return `
            <div class="home-shortcuts">
                <p class="shortcuts-title">Atalhos de Teclado</p>
                <div class="shortcuts-list">
                    <span><kbd>←</kbd> Anterior</span>
                    <span><kbd>→</kbd> Próximo</span>
                    <span><kbd>☰</kbd> Índice</span>
                </div>
            </div>
        `;
    }

    attachStartButton(callback) {
        const btn = document.getElementById('start-journey-btn');
        if (btn) {
            btn.addEventListener('click', callback);
        }
    }

    attachBookSwitcher(callback) {
        const switchBtn = this.container.querySelector('.book-switch-btn');
        if (switchBtn) {
            switchBtn.addEventListener('click', (e) => {
                const bookId = e.target.dataset.switchBook;
                callback(bookId);
            });
        }

        // Também para os cards de seleção
        const bookCards = this.container.querySelectorAll('.book-card');
        bookCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const bookId = card.dataset.book;
                callback(bookId);
            });
        });
    }

    hideLoading() {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement && loadingElement.parentElement) {
            loadingElement.remove();
        }
    }
}
