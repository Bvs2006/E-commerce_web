const express = require('express');
const router = express.Router();
const {
  createChat,
  getUserChats,
  getChatById,
  sendMessage,
  deleteChat
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// All chat routes are protected
router.post('/', protect, createChat);
router.get('/', protect, getUserChats);
router.get('/:id', protect, getChatById);
router.post('/:id/message', protect, sendMessage);
router.delete('/:id', protect, deleteChat);

module.exports = router;
