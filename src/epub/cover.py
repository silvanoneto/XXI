"""Gerador de capa do EPUB."""

import io
from typing import Tuple

import cairosvg

from .config import Config
from .templates import TemplateEngine


class CoverGenerator:
    """Gera a capa do livro em SVG e PNG."""

    TEMPLATE_NAME = "capa.svg.template"
    CONTRACAPA_TEMPLATE = "contracapa.svg.template"

    def __init__(self, config: Config, template_engine: TemplateEngine):
        """
        Inicializa o gerador de capa.

        Args:
            config: Configurações do livro.
            template_engine: Motor de templates.
        """
        self.config = config
        self.template_engine = template_engine

    def _split_titulo(self) -> Tuple[str, str]:
        """Divide o título em duas linhas."""
        partes = self.config.titulo.split()
        linha1 = partes[0].upper() if partes else ""
        linha2 = partes[1] if len(partes) > 1 else ""
        return linha1, linha2

    def generate_svg(self) -> str:
        """
        Gera o SVG da capa com os metadados.

        Returns:
            Conteúdo SVG como string.
        """
        linha1, linha2 = self._split_titulo()

        return self.template_engine.render(
            self.TEMPLATE_NAME,
            TITULO_LINHA1=linha1,
            TITULO_LINHA2=linha2,
            SUBTITULO=self.config.subtitulo,
            EPIGRAFE=self.config.epigrafe,
        )

    def generate_png(self, width: int = 800, height: int = 1120) -> bytes:
        """
        Gera o PNG da capa a partir do SVG.

        Args:
            width: Largura do PNG em pixels.
            height: Altura do PNG em pixels.

        Returns:
            Bytes do PNG.
        """
        svg_content = self.generate_svg()
        png_buffer = io.BytesIO()
        cairosvg.svg2png(
            bytestring=svg_content.encode("utf-8"),
            write_to=png_buffer,
            output_width=width,
            output_height=height,
        )
        return png_buffer.getvalue()

    def generate_contracapa_svg(self) -> str:
        """
        Gera o SVG da contracapa.

        Returns:
            Conteúdo SVG como string.
        """
        return self.template_engine.render(self.CONTRACAPA_TEMPLATE)

    def generate_contracapa_png(self, width: int = 800, height: int = 1120) -> bytes:
        """
        Gera o PNG da contracapa a partir do SVG.

        Args:
            width: Largura do PNG em pixels.
            height: Altura do PNG em pixels.

        Returns:
            Bytes do PNG.
        """
        svg_content = self.generate_contracapa_svg()
        png_buffer = io.BytesIO()
        cairosvg.svg2png(
            bytestring=svg_content.encode("utf-8"),
            write_to=png_buffer,
            output_width=width,
            output_height=height,
        )
        return png_buffer.getvalue()
