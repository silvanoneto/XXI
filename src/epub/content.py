"""Processador de conteúdo Markdown."""

import re
import logging
from pathlib import Path
from dataclasses import dataclass
from typing import Optional, List

import markdown


logger = logging.getLogger(__name__)


@dataclass
class Chapter:
    """Representa um capítulo processado."""

    titulo: str
    conteudo_html: str
    nome_arquivo: str
    incluir_no_toc: bool = True


class ContentProcessor:
    """Processa arquivos Markdown e converte para HTML."""

    MARKDOWN_EXTENSIONS = ["extra", "smarty", "sane_lists"]

    def __init__(self, base_dir: Path):
        """
        Inicializa o processador de conteúdo.

        Args:
            base_dir: Diretório base do projeto.
        """
        self.base_dir = base_dir

    def read_markdown(self, path: Path) -> Optional[str]:
        """
        Lê arquivo markdown.

        Args:
            path: Caminho do arquivo.

        Returns:
            Conteúdo do arquivo ou None se não existir.
        """
        if not path.exists():
            logger.warning(f"  ⚠ Arquivo não encontrado: {path}")
            return None
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def md_to_html(self, content: str) -> str:
        """
        Converte Markdown para HTML.

        Args:
            content: Conteúdo Markdown.

        Returns:
            Conteúdo HTML.
        """
        return markdown.markdown(content, extensions=self.MARKDOWN_EXTENSIONS)

    def extract_title(self, content: str, filename: str) -> str:
        """
        Extrai título do conteúdo Markdown.

        Args:
            content: Conteúdo Markdown.
            filename: Nome do arquivo como fallback.

        Returns:
            Título extraído ou gerado.
        """
        match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        if match:
            titulo = match.group(1).strip()
        else:
            titulo = filename.replace(".md", "").replace("_", " ").title()

        # Remover numeração do início
        titulo = re.sub(r"^\d+\s+", "", titulo)
        # Remover "Passo N " do início
        titulo = re.sub(r"^Passo\s+\d+\s+", "", titulo)

        return titulo

    def process_file(self, path: Path) -> Optional[Chapter]:
        """
        Processa um arquivo Markdown completo.

        Args:
            path: Caminho do arquivo.

        Returns:
            Chapter processado ou None se arquivo não existir.
        """
        content = self.read_markdown(path)
        if content is None:
            return None

        titulo = self.extract_title(content, path.name)
        html = self.md_to_html(content)
        nome_arquivo = path.stem
        incluir_no_toc = "Rodape" not in path.name

        return Chapter(
            titulo=titulo,
            conteudo_html=html,
            nome_arquivo=nome_arquivo,
            incluir_no_toc=incluir_no_toc,
        )

    def process_section(
        self, pasta: str, arquivos: List[str]
    ) -> List[Chapter]:
        """
        Processa uma seção completa de arquivos.

        Args:
            pasta: Caminho relativo da pasta.
            arquivos: Lista de nomes de arquivos.

        Returns:
            Lista de capítulos processados.
        """
        chapters = []
        pasta_path = self.base_dir / pasta

        for arquivo in arquivos:
            chapter = self.process_file(pasta_path / arquivo)
            if chapter:
                chapters.append(chapter)
                logger.info(f"  ✓ {chapter.titulo}")

        return chapters
