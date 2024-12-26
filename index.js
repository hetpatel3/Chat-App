const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let chatHistory = []; // Store chat messages

// Handle Socket.IO connections
io.on('connection', (socket) => { // here, socket is used to send and receive messages from the server.
    console.log('user connected');

    // Send chat history to the newly connected user
    socket.emit('chat-history', chatHistory);

    // Listen for user messages
    socket.on('user-msg', (data) => {
        chatHistory.push(data); // Save to chat history
        io.emit('user-msg', data); // Broadcast to all users
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

 // http server to serve the static files
app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

server.listen(9000, () => {
    console.log('Server is running on port 9000');
});

