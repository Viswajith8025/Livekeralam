require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, 'https://eventkeralamm.vercel.app', 'http://localhost:5173'].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Pass io to app context
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a specific event room
  socket.on('join_room', (eventId) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined room: ${eventId}`);
  });

  // Handle real-time messages
  socket.on('send_message', (data) => {
    // data: { eventId, senderName, content, senderId }
    io.to(data.eventId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
