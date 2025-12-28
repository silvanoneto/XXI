"""Conversor de Markdown → HTML → PDF."""

import logging
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class MarkdownConverter:
    """Converte markdown para PDF usando pandoc e weasyprint."""

    def __init__(self, pandoc_path: Optional[str] = None):
        """
        Inicializa o conversor.

        Args:
            pandoc_path: Caminho customizado para pandoc (opcional).
        """
        self.pandoc_path = pandoc_path or self._find_pandoc()

    @staticmethod
    def _find_pandoc() -> Optional[str]:
        """
        Tenta encontrar pandoc na PATH ou em localizações comuns.

        Returns:
            Caminho para pandoc, ou None se não encontrado.
        """
        try:
            result = subprocess.run(
                ["which", "pandoc"], capture_output=True, text=True, check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError:
            # Tentar localizações comuns
            common_paths = [
                "/opt/homebrew/bin/pandoc",
                "/usr/local/bin/pandoc",
                "/usr/bin/pandoc",
            ]
            for path in common_paths:
                if Path(path).exists():
                    return path
        return None

    @staticmethod
    def sanitize_markdown(content: str) -> str:
        """
        Sanitiza markdown para compatibilidade com PDF.

        Args:
            content: Conteúdo markdown.

        Returns:
            Conteúdo sanitizado.
        """
        # Manter emojis! Apenas limpar espaços em branco excessivos
        content = re.sub(r"\n\n\n+", "\n\n", content)
        return content

    def markdown_to_pdf(self, markdown_path: Path, output_path: Path) -> bool:
        """
        Converte markdown para PDF.

        Args:
            markdown_path: Caminho do arquivo markdown.
            output_path: Caminho do arquivo PDF de saída.

        Returns:
            True se sucesso, False se erro.
        """
        if not self.pandoc_path:
            logger.error("❌ Pandoc não encontrado. Instale com: brew install pandoc")
            return False

        try:
            # Ler e sanitizar markdown
            with open(markdown_path, "r", encoding="utf-8") as f:
                content = f.read()

            sanitized_content = self.sanitize_markdown(content)

            # Escrever em arquivo temporário markdown
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
                        self.pandoc_path,
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
                return self._html_to_pdf(Path(tmp_html_path), output_path)

            finally:
                # Limpar arquivos temporários
                Path(tmp_md_path).unlink()
                if Path(tmp_html_path).exists():
                    Path(tmp_html_path).unlink()

        except Exception as e:
            logger.error(f"❌ Erro ao converter markdown para PDF: {e}")
            return False

    @staticmethod
    def _html_to_pdf(html_path: Path, output_path: Path) -> bool:
        """
        Converte HTML para PDF usando weasyprint.

        Args:
            html_path: Caminho do arquivo HTML.
            output_path: Caminho do arquivo PDF de saída.

        Returns:
            True se sucesso, False se erro.
        """
        try:
            from weasyprint import HTML

            # Ler HTML e converter para PDF
            html_content = Path(html_path).read_text(encoding="utf-8")
            html_file = HTML(string=html_content)
            html_file.write_pdf(str(output_path))

            return True
        except ImportError:
            logger.error("❌ Weasyprint não instalado. Execute: pip install weasyprint")
            return False
        except Exception as e:
            logger.error(f"❌ Erro ao gerar PDF com weasyprint: {e}")
            return False
