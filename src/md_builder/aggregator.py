"""Agregador de conteúdo markdown."""

import logging
import re
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)

# Regex para remover imagens markdown: ![alt](url) ou ![alt][ref]
IMAGE_PATTERN = re.compile(r"!\[([^\]]*)\]\([^)]+\)|!\[([^\]]*)\]\[[^\]]*\]")


class ContentAggregator:
    """Concatena arquivos markdown em um único arquivo."""

    def __init__(self, base_dir: Path):
        """
        Inicializa o agregador.

        Args:
            base_dir: Diretório base do projeto.
        """
        self.base_dir = Path(base_dir)

    @staticmethod
    def remove_images(content: str) -> str:
        """
        Remove referências de imagens do conteúdo markdown.

        Args:
            content: Conteúdo markdown.

        Returns:
            Conteúdo sem referências a imagens.
        """
        # Remove imagens e linhas vazias resultantes
        content = IMAGE_PATTERN.sub("", content)
        # Remove linhas que ficaram apenas com espaços em branco
        content = re.sub(r"\n\s*\n\s*\n", "\n\n", content)
        return content

    def aggregate(self, estrutura_livro: List[dict]) -> tuple[str, int]:
        """
        Concatena todos os arquivos markdown da estrutura.

        Args:
            estrutura_livro: Lista de dicts com 'pasta' e 'arquivos'.

        Returns:
            Tupla (conteúdo_total, quantidade_arquivos_processados).
        """
        conteudo_total = []
        arquivos_processados = 0

        for item in estrutura_livro:
            pasta = self.base_dir / item["pasta"]
            arquivos = item.get("arquivos", [])

            for arquivo in arquivos:
                caminho_arquivo = pasta / arquivo

                if not caminho_arquivo.exists():
                    logger.warning(f"⚠️  Arquivo não encontrado: {caminho_arquivo}")
                    continue

                with open(caminho_arquivo, "r", encoding="utf-8") as f:
                    conteudo = f.read().strip()

                # Remover imagens
                conteudo = self.remove_images(conteudo)

                if conteudo:
                    conteudo_total.append(conteudo)
                    conteudo_total.append("\n\n")  # Separador entre arquivos
                    arquivos_processados += 1

        # Remover último separador extra
        if conteudo_total and conteudo_total[-1] == "\n\n":
            conteudo_total.pop()

        return "".join(conteudo_total), arquivos_processados
