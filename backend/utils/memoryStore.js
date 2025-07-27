// Simple in-memory store for when MongoDB is not available
class MemoryStore {
  constructor() {
    this.conversations = new Map();
    this.cards = [];
  }

  // Conversation methods
  async saveConversation(conversation) {
    this.conversations.set(conversation.sessionId, conversation);
    return conversation;
  }

  async findConversation(sessionId) {
    return this.conversations.get(sessionId) || null;
  }

  async updateConversation(sessionId, updates) {
    const conversation = this.conversations.get(sessionId);
    if (conversation) {
      Object.assign(conversation, updates);
      this.conversations.set(sessionId, conversation);
    }
    return conversation;
  }

  // Cards methods
  async getCards(query = {}) {
    return this.cards.filter(card => {
      if (query.isActive !== undefined && card.isActive !== query.isActive) return false;
      if (query.type && card.type !== query.type) return false;
      if (query.issuer && card.issuer !== query.issuer) return false;
      return true;
    });
  }

  async seedCards(cardsData) {
    this.cards = cardsData.map((card, index) => ({
      ...card,
      _id: `card_${index + 1}`,
      isActive: true
    }));
    console.log(`Seeded ${this.cards.length} cards in memory`);
  }
}

const memoryStore = new MemoryStore();

// Seed some sample cards for demo
const sampleCards = [
  {
    name: "HDFC Regalia Gold",
    issuer: "HDFC Bank",
    type: "Travel",
    annualFee: 2500,
    joiningFee: 2500,
    minIncome: 300000,
    rewards: new Map([
      ['dining', 4],
      ['travel', 4],
      ['shopping', 2],
      ['fuel', 1],
      ['default', 1]
    ]),
    features: [
      "Complimentary airport lounge access",
      "Travel insurance",
      "Fuel surcharge waiver",
      "Reward points never expire"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCreditScore: 750,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Travel", description: "Domestic lounge access", value: "8 visits/year" },
      { category: "Insurance", description: "Travel insurance", value: "Up to ₹50 lakhs" }
    ],
    imageUrl: "/images/hdfc-regalia-gold.jpg",
    rating: 4.2
  },
  {
    name: "ICICI Amazon Pay",
    issuer: "ICICI Bank",
    type: "Cashback",
    annualFee: 0,
    joiningFee: 0,
    minIncome: 300000,
    rewards: new Map([
      ['shopping', 5],
      ['amazon', 5],
      ['dining', 2],
      ['travel', 2],
      ['default', 1]
    ]),
    features: [
      "5% cashback on Amazon",
      "2% cashback on other categories",
      "No annual fee",
      "Amazon Prime membership benefits"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCreditScore: 725,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Amazon cashback", value: "5%" },
      { category: "Prime", description: "Amazon Prime benefits", value: "Free membership" }
    ],
    imageUrl: "/images/icici-amazon-pay.jpg",
    rating: 4.5
  },
  {
    name: "Axis Bank Ace",
    issuer: "Axis Bank",
    type: "Cashback",
    annualFee: 0,
    joiningFee: 0,
    minIncome: 300000,
    rewards: new Map([
      ['shopping', 5],
      ['dining', 4],
      ['travel', 2],
      ['utility', 1],
      ['default', 1]
    ]),
    features: [
      "5% cashback on shopping",
      "4% cashback on dining",
      "No annual fee",
      "Google Pay integration"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 65,
      minCreditScore: 700,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Online shopping cashback", value: "5%" },
      { category: "Dining", description: "Restaurant cashback", value: "4%" }
    ],
    imageUrl: "/images/axis-ace.jpg",
    rating: 4.3
  }
];

memoryStore.seedCards(sampleCards);

module.exports = memoryStore;