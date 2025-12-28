"""Configuração para geração de PDF."""

import logging
from pathlib import Path

import yaml

logger = logging.getLogger(__name__)


class Config:
    """Carrega e valida configuração YAML para PDF."""

    def __init__(
        self,
        titulo: str,
        subtitulo: str,
        config_name: str,
        base_dir: Path,
    ):
        """
        Inicializa a configuração.

        Args:
            titulo: Título do livro.
            subtitulo: Subtítulo do livro.
            config_name: Nome do arquivo de configuração (sem extensão).
            base_dir: Diretório base do projeto.
        """
        self.titulo = titulo
        self.subtitulo = subtitulo
        self.config_name = config_name
        self.base_dir = Path(base_dir)

        # Mapear config files para markdown filenames
        self.markdown_map = {
            "config-livro-ensaio": "Paebiru_XXI.md",
            "config-livro-crio": "CRIO_livro.md",
            "config-livro-tekoha": "Tekoha_XXI.md",
        }

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
            config_name=config_path.stem,
            base_dir=config_path.parent,
        )

    def get_markdown_path(self) -> Path:
        """
        Retorna o caminho esperado do arquivo markdown.

        Returns:
            Path para o arquivo markdown.
        """
        markdown_name = self.markdown_map.get(
            self.config_name,
            self.config_name.replace("config-", "") + ".md",
        )
        return self.base_dir / "assets" / markdown_name

    def get_pdf_path(self) -> Path:
        """
        Retorna o caminho esperado do arquivo PDF.

        Returns:
            Path para o arquivo PDF.
        """
        markdown_path = self.get_markdown_path()
        pdf_name = markdown_path.name.replace(".md", ".pdf")
        return markdown_path.parent / pdf_name
