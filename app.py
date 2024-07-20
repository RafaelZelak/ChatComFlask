from flask import Flask, render_template, redirect, url_for, request, session, flash, jsonify
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import sqlite3
import base64

app = Flask(__name__)
app.secret_key = 'r1r2r3r4r5'
socketio = SocketIO(app)

def validate_login(username, password):
    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
    user = cursor.fetchone()
    conn.close()
    return user

def get_chats():
    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM chats')
    chats = cursor.fetchall()
    conn.close()
    return chats

@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/criar_conta')
def criar_conta():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return render_template('criar_conta.html')

@app.route('/criar_conta_redirect', methods=['POST'])
def criar_conta_redirect():
    return redirect(url_for('criar_conta'))

@app.route('/criar_conta_db', methods=['POST'])
def criar_conta_db():
    username = request.form['username']
    password = request.form['password']
    email = request.form['email']
    idade = request.form['idade']

    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()

    cursor.execute('INSERT INTO users (username, password, email, idade) VALUES (?, ?, ?, ?)', 
                   (username, password, email, idade))
    conn.commit()
    conn.close()

    return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user = validate_login(username, password)
    
    if user:
        session['username'] = username 
        return redirect(url_for('dashboard'))
    else:
        flash('Invalid username or password. Please try again.')
        return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        username = session['username']
        
        conn = sqlite3.connect('login.db')
        cursor = conn.cursor()
        cursor.execute('SELECT username, image FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()

        # Converta a imagem para base64 se ela existir
        user_data = {
            'username': user[0],
            'image': base64.b64encode(user[1]).decode('utf-8') if user[1] else None
        }
        
        chats = get_chats()
        return render_template('dashboard.html', username=user[0], user=user_data, chats=chats)
    else:
        return redirect(url_for('index'))

@app.route('/create_chat', methods=['POST'])
def create_chat():
    chat_name = request.form['chat_name']
    
    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    
    cursor.execute('INSERT INTO chats (name) VALUES (?)', (chat_name,))
    
    conn.commit()
    conn.close()
    
    return redirect(url_for('dashboard'))

@app.route('/chat/<int:chat_id>')
def chat(chat_id):
    if 'username' in session:
        conn = sqlite3.connect('login.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT name FROM chats WHERE id = ?', (chat_id,))
        chat_name = cursor.fetchone()[0]
        
        cursor.execute('SELECT * FROM messages WHERE chat_id = ?', (chat_id,))
        messages = cursor.fetchall()
        
        conn.close()
        
        return render_template('chat.html', username=session['username'], chat_name=chat_name, messages=messages, chat_id=chat_id)
    else:
        return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/configuracoes', methods=['GET'])
def configuracoes():
    if 'username' not in session:
        return redirect(url_for('index'))
    
    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('SELECT username, image FROM users WHERE username = ?', (session['username'],))
    user = cursor.fetchone()
    conn.close()

    if user and user[1]:
        user_data = {
            'username': user[0],
            'image': base64.b64encode(user[1]).decode('utf-8')
        }
    else:
        user_data = {
            'username': user[0],
            'image': None
        }

    return render_template('configuracoes.html', user=user_data)

@app.route('/alterar_nome', methods=['POST'])
def alterar_nome():
    if 'username' not in session:
        return redirect(url_for('index'))

    new_username = request.form['username']
    
    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET username = ? WHERE username = ?', (new_username, session['username']))
    conn.commit()
    conn.close()
    
    session['username'] = new_username
    flash('Nome de usuário atualizado com sucesso!')
    return redirect(url_for('configuracoes'))

@app.route('/alterar_senha', methods=['POST'])
def alterar_senha():
    if 'username' not in session:
        return redirect(url_for('index'))

    new_password = request.form['password']
    
    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET password = ? WHERE username = ?', (new_password, session['username']))
    conn.commit()
    conn.close()
    
    flash('Senha atualizada com sucesso!')
    return redirect(url_for('configuracoes'))

@app.route('/alterar_imagem', methods=['POST'])
def alterar_imagem():
    if 'username' not in session:
        return redirect(url_for('index'))

    image_file = request.files['image']
    
    if image_file:
        image_data = image_file.read()
        conn = sqlite3.connect('login.db')
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET image = ? WHERE username = ?', (image_data, session['username']))
        conn.commit()
        conn.close()
        
    flash('Imagem de perfil atualizada com sucesso!')
    return redirect(url_for('configuracoes'))

@socketio.on('join')
def handle_join(data):
    username = session.get('username')
    room = data['room']
    join_room(room)
    message = f'{username} entrou na sala.'
    send({'username': 'System', 'message': message}, room=room)

@socketio.on('message')
def handle_message(data):
    username = session.get('username')
    room = data['room']
    message = data['message']

    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO messages (chat_id, username, message) VALUES (?, ?, ?)', (room, username, message))
    conn.commit()
    conn.close()

    emit('message', {'username': username, 'message': message}, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
