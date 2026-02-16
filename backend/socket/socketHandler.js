const Chat = require('../models/Chat');

// Store online users
const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their ID
    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Broadcast online status to all users
      io.emit('userOnline', userId);
      
      console.log(`User ${userId} is now online`);
    });

    // Join specific chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat: ${chatId}`);
    });

    // Send message
    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, text, senderId } = data;

        // Save message to database
        const chat = await Chat.findById(chatId);
        
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        const message = {
          sender: senderId,
          text,
          timestamp: new Date(),
          seen: false
        };

        chat.messages.push(message);
        chat.lastMessage = text;
        chat.lastMessageTime = new Date();

        await chat.save();

        // Populate sender info
        const populatedChat = await Chat.findById(chatId)
          .populate('participants', 'name shopName')
          .populate('messages.sender', 'name');

        const newMessage = populatedChat.messages[populatedChat.messages.length - 1];

        // Emit to all users in the chat room
        io.to(chatId).emit('newMessage', {
          chatId,
          message: newMessage
        });

        // Notify other participant if online
        const otherParticipant = chat.participants.find(
          p => p.toString() !== senderId
        );

        if (otherParticipant && onlineUsers.has(otherParticipant.toString())) {
          const receiverSocketId = onlineUsers.get(otherParticipant.toString());
          io.to(receiverSocketId).emit('notification', {
            type: 'newMessage',
            chatId,
            message: text,
            sender: senderId
          });
        }

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { chatId, userId } = data;
      socket.to(chatId).emit('userTyping', { chatId, userId });
    });

    socket.on('stopTyping', (data) => {
      const { chatId, userId } = data;
      socket.to(chatId).emit('userStopTyping', { chatId, userId });
    });

    // Mark messages as seen
    socket.on('markAsSeen', async (data) => {
      try {
        const { chatId, userId } = data;
        
        const chat = await Chat.findById(chatId);
        
        if (chat) {
          chat.messages.forEach(message => {
            if (message.sender.toString() !== userId && !message.seen) {
              message.seen = true;
            }
          });
          
          await chat.save();
          
          // Notify sender that messages were seen
          socket.to(chatId).emit('messagesSeen', { chatId });
        }
      } catch (error) {
        console.error('Error marking messages as seen:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        
        // Broadcast offline status
        io.emit('userOffline', socket.userId);
        
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};

module.exports = socketHandler;
