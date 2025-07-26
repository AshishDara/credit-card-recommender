const express = require('express');
const router = express.Router();
const User = require('../models/User');
const recommendationEngine = require('../services/recommendationEngine');
const llmService = require('../services/llmService');
const { validatePreferences, sanitizeInput } = require('../middleware/validation');

// Get personalized recommendations
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 5 } = req.query;

    // Find user session
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!user.preferences || !user.preferences.monthlyIncome) {
      return res.status(400).json({ 
        error: 'Insufficient user preferences. Please complete the conversation first.' 
      });
    }

    // Get recommendations
    const recommendations = await recommendationEngine.getRecommendations(
      user.preferences, 
      parseInt(limit)
    );

    // Generate detailed explanations and reward simulations
    const detailedRecommendations = await Promise.all(
      recommendations.map(async (rec, index) => {
        const rewardSimulation = await recommendationEngine.calculateRewardSimulation(
          rec.card, 
          user.preferences
        );

        const llmExplanation = await llmService.generateRecommendationExplanation(
          rec.card, 
          user.preferences, 
          rec.score
        );

        return {
          rank: index + 1,
          card: {
            id: rec.card._id,
            name: rec.card.name,
            issuer: rec.card.issuer,
            category: rec.card.category,
            joiningFee: rec.card.joiningFee,
            annualFee: rec.card.annualFee,
            rewardType: rec.card.rewardType,
            rewardRate: rec.card.rewardRate,
            benefits: rec.card.benefits,
            specialPerks: rec.card.specialPerks,
            imageUrl: rec.card.imageUrl,
            applyLink: rec.card.applyLink,
            rating: rec.card.rating,
            eligibility: rec.card.eligibility
          },
          score: rec.score,
          reasons: rec.reasons,
          llmExplanation,
          rewardSimulation,
          matchPercentage: Math.round(rec.score)
        };
      })
    );

    // Save recommendations to user session
    user.recommendations = detailedRecommendations.map(rec => ({
      cardId: rec.card.id,
      score: rec.score,
      reasons: rec.reasons
    }));
    user.isCompleted = true;
    await user.save();

    res.json({
      sessionId,
      userPreferences: user.preferences,
      recommendations: detailedRecommendations,
      summary: {
        totalRecommendations: detailedRecommendations.length,
        topChoice: detailedRecommendations[0],
        averageScore: Math.round(
          detailedRecommendations.reduce((sum, rec) => sum + rec.score, 0) / 
          detailedRecommendations.length
        )
      }
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get recommendations by manual preferences (without session)
router.post('/manual', async (req, res) => {
  try {
    const { preferences, limit = 5 } = req.body;

    if (!preferences || !preferences.monthlyIncome) {
      return res.status(400).json({ 
        error: 'Monthly income is required in preferences' 
      });
    }

    // Get recommendations
    const recommendations = await recommendationEngine.getRecommendations(
      preferences, 
      parseInt(limit)
    );

    // Generate detailed explanations and reward simulations
    const detailedRecommendations = await Promise.all(
      recommendations.map(async (rec, index) => {
        const rewardSimulation = await recommendationEngine.calculateRewardSimulation(
          rec.card, 
          preferences
        );

        const llmExplanation = await llmService.generateRecommendationExplanation(
          rec.card, 
          preferences, 
          rec.score
        );

        return {
          rank: index + 1,
          card: {
            id: rec.card._id,
            name: rec.card.name,
            issuer: rec.card.issuer,
            category: rec.card.category,
            joiningFee: rec.card.joiningFee,
            annualFee: rec.card.annualFee,
            rewardType: rec.card.rewardType,
            rewardRate: rec.card.rewardRate,
            benefits: rec.card.benefits,
            specialPerks: rec.card.specialPerks,
            imageUrl: rec.card.imageUrl,
            applyLink: rec.card.applyLink,
            rating: rec.card.rating,
            eligibility: rec.card.eligibility
          },
          score: rec.score,
          reasons: rec.reasons,
          llmExplanation,
          rewardSimulation,
          matchPercentage: Math.round(rec.score)
        };
      })
    );

    res.json({
      userPreferences: preferences,
      recommendations: detailedRecommendations,
      summary: {
        totalRecommendations: detailedRecommendations.length,
        topChoice: detailedRecommendations[0],
        averageScore: Math.round(
          detailedRecommendations.reduce((sum, rec) => sum + rec.score, 0) / 
          detailedRecommendations.length
        )
      }
    });
  } catch (error) {
    console.error('Error getting manual recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get recommendation explanation for a specific card
router.post('/explain', async (req, res) => {
  try {
    const { cardId, sessionId, preferences } = req.body;

    let userPreferences;
    if (sessionId) {
      const user = await User.findOne({ sessionId });
      if (!user) {
        return res.status(404).json({ error: 'Session not found' });
      }
      userPreferences = user.preferences;
    } else if (preferences) {
      userPreferences = preferences;
    } else {
      return res.status(400).json({ 
        error: 'Either sessionId or preferences must be provided' 
      });
    }

    const Card = require('../models/Card');
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const score = recommendationEngine.calculateCardScore(card, userPreferences);
    const reasons = recommendationEngine.generateReasons(card, userPreferences, score);
    const rewardSimulation = await recommendationEngine.calculateRewardSimulation(
      card, 
      userPreferences
    );
    const llmExplanation = await llmService.generateRecommendationExplanation(
      card, 
      userPreferences, 
      score
    );

    res.json({
      card: {
        id: card._id,
        name: card.name,
        issuer: card.issuer
      },
      score,
      reasons,
      llmExplanation,
      rewardSimulation,
      matchPercentage: Math.round(score)
    });
  } catch (error) {
    console.error('Error explaining recommendation:', error);
    res.status(500).json({ error: 'Failed to explain recommendation' });
  }
});

// Get reward calculation for a card and user preferences
router.post('/calculate-rewards', async (req, res) => {
  try {
    const { cardId, monthlySpending } = req.body;

    if (!cardId || !monthlySpending) {
      return res.status(400).json({ 
        error: 'Card ID and monthly spending data are required' 
      });
    }

    const Card = require('../models/Card');
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const preferences = { spendingHabits: monthlySpending };
    const rewardSimulation = await recommendationEngine.calculateRewardSimulation(
      card, 
      preferences
    );

    res.json({
      card: {
        id: card._id,
        name: card.name,
        issuer: card.issuer,
        annualFee: card.annualFee
      },
      monthlySpending,
      rewardSimulation
    });
  } catch (error) {
    console.error('Error calculating rewards:', error);
    res.status(500).json({ error: 'Failed to calculate rewards' });
  }
});

module.exports = router;