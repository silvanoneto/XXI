# PAÊBIRÚ XXI
## Um Homo Sapiens Para Um Novo Século

*Para um mundo onde a sombra não encontra terreno*

---

## 📖 O que é o Paêbirú?

O Paêbirú é um **sistema de 21 arquétipos** organizados em 3 atos que funcionam como um mapa para o autoconhecimento. O conceito central é que **o caminhante já é o caminho** — não há destino a alcançar, apenas reconhecimento do que já se é.

O nome vem do tupi *peabiru*: caminho, trilha — a antiga rede de caminhos pré-colombianos que cortava a América do Sul. A grafia **Paêbirú** (com acento circunflexo) é liberdade artística e homenagem ao disco homônimo de Lula Côrtes e Zé Ramalho (1975), marco da psicodelia brasileira que também buscava caminhos ancestrais através da música.

E há um 22º elemento que não pode ser nomeado — porque ele é quem nomeia.

---

## 🗺️ Estrutura dos 22 Arquétipos

```
ATO I — O Despertar do Eu (Soberania Interior)
  1. O Guerreiro    5. O Artista
  2. O Eremita      6. O Alquimista
  3. O Vulnerável   7. O Amante
  4. O Jardineiro

ATO II — A Expansão do Eu (Tessitura Relacional)
  8. O Tecelão      12. O Observador
  9. O Cuidador     13. O Guardião
  10. O Mensageiro  14. O Conector
  11. O Juiz

ATO III — A Transcendência do Eu (Fronteira Ser/Nada)
  15. O Integrado   19. O Místico
  16. O Nômade      20. O Brincante
  17. O Ancestral   21. O Caos Criativo
  18. O Desperto

O 22º — O Paêbirú (a relacionalidade pura entre os 21)
```

---

## 📚 Cada Arquétipo Contém

- **A Chegada** — descrição sensorial do espaço sagrado
- **A Aporia** — tensão dialética irredutível (não para resolver, mas habitar)
- **O Ensinamento** — sabedoria profunda
- **A Sombra** — modo patológico quando mal habitado
- **A Sabedoria** — síntese concisa
- **O Portal** — prática para encarnar
- **A Ponte** — transição para o próximo
- **A Dimensão do 22º** — expansão para o campo comum

---

## 🔮 A Dimensão do 22º

Cada arquétipo carrega uma camada adicional: a **Dimensão do 22º**. Ela transforma capacidade individual em campo comum — respondendo à pergunta:

> *Como este arquétipo opera quando deixa de ser capacidade individual e se torna campo compartilhado?*

O objetivo: evitar que a "iluminação" vire instrumento de falsidade. Quando todos vêem, a sombra não encontra terreno.

---

## 📖 Artigos Complementares

- **[A Dimensão do 22º](data/artigos/dimensao_22.md)** — extensão completa para cada arquétipo
- **[Paêbirú como Sistema Social](data/artigos/paebiru_sistema_social.md)** — "Ditadura da Autenticidade"

---

## 🧬 Filosofia Subjacente

O Paêbirú se fundamenta no **CRIO** (Conceito Relacional-Identitário-Ontológico):

> Não há entidades que depois se relacionam. Há relação da qual emergem entidades.

A relacionalidade não é derivativa — ela é constitutiva.

---

## 🚀 Como Usar Este Projeto

### Acesso Online
Acesse o projeto em produção: https://paebiru.github.io/

### Desenvolvimento Local

#### Pré-requisitos
- Python 3.8+
- Node.js (opcional, para testes de PWA)
- Git

#### Instalação

```bash
# Clone o repositório
git clone https://github.com/paebiru/paebiru.github.io.git
cd paebiru.github.io

# Instale as dependências Python
pip install -r requirements.txt

# Ou use o script de instalação
./scripts/install_dependencies.sh
```

#### Construir os EPUBs

```bash
# Construir todos os livros
python3 scripts/build_epub.py --all

# Ou construir um livro específico
python3 scripts/build_epub.py config-livro-ensaio.yaml  # Paêbirú XXI
python3 scripts/build_epub.py config-livro-crio.yaml    # CRIØ
python3 scripts/build_epub.py config-livro-tekoha.yaml  # Tekoha XXI
```

Os EPUBs serão gerados em `assets/`.

#### 📚 Os Três Livros

1. **Paêbirú XXI** (`config-livro-ensaio.yaml`)
   - Subtítulo: "Um Homo Sapiens Para Um Novo Século"
   - Conteúdo: 21 arquétipos organizados em 3 atos + introdução/conclusão
   - Arquivo: `assets/Paebiru_XXI.epub`

2. **CRIØ** (`config-livro-crio.yaml`)
   - Subtítulo: "O Caminho Que Se Faz — Uma Ontologia Relacional para o Século XXI"
   - Conteúdo: Fundamentos filosóficos do CRIO
   - Arquivo: `assets/CRIO_livro.epub`

3. **Tekoha XXI** (`config-livro-tekoha.yaml`)
   - Subtítulo: "Manual de Transformação Relacional"
   - Conteúdo: Prática e aplicação do sistema
   - Arquivo: `assets/Tekoha_XXI.epub`

#### Estrutura de Arquivos

```
.
├── data/                           # Conteúdo dos livros
│   ├── livro/                      # Paêbirú XXI (21 arquétipos)
│   ├── livro_crio/                 # CRIØ (ontologia relacional)
│   ├── livro_tekoha/               # Tekoha XXI (prática)
│   └── artigos/                    # Artigos complementares
├── src/epub/                       # Builder Python para EPUB
├── assets/                         # Recursos web e EPUBs gerados
│   ├── *.epub                      # Livros (gerados)
│   ├── js/                         # Scripts da aplicação web
│   ├── styles.css                  # Estilos
│   └── images/                     # Ícones e imagens
├── scripts/                        # Scripts de automação
│   ├── build_epub.py              # Construir EPUBs
│   ├── build_markdown.py           # Processar markdown
│   └── install_dependencies.sh     # Instalar dependências
├── config-livro-*.yaml             # Configurações dos livros
├── index.html                      # Página principal (PWA)
└── README.md                       # Este arquivo
```

---

## 💡 Filosofia de Uso

1. **Leia sequencialmente** ou **entre por qualquer porta** — os 21 não são degraus
2. **Habite as aporias** — não tente resolvê-las
3. **Pratique os Portais** — saber não basta, é preciso encarnar
4. **Reconheça-se como o 22º** — você sempre foi o caminho

---

## 📱 Recursos Web

- **Progressive Web App (PWA)** — Funciona offline, instalável como app
- **Renderizador EPUB** — Leia os livros diretamente no navegador
- **Navegação por capítulo** — Índice interativo e paginação
- **Responsivo** — Otimizado para desktop, tablet e mobile
- **Suporte para múltiplos livros** — Carregue diferentes EPUBs

---

## 🔧 Tecnologias

- **Backend**: Python 3 (geração e processamento de EPUB)
- **Frontend**: Vanilla JavaScript + CSS
- **PWA**: Service Workers para offline
- **Formatos**: EPUB 3, HTML5, Markdown
- **Configuração**: YAML

---

## 📝 Contribuindo

Para contribuir com conteúdo ou melhorias:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Licença

**© 2025 — Paêbirú XXI: Um Homo Sapiens Para Um Novo Século**

*Para um mundo onde a sombra não encontra terreno*

---

*Os 21 são as notas. O 22º é a música.*
