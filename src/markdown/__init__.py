"""
Módulo para geração de Markdown consolidado do Paêbirú XXI.

Estrutura SOLID:
- Config: carrega e valida configurações
- ContentAggregator: concatena arquivos markdown
- MarkdownBuilder: orquestra a geração do markdown consolidado
"""

from .config import Config
from .aggregator import ContentAggregator
from .builder import MarkdownBuilder

__all__ = [
    "Config",
    "ContentAggregator",
    "MarkdownBuilder",
]
