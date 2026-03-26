# CDX - Campeonato Legend Online

Site estático para exibir lutas, placares e links do YouTube de todas as edições do Campeonato Legend Online (CDX).

## Funcionalidades

- **Múltiplas edições** — Seletor no topo para alternar entre 1ª, 2ª e 4ª Edição
- **Lutas realizadas** — Lista com placares coloridos (verde = vitória, vermelho = derrota)
- **Lutas pendentes** — Lista de confrontos ainda não realizados
- **Classificação** — Tabelas de classificação por grupo e fase final
- **Links YouTube** — Cada luta pode ter um link para assistir a gravação da live
- **Link Challonge** — Edições com URL do Challonge exibem botão para ver a chave completa
- **100% estático** — Não precisa de servidor backend, basta abrir o `index.html`

## Estrutura de Arquivos

```
index.html          # Página principal (estrutura HTML)
scripts.js          # Lógica JS que lê data.json e renderiza tudo
styles.css          # Estilos visuais do site
data.json           # DADOS: todas as edições, lutas, placares e links YouTube
poster.png          # Imagem de fundo do hero
logotipo.png        # Logo no footer
```

## Como usar

### Abrir o site

Basta servir os arquivos via qualquer servidor HTTP. Exemplos:

```sh
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .

# Ou simplesmente abra index.html pelo seu editor/IDE com Live Server
```

### Atualizar dados (lutas, placares, links YouTube)

Edite o arquivo **`data.json`**. Ele contém instruções no topo (`_doc` e `_instrucoes`).

#### Adicionar placar a uma luta

Encontre a luta no array `matches` da edição/fase correspondente e preencha:

```json
{
  "player1": "Kauan",
  "player2": "Anderson",
  "score1": "4",
  "score2": "3",
  "state": "complete",
  "winner": "Kauan",
  "youtube_url": "https://www.youtube.com/watch?v=XXXXX"
}
```

**Campos importantes:**
- `score1` / `score2` — Placar de cada jogador (string)
- `state` — `"open"` = pendente, `"complete"` = finalizada
- `winner` — Nome exato do vencedor (deve bater com player1 ou player2)
- `youtube_url` — Link do YouTube da luta (vazio = sem botão)
- `note` — Texto opcional (ex: `"W.O"`, `"MD9"`, `"Suspensa"`)

#### Adicionar nova edição

Adicione um novo objeto no array `editions` do `data.json`:

```json
{
  "id": "ed5",
  "name": "5ª Edição - Nome",
  "description": "Descrição do campeonato",
  "challonge_url": "https://challonge.com/...",
  "phases": [
    {
      "name": "Nome da Fase",
      "type": "round_robin",
      "matches": [ ... ]
    }
  ]
}
```

### Estrutura do data.json

```
data.json
├── _doc                    # Descrição do arquivo
├── _instrucoes             # Como editar
└── editions[]              # Array de edições
    ├── id                  # ID único (ex: "ed1", "ed4")
    ├── name                # Nome exibido no seletor
    ├── description         # Subtítulo no hero
    ├── challonge_url       # URL do Challonge (opcional)
    └── phases[]            # Fases do campeonato
        ├── name            # Nome da fase
        ├── type            # "groups", "final", "round_robin"
        ├── matches[]       # Array de lutas
        ├── groups[]        # Grupos com standings (opcional)
        ├── standings[]     # Classificação final (opcional)
        └── final_match     # Luta da grande final (opcional)
```

## API Challonge (referência)

A 4ª Edição foi criada no Challonge: https://challonge.com/pt_BR/4y7eas8p

Os dados foram importados via API e salvos no `data.json`. Para atualizar dados futuramente via API:

```sh
# Listar participantes
curl "https://api.challonge.com/v1/tournaments/4y7eas8p/participants.json?api_key=SUA_API_KEY"

# Listar partidas
curl "https://api.challonge.com/v1/tournaments/4y7eas8p/matches.json?api_key=SUA_API_KEY"
```

> **Nota:** A API key não está no código. Use variável de ambiente ou passe manualmente.

## Repositório

[https://github.com/rogeriobbvn/lorpt](https://github.com/rogeriobbvn/lorpt)

---

Projeto criado com apoio do Cascade AI.
