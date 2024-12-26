const socket = io();
let username = '';

const usernameContainer = document.getElementById('username-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username');
const startChatButton = document.getElementById('start-chat');
const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Switch to chat screen after entering username
startChatButton.addEventListener('click', () => {
    username = usernameInput.value.trim(); // trim removes whitespace from both ends
    if (username) {
        usernameContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
    }
});

// Display chat history
socket.on('chat-history', (history) => {
    history.forEach(({ username: sender, message }) => {
        addMessage(sender, message, sender === username); // sender === username is a boolean which checks if the sender is the same as the username
    });
});

// Send message on button click
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();  
    if (message) {
        socket.emit('user-msg', { username, message });
        messageInput.value = ''; // Clear input
    }
});

// Receive messages from the server
socket.on('user-msg', ({ username: sender, message }) => {
    addMessage(sender, message, sender === username);
});

// addMessage function to display messages
function addMessage(sender, message, isSelf) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', isSelf ? 'right' : 'left');
    msgDiv.innerHTML = `<strong>${sender}</strong>: ${message}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
}
