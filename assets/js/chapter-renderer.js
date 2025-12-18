/**
 * Renderizador de capítulos
 * Single Responsibility: Apenas renderizar conteúdo
 * Open/Closed: Extensível via styles config
 */
class ChapterRenderer {
    constructor(containerSelector, colors) {
        this.container = document.querySelector(containerSelector);
        this.colors = colors;
    }

    render(chapter, fontSize) {
        this.container.innerHTML = this.createChapterHTML(chapter.content, fontSize);
        this.applyStyles();
        this.scrollToTop();
    }

    createChapterHTML(content, fontSize) {
        return `
            <div class="chapter-content" style="
                max-width: var(--content-max-width, min(800px, 90vw));
                margin: 0 auto;
                padding: clamp(1.5rem, 3vw, 4rem) clamp(1rem, 3vw, 3rem);
                font-size: ${fontSize}%;
                line-height: 1.9;
            ">
                ${content}
            </div>
        `;
    }

    applyStyles() {
        const content = this.container.querySelector(".chapter-content");
        if (!content) return;

        this.styleHeadings(content);
        this.styleBlockquotes(content);
        this.styleEmphasis(content);
        this.styleHorizontalRules(content);
    }

    styleHeadings(content) {
        content.querySelectorAll("h1, h2, h3, h4").forEach(el => {
            el.style.color = this.colors.gold;
            el.style.fontWeight = "400";
            el.style.marginTop = "2em";
        });
    }

    styleBlockquotes(content) {
        content.querySelectorAll("blockquote").forEach(el => {
            el.style.borderLeft = `3px solid ${this.colors.gold}`;
            el.style.paddingLeft = "1.5rem";
            el.style.marginLeft = "0";
            el.style.color = this.colors.blockquote;
            el.style.fontStyle = "italic";
        });
    }

    styleEmphasis(content) {
        content.querySelectorAll("strong").forEach(el => {
            el.style.color = this.colors.goldLight;
        });
        content.querySelectorAll("em").forEach(el => {
            el.style.color = this.colors.textLight;
        });
    }

    styleHorizontalRules(content) {
        content.querySelectorAll("hr").forEach(el => {
            el.style.border = "none";
            el.style.borderTop = `1px solid ${this.colors.gold}`;
            el.style.opacity = "0.3";
            el.style.margin = "2em 0";
        });
    }

    scrollToTop() {
        this.container.scrollTop = 0;
    }

    updateFontSize(fontSize) {
        const content = this.container.querySelector(".chapter-content");
        if (content) {
            content.style.fontSize = `${fontSize}%`;
        }
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="loading">
                <p style="color: ${this.colors.gold};">Erro ao carregar o livro.</p>
                <p>${message}</p>
                <a href="${Config.epub.path}" download style="color: ${this.colors.gold}; margin-top: 1rem;">
                    Baixar EPUB diretamente
                </a>
            </div>
        `;
    }

    hideLoading() {
        const loadingElement = this.container.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}
