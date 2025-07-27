const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Start a new conversation
router.post('/start', chatController.startConversation);

// Send a message in the conversation
router.post('/message', chatController.sendMessage);

// Get conversation history
router.get('/:sessionId', chatController.getConversation);

// Reset conversation
router.post('/:sessionId/reset', chatController.resetConversation);

module.exports = router;