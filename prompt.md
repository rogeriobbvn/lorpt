Objetivo do Projeto
Criar um site em Python (com Django ou Flask) para organizar campeonatos de Legend Online, onde:

Jogadores se cadastram e criam perfil

Podem se inscrever em campeonatos ativos

Os organizadores podem criar campeonatos e definir regras

O sistema registra resultados e mantém um ranking por vitórias/derrotas

Há um painel de administração para controle geral

✅ Funcionalidades Principais
Jogador:
Cadastro/Login (e-mail, nickname, senha)

Edição de perfil (guilda, servidor, imagem)

Inscrição em campeonatos

Visualização de campeonatos abertos, em andamento e encerrados

Histórico de partidas e ranking pessoal

Campeonato:
Criado por administradores

Definições:

Nome, descrição, servidor

Tipo (1x1, 2x2, 5x5 etc.)

Data de início e fim

Limite de participantes

Inscrições automáticas ou por convite

Árvores de disputa (chaveamento) automáticas

Registro de resultado manual ou por API/bot externo (caso futuro)

Ranking por pontos: vitórias, derrotas, W.O., etc.

Admin:
Painel com gerenciamento de usuários

Criação e edição de campeonatos

Aprovação ou rejeição de inscrições

Registro e edição de resultados

Sistema de mensagens/avisos para participantes

💽 Banco de Dados (MySQL ou SQLite)
Tabelas principais:

users (id, nome, email, senha, guilda, servidor)

tournaments (id, nome, tipo, status, criador_id, limite, data_inicio)

participants (id, user_id, tournament_id, status)

matches (id, tournament_id, player1_id, player2_id, vencedor_id, data, fase)

rankings (user_id, vitorias, derrotas, torneios_jogados)

🛠️ Tecnologia Sugerida
Backend: Python + Flask ou Django

Frontend: HTML + CSS + JS (com Bootstrap ou Tailwind)

Banco de dados: SQLite (simples) ou MySQL (produção)

Painel Admin: Django Admin (se usar Django) ou painel próprio com Flask Admin

Login Seguro: Flask-Login ou Django Auth

Hospedagem: Replit (teste), Render, Railway ou VPS (produção)

🌐 Extras inspirados em sites como Toornament, Challonge e Battlefy
Painel de visualização de chaves (estilo torneio com fases)

Notificações por e-mail sobre partidas

API futura para integração com bots do Discord

Logs de atividade (alterações de admin, partidas registradas)

Suporte a torneios com grupos e mata-mata

Ranking geral com filtro por guilda ou servidor