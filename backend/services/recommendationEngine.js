const Card = require('../models/Card');

class RecommendationEngine {
  constructor() {
    this.weights = {
      income_eligibility: 0.25,
      spending_match: 0.30,
      benefit_alignment: 0.20,
      credit_score: 0.15,
      cost_benefit: 0.10
    };
  }

  async getRecommendations(userPreferences, limit = 5) {
    try {
      // Get all active cards
      const cards = await Card.find({ isActive: true });
      
      // Score each card
      const scoredCards = cards.map(card => {
        const score = this.calculateCardScore(card, userPreferences);
        return {
          card,
          score,
          reasons: this.generateReasons(card, userPreferences, score)
        };
      });

      // Sort by score and return top recommendations
      scoredCards.sort((a, b) => b.score - a.score);
      
      return scoredCards.slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  calculateCardScore(card, userPreferences) {
    let totalScore = 0;

    // 1. Income Eligibility Score (25%)
    const incomeScore = this.calculateIncomeScore(card, userPreferences.monthlyIncome);
    totalScore += incomeScore * this.weights.income_eligibility;

    // 2. Spending Pattern Match Score (30%)
    const spendingScore = this.calculateSpendingScore(card, userPreferences.spendingHabits, userPreferences.primarySpendingCategory);
    totalScore += spendingScore * this.weights.spending_match;

    // 3. Benefit Alignment Score (20%)
    const benefitScore = this.calculateBenefitScore(card, userPreferences.preferredBenefits);
    totalScore += benefitScore * this.weights.benefit_alignment;

    // 4. Credit Score Compatibility (15%)
    const creditScore = this.calculateCreditScore(card, userPreferences.creditScore);
    totalScore += creditScore * this.weights.credit_score;

    // 5. Cost-Benefit Ratio (10%)
    const costBenefitScore = this.calculateCostBenefitScore(card, userPreferences);
    totalScore += costBenefitScore * this.weights.cost_benefit;

    return Math.round(totalScore);
  }

  calculateIncomeScore(card, monthlyIncome) {
    if (!monthlyIncome) return 50; // neutral score if income not provided
    
    const annualIncome = monthlyIncome * 12;
    const requiredIncome = card.eligibility.minIncome;
    
    if (annualIncome < requiredIncome * 0.8) return 10; // Significantly below requirement
    if (annualIncome < requiredIncome) return 30; // Slightly below requirement
    if (annualIncome >= requiredIncome * 2) return 100; // Well above requirement
    if (annualIncome >= requiredIncome * 1.5) return 90; // Comfortably above requirement
    return 70; // Just meets requirement
  }

  calculateSpendingScore(card, spendingHabits = {}, primaryCategory) {
    let score = 0;
    let totalWeight = 0;

    // Check each spending category
    for (const spendingCat of card.spendingCategories) {
      const categoryAmount = spendingHabits[spendingCat.category] || 0;
      const rewardValue = spendingCat.cashbackRate || (spendingCat.rewardMultiplier * 0.25); // Assume 0.25% base value for points
      
      if (categoryAmount > 0) {
        const categoryScore = Math.min(100, rewardValue * 20); // Higher reward rate = higher score
        const weight = categoryAmount / 10000; // Normalize spending amount
        
        score += categoryScore * weight;
        totalWeight += weight;
      }
    }

    // Boost score if card matches primary spending category
    if (primaryCategory) {
      const matchingCategory = card.spendingCategories.find(cat => cat.category === primaryCategory);
      if (matchingCategory) {
        const boost = (matchingCategory.cashbackRate || matchingCategory.rewardMultiplier) * 10;
        score += boost;
        totalWeight += 1;
      }
    }

    return totalWeight > 0 ? Math.min(100, score / totalWeight) : 50;
  }

  calculateBenefitScore(card, preferredBenefits = []) {
    if (preferredBenefits.length === 0) return 50;

    const cardBenefits = [...card.benefits, ...card.specialPerks].join(' ').toLowerCase();
    let matches = 0;

    for (const benefit of preferredBenefits) {
      const benefitLower = benefit.toLowerCase();
      if (cardBenefits.includes(benefitLower) || 
          cardBenefits.includes(benefitLower.replace('_', ' ')) ||
          cardBenefits.includes(benefitLower.replace(' ', '_'))) {
        matches++;
      }
    }

    return Math.min(100, (matches / preferredBenefits.length) * 100);
  }

  calculateCreditScore(card, userCreditScore) {
    if (!userCreditScore || userCreditScore === 'unknown') return 50;

    const requiredScore = card.eligibility.minCreditScore;
    const creditScoreMap = {
      'excellent': 800,
      'good': 720,
      'fair': 650,
      'poor': 550
    };

    const userScore = creditScoreMap[userCreditScore];
    
    if (userScore >= requiredScore + 50) return 100;
    if (userScore >= requiredScore) return 80;
    if (userScore >= requiredScore - 30) return 60;
    if (userScore >= requiredScore - 50) return 40;
    return 20;
  }

  calculateCostBenefitScore(card, userPreferences) {
    const annualFee = card.annualFee;
    
    // Free cards get bonus points
    if (annualFee === 0) return 100;
    
    // Calculate potential annual reward based on spending
    let potentialReward = 0;
    const spendingHabits = userPreferences.spendingHabits || {};
    
    for (const spendingCat of card.spendingCategories) {
      const monthlySpend = spendingHabits[spendingCat.category] || 0;
      const annualSpend = monthlySpend * 12;
      const rewardRate = spendingCat.cashbackRate || (spendingCat.rewardMultiplier * 0.25);
      potentialReward += (annualSpend * rewardRate) / 100;
    }

    const netBenefit = potentialReward - annualFee;
    
    if (netBenefit >= annualFee) return 100; // Reward exceeds fee significantly
    if (netBenefit >= 0) return 80; // Positive net benefit
    if (netBenefit >= -annualFee * 0.5) return 60; // Reasonable cost
    return 30; // High cost relative to benefit
  }

  generateReasons(card, userPreferences, score) {
    const reasons = [];

    // Income eligibility reason
    if (userPreferences.monthlyIncome && userPreferences.monthlyIncome * 12 >= card.eligibility.minIncome) {
      reasons.push("✅ You meet the income eligibility criteria");
    }

    // Free card benefit
    if (card.annualFee === 0) {
      reasons.push("💳 No annual fee - great value");
    }

    // High reward rate
    if (card.rewardRate >= 4) {
      reasons.push(`🎯 High ${card.rewardType} rate of ${card.rewardRate}%`);
    }

    // Primary category match
    if (userPreferences.primarySpendingCategory) {
      const matchingCategory = card.spendingCategories.find(cat => 
        cat.category === userPreferences.primarySpendingCategory && 
        (cat.cashbackRate > 2 || cat.rewardMultiplier > 2)
      );
      if (matchingCategory) {
        reasons.push(`💰 Excellent rewards on ${userPreferences.primarySpendingCategory}`);
      }
    }

    // Premium benefits
    if (card.specialPerks.some(perk => perk.toLowerCase().includes('lounge'))) {
      reasons.push("✈️ Airport lounge access included");
    }

    // Popular choice
    if (card.rating >= 4.0) {
      reasons.push(`⭐ Highly rated card (${card.rating}/5)`);
    }

    return reasons.slice(0, 3); // Return top 3 reasons
  }

  async calculateRewardSimulation(card, userPreferences) {
    const spendingHabits = userPreferences.spendingHabits || {};
    let annualReward = 0;
    const breakdown = {};

    for (const spendingCat of card.spendingCategories) {
      const monthlySpend = spendingHabits[spendingCat.category] || 0;
      const annualSpend = monthlySpend * 12;
      
      if (annualSpend > 0) {
        const rewardRate = spendingCat.cashbackRate || (spendingCat.rewardMultiplier * 0.25);
        const categoryReward = (annualSpend * rewardRate) / 100;
        
        annualReward += categoryReward;
        breakdown[spendingCat.category] = {
          spend: annualSpend,
          reward: categoryReward,
          rate: rewardRate
        };
      }
    }

    const netBenefit = annualReward - card.annualFee;

    return {
      annualReward: Math.round(annualReward),
      annualFee: card.annualFee,
      netBenefit: Math.round(netBenefit),
      breakdown
    };
  }
}

module.exports = new RecommendationEngine();