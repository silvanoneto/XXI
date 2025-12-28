/**
 * Configurações globais da aplicação
 * Single Responsibility: Apenas configurações
 */
const Config = {
    books: {
        paebiru: {
            id: 'paebiru',
            path: 'assets/Paebiru_XXI.epub',
            title: 'PAÊBIRÚ XXI',
            subtitle: 'Um Ensaio Filosófico',
            epigraph: 'Para um mundo onde a sombra não encontra terreno',
            footnote: '21 arquétipos · 3 atos · 1 caminho',
            symbol: 'paebiru' // tipo de símbolo SVG
        },
        crio: {
            id: 'crio',
            path: 'assets/CRIO_livro.epub',
            title: 'CRIØ',
            subtitle: 'Uma Ontologia Relacional para o Século XXI',
            epigraph: 'Caminhante, não há caminho, faz-se caminho ao andar…',
            footnote: 'Você não existe antes de suas relações. Você é a teia que te tece.',
            symbol: 'crio' // tipo de símbolo SVG
        },
        tekoha: {
            id: 'tekoha',
            path: 'assets/Tekoha_XXI.epub',
            title: 'TEKOHA XXI',
            subtitle: 'Manual de Transformação Relacional',
            epigraph: 'Sem tekoha não há tekó.',
            footnote: 'Do indivíduo ao cosmos · Da teoria à prática · A trilogia completa',
            symbol: 'tekoha' // tipo de símbolo SVG
        }
    },

    defaultBook: 'paebiru',

    epub: {
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
Object.freeze(Config.books);
Object.freeze(Config.books.paebiru);
Object.freeze(Config.books.crio);
Object.freeze(Config.books.tekoha);
Object.freeze(Config.epub);
Object.freeze(Config.ui);
Object.freeze(Config.ui.fontSize);
Object.freeze(Config.selectors);
Object.freeze(Config.colors);
