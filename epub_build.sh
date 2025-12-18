#!/usr/bin/env python3
"""
Gera ebook EPUB do Paêbirú XXI
Requer: pip install ebooklib markdown cairosvg pyyaml
"""

import logging
import sys
from pathlib import Path

# Adicionar src ao path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from epub import Config, EpubBuilder

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)


def main():
    """Ponto de entrada principal."""
    base_dir = Path(__file__).parent
    config = Config.from_yaml(base_dir / "config.yaml")

    builder = EpubBuilder(config)
    builder.build()


if __name__ == "__main__":
    main()
