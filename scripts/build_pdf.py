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
import sys
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)
logger = logging.getLogger(__name__)


def build_pdf(config_path: Path) -> bool:
    """
    Gera PDF a partir do arquivo de configuração.

    Args:
        config_path: Caminho para o arquivo de configuração YAML.

    Returns:
        True se o build foi bem sucedido, False caso contrário.
    """
    try:
        # Importar módulos do projeto
        base_dir = config_path.parent
        sys.path.insert(0, str(base_dir / "src"))

        from pdf.config import Config
        from pdf.builder import PdfBuilder

        # Carregar configuração
        config = Config.from_yaml(config_path)

        # Gerar PDF
        builder = PdfBuilder(config)
        return builder.build()

    except FileNotFoundError as e:
        logger.error(f"❌ Arquivo não encontrado: {e}")
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
