from flask import Flask, render_template, redirect, url_for, request, session, flash, jsonify
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import sqlite3

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
    return render_template('index.html')

@app.route('/criar_conta')
def criar_conta():
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
        chats = get_chats()
        return render_template('dashboard.html', username=username, chats=chats)
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

@socketio.on('join')
def handle_join(data):
    username = session.get('username')
    room = data['room']
    join_room(room)
    send(username + ' entrou no chat', room=room)

@socketio.on('leave')
def handle_leave(data):
    username = session.get('username')
    room = data['room']
    leave_room(room)
    send(username + ' entrou no chat', room=room)

@socketio.on('message')
def handle_message(data):
    username = session.get('username')
    room = data['room']
    message = f"{username}: {data['message']}"
    conn = sqlite3.connect('login.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO messages (chat_id, username, message) VALUES (?, ?, ?)', (data['room'], username, data['message']))
    conn.commit()
    conn.close()
    send(message, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
