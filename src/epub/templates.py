"""Motor de templates para SVG e HTML."""

from pathlib import Path
from typing import Dict


class TemplateEngine:
    """Renderiza templates com substituição de placeholders."""

    def __init__(self, templates_dir: Path):
        """
        Inicializa o motor de templates.

        Args:
            templates_dir: Diretório contendo os arquivos de template.
        """
        self.templates_dir = templates_dir
        self._cache: Dict[str, str] = {}

    def load(self, template_name: str) -> str:
        """
        Carrega um template do disco (com cache).

        Args:
            template_name: Nome do arquivo de template.

        Returns:
            Conteúdo do template.
        """
        if template_name not in self._cache:
            template_path = self.templates_dir / template_name
            with open(template_path, "r", encoding="utf-8") as f:
                self._cache[template_name] = f.read()
        return self._cache[template_name]

    def render(self, template_name: str, **kwargs: str) -> str:
        """
        Renderiza um template substituindo placeholders.

        Args:
            template_name: Nome do arquivo de template.
            **kwargs: Pares chave=valor para substituição.
                      Placeholders no formato {{CHAVE}} serão substituídos.

        Returns:
            Template renderizado.
        """
        content = self.load(template_name)
        for key, value in kwargs.items():
            placeholder = f"{{{{{key}}}}}"
            content = content.replace(placeholder, value)
        return content
