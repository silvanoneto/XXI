"""Builder para geração de PDF."""

import logging

from .config import Config
from .converter import MarkdownConverter

logger = logging.getLogger(__name__)


class PdfBuilder:
    """Orquestra a geração do PDF."""

    def __init__(self, config: Config):
        """
        Inicializa o builder.

        Args:
            config: Configurações do livro.
        """
        self.config = config
        self.converter = MarkdownConverter()

    def build(self) -> bool:
        """
        Gera o arquivo PDF.

        Returns:
            True se sucesso, False se erro.
        """
        try:
            markdown_path = self.config.get_markdown_path()
            output_path = self.config.get_pdf_path()

            # Validar se markdown existe
            if not markdown_path.exists():
                logger.warning(f"⚠️  Markdown não encontrado: {markdown_path}")
                logger.info(
                    "   Gere o markdown primeiro com: python3 scripts/build_markdown.py --all"
                )
                return False

            logger.info(f"📄 Convertendo: {self.config.titulo}")
            if self.config.subtitulo:
                logger.info(f"   {self.config.subtitulo}")

            # Converter markdown para PDF
            logger.info("   🔄 Convertendo markdown → PDF...")
            if not self.converter.markdown_to_pdf(markdown_path, output_path):
                return False

            # Estatísticas
            tamanho_mb = output_path.stat().st_size / (1024 * 1024)
            logger.info(f"✅ Gerado: {output_path}")
            logger.info(f"   📏 {tamanho_mb:.1f} MB")

            return True

        except Exception as e:
            logger.error(f"❌ Erro inesperado: {e}")
            return False
