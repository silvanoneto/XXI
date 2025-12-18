/**
 * Serviço de carregamento de EPUB
 * Single Responsibility: Apenas carregar e parsear EPUB
 * Dependency Inversion: Recebe dependências via construtor
 */
class EPUBLoader {
    constructor(epubPath) {
        this.epubPath = epubPath;
        this.parser = new DOMParser();
        this.imageCache = {}; // Cache de blob URLs das imagens
    }

    async load() {
        const response = await fetch(this.epubPath);
        const blob = await response.blob();
        return await JSZip.loadAsync(blob);
    }

    /**
     * Extrai todas as imagens do EPUB e cria blob URLs
     */
    async extractImages(zip, opfDir) {
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
        const files = zip.file(/\.(png|jpg|jpeg|gif|svg|webp)$/i);
        
        for (const file of files) {
            try {
                const arrayBuffer = await file.async('arraybuffer');
                const mimeType = this.getMimeType(file.name);
                const blob = new Blob([arrayBuffer], { type: mimeType });
                const blobUrl = URL.createObjectURL(blob);
                
                // Guardar com caminho relativo ao diretório do OPF
                const relativePath = file.name.startsWith(opfDir) 
                    ? file.name.substring(opfDir.length)
                    : file.name;
                this.imageCache[relativePath] = blobUrl;
                
                // Também guardar com o caminho completo
                this.imageCache[file.name] = blobUrl;
            } catch (err) {
                console.warn(`Erro ao extrair imagem ${file.name}:`, err);
            }
        }
    }

    /**
     * Retorna o MIME type baseado na extensão do arquivo
     */
    getMimeType(filename) {
        const ext = filename.toLowerCase().split('.').pop();
        const mimeTypes = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }

    /**
     * Substitui caminhos de imagens no HTML por blob URLs
     */
    replaceImagePaths(html) {
        // Substituir src="images/xxx" por blob URLs
        return html.replace(/src=["']([^"']+)["']/g, (match, src) => {
            // Procurar no cache de imagens
            if (this.imageCache[src]) {
                return `src="${this.imageCache[src]}"`;
            }
            // Tentar com prefixo images/
            if (this.imageCache['images/' + src]) {
                return `src="${this.imageCache['images/' + src]}"`;
            }
            // Tentar sem prefixo
            const filename = src.split('/').pop();
            if (this.imageCache['images/' + filename]) {
                return `src="${this.imageCache['images/' + filename]}"`;
            }
            return match;
        });
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
        
        // Obter o HTML do body e substituir caminhos de imagens
        let bodyContent = doc.querySelector("body")?.innerHTML || content;
        bodyContent = this.replaceImagePaths(bodyContent);
        
        return {
            title: doc.querySelector("title")?.textContent || 'Sem título',
            content: bodyContent
        };
    }

    shouldSkipFile(href, skipPatterns) {
        return skipPatterns.some(pattern => href.includes(pattern));
    }
}
