document.addEventListener('DOMContentLoaded', () => {
    var socket = io();
    var loggedInUsername = window.loggedInUsername;
    var chatId = window.chatId;

    socket.emit('join', { room: chatId });

    socket.on('message', function(msg) {

        var msg_username = msg.split(':')[0].trim();
        var isSystemMessage = msg.includes('entrou no chat') || msg.includes('saiu do chat');
        
        if (isSystemMessage) {
            var item = document.createElement('div');
            item.className = 'system-message text-center';
            item.textContent = msg;
            document.getElementById('messages').appendChild(item);
        } else {

            var item = document.createElement('div');
            item.className = 'message-container';

            var img = document.createElement('img');
            img.src = 'https://via.placeholder.com/50';
            img.className = 'message-img';

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
            messageContent.textContent = msgParts.slice(1).join(": "); 

            messageText.appendChild(messageContent);

            messageDiv.appendChild(usernameDiv);
            messageDiv.appendChild(messageText);
            messageDiv.appendChild(timestamp);

            if (msg_username === loggedInUsername) {
                item.classList.add('my-message');
                item.appendChild(messageDiv);
                item.appendChild(img);
            } else {
                item.classList.add('other-message');
                item.appendChild(img);
                item.appendChild(messageDiv);
            }

            document.getElementById('messages').appendChild(item);
        }
        
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    });

    document.getElementById('message').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault();
        }
    });
});

function sendMessage() {
    var message = document.getElementById('message').value;
    var socket = io();
    var chatId = window.chatId;
    var username = "{{ username }}";
    socket.emit('message', { room: chatId, message: message });
    document.getElementById('message').value = '';
}
