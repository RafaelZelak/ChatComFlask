document.addEventListener('DOMContentLoaded', () => {
    var socket = io();
    var loggedInUsername = window.loggedInUsername;
    var chatId = window.chatId;

    socket.emit('join', { room: chatId });

    socket.on('message', function(msg){
        console.log('Mensagem recebida:', msg);

        var msg_username = msg.split(':')[0].trim();
        
        console.log(msg_username + " -> " + loggedInUsername);

        var item = document.createElement('div');
        item.className = 'message-container';

        var img = document.createElement('img');
        img.src = 'https://via.placeholder.com/50'; // Imagem placeholder
        img.className = 'message-img'; // Adicionar classe para estilização CSS

        var messageDiv = document.createElement('div');
        messageDiv.className = 'message';

        var usernameDiv = document.createElement('div');
        usernameDiv.className = 'username';

        var messageText = document.createElement('div');
        messageText.className = 'message-text';

        var messageContent = document.createElement('span');
        var timestamp = document.createElement('span');
        var now = new Date();

        timestamp.className = 'timestamp';
        timestamp.textContent = now.toLocaleTimeString();

        var msgParts = msg.split(": ");
        usernameDiv.textContent = msgParts[0];
        messageContent.textContent = msgParts.slice(1).join(": "); // Remover o prefixo

        messageText.appendChild(messageContent);

        messageDiv.appendChild(usernameDiv);
        messageDiv.appendChild(messageText);
        messageDiv.appendChild(timestamp);

        if (msg_username === loggedInUsername) {
            item.classList.add('my-message');
            // Posicionar a imagem à direita e o conteúdo à esquerda
            item.appendChild(messageDiv);
            item.appendChild(img);
        } else {
            item.classList.add('other-message');
            // Posicionar a imagem à esquerda e o conteúdo à direita
            item.appendChild(img);
            item.appendChild(messageDiv);
        }

        document.getElementById('messages').appendChild(item);
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    });
});

function sendMessage() {
    var message = document.getElementById('message').value;
    var socket = io();
    var chatId = window.chatId;
    var username = "{{ username }}";
    console.log('Enviando mensagem:', username + ": " + message);
    socket.emit('message', { room: chatId, message: message });
    document.getElementById('message').value = '';
}
