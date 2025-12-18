/**
 * Serviço de carregamento de EPUB
 * Single Responsibility: Apenas carregar e parsear EPUB
 * Dependency Inversion: Recebe dependências via construtor
 */
class EPUBLoader {
    constructor(epubPath) {
        this.epubPath = epubPath;
        this.parser = new DOMParser();
    }

    async load() {
        const response = await fetch(this.epubPath);
        const blob = await response.blob();
        return await JSZip.loadAsync(blob);
    }

    async getOpfPath(zip) {
        const container = await zip.file("META-INF/container.xml").async("text");
        const containerDoc = this.parser.parseFromString(container, "text/xml");
        return containerDoc.querySelector("rootfile").getAttribute("full-path");
    }

    async parseOpf(zip, opfPath) {
        const opf = await zip.file(opfPath).async("text");
        return this.parser.parseFromString(opf, "text/xml");
    }

    buildManifestMap(opfDoc) {
        const manifest = opfDoc.querySelectorAll("manifest item");
        const map = {};
        manifest.forEach(item => {
            map[item.getAttribute("id")] = item.getAttribute("href");
        });
        return map;
    }

    getSpineItems(opfDoc) {
        return opfDoc.querySelectorAll("spine itemref");
    }

    async extractChapter(zip, filePath) {
        const file = zip.file(filePath);
        if (!file) return null;
        
        const content = await file.async("text");
        const doc = this.parser.parseFromString(content, "text/html");
        
        return {
            title: doc.querySelector("title")?.textContent || 'Sem título',
            content: doc.querySelector("body")?.innerHTML || content
        };
    }

    shouldSkipFile(href, skipPatterns) {
        return skipPatterns.some(pattern => href.includes(pattern));
    }
}
