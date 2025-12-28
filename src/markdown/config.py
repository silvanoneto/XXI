"""Configuração para geração de Markdown."""

import logging
from pathlib import Path
from typing import List, Dict, Any

import yaml

logger = logging.getLogger(__name__)


class Config:
    """Carrega e valida configuração YAML para markdown."""

    def __init__(
        self,
        titulo: str,
        subtitulo: str,
        estrutura_livro: List[Dict[str, Any]],
        base_dir: Path,
    ):
        """
        Inicializa a configuração.

        Args:
            titulo: Título do livro.
            subtitulo: Subtítulo do livro.
            estrutura_livro: Lista de dicts com 'pasta' e 'arquivos'.
            base_dir: Diretório base do projeto.
        """
        self.titulo = titulo
        self.subtitulo = subtitulo
        self.estrutura_livro = estrutura_livro
        self.base_dir = Path(base_dir)

    @classmethod
    def from_yaml(cls, config_path: Path) -> "Config":
        """
        Carrega configuração de um arquivo YAML.

        Args:
            config_path: Caminho do arquivo YAML.

        Returns:
            Instância de Config.

        Raises:
            FileNotFoundError: Se o arquivo não existir.
            yaml.YAMLError: Se o YAML for inválido.
        """
        if not config_path.exists():
            raise FileNotFoundError(f"Arquivo não encontrado: {config_path}")

        with open(config_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

        return cls(
            titulo=data.get("titulo", ""),
            subtitulo=data.get("subtitulo", ""),
            estrutura_livro=data.get("estrutura_livro", []),
            base_dir=config_path.parent,
        )
