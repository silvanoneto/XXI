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
                    <button class="book-card" data-book="crio">
                        ${this.createSymbolSVG('crio')}
                        <h2>CRIØ</h2>
                        <p>Uma Ontologia Relacional para o Século XXI</p>
                        <span class="book-meta">Filosofia relacional</span>
                    </button>
                    <button class="book-card" data-book="paebiru">
                        ${this.createSymbolSVG('paebiru')}
                        <h2>PAÊBIRÚ XXI</h2>
                        <p>Um Ensaio Filosófico</p>
                        <span class="book-meta">21 arquétipos · 3 atos</span>
                    </button>
                    <button class="book-card" data-book="tekoha">
                        ${this.createSymbolSVG('tekoha')}
                        <h2>TEKOHA XXI</h2>
                        <p>Manual de Transformação Relacional</p>
                        <span class="book-meta">A trilogia completa</span>
                    </button>
                </div>
            </div>
        `;
    }

    createBookSwitcher() {
        // Para 3 livros, mostrar os outros dois
        const currentId = this.currentBook?.id;
        const otherBooks = Object.values(Config.books).filter(b => b.id !== currentId);

        return `
            <div class="book-switch-container">
                ${otherBooks.map(book => `
                    <button class="book-switch-btn" data-switch-book="${book.id}">
                        ← Ler ${book.title}
                    </button>
                `).join('')}
            </div>
        `;
    }

    createSymbolSVG(type = 'paebiru') {
        if (type === 'crio') {
            return this.createCrioSymbolSVG();
        }
        if (type === 'tekoha') {
            return this.createTekohaSymbolSVG();
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

                <!-- Teia orgânica - "você é a teia que te tece" -->
                <!-- Fios curvos entrelaçados formando o ser -->
                <g stroke="${this.colors.gold}" fill="none" stroke-width="1" opacity="0.5">
                    <!-- Espirais entrelaçadas -->
                    <path d="M 100 20 Q 150 60, 140 100 Q 130 140, 100 180" />
                    <path d="M 100 20 Q 50 60, 60 100 Q 70 140, 100 180" />
                    <path d="M 20 100 Q 60 50, 100 60 Q 140 70, 180 100" />
                    <path d="M 20 100 Q 60 150, 100 140 Q 140 130, 180 100" />
                </g>

                <!-- Fios diagonais entrecruzados -->
                <g stroke="${this.colors.gold}" fill="none" stroke-width="0.8" opacity="0.4">
                    <path d="M 30 30 Q 100 80, 170 30" />
                    <path d="M 30 170 Q 100 120, 170 170" />
                    <path d="M 30 30 Q 80 100, 30 170" />
                    <path d="M 170 30 Q 120 100, 170 170" />
                </g>

                <!-- Nós onde os fios se cruzam -->
                <g fill="${this.colors.gold}">
                    <circle cx="60" cy="60" r="3" opacity="0.6"/>
                    <circle cx="140" cy="60" r="3" opacity="0.6"/>
                    <circle cx="60" cy="140" r="3" opacity="0.6"/>
                    <circle cx="140" cy="140" r="3" opacity="0.6"/>
                    <circle cx="100" cy="45" r="2.5" opacity="0.5"/>
                    <circle cx="100" cy="155" r="2.5" opacity="0.5"/>
                    <circle cx="45" cy="100" r="2.5" opacity="0.5"/>
                    <circle cx="155" cy="100" r="2.5" opacity="0.5"/>
                </g>

                <!-- Centro - o Ø como vazio produtivo (śūnyatā) -->
                <circle cx="100" cy="100" r="25" fill="url(#crioGlow)" opacity="0.4"/>
                <circle cx="100" cy="100" r="18" fill="none" stroke="${this.colors.gold}" stroke-width="1.5" opacity="0.7"/>

                <!-- Ø - o vazio que constitui -->
                <text x="100" y="108" text-anchor="middle" fill="${this.colors.gold}" font-size="24" font-family="serif" opacity="0.9">Ø</text>
            </svg>
        `;
    }

    createTekohaSymbolSVG() {
        return `
            <svg class="home-symbol" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="tekohaGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#fff9e6"/>
                        <stop offset="100%" stop-color="${this.colors.gold}" stop-opacity="0"/>
                    </radialGradient>
                    <linearGradient id="tekohaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${this.colors.gold}"/>
                        <stop offset="50%" stop-color="${this.colors.goldLight}"/>
                        <stop offset="100%" stop-color="${this.colors.gold}"/>
                    </linearGradient>
                </defs>

                <!-- Rede de comunidades/aldeias (quilombos/mocambos) -->
                <!-- Conexões entre aldeias (trilhas secretas) -->
                <g stroke="${this.colors.gold}" stroke-width="0.8" opacity="0.3">
                    <!-- Conexões externas -->
                    <line x1="100" y1="30" x2="160" y2="65"/>
                    <line x1="160" y1="65" x2="160" y2="135"/>
                    <line x1="160" y1="135" x2="100" y2="170"/>
                    <line x1="100" y1="170" x2="40" y2="135"/>
                    <line x1="40" y1="135" x2="40" y2="65"/>
                    <line x1="40" y1="65" x2="100" y2="30"/>
                    <!-- Conexões ao centro -->
                    <line x1="100" y1="100" x2="100" y2="30"/>
                    <line x1="100" y1="100" x2="160" y2="65"/>
                    <line x1="100" y1="100" x2="160" y2="135"/>
                    <line x1="100" y1="100" x2="100" y2="170"/>
                    <line x1="100" y1="100" x2="40" y2="135"/>
                    <line x1="100" y1="100" x2="40" y2="65"/>
                </g>

                <!-- Aldeias/Mocambos (hexágonos representando casas) -->
                <!-- Aldeia central (opy - casa de reza) -->
                <g transform="translate(100, 100)">
                    <polygon points="0,-18 15.6,-9 15.6,9 0,18 -15.6,9 -15.6,-9"
                        fill="url(#tekohaGlow)" stroke="${this.colors.gold}" stroke-width="1.5" opacity="0.8"/>
                </g>

                <!-- Aldeias externas (mocambos conectados) -->
                <g fill="rgba(212, 175, 55, 0.2)" stroke="${this.colors.gold}" stroke-width="1">
                    <!-- Norte -->
                    <g transform="translate(100, 30)">
                        <polygon points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6" opacity="0.7"/>
                    </g>
                    <!-- Nordeste -->
                    <g transform="translate(160, 65)">
                        <polygon points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6" opacity="0.7"/>
                    </g>
                    <!-- Sudeste -->
                    <g transform="translate(160, 135)">
                        <polygon points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6" opacity="0.7"/>
                    </g>
                    <!-- Sul -->
                    <g transform="translate(100, 170)">
                        <polygon points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6" opacity="0.7"/>
                    </g>
                    <!-- Sudoeste -->
                    <g transform="translate(40, 135)">
                        <polygon points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6" opacity="0.7"/>
                    </g>
                    <!-- Noroeste -->
                    <g transform="translate(40, 65)">
                        <polygon points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6" opacity="0.7"/>
                    </g>
                </g>

                <!-- Círculo externo representando o território -->
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#tekohaGold)" stroke-width="0.5" opacity="0.25" stroke-dasharray="4 4"/>
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
        // Suporta múltiplos botões de troca
        const switchBtns = this.container.querySelectorAll('.book-switch-btn');
        switchBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.target.dataset.switchBook;
                callback(bookId);
            });
        });

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
