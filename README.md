# Legend Online Championship Organizer

Este projeto é um app web em Flask para organizar campeonatos do jogo Legend Online.

## Funcionalidades
- Cadastro e login de jogadores (e-mail, nickname, senha)
- Perfis editáveis (guilda, servidor, imagem)
- Inscrição em campeonatos ativos
- Visualização de campeonatos abertos, em andamento e encerrados
- Histórico de partidas e ranking pessoal
- Criação, edição e gerenciamento de campeonatos (admin)
- Árvores de disputa automáticas (futuro)
- Registro de partidas e ranking por vitórias/derrotas/W.O.
- Painel administrativo: gerenciamento de usuários, campeonatos, resultados e avisos

## Estrutura de Pastas
```
app.py                # Arquivo principal Flask
models.py             # Modelos do banco de dados
forms.py              # Formulários WTForms
requirements.txt      # Dependências do projeto
/templates/           # Templates HTML (Jinja2)
/static/              # Arquivos estáticos (CSS, imagens)
```

## Como rodar localmente

1. Instale as dependências:
   ```sh
   pip install -r requirements.txt
   ```
2. Execute o app:
   ```sh
   python app.py
   ```
3. Acesse em: [http://localhost:5000](http://localhost:5000)

## Repositório

Este projeto está em: [https://github.com/rogeriobbvn/lorpt](https://github.com/rogeriobbvn/lorpt)

---

Projeto criado com apoio do Cascade AI.
# lorpt
