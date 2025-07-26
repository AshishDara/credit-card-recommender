const Card = require('../models/Card');

class CompareController {
  async compareCards(req, res) {
    try {
      const { cardIds } = req.body;

      if (!cardIds || !Array.isArray(cardIds) || cardIds.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'At least 2 card IDs are required for comparison'
        });
      }

      if (cardIds.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'Cannot compare more than 5 cards at once'
        });
      }

      const cards = await Card.find({ _id: { $in: cardIds }, isActive: true });

      if (cards.length !== cardIds.length) {
        return res.status(404).json({
          success: false,
          message: 'One or more cards not found'
        });
      }

      const comparison = this.generateComparison(cards);

      res.json({
        success: true,
        comparison
      });

    } catch (error) {
      console.error('Error comparing cards:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compare cards'
      });
    }
  }

  async getComparisonData(req, res) {
    try {
      const { cardIds } = req.params;
      const cardIdArray = cardIds.split(',');

      if (cardIdArray.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'At least 2 card IDs are required'
        });
      }

      const cards = await Card.find({ _id: { $in: cardIdArray }, isActive: true });

      res.json({
        success: true,
        cards
      });

    } catch (error) {
      console.error('Error getting comparison data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get comparison data'
      });
    }
  }

  generateComparison(cards) {
    const comparison = {
      cards: cards.map(card => ({
        _id: card._id,
        name: card.name,
        issuer: card.issuer,
        type: card.type,
        annualFee: card.annualFee,
        joiningFee: card.joiningFee,
        minIncome: card.minIncome,
        rewards: card.rewards,
        features: card.features,
        benefits: card.benefits,
        imageUrl: card.imageUrl,
        rating: card.rating,
        eligibility: card.eligibility
      })),
      comparison: {
        fees: this.compareFees(cards),
        rewards: this.compareRewards(cards),
        eligibility: this.compareEligibility(cards),
        features: this.compareFeatures(cards),
        summary: this.generateSummary(cards)
      }
    };

    return comparison;
  }

  compareFees(cards) {
    return {
      lowestAnnualFee: {
        value: Math.min(...cards.map(c => c.annualFee)),
        cards: cards.filter(c => c.annualFee === Math.min(...cards.map(c => c.annualFee))).map(c => c.name)
      },
      lowestJoiningFee: {
        value: Math.min(...cards.map(c => c.joiningFee)),
        cards: cards.filter(c => c.joiningFee === Math.min(...cards.map(c => c.joiningFee))).map(c => c.name)
      },
      freeCards: cards.filter(c => c.annualFee === 0 && c.joiningFee === 0).map(c => c.name)
    };
  }

  compareRewards(cards) {
    const rewardCategories = new Set();
    cards.forEach(card => {
      card.rewards.forEach((value, key) => rewardCategories.add(key));
    });

    const categoryComparison = {};
    rewardCategories.forEach(category => {
      const cardRewards = cards.map(card => ({
        name: card.name,
        rate: card.rewards.get(category) || 0
      }));
      
      const maxReward = Math.max(...cardRewards.map(cr => cr.rate));
      categoryComparison[category] = {
        maxRate: maxReward,
        bestCards: cardRewards.filter(cr => cr.rate === maxReward).map(cr => cr.name),
        allRates: cardRewards
      };
    });

    return categoryComparison;
  }

  compareEligibility(cards) {
    return {
      lowestIncome: {
        value: Math.min(...cards.map(c => c.minIncome)),
        cards: cards.filter(c => c.minIncome === Math.min(...cards.map(c => c.minIncome))).map(c => c.name)
      },
      ageRange: {
        minAge: Math.min(...cards.map(c => c.eligibility.minAge)),
        maxAge: Math.max(...cards.map(c => c.eligibility.maxAge))
      },
      employmentTypes: [...new Set(cards.flatMap(c => c.eligibility.employmentType))]
    };
  }

  compareFeatures(cards) {
    const allFeatures = new Set();
    cards.forEach(card => {
      card.features.forEach(feature => allFeatures.add(feature));
    });

    const featureComparison = {};
    allFeatures.forEach(feature => {
      featureComparison[feature] = cards.filter(card => 
        card.features.includes(feature)
      ).map(card => card.name);
    });

    return featureComparison;
  }

  generateSummary(cards) {
    const summary = [];

    // Best for low fees
    const freeCards = cards.filter(c => c.annualFee === 0);
    if (freeCards.length > 0) {
      summary.push({
        category: 'Best for No Annual Fee',
        cards: freeCards.map(c => c.name),
        reason: 'No annual fee charged'
      });
    }

    // Best rated
    const maxRating = Math.max(...cards.map(c => c.rating));
    const topRatedCards = cards.filter(c => c.rating === maxRating);
    summary.push({
      category: 'Highest Rated',
      cards: topRatedCards.map(c => c.name),
      reason: `${maxRating}/5 star rating`
    });

    // Best for low income
    const minIncome = Math.min(...cards.map(c => c.minIncome));
    const lowIncomeCards = cards.filter(c => c.minIncome === minIncome);
    summary.push({
      category: 'Lowest Income Requirement',
      cards: lowIncomeCards.map(c => c.name),
      reason: `Minimum income: ₹${minIncome.toLocaleString()}`
    });

    return summary;
  }
}

module.exports = new CompareController();