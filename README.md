# Avaliação prática - Django REST API + Frontend + Deploy

Este projeto foi criado como uma aplicação de cadastro e login de perfis, seguindo as exigências da atividade prática de desenvolvimento web.

## Objetivo

- Implementar um backend em Django com API REST;
- Criar um frontend simples para consumir a API;
- Usar autenticação por token em um fluxo básico;
- Disponibilizar o projeto em ambiente de produção no Render.

## Tecnologias

- Python 3.14
- Django 6
- Django REST Framework
- SQLite para desenvolvimento
- WhiteNoise para arquivos estáticos
- Render para deploy

## Como rodar localmente

1. Crie e ative um ambiente virtual
2. Instale as dependências:
   ```bash
   python -m pip install Django djangorestframework gunicorn whitenoise dj-database-url
   ```
3. Execute as migrações:
   ```bash
   python manage.py migrate
   ```
4. Inicie o servidor:
   ```bash
   python manage.py runserver
   ```
5. Acesse:
   ```text
   http://127.0.0.1:8000/
   ```

## Endpoints principais

- GET /api/perfis/
- POST /api/perfis/criar/
- GET /api/perfil/
- POST /api/login/
- POST /api/logout/

## Deploy no Render

1. Crie um novo Web Service no Render.
2. Conecte este repositório do GitHub.
3. Configure o ambiente:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn avaliacao_django.wsgi:application`
4. Defina variável de ambiente:
   - `DEBUG=False`
   - `SECRET_KEY=sua-chave-secreta`
5. Publique o serviço.

## Script para apresentação

> Olá, meu nome é [seu nome], e hoje vou apresentar o projeto de avaliação prática de Django. 
> Eu criei uma aplicação de cadastro e login de perfis, com uma API REST no backend e um frontend simples para consumir esses dados. 
> O objetivo era desenvolver uma rede social fictícia, com perfis, autenticação e listagem de usuários. 
> No backend, usei Django e Django REST Framework para criar endpoints de cadastro, login e consulta de perfis. 
> No frontend, implementei uma página com formulário de login, cadastro e exibição dos dados do usuário logado. 
> Também deixei a aplicação pronta para deploy no Render, seguindo o que foi pedido na atividade. 
> A parte mais desafiadora foi conectar a interface com a API e garantir que o fluxo de autenticação funcionasse corretamente. 
> Mesmo sendo um estudante iniciante, consegui estruturar o projeto, testar a aplicação e deixá-la funcional. 
> Obrigado pela atenção.

## Observação

A aplicação usa um banco SQLite em desenvolvimento e pode ser adaptada para PostgreSQL em produção no Render.
