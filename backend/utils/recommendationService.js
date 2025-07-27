const Card = require('../models/Card');
const memoryStore = require('./memoryStore');
const mongoose = require('mongoose');

class RecommendationService {
  async getRecommendations(userProfile) {
    try {
      let cards;
      
      // Try MongoDB first, fallback to memory store
      if (mongoose.connection.readyState === 1) {
        cards = await Card.find({ isActive: true });
      } else {
        cards = await memoryStore.getCards({ isActive: true });
      }
      
      const scoredCards = cards.map(card => ({
        card,
        score: this.calculateScore(card, userProfile),
        reasoning: this.generateReasoning(card, userProfile)
      }));

      // Sort by score and return top 5
      scoredCards.sort((a, b) => b.score - a.score);
      return scoredCards.slice(0, 5);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  calculateScore(card, userProfile) {
    let score = 0;
    const maxScore = 100;

    // Income eligibility (30 points)
    if (userProfile.income && userProfile.income >= card.minIncome) {
      score += 30;
      // Bonus if income is well above minimum
      if (userProfile.income >= card.minIncome * 2) {
        score += 5;
      }
    } else if (userProfile.income && userProfile.income < card.minIncome) {
      score -= 20; // Heavy penalty for not meeting income requirement
    }

    // Age eligibility (10 points)
    if (userProfile.age) {
      if (userProfile.age >= card.eligibility.minAge && userProfile.age <= card.eligibility.maxAge) {
        score += 10;
      } else {
        score -= 15; // Penalty for age mismatch
      }
    }

    // Card type preference (25 points)
    if (userProfile.preferences?.cardType?.length > 0) {
      const hasPreferredType = userProfile.preferences.cardType.some(
        pref => pref.toLowerCase() === card.type.toLowerCase()
      );
      if (hasPreferredType) {
        score += 25;
      }
    }

    // Annual fee preference (15 points)
    if (userProfile.preferences?.maxAnnualFee !== undefined) {
      if (card.annualFee <= userProfile.preferences.maxAnnualFee) {
        score += 15;
      } else {
        score -= 10; // Penalty for exceeding fee preference
      }
    } else {
      // Default preference for lower fees
      if (card.annualFee === 0) score += 10;
      else if (card.annualFee <= 5000) score += 5;
    }

    // Spending category match (20 points)
    if (userProfile.spendingCategories) {
      const spendingKeys = Array.from(userProfile.spendingCategories.keys());
      let categoryMatches = 0;

      spendingKeys.forEach(category => {
        // Check if card has rewards for this category
        let rewardRate;
        if (card.rewards instanceof Map) {
          rewardRate = card.rewards.get(category);
        } else if (typeof card.rewards === 'object') {
          rewardRate = card.rewards[category];
        }
        
        if (rewardRate && rewardRate > 1) {
          categoryMatches += rewardRate; // Weight by reward rate
        }

        // Check if card type matches spending category
        if (category === 'travel' && card.type === 'Travel') categoryMatches += 3;
        if (category === 'fuel' && card.type === 'Fuel') categoryMatches += 3;
        if (category === 'shopping' && card.type === 'Shopping') categoryMatches += 3;
      });

      score += Math.min(categoryMatches * 3, 20); // Cap at 20 points
    }

    // Card rating (bonus points)
    score += card.rating * 2; // Up to 10 bonus points

    // Premium card adjustment
    if (card.type === 'Premium') {
      if (userProfile.income && userProfile.income >= 1000000) {
        score += 5; // Bonus for high income users
      } else {
        score -= 10; // Penalty for lower income users
      }
    }

    return Math.max(0, Math.min(score, maxScore));
  }

  generateReasoning(card, userProfile) {
    const reasons = [];

    if (userProfile.income && userProfile.income >= card.minIncome) {
      if (userProfile.income >= card.minIncome * 2) {
        reasons.push(`Your income comfortably meets the requirement (₹${card.minIncome.toLocaleString()})`);
      } else {
        reasons.push(`Meets income requirement of ₹${card.minIncome.toLocaleString()}`);
      }
    }

    if (userProfile.preferences?.cardType?.length > 0) {
      const hasPreferredType = userProfile.preferences.cardType.some(
        pref => pref.toLowerCase() === card.type.toLowerCase()
      );
      if (hasPreferredType) {
        reasons.push(`Matches your preference for ${card.type.toLowerCase()} cards`);
      }
    }

    if (userProfile.spendingCategories) {
      const spendingKeys = Array.from(userProfile.spendingCategories.keys());
      const matchingCategories = [];

      spendingKeys.forEach(category => {
        let rewardRate;
        if (card.rewards instanceof Map) {
          rewardRate = card.rewards.get(category);
        } else if (typeof card.rewards === 'object') {
          rewardRate = card.rewards[category];
        }
        
        if (rewardRate && rewardRate > 1) {
          matchingCategories.push(`${category} (${rewardRate}% rewards)`);
        }
      });

      if (matchingCategories.length > 0) {
        reasons.push(`Great rewards for: ${matchingCategories.join(', ')}`);
      }
    }

    if (card.annualFee === 0) {
      reasons.push('No annual fee');
    } else if (userProfile.preferences?.maxAnnualFee && card.annualFee <= userProfile.preferences.maxAnnualFee) {
      reasons.push(`Annual fee (₹${card.annualFee}) within your budget`);
    }

    if (card.rating >= 4) {
      reasons.push(`Highly rated card (${card.rating}/5 stars)`);
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Good overall match for your profile';
  }

  async calculateRewardSimulation(card, monthlySpending) {
    const simulation = {
      cardName: card.name,
      monthlyRewards: 0,
      annualRewards: 0,
      annualFee: card.annualFee,
      netBenefit: 0
    };

    let totalRewards = 0;

    // Calculate rewards for each spending category
    for (const [category, amount] of Object.entries(monthlySpending)) {
      const rewardRate = card.rewards.get(category) || card.rewards.get('default') || 1;
      const categoryRewards = (amount * rewardRate) / 100;
      totalRewards += categoryRewards;
    }

    simulation.monthlyRewards = totalRewards;
    simulation.annualRewards = totalRewards * 12;
    simulation.netBenefit = simulation.annualRewards - card.annualFee;

    return simulation;
  }
}

module.exports = new RecommendationService();