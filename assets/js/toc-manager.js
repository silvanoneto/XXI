/**
 * Gerenciador do Índice (TOC)
 * Single Responsibility: Apenas gerenciar TOC
 */
class TOCManager {
    constructor(tocSelector) {
        this.tocElement = document.querySelector(tocSelector);
    }

    build(chapters, onChapterSelect) {
        this.tocElement.innerHTML = "";

        chapters.forEach((chapter, index) => {
            const li = this.createTOCItem(chapter, index, onChapterSelect);
            this.tocElement.appendChild(li);
        });
    }

    createTOCItem(chapter, index, onSelect) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = "#";
        a.textContent = chapter.title;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            onSelect(index);
        });

        li.appendChild(a);
        return li;
    }

    setActive(index) {
        const links = this.tocElement.querySelectorAll("a");
        links.forEach((a, i) => {
            a.classList.toggle("active", i === index);
        });
    }

    clearActive() {
        this.tocElement.querySelectorAll("a").forEach(a => {
            a.classList.remove("active");
        });
    }
}
