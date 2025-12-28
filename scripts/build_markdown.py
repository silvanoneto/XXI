#!/usr/bin/env python3
"""
Concatena todo o livro em um único arquivo Markdown.

Uso:
    python3 scripts/build_markdown.py config-livro-ensaio.yaml
    python3 scripts/build_markdown.py config-livro-crio.yaml
    python3 scripts/build_markdown.py config-livro-ensaio.yaml -o custom_output.md

Requer: pip install pyyaml

Os arquivos são gerados em assets/ por padrão.
"""

import argparse
import logging
import sys
from pathlib import Path
from typing import Optional

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)
logger = logging.getLogger(__name__)


def build_markdown(config_path: Path, output_path: Optional[Path] = None) -> bool:
    """
    Concatena todos os arquivos markdown do livro em um único arquivo.

    Args:
        config_path: Caminho para o arquivo de configuração YAML.
        output_path: Caminho de saída (opcional). Se não fornecido, usa o nome do config.

    Returns:
        True se o build foi bem sucedido, False caso contrário.
    """
    try:
        # Importar módulos do projeto
        base_dir = config_path.parent
        sys.path.insert(0, str(base_dir / "src"))

        from md_builder.config import Config
        from md_builder.builder import MarkdownBuilder

        # Carregar configuração
        config = Config.from_yaml(config_path)

        # Determinar arquivo de saída
        if output_path is None:
            output_name = config_path.stem.replace("config-", "") + ".md"
            output_path = base_dir / "assets" / output_name

        # Gerar markdown
        builder = MarkdownBuilder(config)
        return builder.build(output_path)

    except FileNotFoundError as e:
        logger.error(f"❌ Arquivo não encontrado: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Erro inesperado: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Concatena todo o livro em um único arquivo Markdown."
    )
    parser.add_argument(
        "config",
        type=Path,
        nargs="?",
        help="Arquivo de configuração YAML do livro",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Arquivo de saída (opcional)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Gera markdown para todos os configs encontrados",
    )

    args = parser.parse_args()

    if args.all:
        # Encontrar todos os arquivos de configuração
        config_dir = Path(".")
        configs = list(config_dir.glob("config-livro-*.yaml"))

        if not configs:
            logger.error("❌ Nenhum arquivo de configuração encontrado")
            sys.exit(1)

        sucesso = True
        for config in configs:
            logger.info(f"\n{'='*50}")
            if not build_markdown(config):
                sucesso = False

        sys.exit(0 if sucesso else 1)
    elif args.config:
        if not args.config.exists():
            logger.error(f"❌ Arquivo não encontrado: {args.config}")
            sys.exit(1)

        sucesso = build_markdown(args.config, args.output)
        sys.exit(0 if sucesso else 1)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
