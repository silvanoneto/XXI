/**
 * Gerenciador de estado da aplicação
 * Single Responsibility: Apenas gerenciar estado
 */
class StateManager {
    constructor() {
        this.state = {
            chapters: [],
            currentChapter: -1, // -1 = home
            fontSize: this.loadFontSize()
        };
        this.listeners = [];
    }

    getState() {
        return { ...this.state };
    }

    get chapters() {
        return this.state.chapters;
    }

    get currentChapter() {
        return this.state.currentChapter;
    }

    get fontSize() {
        return this.state.fontSize;
    }

    setChapters(chapters) {
        this.state.chapters = chapters;
        this.notify('chaptersLoaded', chapters);
    }

    setCurrentChapter(index) {
        const previous = this.state.currentChapter;
        this.state.currentChapter = index;
        this.saveCheckpoint();
        this.notify('chapterChanged', { previous, current: index });
    }

    saveCheckpoint() {
        const checkpoint = {
            chapter: this.state.currentChapter,
            timestamp: Date.now()
        };
        localStorage.setItem('readingCheckpoint', JSON.stringify(checkpoint));
    }

    loadCheckpoint() {
        try {
            const saved = localStorage.getItem('readingCheckpoint');
            if (saved) {
                const checkpoint = JSON.parse(saved);
                return checkpoint.chapter;
            }
        } catch (e) {
            console.warn('Erro ao carregar checkpoint:', e);
        }
        return null;
    }

    setFontSize(size) {
        this.state.fontSize = Math.max(
            Config.ui.fontSize.min,
            Math.min(Config.ui.fontSize.max, size)
        );
        this.saveFontSize();
        this.notify('fontSizeChanged', this.state.fontSize);
    }

    saveFontSize() {
        localStorage.setItem('fontSize', this.state.fontSize.toString());
    }

    loadFontSize() {
        try {
            const saved = localStorage.getItem('fontSize');
            if (saved) {
                const size = parseInt(saved, 10);
                if (!isNaN(size) && size >= Config.ui.fontSize.min && size <= Config.ui.fontSize.max) {
                    return size;
                }
            }
        } catch (e) {
            console.warn('Erro ao carregar fontSize:', e);
        }
        return Config.ui.fontSize.default;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify(event, data) {
        this.listeners.forEach(callback => callback(event, data));
    }

    isHome() {
        return this.state.currentChapter === -1;
    }

    isFirstChapter() {
        return this.state.currentChapter === 0;
    }

    isLastChapter() {
        return this.state.currentChapter === this.state.chapters.length - 1;
    }

    hasChapters() {
        return this.state.chapters.length > 0;
    }
}
