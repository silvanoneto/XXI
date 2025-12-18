"""Configuração do EPUB via dataclass."""

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Tuple

import yaml


@dataclass
class Config:
    """Configurações do livro carregadas do YAML."""

    titulo: str
    subtitulo: str
    coautor: str
    lingua: str
    identificador: str
    epigrafe: str
    output_file: str
    estrutura_livro: List[Tuple[str, List[str]]] = field(default_factory=list)
    estrutura_artigos: List[Tuple[str, List[str]]] = field(default_factory=list)
    base_dir: Path = field(default_factory=Path)

    @classmethod
    def from_yaml(cls, yaml_path: Path) -> "Config":
        """Carrega configurações de um arquivo YAML."""
        with open(yaml_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

        base_dir = yaml_path.parent

        estrutura_livro = [
            (item["pasta"], item["arquivos"]) for item in data.get("estrutura_livro", [])
        ]
        estrutura_artigos = [
            (item["pasta"], item["arquivos"])
            for item in data.get("estrutura_artigos", [])
        ]

        return cls(
            titulo=data["titulo"],
            subtitulo=data["subtitulo"],
            coautor=data["coautor"],
            lingua=data["lingua"],
            identificador=data["identificador"],
            epigrafe=data["epigrafe"],
            output_file=data["output_file"],
            estrutura_livro=estrutura_livro,
            estrutura_artigos=estrutura_artigos,
            base_dir=base_dir,
        )

    @property
    def output_path(self) -> Path:
        """Caminho completo do arquivo de saída."""
        return self.base_dir / self.output_file

    @property
    def titulo_completo(self) -> str:
        """Título completo com subtítulo."""
        return f"{self.titulo}: {self.subtitulo}"
