const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const { validateCardIds, sanitizeInput } = require('../middleware/validation');

// Get all cards with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      issuer, 
      minIncome, 
      maxAnnualFee, 
      rewardType,
      limit = 20,
      sort = 'rating',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (issuer) filter.issuer = new RegExp(issuer, 'i');
    if (minIncome) filter['eligibility.minIncome'] = { $lte: parseInt(minIncome) };
    if (maxAnnualFee) filter.annualFee = { $lte: parseInt(maxAnnualFee) };
    if (rewardType) filter.rewardType = rewardType;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const cards = await Card.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit));

    res.json({
      cards,
      total: cards.length,
      filters: {
        category,
        issuer,
        minIncome,
        maxAnnualFee,
        rewardType
      }
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// Get card by ID
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

// Get cards by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const cards = await Card.find({ 
      category: category.toLowerCase(), 
      isActive: true 
    })
    .sort({ rating: -1 })
    .limit(parseInt(limit));

    res.json({
      category,
      cards,
      total: cards.length
    });
  } catch (error) {
    console.error('Error fetching cards by category:', error);
    res.status(500).json({ error: 'Failed to fetch cards by category' });
  }
});

// Get cards by issuer
router.get('/issuer/:issuer', async (req, res) => {
  try {
    const { issuer } = req.params;
    const { limit = 10 } = req.query;

    const cards = await Card.find({ 
      issuer: new RegExp(issuer, 'i'), 
      isActive: true 
    })
    .sort({ rating: -1 })
    .limit(parseInt(limit));

    res.json({
      issuer,
      cards,
      total: cards.length
    });
  } catch (error) {
    console.error('Error fetching cards by issuer:', error);
    res.status(500).json({ error: 'Failed to fetch cards by issuer' });
  }
});

// Search cards
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const searchRegex = new RegExp(query, 'i');
    
    const cards = await Card.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: searchRegex },
            { issuer: searchRegex },
            { benefits: { $elemMatch: { $regex: searchRegex } } },
            { specialPerks: { $elemMatch: { $regex: searchRegex } } }
          ]
        }
      ]
    })
    .sort({ rating: -1 })
    .limit(parseInt(limit));

    res.json({
      query,
      cards,
      total: cards.length
    });
  } catch (error) {
    console.error('Error searching cards:', error);
    res.status(500).json({ error: 'Failed to search cards' });
  }
});

// Get available categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Card.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get available issuers
router.get('/meta/issuers', async (req, res) => {
  try {
    const issuers = await Card.distinct('issuer', { isActive: true });
    res.json({ issuers });
  } catch (error) {
    console.error('Error fetching issuers:', error);
    res.status(500).json({ error: 'Failed to fetch issuers' });
  }
});

// Compare multiple cards
router.post('/compare', async (req, res) => {
  try {
    const { cardIds } = req.body;

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length < 2) {
      return res.status(400).json({ 
        error: 'Please provide at least 2 card IDs for comparison' 
      });
    }

    if (cardIds.length > 5) {
      return res.status(400).json({ 
        error: 'Maximum 5 cards can be compared at once' 
      });
    }

    const cards = await Card.find({ 
      _id: { $in: cardIds }, 
      isActive: true 
    });

    if (cards.length !== cardIds.length) {
      return res.status(404).json({ 
        error: 'One or more cards not found' 
      });
    }

    // Create comparison matrix
    const comparison = {
      cards: cards.map(card => ({
        id: card._id,
        name: card.name,
        issuer: card.issuer,
        category: card.category,
        joiningFee: card.joiningFee,
        annualFee: card.annualFee,
        rewardType: card.rewardType,
        rewardRate: card.rewardRate,
        minIncome: card.eligibility.minIncome,
        minCreditScore: card.eligibility.minCreditScore,
        benefits: card.benefits,
        specialPerks: card.specialPerks,
        rating: card.rating,
        imageUrl: card.imageUrl,
        applyLink: card.applyLink
      })),
      summary: {
        lowestAnnualFee: Math.min(...cards.map(c => c.annualFee)),
        highestRewardRate: Math.max(...cards.map(c => c.rewardRate)),
        lowestMinIncome: Math.min(...cards.map(c => c.eligibility.minIncome)),
        averageRating: (cards.reduce((sum, c) => sum + c.rating, 0) / cards.length).toFixed(1)
      }
    };

    res.json(comparison);
  } catch (error) {
    console.error('Error comparing cards:', error);
    res.status(500).json({ error: 'Failed to compare cards' });
  }
});

module.exports = router;