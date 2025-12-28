#!/usr/bin/env python3
"""
Gera ebook EPUB a partir de um arquivo de configuração.

Uso:
    python3 scripts/build_epub.py config-livro-crio.yaml
    python3 scripts/build_epub.py config-livro-ensaio.yaml
    python3 scripts/build_epub.py --all  # Gera todos os livros

Requer: pip install ebooklib markdown cairosvg pyyaml
"""

import argparse
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import List

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)
logger = logging.getLogger(__name__)


def get_templates_dir(config) -> Path:
    """
    Determina o diretório de templates baseado no config.

    Args:
        config: Configuração do livro.

    Returns:
        Path para o diretório de templates.
    """
    # Pega o primeiro item da estrutura para determinar o diretório base
    if config.estrutura_livro:
        primeira_pasta = config.estrutura_livro[0][0]
        # Extrai o diretório base (ex: "data/livro_crio" de "data/livro_crio/01_Abertura")
        partes = Path(primeira_pasta).parts
        if len(partes) >= 2:
            return config.base_dir / partes[0] / partes[1]

    # Fallback para data/livro
    return config.base_dir / "data" / "livro"


def build_epub(config_path: Path) -> bool:
    """
    Gera um EPUB a partir do arquivo de configuração.

    Args:
        config_path: Caminho para o arquivo YAML de configuração.

    Returns:
        True se sucesso, False se erro.
    """
    base_dir = config_path.parent

    # Importar módulos do projeto
    sys.path.insert(0, str(base_dir / "src"))

    from epub.config import Config
    from epub.templates import TemplateEngine
    from epub.cover import CoverGenerator
    from epub.content import ContentProcessor
    from ebooklib import epub

    # Carregar configuração
    try:
        config = Config.from_yaml(config_path)
    except Exception as e:
        logger.error(f"❌ Erro ao carregar config: {e}")
        return False

    # Determinar diretório de templates
    templates_dir = get_templates_dir(config)

    template_engine = TemplateEngine(templates_dir)
    cover_generator = CoverGenerator(config, template_engine)
    content_processor = ContentProcessor(base_dir)

    logger.info(f"\n{'='*50}")
    logger.info(f"Gerando EPUB: {config.titulo_completo}")
    logger.info(f"{'='*50}\n")

    # Criar livro EPUB
    book = epub.EpubBook()
    book.set_identifier(config.identificador)
    book.set_title(config.titulo_completo)
    book.set_language(config.lingua)
    book.add_author(config.coautor)
    book.add_metadata("DC", "date", datetime.now().strftime("%Y-%m-%d"))
    book.add_metadata("DC", "description", f"{config.titulo}: {config.subtitulo}")

    # Adicionar capa
    logger.info("Adicionando capa...")
    try:
        capa_bytes = cover_generator.generate_png()
        book.set_cover("capa.png", capa_bytes, create_page=True)
        logger.info("  ✓ Capa adicionada")
    except Exception as e:
        logger.warning(f"  ⚠ Erro ao gerar capa: {e}")

    # Adicionar imagens se existirem
    images_dir = base_dir / "assets" / "images"
    if images_dir.exists():
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
                book.add_item(img_item)
        logger.info("  ✓ Imagens adicionadas")

    # Processar capítulos
    logger.info("\nProcessando capítulos...")

    chapters = []
    toc = []
    counter = 0

    for pasta, arquivos in config.estrutura_livro:
        for arquivo in arquivos:
            filepath = base_dir / pasta / arquivo

            if not filepath.exists():
                logger.warning(f"  ⚠ Arquivo não encontrado: {filepath}")
                continue

            chapter = content_processor.process_file(filepath)

            if chapter is None:
                logger.warning(f"  ⚠ Erro ao processar: {filepath}")
                continue

            nome_unico = f"cap_{counter:02d}_{chapter.nome_arquivo}"
            epub_chapter = epub.EpubHtml(
                title=chapter.titulo,
                file_name=f"{nome_unico}.xhtml",
                lang=config.lingua,
            )

            # Renderizar com template
            html_content = template_engine.render(
                "capitulo.html.template",
                TITULO=chapter.titulo,
                CONTEUDO=chapter.conteudo_html,
            )
            epub_chapter.content = html_content

            book.add_item(epub_chapter)
            chapters.append(epub_chapter)
            toc.append(epub_chapter)

            logger.info(f"  ✓ {chapter.titulo}")
            counter += 1

    # Processar artigos/apêndices se existirem
    if hasattr(config, "estrutura_artigos") and config.estrutura_artigos:
        logger.info("\nProcessando apêndices...")
        artigos = []
        for pasta, arquivos in config.estrutura_artigos:
            for arquivo in arquivos:
                filepath = base_dir / pasta / arquivo
                if not filepath.exists():
                    continue

                chapter = content_processor.process_file(filepath)
                if chapter is None:
                    continue

                counter += 1
                nome_unico = f"apendice_{counter:02d}_{chapter.nome_arquivo}"
                epub_chapter = epub.EpubHtml(
                    title=chapter.titulo,
                    file_name=f"{nome_unico}.xhtml",
                    lang=config.lingua,
                )

                html_content = template_engine.render(
                    "capitulo.html.template",
                    TITULO=chapter.titulo,
                    CONTEUDO=chapter.conteudo_html,
                )
                epub_chapter.content = html_content

                book.add_item(epub_chapter)
                chapters.append(epub_chapter)
                artigos.append(epub_chapter)

                logger.info(f"  ✓ {chapter.titulo}")

        if artigos:
            toc.append((epub.Section("Apêndice"), artigos))

    # Adicionar contracapa se existir template
    contracapa_template = templates_dir / "contracapa.svg.template"
    if contracapa_template.exists():
        try:
            contracapa_bytes = cover_generator.generate_contracapa_png()
            contracapa_img = epub.EpubItem(
                uid="contracapa",
                file_name="contracapa.png",
                media_type="image/png",
                content=contracapa_bytes,
            )
            book.add_item(contracapa_img)

            html_content = template_engine.render(
                "capitulo.html.template",
                TITULO="",
                CONTEUDO='<div style="text-align:center;"><img src="contracapa.png" alt="Contracapa" style="width:100%; max-width:800px; height:auto;"/></div>',
            )
            contracapa_page = epub.EpubHtml(
                title="Contracapa",
                file_name="contracapa.xhtml",
                lang=config.lingua,
            )
            contracapa_page.content = html_content
            book.add_item(contracapa_page)
            chapters.append(contracapa_page)
            logger.info("  ✓ Contracapa adicionada")
        except Exception as e:
            logger.warning(f"  ⚠ Erro ao gerar contracapa: {e}")

    # Configurar TOC e spine
    book.toc = toc
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())
    book.spine = ["nav"] + chapters

    # Escrever arquivo
    output_path = base_dir / config.output_file
    output_path.parent.mkdir(parents=True, exist_ok=True)

    epub.write_epub(str(output_path), book)

    logger.info(f"\n{'='*50}")
    logger.info(f"✓ EPUB gerado: {output_path}")
    logger.info(f"  📊 {len(chapters)} capítulos")
    logger.info(f"{'='*50}\n")

    return True


def find_all_configs(base_dir: Path) -> List[Path]:
    """
    Encontra todos os arquivos de configuração de livros.

    Args:
        base_dir: Diretório base para busca.

    Returns:
        Lista de caminhos para arquivos de configuração.
    """
    configs = []
    for pattern in ["config-livro*.yaml", "config-*.yaml"]:
        configs.extend(base_dir.glob(pattern))

    # Excluir config.yaml genérico se houver configs específicos
    specific_configs = [
        c
        for c in configs
        if "livro" in c.name or "ensaio" in c.name or "crio" in c.name
    ]
    if specific_configs:
        return sorted(set(specific_configs))

    return sorted(set(configs))


def main():
    """Ponto de entrada principal."""
    parser = argparse.ArgumentParser(
        description="Gera EPUB a partir de arquivo de configuração.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
    python3 scripts/build_epub.py config-livro-crio.yaml
    python3 scripts/build_epub.py config-livro-ensaio.yaml
    python3 scripts/build_epub.py --all
    python3 scripts/build_epub.py --list
        """,
    )

    parser.add_argument("config", nargs="?", help="Arquivo de configuração YAML")
    parser.add_argument(
        "--all", "-a", action="store_true", help="Gera todos os livros encontrados"
    )
    parser.add_argument(
        "--list",
        "-l",
        action="store_true",
        help="Lista os arquivos de configuração disponíveis",
    )

    args = parser.parse_args()

    base_dir = Path(__file__).parent.parent

    # Listar configs
    if args.list:
        configs = find_all_configs(base_dir)
        print("\n📚 Arquivos de configuração disponíveis:\n")
        for config in configs:
            print(f"   • {config.name}")
        print()
        return

    # Gerar todos
    if args.all:
        configs = find_all_configs(base_dir)
        if not configs:
            logger.error("❌ Nenhum arquivo de configuração encontrado.")
            sys.exit(1)

        logger.info(f"\n📚 Gerando {len(configs)} livro(s)...\n")

        success = 0
        for config_path in configs:
            if build_epub(config_path):
                success += 1

        logger.info(f"\n✨ Completo: {success}/{len(configs)} livros gerados.\n")
        sys.exit(0 if success == len(configs) else 1)

    # Config específico
    if args.config:
        config_path = base_dir / args.config
        if not config_path.exists():
            # Tentar como caminho absoluto
            config_path = Path(args.config)

        if not config_path.exists():
            logger.error(f"❌ Arquivo não encontrado: {args.config}")
            sys.exit(1)

        success = build_epub(config_path)
        sys.exit(0 if success else 1)

    # Sem argumentos - mostrar ajuda
    parser.print_help()
    print("\n📚 Configs disponíveis:")
    for config in find_all_configs(base_dir):
        print(f"   • {config.name}")
    print()


if __name__ == "__main__":
    main()
