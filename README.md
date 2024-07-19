# Projeto Flask Chat em Tempo Real

## Visão Geral

Este projeto é uma aplicação web de chat em tempo real construída com Flask e Flask-SocketIO. A aplicação permite que os usuários criem contas, façam login, criem salas de chat e enviem mensagens em tempo real.

## Funcionalidades

* **Criação de Conta:** Os usuários podem criar uma nova conta fornecendo um nome de usuário, senha, email e idade.
* **Login/Logout:** Os usuários podem fazer login e logout de suas contas.
* **Dashboard:** Após o login, os usuários são redirecionados para um dashboard onde podem ver todas as salas de chat disponíveis.
* **Criação de Salas de Chat:** Os usuários podem criar novas salas de chat.
* **Mensagens em Tempo Real:** Os usuários podem entrar em salas de chat e enviar mensagens em tempo real.
* **Histórico de Mensagens:** As mensagens enviadas em uma sala de chat são armazenadas e exibidas aos usuários quando entram na sala.

## Tecnologias Utilizadas

* **Flask:** Framework web em Python.
* **Flask-SocketIO:** Extensão do Flask para adicionar comunicação em tempo real via WebSockets.
* **SQLite:** Banco de dados para armazenar informações dos usuários, salas de chat e mensagens.

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/flask-chat.git
    cd flask-chat
    ```

2. Crie e ative um ambiente virtual:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # No Windows use: venv\Scripts\activate
    ```

3. Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```

4. Crie o banco de dados:
    ```bash
    python
    ```
    ```python
    import sqlite3

    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        email TEXT,
                        idade INTEGER)''')
    cursor.execute('''CREATE TABLE chats (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL)''')
    cursor.execute('''CREATE TABLE messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        chat_id INTEGER NOT NULL,
                        username TEXT NOT NULL,
                        message TEXT NOT NULL,
                        FOREIGN KEY (chat_id) REFERENCES chats(id))''')
    conn.commit()
    conn.close()
    exit()
    ```

5. Execute a aplicação:
    ```bash
    python app.py
    ```

6. Abra o navegador e acesse:
    ```
    http://127.0.0.1:5000/
    ```


## Rotas

* `/`: Página inicial
* `/criar_conta`: Página para criar uma nova conta
* `/criar_conta_redirect`: Redireciona para a página de criação de conta
* `/criar_conta_db`: Endpoint para salvar os dados de criação de conta no banco de dados
* `/login`: Endpoint para login do usuário
* `/dashboard`: Página de dashboard após login
* `/create_chat`: Endpoint para criação de uma nova sala de chat
* `/chat/<int:chat_id>`: Página de chat para uma sala específica
* `/logout`: Endpoint para logout do usuário

## Eventos Socket.IO

* `join`: O usuário entra em uma sala de chat
* `leave`: O usuário sai de uma sala de chat
* `message`: O usuário envia uma mensagem em uma sala de chat

