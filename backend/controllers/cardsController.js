const Card = require('../models/Card');

class CardsController {
  async getAllCards(req, res) {
    try {
      const { page = 1, limit = 20, type, issuer, sortBy = 'rating' } = req.query;
      
      const query = { isActive: true };
      if (type) query.type = type;
      if (issuer) query.issuer = issuer;

      const sortOptions = {};
      if (sortBy === 'rating') sortOptions.rating = -1;
      if (sortBy === 'fee') sortOptions.annualFee = 1;
      if (sortBy === 'income') sortOptions.minIncome = 1;

      const cards = await Card.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Card.countDocuments(query);

      res.json({
        success: true,
        cards,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      console.error('Error getting cards:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get cards'
      });
    }
  }

  async getCardById(req, res) {
    try {
      const card = await Card.findById(req.params.id);
      
      if (!card) {
        return res.status(404).json({
          success: false,
          message: 'Card not found'
        });
      }

      res.json({
        success: true,
        card
      });
    } catch (error) {
      console.error('Error getting card:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get card'
      });
    }
  }

  async searchCards(req, res) {
    try {
      const { q, minIncome, maxFee, type, issuer } = req.query;
      
      const query = { isActive: true };
      
      if (q) {
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { issuer: { $regex: q, $options: 'i' } },
          { features: { $elemMatch: { $regex: q, $options: 'i' } } }
        ];
      }
      
      if (minIncome) query.minIncome = { $lte: parseInt(minIncome) };
      if (maxFee) query.annualFee = { $lte: parseInt(maxFee) };
      if (type) query.type = type;
      if (issuer) query.issuer = issuer;

      const cards = await Card.find(query).sort({ rating: -1 });

      res.json({
        success: true,
        cards,
        count: cards.length
      });
    } catch (error) {
      console.error('Error searching cards:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search cards'
      });
    }
  }
}

module.exports = new CardsController();