#!/usr/bin/env python3
"""
Gera PDFs a partir dos arquivos markdown concatenados.

Uso:
    python3 scripts/build_pdf.py --all
    python3 scripts/build_pdf.py config-livro-ensaio.yaml

Requer: pip install pyyaml weasyprint

Weasyprint oferece melhor suporte para unicode e caracteres especiais.
"""

import argparse
import logging
import subprocess
import sys
from pathlib import Path

import yaml

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)
logger = logging.getLogger(__name__)

# Tentar encontrar pandoc na PATH
PANDOC_PATH = None
try:
    result = subprocess.run(
        ["which", "pandoc"], capture_output=True, text=True, check=True
    )
    PANDOC_PATH = result.stdout.strip()
except subprocess.CalledProcessError:
    # Tentar localizações comuns
    common_paths = [
        "/opt/homebrew/bin/pandoc",
        "/usr/local/bin/pandoc",
        "/usr/bin/pandoc",
    ]
    for path in common_paths:
        if Path(path).exists():
            PANDOC_PATH = path
            break


def load_config(config_path: Path) -> dict:
    """Carrega o arquivo de configuração YAML."""
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def sanitize_markdown_for_pdf(markdown_path: Path) -> str:
    """
    Lê o markdown e faz sanitização mínima para compatibilidade com PDF.

    Args:
        markdown_path: Caminho do arquivo markdown.

    Returns:
        Conteúdo markdown sanitizado.
    """
    import re

    with open(markdown_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Manter emojis! Apenas limpar espaços em branco excessivos
    content = re.sub(r"\n\n\n+", "\n\n", content)

    return content


def markdown_to_html(markdown_path: Path) -> str | None:
    """Converte markdown para HTML usando pandoc."""
    try:
        result = subprocess.run(
            ["pandoc", str(markdown_path), "-t", "html5"],
            capture_output=True,
            text=True,
            check=True,
        )
        return result.stdout
    except FileNotFoundError:
        logger.error("❌ Pandoc não encontrado. Instale com: brew install pandoc")
        return None
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Erro ao converter markdown: {e.stderr}")
        return None


def html_to_pdf_pandoc(html_content: str, output_path: Path) -> bool:
    """Converte HTML para PDF usando pandoc."""
    try:
        process = subprocess.Popen(
            ["pandoc", "-f", "html", "-t", "pdf", "-o", str(output_path)],
            stdin=subprocess.PIPE,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        stdout, stderr = process.communicate(input=html_content)

        if process.returncode != 0:
            logger.error(f"❌ Erro ao gerar PDF: {stderr}")
            return False
        return True
    except FileNotFoundError:
        logger.error("❌ Pandoc não encontrado. Instale com: brew install pandoc")
        return False


def markdown_to_pdf_pandoc(markdown_path: Path, output_path: Path) -> bool:
    """Converte Markdown para PDF usando pandoc + weasyprint."""
    try:
        if not PANDOC_PATH:
            logger.error("❌ Pandoc não encontrado. Instale com: brew install pandoc")
            return False

        # Sanitizar conteúdo markdown
        sanitized_content = sanitize_markdown_for_pdf(markdown_path)

        # Escrever em arquivo temporário markdown
        import tempfile

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".md", delete=False, encoding="utf-8"
        ) as tmp_md:
            tmp_md.write(sanitized_content)
            tmp_md_path = tmp_md.name

        try:
            # Converter markdown para HTML
            tmp_html_path = tmp_md_path.replace(".md", ".html")
            result = subprocess.run(
                [
                    PANDOC_PATH,
                    tmp_md_path,
                    "-f",
                    "markdown-yaml_metadata_block",
                    "-t",
                    "html5",
                    "-o",
                    tmp_html_path,
                ],
                capture_output=True,
                text=True,
                check=False,
            )

            if result.returncode != 0:
                logger.error(f"❌ Erro ao converter para HTML: {result.stderr}")
                return False

            # Converter HTML para PDF com weasyprint
            logger.info("   🔄 Convertendo HTML → PDF (weasyprint)...")
            try:
                from weasyprint import HTML

                # Ler HTML e converter para PDF
                html_file = HTML(string=Path(tmp_html_path).read_text(encoding="utf-8"))
                html_file.write_pdf(str(output_path))

                return True
            except ImportError:
                logger.error(
                    "❌ Weasyprint não instalado. Execute: pip install weasyprint"
                )
                return False
            except Exception as e:
                logger.error(f"❌ Erro ao gerar PDF com weasyprint: {e}")
                return False

        finally:
            # Limpar arquivos temporários
            Path(tmp_md_path).unlink()
            if Path(tmp_html_path).exists():
                Path(tmp_html_path).unlink()

    except Exception as e:
        logger.error(f"❌ Erro: {e}")
        return False


def build_pdf(config_path: Path) -> bool:
    """
    Gera PDF a partir do arquivo de configuração.

    Args:
        config_path: Caminho para o arquivo de configuração YAML.

    Returns:
        True se o build foi bem sucedido, False caso contrário.
    """
    try:
        # Carregar configuração
        config = load_config(config_path)
        base_dir = config_path.parent

        titulo = config.get("titulo", "Livro")
        subtitulo = config.get("subtitulo", "")

        # Mapear config files para markdown filenames
        config_name = config_path.stem
        markdown_map = {
            "config-livro-ensaio": "Paebiru_XXI.md",
            "config-livro-crio": "CRIO_livro.md",
            "config-livro-tekoha": "Tekoha_XXI.md",
        }

        markdown_name = markdown_map.get(
            config_name, config_name.replace("config-", "") + ".md"
        )
        markdown_path = base_dir / "assets" / markdown_name

        # Determinar arquivo PDF de saída
        pdf_name = markdown_name.replace(".md", ".pdf")
        output_path = base_dir / "assets" / pdf_name

        if not markdown_path.exists():
            logger.warning(f"⚠️  Markdown não encontrado: {markdown_path}")
            logger.info(
                "   Gere o markdown primeiro com: python3 scripts/build_markdown.py --all"
            )
            return False

        logger.info(f"📄 Convertendo: {titulo}")
        if subtitulo:
            logger.info(f"   {subtitulo}")

        # Converter markdown diretamente para PDF (evita problemas com YAML parsing)
        logger.info("   🔄 Convertendo markdown → PDF...")
        if not markdown_to_pdf_pandoc(markdown_path, output_path):
            return False

        # Estatísticas
        tamanho_mb = output_path.stat().st_size / (1024 * 1024)
        logger.info(f"✅ Gerado: {output_path}")
        logger.info(f"   📏 {tamanho_mb:.1f} MB")

        return True

    except FileNotFoundError as e:
        logger.error(f"❌ Arquivo não encontrado: {e}")
        return False
    except yaml.YAMLError as e:
        logger.error(f"❌ Erro ao parsear YAML: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Erro inesperado: {e}")
        return False


def build_all_pdfs(base_dir: Path) -> bool:
    """Constrói todos os PDFs a partir dos config files."""
    configs = [
        base_dir / "config-livro-ensaio.yaml",
        base_dir / "config-livro-crio.yaml",
        base_dir / "config-livro-tekoha.yaml",
    ]

    success_count = 0
    for config in configs:
        if config.exists():
            if build_pdf(config):
                success_count += 1
            logger.info("")  # Espaço entre builds

    logger.info(f"📊 Resumo: {success_count}/{len(configs)} PDFs gerados com sucesso")
    return success_count == len(configs)


def main():
    parser = argparse.ArgumentParser(
        description="Gera PDFs a partir dos arquivos markdown.",
    )
    parser.add_argument(
        "config",
        type=Path,
        nargs="?",
        help="Arquivo de configuração YAML do livro",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Gera todos os PDFs",
    )

    args = parser.parse_args()

    if args.all:
        base_dir = Path.cwd()
        success = build_all_pdfs(base_dir)
        sys.exit(0 if success else 1)
    elif args.config:
        success = build_pdf(args.config)
        sys.exit(0 if success else 1)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
