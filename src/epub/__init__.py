"""
Módulo para geração de EPUB do Paêbirú XXI.

Estrutura SOLID:
- Config: carrega e valida configurações
- TemplateEngine: renderiza templates SVG/HTML
- CoverGenerator: gera capa (SVG → PNG)
- ContentProcessor: processa markdown → capítulos
- EpubBuilder: orquestra a geração do EPUB
"""

from .config import Config
from .templates import TemplateEngine
from .cover import CoverGenerator
from .content import ContentProcessor
from .builder import EpubBuilder

__all__ = [
    "Config",
    "TemplateEngine",
    "CoverGenerator",
    "ContentProcessor",
    "EpubBuilder",
]
