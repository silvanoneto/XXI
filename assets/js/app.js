/**
 * Aplicação Principal - Orquestrador
 * Single Responsibility: Coordenar módulos
 * Dependency Inversion: Depende de abstrações (interfaces dos módulos)
 */
class PaebiruApp {
    constructor() {
        // Inicializar gerenciador de estado
        this.state = new StateManager();

        // Livro atual (será definido na inicialização)
        this.currentBookConfig = null;
        this.epubLoader = null;

        // Inicializar módulos com suas dependências
        this.chapterRenderer = new ChapterRenderer(Config.selectors.reader, Config.colors);
        this.homeRenderer = new HomeRenderer(Config.selectors.reader, Config.colors);
        this.tocManager = new TOCManager(Config.selectors.toc);
        this.navigation = new NavigationController(this.state);
        this.ui = new UIController(this.state);

        // Inscrever para mudanças de estado
        this.state.subscribe(this.handleStateChange.bind(this));

        // Expor métodos globais para onclick do HTML
        this.exposeGlobalMethods();
    }

    async init() {
        try {
            // Carregar tema e fonte salvos
            this.ui.loadTheme();
            this.ui.loadFont();

            // Verificar se há livro salvo
            const savedBookId = localStorage.getItem('currentBook');
            const savedBook = savedBookId ? Config.books[savedBookId] : null;

            if (savedBook) {
                await this.loadBook(savedBookId);
            } else {
                // Mostrar seletor de livros
                this.showBookSelector();
            }
        } catch (err) {
            console.error("Erro ao inicializar:", err);
            this.chapterRenderer.showError(err.message);
        }
    }

    showBookSelector() {
        this.homeRenderer.render(
            null,
            null,
            (bookId) => this.loadBook(bookId)
        );
        this.updateMenuVisibility(false);
    }

    async loadBook(bookId) {
        const bookConfig = Config.books[bookId];
        if (!bookConfig) {
            console.error('Livro não encontrado:', bookId);
            return;
        }

        // Salvar livro atual
        localStorage.setItem('currentBook', bookId);
        this.currentBookConfig = bookConfig;

        // Atualizar título da página
        document.title = `${bookConfig.title} — ${bookConfig.subtitle}`;

        // Criar novo loader para o livro
        this.epubLoader = new EPUBLoader(bookConfig.path);

        try {
            const chapters = await this.loadEPUB();
            this.state.setChapters(chapters);
            this.tocManager.build(chapters, this.handleChapterSelect.bind(this));

            // Restaurar checkpoint de leitura (específico por livro)
            const savedChapter = this.state.loadCheckpoint(bookId);
            if (savedChapter !== null && savedChapter >= 0 && savedChapter < chapters.length) {
                this.navigation.goToChapter(savedChapter);
            } else {
                this.showHome();
            }
        } catch (err) {
            console.error("Erro ao carregar livro:", err);
            this.chapterRenderer.showError(err.message);
        }
    }

    async switchBook(bookId) {
        // Limpar estado atual
        this.state.setChapters([]);
        this.state.setCurrentChapter(-1);

        // Carregar novo livro
        await this.loadBook(bookId);
    }

    async loadEPUB() {
        const zip = await this.epubLoader.load();
        const opfPath = await this.epubLoader.getOpfPath(zip);
        const opfDir = opfPath.substring(0, opfPath.lastIndexOf("/") + 1);
        const opfDoc = await this.epubLoader.parseOpf(zip, opfPath);

        // Extrair imagens primeiro para criar cache de blob URLs
        await this.epubLoader.extractImages(zip, opfDir);

        const manifestMap = this.epubLoader.buildManifestMap(opfDoc);
        const spineItems = this.epubLoader.getSpineItems(opfDoc);

        const chapters = [];

        for (const itemref of spineItems) {
            const id = itemref.getAttribute("idref");
            const href = manifestMap[id];

            if (href && href.endsWith(".xhtml") &&
                !this.epubLoader.shouldSkipFile(href, Config.epub.skipFiles)) {
                const chapter = await this.epubLoader.extractChapter(zip, opfDir + href);
                if (chapter) {
                    chapters.push({ ...chapter, href });
                }
            }
        }

        return chapters;
    }

    handleStateChange(event, data) {
        switch (event) {
            case 'chapterChanged':
                this.onChapterChanged(data);
                break;
            case 'fontSizeChanged':
                this.chapterRenderer.updateFontSize(data);
                break;
        }
    }

    onChapterChanged({ current }) {
        if (current === -1) {
            this.renderHome();
        } else {
            this.renderChapter(current);
        }
        this.navigation.updateButtons();
        this.navigation.updateProgress();
    }

    showHome() {
        this.state.setCurrentChapter(-1);
    }

    renderHome() {
        this.homeRenderer.render(
            () => this.navigation.goToChapter(0),
            this.currentBookConfig,
            (bookId) => this.switchBook(bookId)
        );
        this.tocManager.clearActive();
        this.updateMenuVisibility(false);
    }

    renderChapter(index) {
        const chapter = this.state.chapters[index];
        if (chapter) {
            this.chapterRenderer.render(chapter, this.state.fontSize);
            this.tocManager.setActive(index);
            // Salvar checkpoint específico por livro
            if (this.currentBookConfig) {
                this.state.saveCheckpoint(index, this.currentBookConfig.id);
            }
            this.updateMenuVisibility(true);
        }
    }

    updateMenuVisibility(show) {
        const readingControls = document.querySelectorAll('.reading-control');
        readingControls.forEach(btn => {
            btn.style.display = show ? '' : 'none';
        });
    }

    handleChapterSelect(index) {
        this.navigation.goToChapter(index);
        this.ui.closeSidebar();
    }

    // Expor métodos para uso em atributos onclick do HTML
    exposeGlobalMethods() {
        window.showHome = () => this.showHome();
        window.displayChapter = (index) => this.navigation.goToChapter(index);
        window.prevPage = () => this.navigation.goToPrevious();
        window.nextPage = () => this.navigation.goToNext();
        window.increaseFontSize = () => this.ui.increaseFontSize();
        window.decreaseFontSize = () => this.ui.decreaseFontSize();
        window.cycleTheme = () => this.ui.cycleTheme();
        window.cycleFont = () => this.ui.cycleFont();
        window.toggleSidebar = () => this.ui.toggleSidebar();
        window.switchBook = (bookId) => this.switchBook(bookId);
    }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new PaebiruApp();
    app.init();
});
