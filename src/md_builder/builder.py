"""Builder para geração de Markdown consolidado."""

import logging
from pathlib import Path

from .config import Config
from .aggregator import ContentAggregator

logger = logging.getLogger(__name__)


class MarkdownBuilder:
    """Orquestra a geração do markdown consolidado."""

    def __init__(self, config: Config):
        """
        Inicializa o builder.

        Args:
            config: Configurações do livro.
        """
        self.config = config
        self.aggregator = ContentAggregator(config.base_dir)

    def build(self, output_path: Path) -> bool:
        """
        Gera o arquivo markdown consolidado.

        Args:
            output_path: Caminho do arquivo de saída.

        Returns:
            True se sucesso, False se erro.
        """
        try:
            logger.info(f"📚 Gerando: {self.config.titulo}")
            if self.config.subtitulo:
                logger.info(f"   {self.config.subtitulo}")
            logger.info("")

            # Concatenar conteúdo
            conteudo_total, arquivos_processados = self.aggregator.aggregate(
                self.config.estrutura_livro
            )

            # Criar diretório de saída se não existir
            output_path.parent.mkdir(parents=True, exist_ok=True)

            # Escrever arquivo final
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(conteudo_total)

            # Estatísticas
            tamanho_kb = output_path.stat().st_size / 1024
            logger.info(f"✅ Gerado: {output_path}")
            logger.info(f"   📄 {arquivos_processados} arquivos processados")
            logger.info(f"   📏 {tamanho_kb:.1f} KB")

            return True

        except Exception as e:
            logger.error(f"❌ Erro ao gerar markdown: {e}")
            return False
