const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.client = null;
    
    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey
      });
    } else {
      console.warn('OpenAI API key not provided. Using fallback responses.');
    }
  }

  async createChatCompletion(messages, systemPrompt = null) {
    if (!this.client) {
      return this.getFallbackResponse(messages);
    }

    try {
      const messagesWithSystem = systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;

      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messagesWithSystem,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(messages);
    }
  }

  getFallbackResponse(messages) {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    // Income inquiry
    if (lastMessage.includes('income') || messages.length <= 1) {
      return "Thank you for sharing that information! Now, could you tell me about your primary spending categories? For example, do you spend more on dining, shopping, travel, or fuel? This will help me recommend cards with the best reward rates for your lifestyle. 🍽️🛒✈️";
    }
    
    // After income info
    if (lastMessage.match(/\d+/) && lastMessage.match(/(lakh|thousand|k|crore)/i)) {
      return "Great! Now I'd like to understand your spending habits better. What are your main spending categories? Do you spend more on:\n\n🍽️ Dining & restaurants\n🛒 Online shopping\n✈️ Travel & hotels\n⛽ Fuel & transportation\n💊 Grocery & utilities\n\nThis helps me find cards with the best rewards for your lifestyle!";
    }
    
    // Spending categories response
    if (lastMessage.includes('dining') || lastMessage.includes('shopping') || lastMessage.includes('travel') || lastMessage.includes('fuel')) {
      return "Excellent! Based on your spending patterns, I can see some great opportunities for rewards. One more question - what's your preference for annual fees? Would you prefer:\n\n💰 No annual fee cards\n🏆 Low fee cards (₹500-₹2000) with good benefits\n💎 Premium cards (₹2000+) with excellent rewards\n\nThis will help me narrow down the perfect recommendations for you!";
    }
    
    // Final response
    return "Perfect! I now have enough information about your profile. Based on what you've shared about your income, spending habits, and preferences, I can provide you with personalized credit card recommendations. Click the 'Get My Credit Card Recommendations' button below to see the top cards matched specifically for your needs! ✨";
  }

  getSystemPrompt() {
    return `You are a helpful credit card recommendation assistant for Indian credit cards. 
    Your goal is to understand the user's financial profile and spending habits to recommend the best credit cards.
    
    Follow these guidelines:
    1. Ask one question at a time to gather information
    2. Be conversational and friendly
    3. Focus on: income, spending categories, preferred card type, annual fee tolerance
    4. After gathering enough information, ask if they want recommendations
    5. Keep responses concise and engaging
    6. Use emojis sparingly to make conversations friendly
    
    Information to gather:
    - Annual income
    - Primary spending categories (dining, shopping, travel, fuel, etc.)
    - Preferred card type (cashback, rewards, travel, etc.)
    - Annual fee preference
    - Age (for eligibility)
    - Current occupation
    
    Always be helpful and provide value in your responses.`;
  }

  async getConversationalResponse(messages, userProfile = {}) {
    if (!this.client) {
      return this.getFallbackResponse(messages);
    }
    const systemPrompt = this.getSystemPrompt();
    return await this.createChatCompletion(messages, systemPrompt);
  }
}

module.exports = new OpenAIService();