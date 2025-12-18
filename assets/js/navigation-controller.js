/**
 * Controlador de navegação
 * Single Responsibility: Apenas controlar navegação
 */
class NavigationController {
    constructor(stateManager) {
        this.state = stateManager;
        this.prevButton = document.querySelector('.nav-arrow.prev');
        this.nextButton = document.querySelector('.nav-arrow.next');
        this.progressBar = document.querySelector(Config.selectors.progressBar);

        this.bindKeyboardEvents();
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToPrevious();
            else if (e.key === 'ArrowRight') this.goToNext();
        });
    }

    goToPrevious() {
        if (this.state.currentChapter > 0) {
            this.state.setCurrentChapter(this.state.currentChapter - 1);
        } else if (this.state.currentChapter === 0) {
            this.state.setCurrentChapter(-1); // Go to home
        }
    }

    goToNext() {
        if (this.state.currentChapter < this.state.chapters.length - 1) {
            this.state.setCurrentChapter(this.state.currentChapter + 1);
        }
    }

    goToChapter(index) {
        if (index >= 0 && index < this.state.chapters.length) {
            this.state.setCurrentChapter(index);
        }
    }

    goToHome() {
        this.state.setCurrentChapter(-1);
    }

    updateButtons() {
        if (this.prevButton) {
            this.prevButton.disabled = this.state.currentChapter < 0;
        }
        if (this.nextButton) {
            this.nextButton.disabled = this.state.isLastChapter();
        }
    }

    updateProgress() {
        if (!this.progressBar || !this.state.hasChapters()) return;

        const progress = this.state.isHome()
            ? 0
            : ((this.state.currentChapter + 1) / this.state.chapters.length) * 100;

        this.progressBar.style.width = `${progress}%`;
    }
}
