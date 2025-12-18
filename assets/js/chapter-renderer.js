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
                padding: clamp(2rem, 4vw, 5rem) clamp(1.5rem, 4vw, 4rem);
                font-size: ${fontSize}%;
                line-height: 2;
                text-align: justify;
                hyphens: auto;
                -webkit-hyphens: auto;
            ">
                ${content}
            </div>
        `;
    }

    applyStyles() {
        const content = this.container.querySelector(".chapter-content");
        if (!content) return;

        this.styleParagraphs(content);
        this.styleHeadings(content);
        this.styleBlockquotes(content);
        this.styleEmphasis(content);
        this.styleHorizontalRules(content);
        this.styleLists(content);
    }

    styleParagraphs(content) {
        content.querySelectorAll("p").forEach((el, index) => {
            el.style.marginBottom = "1.2em";
            el.style.textIndent = "1.5em";
            // Primeiro parágrafo após título não tem indentação
            const prev = el.previousElementSibling;
            if (!prev || prev.tagName.match(/^H[1-6]$/) || prev.tagName === 'HR') {
                el.style.textIndent = "0";
            }
        });
    }

    styleHeadings(content) {
        content.querySelectorAll("h1, h2, h3, h4").forEach(el => {
            el.style.color = this.colors.gold;
            el.style.fontWeight = "400";
            el.style.marginTop = "2.5em";
            el.style.marginBottom = "1em";
            el.style.textAlign = "left";
            el.style.textIndent = "0";
        });
    }

    styleBlockquotes(content) {
        content.querySelectorAll("blockquote").forEach(el => {
            el.style.borderLeft = `3px solid ${this.colors.gold}`;
            el.style.paddingLeft = "1.5rem";
            el.style.paddingRight = "1rem";
            el.style.marginLeft = "1em";
            el.style.marginRight = "1em";
            el.style.marginTop = "1.5em";
            el.style.marginBottom = "1.5em";
            el.style.color = this.colors.blockquote;
            el.style.fontStyle = "italic";
            el.style.textAlign = "left";
            // Remover indent dos parágrafos dentro do blockquote
            el.querySelectorAll("p").forEach(p => {
                p.style.textIndent = "0";
            });
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
            el.style.margin = "2.5em auto";
            el.style.width = "40%";
        });
    }

    styleLists(content) {
        content.querySelectorAll("ul, ol").forEach(el => {
            el.style.marginLeft = "2em";
            el.style.marginBottom = "1.5em";
            el.style.paddingLeft = "1em";
        });
        content.querySelectorAll("li").forEach(el => {
            el.style.marginBottom = "0.5em";
            el.style.textIndent = "0";
            el.style.textAlign = "left";
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
