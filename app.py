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
        session['username'] = username  # Armazena o nome de usuário na sessão
        return redirect(url_for('dashboard'))
    else:
        flash('Invalid username or password. Please try again.')
        return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        username = session['username']
        return render_template('dashboard.html', username=username)
    else:
        return redirect(url_for('index'))

@app.route('/chat')
def chat():
    if 'username' in session:
        return render_template('chat.html', username=session['username'])
    else:
        return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@socketio.on('message')
def handle_message(data):
    username = session.get('username')
    if username:
        message = f"{username}: {data.split(': ', 1)[-1]}"  # Evitar duplicação do nome de usuário
        send(message, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
