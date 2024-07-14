document.addEventListener('DOMContentLoaded', () => {
    var socket = io();
    var username = "{{ username }}"; // Obtendo o nome de usuário da sessão Flask

    socket.on('message', function(msg){
        console.log('Mensagem recebida:', msg);

        var item = document.createElement('div');
        item.className = 'message-container';

        var img = document.createElement('img');
        img.src = 'https://via.placeholder.com/50'; // Imagem placeholder

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

        if (msg.startsWith(username + ": ")) {
            item.classList.add('my-message');
            usernameDiv.textContent = username;
            messageContent.textContent = msg.replace(username + ": ", ""); // Remover o prefixo
        } else {
            item.classList.add('other-message');
            var msgParts = msg.split(": ");
            usernameDiv.textContent = msgParts[0]; // Nome de usuário
            messageContent.textContent = msgParts.slice(1).join(": "); // Mensagem
        }

        messageText.appendChild(messageContent);

        messageDiv.appendChild(usernameDiv);
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
    console.log('Enviando mensagem:', username + ": " + message);
    socket.send(username + ": " + message);
    document.getElementById('message').value = '';
}
