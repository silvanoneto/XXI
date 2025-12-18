"""Builder do EPUB seguindo padrão SOLID."""

import logging
from datetime import datetime
from typing import List, Optional, Tuple

from ebooklib import epub

from .config import Config
from .templates import TemplateEngine
from .cover import CoverGenerator
from .content import ContentProcessor, Chapter


logger = logging.getLogger(__name__)


class EpubBuilder:
    """Orquestra a geração do EPUB."""

    HTML_TEMPLATE = "capitulo.html.template"

    def __init__(self, config: Config):
        """
        Inicializa o builder.

        Args:
            config: Configurações do livro.
        """
        self.config = config
        self.template_engine = TemplateEngine(config.base_dir / "data" / "livro")
        self.cover_generator = CoverGenerator(config, self.template_engine)
        self.content_processor = ContentProcessor(config.base_dir)

        self._book: epub.EpubBook = None
        self._chapters: List[epub.EpubHtml] = []
        self._toc: List = []
        self._counter: int = 0

    def _create_epub_chapter(
        self, chapter: Chapter, prefixo: str = ""
    ) -> epub.EpubHtml:
        """
        Cria um capítulo EPUB a partir de um Chapter.

        Args:
            chapter: Capítulo processado.
            prefixo: Prefixo para nome único do arquivo.

        Returns:
            Capítulo EPUB.
        """
        nome_unico = (
            f"{prefixo}_{chapter.nome_arquivo}" if prefixo else chapter.nome_arquivo
        )
        epub_chapter = epub.EpubHtml(
            title=chapter.titulo,
            file_name=f"{nome_unico}.xhtml",
            lang=self.config.lingua,
        )

        html_content = self.template_engine.render(
            self.HTML_TEMPLATE,
            TITULO=chapter.titulo,
            CONTEUDO=chapter.conteudo_html,
        )
        epub_chapter.content = html_content

        self._book.add_item(epub_chapter)
        return epub_chapter

    def _add_cover(self) -> None:
        """Adiciona a capa ao EPUB."""
        logger.info("  ✓ Capa SVG gerada em memória")
        capa_bytes = self.cover_generator.generate_png()
        logger.info("  ✓ Capa convertida em memória (SVG → PNG)")

        self._book.set_cover("capa.png", capa_bytes, create_page=True)
        logger.info("  ✓ Capa adicionada ao EPUB")

    def _add_chapter_images(self) -> None:
        """Adiciona imagens dos capítulos ao EPUB."""
        images_dir = self.config.base_dir / "assets" / "images"

        image_files = {
            "introducao.png": "introducao",
            "ato_1.png": "ato1",
            "ato_2.png": "ato2",
            "ato_3.png": "ato3",
            "conclusao.png": "conclusao",
        }

        for filename, uid in image_files.items():
            img_path = images_dir / filename
            if img_path.exists():
                with open(img_path, "rb") as f:
                    img_content = f.read()

                img_item = epub.EpubItem(
                    uid=uid,
                    file_name=f"images/{filename}",
                    media_type="image/png",
                    content=img_content,
                )
                self._book.add_item(img_item)

        logger.info("  ✓ Imagens dos capítulos adicionadas ao EPUB")

    def _add_contracapa(self) -> None:
        """Adiciona a contracapa ao EPUB."""
        logger.info("  ✓ Contracapa SVG gerada em memória")
        contracapa_bytes = self.cover_generator.generate_contracapa_png()
        logger.info("  ✓ Contracapa convertida em memória (SVG → PNG)")

        # Adiciona como imagem no EPUB
        contracapa_img = epub.EpubItem(
            uid="contracapa",
            file_name="contracapa.png",
            media_type="image/png",
            content=contracapa_bytes,
        )
        self._book.add_item(contracapa_img)

        # Cria página HTML para a contracapa usando template
        html_content = self.template_engine.render(
            self.HTML_TEMPLATE,
            TITULO="",
            CONTEUDO='<div style="text-align:center;"><img src="contracapa.png" alt="Contracapa" style="width:100%; max-width:800px; height:auto;"/></div>',
        )

        contracapa_page = epub.EpubHtml(
            title="Contracapa", file_name="contracapa.xhtml", lang=self.config.lingua
        )
        contracapa_page.content = html_content
        self._book.add_item(contracapa_page)
        self._chapters.append(contracapa_page)
        logger.info("  ✓ Contracapa adicionada ao EPUB")

    def _add_metadata(self) -> None:
        """Adiciona metadados ao EPUB."""
        self._book.set_identifier(self.config.identificador)
        self._book.set_title(self.config.titulo_completo)
        self._book.set_language(self.config.lingua)
        self._book.add_author(self.config.coautor)
        self._book.add_metadata("DC", "contributor", "Assistentes de IA (LLMs)")
        self._book.add_metadata("DC", "description", self.config.epigrafe)
        self._book.add_metadata("DC", "date", datetime.now().strftime("%Y-%m-%d"))

    def _process_structure(
        self, estrutura: List[Tuple[str, List[str]]], secao_nome: Optional[str] = None
    ) -> List[epub.EpubHtml]:
        """
        Processa uma estrutura de conteúdo.

        Args:
            estrutura: Lista de (pasta, arquivos).
            secao_nome: Nome da seção para TOC (opcional).

        Returns:
            Lista de capítulos EPUB.
        """
        all_chapters = []

        for pasta, arquivos in estrutura:
            chapters = self.content_processor.process_section(pasta, arquivos)
            secao_capitulos = []
            prefixo_secao = pasta.split("/")[-1][:10]

            for chapter in chapters:
                self._counter += 1
                prefixo = f"{self._counter:02d}_{prefixo_secao}"
                epub_chapter = self._create_epub_chapter(chapter, prefixo)

                self._chapters.append(epub_chapter)
                all_chapters.append(epub_chapter)

                if chapter.incluir_no_toc:
                    secao_capitulos.append(epub_chapter)

            if secao_capitulos:
                nome_secao = pasta.split("/")[-1].replace("_", " ")
                if len(secao_capitulos) > 1:
                    self._toc.append((epub.Section(nome_secao), secao_capitulos))
                else:
                    self._toc.extend(secao_capitulos)

        return all_chapters

    def build(self) -> None:
        """Executa a geração completa do EPUB."""
        logger.info(f"\n📖 Gerando EPUB: {self.config.titulo}")
        logger.info("=" * 50)

        # Inicializar livro
        self._book = epub.EpubBook()
        self._chapters = []
        self._toc = []
        self._counter = 0

        # Adicionar capa e metadados
        self._add_cover()
        self._add_chapter_images()
        self._add_metadata()

        # Processar livro
        logger.info("\n📚 Processando livro...")
        self._process_structure(self.config.estrutura_livro)

        # Processar artigos
        logger.info("\n📑 Processando artigos (Apêndice)...")
        artigos = []
        for pasta, arquivos in self.config.estrutura_artigos:
            chapters = self.content_processor.process_section(pasta, arquivos)
            for chapter in chapters:
                chapter.nome_arquivo = f"apendice_{chapter.nome_arquivo}"
                epub_chapter = self._create_epub_chapter(chapter)
                self._chapters.append(epub_chapter)
                artigos.append(epub_chapter)

        if artigos:
            self._toc.append((epub.Section("Apêndice: Artigos"), artigos))

        # Adicionar contracapa ao final
        self._add_contracapa()

        # Finalizar navegação
        self._book.toc = self._toc
        self._book.add_item(epub.EpubNcx())
        self._book.add_item(epub.EpubNav())
        self._book.spine = ["nav"] + self._chapters

        # Escrever arquivo
        epub.write_epub(str(self.config.output_path), self._book, {})

        logger.info("\n" + "=" * 50)
        logger.info("✨ EPUB gerado com sucesso!")
        logger.info(f"   📁 {self.config.output_path}")
        logger.info(f"   📊 {len(self._chapters)} capítulos")
