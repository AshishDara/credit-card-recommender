const Conversation = require('../models/Conversation');
const openaiService = require('../utils/openaiService');
const recommendationService = require('../utils/recommendationService');
const memoryStore = require('../utils/memoryStore');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

class ChatController {
  async startConversation(req, res) {
    try {
      const sessionId = uuidv4();
      
      const conversationData = {
        sessionId,
        userId: req.body.userId || null,
        messages: [{
          role: 'assistant',
          content: 'Hello! I\'m here to help you find the perfect credit card for your needs. Let\'s start by understanding your financial profile. What\'s your approximate annual income? 💳',
          timestamp: new Date()
        }],
        currentStep: 'income_inquiry',
        userProfile: {},
        recommendations: [],
        status: 'active'
      };

      let conversation;
      
      // Try MongoDB first, fallback to memory store
      if (mongoose.connection.readyState === 1) {
        conversation = new Conversation(conversationData);
        await conversation.save();
      } else {
        conversation = await memoryStore.saveConversation(conversationData);
      }

      res.status(201).json({
        success: true,
        sessionId,
        message: conversationData.messages[0].content
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start conversation'
      });
    }
  }

  async sendMessage(req, res) {
    try {
      const { sessionId, message } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({
          success: false,
          message: 'SessionId and message are required'
        });
      }

      let conversation;
      
      // Try MongoDB first, fallback to memory store
      if (mongoose.connection.readyState === 1) {
        conversation = await Conversation.findOne({ sessionId });
      } else {
        conversation = await memoryStore.findConversation(sessionId);
      }
      
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      // Add user message
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      conversation.messages.push(userMessage);

      // Extract information from user message
      await this.extractUserInformation(conversation, message);

      // Get AI response
      const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await openaiService.getConversationalResponse(
        messages,
        conversation.userProfile
      );

      // Add AI response
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      conversation.messages.push(assistantMessage);

      // Check if we have enough information for recommendations
      if (this.hasEnoughInformation(conversation.userProfile)) {
        conversation.currentStep = 'ready_for_recommendations';
      }

      // Save conversation
      if (mongoose.connection.readyState === 1) {
        await conversation.save();
      } else {
        await memoryStore.saveConversation(conversation);
      }

      res.json({
        success: true,
        message: aiResponse,
        currentStep: conversation.currentStep,
        canRecommend: conversation.currentStep === 'ready_for_recommendations'
      });

    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process message'
      });
    }
  }

  async getConversation(req, res) {
    try {
      const { sessionId } = req.params;
      
      const conversation = await Conversation.findOne({ sessionId })
        .populate('recommendations.cardId');

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      res.json({
        success: true,
        conversation: {
          sessionId: conversation.sessionId,
          messages: conversation.messages,
          userProfile: conversation.userProfile,
          recommendations: conversation.recommendations,
          currentStep: conversation.currentStep
        }
      });
    } catch (error) {
      console.error('Error getting conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get conversation'
      });
    }
  }

  async resetConversation(req, res) {
    try {
      const { sessionId } = req.params;
      
      await Conversation.findOneAndUpdate(
        { sessionId },
        {
          messages: [{
            role: 'assistant',
            content: 'Hello! I\'m here to help you find the perfect credit card for your needs. Let\'s start by understanding your financial profile. What\'s your approximate annual income? 💳',
            timestamp: new Date()
          }],
          userProfile: {},
          recommendations: [],
          currentStep: 'income_inquiry',
          status: 'active'
        }
      );

      res.json({
        success: true,
        message: 'Conversation reset successfully'
      });
    } catch (error) {
      console.error('Error resetting conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset conversation'
      });
    }
  }

  async extractUserInformation(conversation, message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract income
    const incomeMatch = message.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lakhs|k|thousand|crore|crores)?/i);
    if (incomeMatch && !conversation.userProfile.income) {
      let income = parseFloat(incomeMatch[1].replace(/,/g, ''));
      if (lowerMessage.includes('lakh')) income *= 100000;
      if (lowerMessage.includes('k') || lowerMessage.includes('thousand')) income *= 1000;
      if (lowerMessage.includes('crore')) income *= 10000000;
      conversation.userProfile.income = income;
    }

    // Extract age
    const ageMatch = message.match(/(\d{2})\s*(?:years|year|yr)/i);
    if (ageMatch && !conversation.userProfile.age) {
      conversation.userProfile.age = parseInt(ageMatch[1]);
    }

    // Extract spending categories
    const spendingKeywords = {
      dining: ['dining', 'restaurant', 'food', 'eat', 'meal'],
      shopping: ['shopping', 'shop', 'buy', 'purchase', 'retail'],
      travel: ['travel', 'flight', 'hotel', 'vacation', 'trip'],
      fuel: ['fuel', 'petrol', 'gas', 'diesel'],
      grocery: ['grocery', 'groceries', 'supermarket'],
      entertainment: ['entertainment', 'movie', 'cinema', 'games']
    };

    for (const [category, keywords] of Object.entries(spendingKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (!conversation.userProfile.spendingCategories) {
          conversation.userProfile.spendingCategories = new Map();
        }
        conversation.userProfile.spendingCategories.set(category, true);
      }
    }

    // Extract card type preferences
    const cardTypes = ['cashback', 'rewards', 'travel', 'fuel', 'shopping', 'premium'];
    for (const type of cardTypes) {
      if (lowerMessage.includes(type)) {
        if (!conversation.userProfile.preferences.cardType) {
          conversation.userProfile.preferences.cardType = [];
        }
        if (!conversation.userProfile.preferences.cardType.includes(type)) {
          conversation.userProfile.preferences.cardType.push(type);
        }
      }
    }
  }

  hasEnoughInformation(userProfile) {
    return userProfile.income && 
           (userProfile.spendingCategories?.size > 0 || 
            userProfile.preferences?.cardType?.length > 0);
  }
}

// Add uuid dependency check
try {
  require('uuid');
} catch (error) {
  console.warn('UUID package not found, using fallback ID generation');
}

module.exports = new ChatController();