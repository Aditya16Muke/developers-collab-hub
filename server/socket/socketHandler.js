const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (io) => {

  // Authenticate every socket connection with the JWT
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token provided'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.user.name}`);

    socket.on('join_room', (projectId) => {
      socket.join(projectId);
      console.log(`${socket.user.name} joined room: ${projectId}`);
    });

    socket.on('send_message', async ({ projectId, content }) => {
      if (!content || !content.trim()) return;

      try {
        const message = await Message.create({
          project: projectId,
          sender:  socket.user._id,
          content: content.trim(),
        });

        const populated = await message.populate('sender', 'name avatar');

        // Send to ALL users in this room (including the sender)
        io.to(projectId).emit('receive_message', populated);
      } catch (err) {
        socket.emit('error', { message: 'Message could not be sent' });
      }
    });

    socket.on('leave_room', (projectId) => {
      socket.leave(projectId);
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.user.name}`);
    });
  });
};