const Chat = require('../models/Chat');

// @desc    Create or get chat
// @route   POST /api/chats
// @access  Private
exports.createChat = async (req, res) => {
  try {
    const { sellerId, productId } = req.body;
    const userId = req.user._id;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, sellerId] },
      productId
    }).populate('participants', 'name shopName')
      .populate('productId', 'name images');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [userId, sellerId],
        productId
      });

      chat = await Chat.findById(chat._id)
        .populate('participants', 'name shopName')
        .populate('productId', 'name images');
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', 'name shopName')
      .populate('productId', 'name images')
      .sort('-lastMessageTime');

    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chat by ID
// @route   GET /api/chats/:id
// @access  Private
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name shopName')
      .populate('productId', 'name images')
      .populate('messages.sender', 'name');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    // Mark messages as seen for the current user
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user._id.toString()) {
        message.seen = true;
      }
    });

    await chat.save();

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/chats/:id/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message in this chat'
      });
    }

    const message = {
      sender: req.user._id,
      text,
      timestamp: new Date()
    };

    chat.messages.push(message);
    chat.lastMessage = text;
    chat.lastMessageTime = new Date();

    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name shopName')
      .populate('messages.sender', 'name');

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      chat: populatedChat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chats/:id
// @access  Private
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this chat'
      });
    }

    await chat.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
