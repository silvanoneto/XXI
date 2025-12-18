/**
 * Configurações globais da aplicação
 * Single Responsibility: Apenas configurações
 */
const Config = {
    epub: {
        path: 'assets/Paebiru_XXI.epub',
        skipFiles: ['nav', 'contracapa']
    },
    
    ui: {
        fontSize: {
            default: 100,
            min: 70,
            max: 150,
            step: 10
        },
        mobileBreakpoint: 768
    },
    
    selectors: {
        reader: '#reader',
        toc: '#toc',
        sidebar: '#sidebar',
        progressBar: '#progress-bar'
    },
    
    colors: {
        gold: '#d4af37',
        goldLight: '#f4e4ba',
        bgDark: '#0d0d1a',
        textMuted: '#888',
        textDark: '#666',
        textLight: '#ccc',
        blockquote: '#aaa'
    }
};

// Freeze para imutabilidade (Open/Closed Principle)
Object.freeze(Config);
Object.freeze(Config.epub);
Object.freeze(Config.ui);
Object.freeze(Config.ui.fontSize);
Object.freeze(Config.selectors);
Object.freeze(Config.colors);
