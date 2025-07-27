const Conversation = require('../models/Conversation');
const recommendationService = require('../utils/recommendationService');
const memoryStore = require('../utils/memoryStore');
const mongoose = require('mongoose');

class RecommendationsController {
  async getRecommendations(req, res) {
    try {
      const { sessionId, userProfile } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'SessionId is required'
        });
      }

      const conversation = mongoose.connection.readyState === 1
        ? await Conversation.findOne({ sessionId })
        : await memoryStore.findConversation(sessionId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      // Use provided userProfile or conversation's userProfile
      const profile = userProfile || conversation.userProfile;

      // Get recommendations
      const recommendations = await recommendationService.getRecommendations(profile);

      // Save recommendations to conversation
      conversation.recommendations = recommendations.map(rec => ({
        cardId: rec.card._id,
        score: rec.score,
        reasoning: rec.reasoning,
        timestamp: new Date()
      }));

      conversation.currentStep = 'recommendations_provided';
      
      if (mongoose.connection.readyState === 1) {
        await conversation.save();
      } else {
        await memoryStore.saveConversation(conversation);
      }

      // Format response
      const formattedRecommendations = recommendations.map(rec => ({
        card: {
          _id: rec.card._id,
          name: rec.card.name,
          issuer: rec.card.issuer,
          type: rec.card.type,
          annualFee: rec.card.annualFee,
          joiningFee: rec.card.joiningFee,
          minIncome: rec.card.minIncome,
          rewards: rec.card.rewards,
          features: rec.card.features,
          benefits: rec.card.benefits,
          imageUrl: rec.card.imageUrl,
          rating: rec.card.rating
        },
        score: rec.score,
        reasoning: rec.reasoning
      }));

      res.json({
        success: true,
        recommendations: formattedRecommendations,
        userProfile: profile
      });

    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recommendations'
      });
    }
  }

  async getRecommendationsBySession(req, res) {
    try {
      const { sessionId } = req.params;

      const conversation = mongoose.connection.readyState === 1
        ? await Conversation.findOne({ sessionId }).populate('recommendations.cardId')
        : await memoryStore.findConversation(sessionId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      if (conversation.recommendations.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No recommendations found for this session'
        });
      }

      const formattedRecommendations = conversation.recommendations.map(rec => ({
        card: rec.cardId,
        score: rec.score,
        reasoning: rec.reasoning,
        timestamp: rec.timestamp
      }));

      res.json({
        success: true,
        recommendations: formattedRecommendations,
        userProfile: conversation.userProfile
      });

    } catch (error) {
      console.error('Error getting recommendations by session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recommendations'
      });
    }
  }

  async getRewardSimulation(req, res) {
    try {
      const { cardId, monthlySpending } = req.body;

      if (!cardId || !monthlySpending) {
        return res.status(400).json({
          success: false,
          message: 'CardId and monthlySpending are required'
        });
      }

      const card = await Card.findById(cardId);
      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found'
        });
      }

      const simulation = await recommendationService.calculateRewardSimulation(card, monthlySpending);

      res.json({
        success: true,
        simulation
      });

    } catch (error) {
      console.error('Error calculating reward simulation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate reward simulation'
      });
    }
  }
}

module.exports = new RecommendationsController();