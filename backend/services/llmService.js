const openai = require('../config/openai');

class LLMService {
  constructor() {
    this.systemPrompt = `You are a helpful credit card recommendation assistant for Indian consumers. Your role is to guide users through a personalized conversation to understand their financial needs and spending habits to recommend the best credit cards.

Guidelines:
1. Ask one question at a time to keep the conversation natural
2. Be conversational and friendly, not robotic
3. Ask about these key areas (but don't follow a rigid script):
   - Monthly income (to check eligibility)
   - Primary spending categories (fuel, travel, dining, groceries, shopping, entertainment, online)
   - Preferred benefits (cashback, travel rewards, lounge access, etc.)
   - Existing credit cards (optional)
   - Credit score range (excellent/good/fair/poor/unknown)
   - Any specific preferences or requirements

4. After gathering enough information, summarize what you've learned and indicate you're ready to provide recommendations
5. Keep responses concise (2-3 sentences max)
6. Use Indian context and terminology
7. Be encouraging and helpful

Current conversation context will be provided. Respond naturally to continue the conversation.`;
  }

  async generateResponse(conversationHistory, userPreferences = {}) {
    try {
      if (!openai) {
        // Return a fallback response when OpenAI is not available
        return this.getFallbackResponse(conversationHistory);
      }

      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 150,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating LLM response:', error);
      return this.getFallbackResponse(conversationHistory);
    }
  }

  getFallbackResponse(conversationHistory) {
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    
    // Simple fallback responses based on keywords
    const userMessage = lastMessage?.content?.toLowerCase() || '';
    
    if (userMessage.includes('income')) {
      return "Great! Now tell me about your primary spending categories. Do you spend more on fuel, dining, travel, or online shopping?";
    } else if (userMessage.includes('spending') || userMessage.includes('fuel') || userMessage.includes('dining')) {
      return "That's helpful! What kind of benefits are you looking for? Cashback, travel rewards, or lounge access?";
    } else if (userMessage.includes('benefit') || userMessage.includes('cashback') || userMessage.includes('travel')) {
      return "Perfect! Do you have any existing credit cards, and what's your approximate credit score range?";
    } else if (userMessage.includes('credit score') || userMessage.includes('card')) {
      return "Thank you for the information! I now have enough details to provide personalized credit card recommendations for you.";
    } else {
      return "Could you tell me more about your monthly income and spending habits so I can recommend the best credit cards for you?";
    }
  }

  async extractUserPreferences(conversationHistory) {
    try {
      if (!openai) {
        return this.extractPreferencesFallback(conversationHistory);
      }

      const extractionPrompt = `Analyze the following conversation and extract user preferences for credit card recommendations. Return a JSON object with the following structure:

{
  "monthlyIncome": number or null,
  "spendingHabits": {
    "fuel": number (monthly amount) or null,
    "travel": number or null,
    "groceries": number or null,
    "dining": number or null,
    "shopping": number or null,
    "entertainment": number or null,
    "online": number or null
  },
  "preferredBenefits": ["cashback", "travel", "lounge_access", etc.],
  "existingCards": ["card names"],
  "creditScore": "excellent" | "good" | "fair" | "poor" | "unknown" | null,
  "primarySpendingCategory": "fuel" | "travel" | "dining" | "groceries" | "shopping" | "entertainment" | "online" | null
}

Conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\\n')}

Extract only information that was explicitly mentioned. Use null for missing information.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: extractionPrompt }],
        max_tokens: 300,
        temperature: 0.1
      });

      const response = completion.choices[0].message.content.trim();
      
      // Try to parse the JSON response
      try {
        return JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse LLM preference extraction:', response);
        return this.extractPreferencesFallback(conversationHistory);
      }
    } catch (error) {
      console.error('Error extracting user preferences:', error);
      return this.extractPreferencesFallback(conversationHistory);
    }
  }

  extractPreferencesFallback(conversationHistory) {
    const preferences = {
      monthlyIncome: null,
      spendingHabits: {},
      preferredBenefits: [],
      existingCards: [],
      creditScore: null,
      primarySpendingCategory: null
    };

    const conversation = conversationHistory.map(msg => msg.content.toLowerCase()).join(' ');

    // Simple regex-based extraction for common patterns
    const incomeMatch = conversation.match(/(\d+)(?:000)?\s*(?:per month|monthly|income)/);
    if (incomeMatch) {
      let income = parseInt(incomeMatch[1]);
      if (income < 1000) income *= 1000; // Convert to full amount if abbreviated
      preferences.monthlyIncome = income;
    }

    // Extract spending categories
    if (conversation.includes('fuel')) preferences.primarySpendingCategory = 'fuel';
    else if (conversation.includes('travel')) preferences.primarySpendingCategory = 'travel';
    else if (conversation.includes('dining') || conversation.includes('food')) preferences.primarySpendingCategory = 'dining';
    else if (conversation.includes('online') || conversation.includes('shopping')) preferences.primarySpendingCategory = 'online';

    // Extract preferred benefits
    if (conversation.includes('cashback')) preferences.preferredBenefits.push('cashback');
    if (conversation.includes('travel')) preferences.preferredBenefits.push('travel');
    if (conversation.includes('lounge')) preferences.preferredBenefits.push('lounge_access');

    return preferences;
  }

  async generateRecommendationExplanation(card, userPreferences, score) {
    try {
      if (!openai) {
        return this.getFallbackExplanation(card, userPreferences, score);
      }

      const prompt = `Explain why this credit card is recommended for the user in 2-3 bullet points. Be specific about benefits that match their preferences.

Card: ${card.name} by ${card.issuer}
Key features: ${card.benefits.join(', ')}
Annual fee: Rs. ${card.annualFee}
Reward rate: ${card.rewardRate}% ${card.rewardType}

User preferences: ${JSON.stringify(userPreferences)}
Recommendation score: ${score}/100

Provide 2-3 concise bullet points explaining why this card fits their needs.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.5
      });

      const explanation = completion.choices[0].message.content.trim();
      return explanation.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 3);
    } catch (error) {
      console.error('Error generating recommendation explanation:', error);
      return this.getFallbackExplanation(card, userPreferences, score);
    }
  }

  getFallbackExplanation(card, userPreferences, score) {
    const explanations = [];
    
    if (card.annualFee === 0) {
      explanations.push('• No annual fee makes this card excellent value for money');
    }
    
    if (card.rewardRate >= 4) {
      explanations.push(`• High ${card.rewardType} rate of ${card.rewardRate}% on eligible spends`);
    }
    
    if (userPreferences.primarySpendingCategory) {
      const matchingCategory = card.spendingCategories?.find(cat => 
        cat.category === userPreferences.primarySpendingCategory
      );
      if (matchingCategory) {
        explanations.push(`• Great rewards on ${userPreferences.primarySpendingCategory} spending`);
      }
    }
    
    if (explanations.length === 0) {
      explanations.push('• Well-suited for your spending profile and income range');
      explanations.push('• Offers good value with competitive reward rates');
    }
    
    return explanations.slice(0, 3);
  }
}

module.exports = new LLMService();