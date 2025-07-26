const express = require('express');
const router = express.Router();
const User = require('../models/User');
const llmService = require('../services/llmService');
const { v4: uuidv4 } = require('uuid');
const { validateChatMessage, sanitizeInput } = require('../middleware/validation');

// Start a new chat session
router.post('/start', async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    const user = new User({
      sessionId,
      conversationHistory: [{
        role: 'assistant',
        content: 'Hi! I\'m here to help you find the perfect credit card for your needs. To get started, could you tell me about your approximate monthly income?'
      }]
    });

    await user.save();

    res.json({
      sessionId,
      message: user.conversationHistory[0].content
    });
  } catch (error) {
    console.error('Error starting chat session:', error);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
});

// Continue conversation
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Find user session
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Add user message to conversation history
    user.conversationHistory.push({
      role: 'user',
      content: message
    });

    // Generate AI response
    const aiResponse = await llmService.generateResponse(user.conversationHistory, user.preferences);

    // Add AI response to conversation history
    user.conversationHistory.push({
      role: 'assistant',
      content: aiResponse
    });

    // Extract and update user preferences
    const extractedPreferences = await llmService.extractUserPreferences(user.conversationHistory);
    user.preferences = { ...user.preferences, ...extractedPreferences };

    // Check if we have enough information for recommendations
    const hasEnoughInfo = checkIfReadyForRecommendations(user.preferences);
    
    await user.save();

    res.json({
      message: aiResponse,
      preferences: user.preferences,
      readyForRecommendations: hasEnoughInfo
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get conversation history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      conversationHistory: user.conversationHistory,
      preferences: user.preferences,
      isCompleted: user.isCompleted
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Reset conversation
router.post('/reset/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    user.conversationHistory = [{
      role: 'assistant',
      content: 'Hi! I\'m here to help you find the perfect credit card for your needs. To get started, could you tell me about your approximate monthly income?'
    }];
    user.preferences = {};
    user.recommendations = [];
    user.isCompleted = false;

    await user.save();

    res.json({
      message: 'Conversation reset successfully',
      sessionId
    });
  } catch (error) {
    console.error('Error resetting conversation:', error);
    res.status(500).json({ error: 'Failed to reset conversation' });
  }
});

// Helper function to check if we have enough information
function checkIfReadyForRecommendations(preferences) {
  return !!(
    preferences.monthlyIncome &&
    (preferences.primarySpendingCategory || 
     Object.values(preferences.spendingHabits || {}).some(amount => amount > 0))
  );
}

module.exports = router;