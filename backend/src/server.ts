import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { config } from './config/app';
import { verifyToken } from './utils/jwt';
import { NotificationService } from './observers/NotificationObserver';

const server = http.createServer(app);

// WebSocket setup
const io = new SocketIOServer(server, {
  cors: {
    origin: config.frontendUrl,
    credentials: true,
  },
});

// WebSocket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = verifyToken(token);
    socket.data.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.data.user.userId}`);

  // Join user-specific room
  socket.join(socket.data.user.userId);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.data.user.userId}`);
  });
});

// Set WebSocket observer for notifications
const notificationService = NotificationService.getInstance();
notificationService.setWebSocketObserver(io);

// Start server
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Frontend URL: ${config.frontendUrl}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});