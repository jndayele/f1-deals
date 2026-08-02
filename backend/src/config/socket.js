let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map(o => o.trim()).filter(Boolean);

    io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true
      },
      // Connection stability settings for Render / reverse proxies
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
      console.log('Client connected to socket:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected from socket:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
