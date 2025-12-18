/**
 * Renderizador da tela inicial
 * Single Responsibility: Apenas renderizar home screen
 */
class HomeRenderer {
    constructor(containerSelector, colors) {
        this.container = document.querySelector(containerSelector);
        this.colors = colors;
    }

    render(onStartCallback) {
        this.container.innerHTML = this.createHomeHTML();
        this.attachStartButton(onStartCallback);
    }

    createHomeHTML() {
        return `
            <div class="home-screen">
                ${this.createSymbolSVG()}
                ${this.createTitle()}
                ${this.createSubtitle()}
                ${this.createEpigraph()}
                ${this.createStartButton()}
                ${this.createFootnote()}
                ${this.createKeyboardShortcuts()}
            </div>
        `;
    }

    createSymbolSVG() {
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

    createTitle() {
        return `
            <h1 class="home-title">PAÊBIRÚ XXI</h1>
        `;
    }

    createSubtitle() {
        return `
            <p class="home-subtitle">Um Homo Sapiens Para Um Novo Século</p>
        `;
    }

    createEpigraph() {
        return `
            <p class="home-epigraph">"Para um mundo onde a sombra não encontra terreno"</p>
        `;
    }

    createStartButton() {
        return `
            <button id="start-journey-btn" class="home-start-btn">COMEÇAR A JORNADA</button>
        `;
    }

    createFootnote() {
        return `
            <p class="home-footnote">21 arquétipos · 3 atos · 1 caminho</p>
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

    hideLoading() {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement && loadingElement.parentElement) {
            loadingElement.remove();
        }
    }
}
