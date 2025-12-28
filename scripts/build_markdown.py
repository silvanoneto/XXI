#!/usr/bin/env python3
"""
Concatena todo o livro em um único arquivo Markdown.

Uso:
    python3 scripts/build_markdown.py config-livro-ensaio.yaml
    python3 scripts/build_markdown.py config-livro-crio.yaml
    python3 scripts/build_markdown.py config-livro-ensaio.yaml -o output/livro_completo.md

Requer: pip install pyyaml
"""

import argparse
import logging
import re
import sys
from pathlib import Path
from typing import Optional

import yaml

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)
logger = logging.getLogger(__name__)


# Regex para remover imagens markdown: ![alt](url) ou ![alt][ref]
IMAGE_PATTERN = re.compile(r"!\[([^\]]*)\]\([^)]+\)|!\[([^\]]*)\]\[[^\]]*\]")


def load_config(config_path: Path) -> dict:
    """Carrega o arquivo de configuração YAML."""
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def remove_images(content: str) -> str:
    """Remove referências de imagens do conteúdo markdown."""
    # Remove imagens e linhas vazias resultantes
    content = IMAGE_PATTERN.sub("", content)
    # Remove linhas que ficaram apenas com espaços em branco
    content = re.sub(r"\n\s*\n\s*\n", "\n\n", content)
    return content


def build_markdown(config_path: Path, output_path: Optional[Path] = None) -> bool:
    """
    Concatena todos os arquivos markdown do livro em um único arquivo.

    Args:
        config_path: Caminho para o arquivo de configuração YAML.
        output_path: Caminho de saída (opcional). Se não fornecido, usa o nome do config.

    Returns:
        True se o build foi bem sucedido, False caso contrário.
    """
    try:
        # Carregar configuração
        config = load_config(config_path)
        base_dir = config_path.parent

        titulo = config.get("titulo", "Livro")
        subtitulo = config.get("subtitulo", "")
        estrutura = config.get("estrutura_livro", [])

        # Determinar arquivo de saída
        if output_path is None:
            output_name = config_path.stem.replace("config-", "") + ".md"
            output_path = base_dir / "output" / output_name

        # Criar diretório de saída se não existir
        output_path.parent.mkdir(parents=True, exist_ok=True)

        logger.info(f"📚 Gerando: {titulo}")
        if subtitulo:
            logger.info(f"   {subtitulo}")
        logger.info("")

        # Concatenar conteúdo
        conteudo_total = []
        arquivos_processados = 0

        for item in estrutura:
            pasta = base_dir / item["pasta"]
            arquivos = item.get("arquivos", [])

            for arquivo in arquivos:
                caminho_arquivo = pasta / arquivo

                if not caminho_arquivo.exists():
                    logger.warning(f"⚠️  Arquivo não encontrado: {caminho_arquivo}")
                    continue

                with open(caminho_arquivo, "r", encoding="utf-8") as f:
                    conteudo = f.read().strip()

                # Remover imagens
                conteudo = remove_images(conteudo)

                if conteudo:
                    conteudo_total.append(conteudo)
                    conteudo_total.append("\n\n")  # Separador entre arquivos
                    arquivos_processados += 1

        # Remover último separador extra
        if conteudo_total and conteudo_total[-1] == "\n\n":
            conteudo_total.pop()

        # Escrever arquivo final
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("".join(conteudo_total))

        # Estatísticas
        tamanho_kb = output_path.stat().st_size / 1024
        logger.info(f"✅ Gerado: {output_path}")
        logger.info(f"   📄 {arquivos_processados} arquivos processados")
        logger.info(f"   📏 {tamanho_kb:.1f} KB")

        return True

    except FileNotFoundError as e:
        logger.error(f"❌ Arquivo não encontrado: {e}")
        return False
    except yaml.YAMLError as e:
        logger.error(f"❌ Erro ao parsear YAML: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Erro inesperado: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Concatena todo o livro em um único arquivo Markdown."
    )
    parser.add_argument(
        "config",
        type=Path,
        help="Arquivo de configuração YAML do livro",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Arquivo de saída (opcional)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Gera markdown para todos os configs encontrados",
    )

    args = parser.parse_args()

    if args.all:
        # Encontrar todos os arquivos de configuração
        config_dir = Path(".")
        configs = list(config_dir.glob("config-livro-*.yaml"))

        if not configs:
            logger.error("❌ Nenhum arquivo de configuração encontrado")
            sys.exit(1)

        sucesso = True
        for config in configs:
            logger.info(f"\n{'='*50}")
            if not build_markdown(config):
                sucesso = False

        sys.exit(0 if sucesso else 1)
    else:
        if not args.config.exists():
            logger.error(f"❌ Arquivo não encontrado: {args.config}")
            sys.exit(1)

        sucesso = build_markdown(args.config, args.output)
        sys.exit(0 if sucesso else 1)


if __name__ == "__main__":
    main()
