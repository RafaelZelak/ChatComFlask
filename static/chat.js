document.addEventListener('DOMContentLoaded', () => {
    var socket = io();
    var username = "{{ username }}"; // Obtendo o nome de usuário da sessão Flask

    socket.on('message', function(msg){
        var item = document.createElement('div');
        item.className = 'message-container';

        var img = document.createElement('img');
        img.src = 'https://via.placeholder.com/50'; // Imagem placeholder

        var messageDiv = document.createElement('div');
        messageDiv.className = 'message';

        var messageText = document.createElement('div');
        
        // Diferenciar mensagens e remover o prefixo
        if (msg.startsWith(username + ": ")) {
            item.classList.add('my-message');
            messageText.textContent = msg.replace(username + ": ", ""); // Remover o prefixo
        } else {
            item.classList.add('other-message');
            messageText.textContent = msg;
        }

        var timestamp = document.createElement('div');
        var now = new Date();
        timestamp.className = 'timestamp';
        timestamp.textContent = now.toLocaleTimeString();

        messageDiv.appendChild(messageText);
        messageDiv.appendChild(timestamp);

        item.appendChild(img);
        item.appendChild(messageDiv);

        document.getElementById('messages').appendChild(item);
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    });
});

function sendMessage() {
    var message = document.getElementById('message').value;
    var socket = io();
    var username = "{{ username }}";
    socket.send(username + ": " + message);
    document.getElementById('message').value = '';
}