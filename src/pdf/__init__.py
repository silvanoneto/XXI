"""
Módulo para geração de PDF do Paêbirú XXI.

Estrutura SOLID:
- Config: carrega e valida configurações
- MarkdownConverter: converte markdown → HTML → PDF
- PdfBuilder: orquestra a geração do PDF
"""

from .config import Config
from .converter import MarkdownConverter
from .builder import PdfBuilder

__all__ = [
    "Config",
    "MarkdownConverter",
    "PdfBuilder",
]
