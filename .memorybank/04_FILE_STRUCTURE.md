# Estrutura de Arquivos do Projeto

## Diretório Raiz

```
/Users/silvis/Desktop/22/
├── .memorybank/           # Documentação para LLMs (este diretório)
├── artigos/               # Artigos e ensaios complementares
│   └── dimensao_22.md     # Extensão: A Dimensão do 22º
├── paebiru_sistema_social.md  # Ensaio: Ditadura da Autenticidade (291 linhas)
└── livro/                 # Conteúdo principal do livro
```

## Estrutura do Livro

```
livro/
├── 00_Cabecalho/
│   └── 00_Cabecalho.md           # Título e subtítulo
│
├── 01_Introducao/
│   ├── 00_introducao.md          # Marcador de seção
│   ├── 01_Invocacao.md           # Abertura ritual
│   └── 02_Prologo.md             # "As Vinte e Uma Faces do Caminhar"
│
├── 02_Ato_I_O_Despertar_do_Eu/   # Passos 1-7
│   ├── 00_ato_1.md               # Título do ato
│   ├── 01_Interludio.md          # Transição
│   ├── 02_Passo_1_O_Guerreiro.md
│   ├── 03_Passo_2_O_Eremita.md
│   ├── 04_Passo_3_O_Vulneravel.md
│   ├── 05_Passo_4_O_Jardineiro.md
│   ├── 06_Passo_5_O_Artista.md
│   ├── 07_Passo_6_O_Alquimista.md
│   └── 08_Passo_7_O_Amante.md
│
├── 03_Ato_II_A_Expansao_do_Eu/   # Passos 8-14
│   ├── 00_ato_2.md
│   ├── 01_Interludio.md
│   ├── 02_Passo_8_O_Tecelao.md
│   ├── 03_Passo_9_O_Cuidador.md
│   ├── 04_Passo_10_O_Mensageiro.md
│   ├── 05_Passo_11_O_Juiz.md
│   ├── 06_Passo_12_O_Observador.md
│   ├── 07_Passo_13_O_Guardiao.md
│   └── 08_Passo_14_O_Conector.md
│
├── 04_Ato_III_A_Transcendencia_do_Eu/  # Passos 15-21
│   ├── 00_ato_3.md
│   ├── 01_Interludio.md
│   ├── 02_Passo_15_O_Integrado.md
│   ├── 03_Passo_16_O_Nomade.md
│   ├── 04_Passo_17_O_Ancestral.md
│   ├── 05_Passo_18_O_Desperto.md
│   ├── 06_Passo_19_O_Mistico.md
│   ├── 07_Passo_20_O_Brincante.md
│   └── 08_Passo_21_O_Caos_Criativo.md
│
├── 05_Conclusao/
│   ├── 00_conclusao.md
│   ├── 01_Epilogo.md
│   ├── 02_O_22_O_Paebiru_Revelado.md  # Revelação do 22º
│   ├── 03_O_Circulo_Manifesto_Final.md
│   ├── 04_Coda.md                     # Encerramento ritual
│   └── 99_Rodape.md                   # Informações finais (dentro da Conclusão)
```

## Convenções de Nomenclatura

### Pastas
- `NN_Nome_Secao/` — Número de dois dígitos + nome descritivo
- Acentos removidos dos nomes de pasta
- Underscore (_) como separador

### Arquivos
- `NN_nome_arquivo.md` — Número de ordem + nome
- Arquétipos: `0N_Passo_N_O_Nome.md`
- Marcadores de seção: `00_nome.md`

## Ordem de Leitura Linear

1. `00_Cabecalho/00_Cabecalho.md`
2. `01_Introducao/01_Invocacao.md`
3. `01_Introducao/02_Prologo.md`
4. `02_Ato_I.../00_ato_1.md`
5. `02_Ato_I.../01_Interludio.md`
6. `02_Ato_I.../02_Passo_1_O_Guerreiro.md` até `08_Passo_7_O_Amante.md`
7. (Repetir padrão para Atos II e III)
8. `05_Conclusao/01_Epilogo.md` até `04_Coda.md`
9. `05_Conclusao/99_Rodape.md`

## Documentos Auxiliares

### artigos/dimensao_22.md
- **Localização**: artigos/
- **Conteúdo**: Extensão de cada arquétipo com "Dimensão do 22º"
- **Uso**: Material já integrado ao final de cada capítulo de arquétipo
- **Estrutura**: Segue ordem dos 21 arquétipos
- **Status**: Integrado aos capítulos (Janeiro 2025)

### paebiru_sistema_social.md
- **Localização**: Raiz do projeto
- **Conteúdo**: Ensaio teórico "Ditadura da Autenticidade"
- **Seções**:
  - Parte I: Anatomia do Picareta
  - Parte II: Cibernética da Autenticidade
  - Parte III: O Paêbirú como Protocolo Social
  - Parte IV: A Estrutura Anti-Sombra
  - Parte V: Objeções e Respostas

## Tarefas Pendentes de Integração

- [x] Integrar conteúdo de `artigos/dimensao_22.md` nos capítulos correspondentes ✔️
- [ ] Verificar consistência entre arquétipos individuais e versão coletiva
- [ ] Revisar transições (Pontes) entre arquétipos
- [ ] Padronizar formatação dos Portais (práticas)
