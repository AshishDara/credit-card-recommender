const mongoose = require('mongoose');
const Card = require('../models/Card');
require('dotenv').config();

const creditCards = [
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
      { category: "Insurance", description: "Travel insurance", value: "Up to ₹50 lakhs" },
      { category: "Fuel", description: "Fuel surcharge waiver", value: "1% on ₹4000/month" }
    ],
    imageUrl: "/images/hdfc-regalia-gold.jpg",
    rating: 4.2
  },
  {
    name: "SBI SimplyCLICK",
    issuer: "State Bank of India",
    type: "Shopping",
    annualFee: 499,
    joiningFee: 499,
    minIncome: 200000,
    rewards: new Map([
      ['shopping', 10],
      ['dining', 5],
      ['travel', 2],
      ['default', 1]
    ]),
    features: [
      "10X rewards on online shopping",
      "5X rewards on dining",
      "Movie ticket discounts",
      "Annual fee reversal on spending"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 65,
      minCreditScore: 700,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Online shopping rewards", value: "10X points" },
      { category: "Entertainment", description: "Movie ticket discount", value: "₹125 off" },
      { category: "Dining", description: "Restaurant rewards", value: "5X points" }
    ],
    imageUrl: "/images/sbi-simplyclick.jpg",
    rating: 3.8
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
      { category: "Prime", description: "Amazon Prime benefits", value: "Free membership" },
      { category: "Other", description: "General cashback", value: "2%" }
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
      { category: "Dining", description: "Restaurant cashback", value: "4%" },
      { category: "Utility", description: "Bill payment rewards", value: "1%" }
    ],
    imageUrl: "/images/axis-ace.jpg",
    rating: 4.3
  },
  {
    name: "HDFC Millennia",
    issuer: "HDFC Bank",
    type: "Cashback",
    annualFee: 1000,
    joiningFee: 1000,
    minIncome: 300000,
    rewards: new Map([
      ['shopping', 5],
      ['smartbuy', 10],
      ['dining', 2.5],
      ['default', 1]
    ]),
    features: [
      "5% cashback on shopping",
      "10% cashback on SmartBuy",
      "2.5% cashback on dining",
      "Annual fee waiver on spending"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCreditScore: 750,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Online shopping rewards", value: "5% cashback" },
      { category: "SmartBuy", description: "HDFC SmartBuy portal", value: "10% cashback" },
      { category: "Fee Waiver", description: "Annual fee reversal", value: "On ₹1L spend" }
    ],
    imageUrl: "/images/hdfc-millennia.jpg",
    rating: 4.1
  },
  {
    name: "IndusInd Pinnacle",
    issuer: "IndusInd Bank",
    type: "Premium",
    annualFee: 12500,
    joiningFee: 12500,
    minIncome: 1500000,
    rewards: new Map([
      ['travel', 3.5],
      ['dining', 3.5],
      ['shopping', 2],
      ['default', 1.5]
    ]),
    features: [
      "Unlimited airport lounge access",
      "Golf privileges",
      "Concierge services",
      "Travel and dining privileges"
    ],
    eligibility: {
      minAge: 25,
      maxAge: 65,
      minCreditScore: 800,
      employmentType: ["Salaried", "Self-employed", "Business"]
    },
    benefits: [
      { category: "Travel", description: "Airport lounge access", value: "Unlimited domestic & international" },
      { category: "Golf", description: "Golf course access", value: "Complimentary rounds" },
      { category: "Concierge", description: "24/7 concierge service", value: "Global assistance" }
    ],
    imageUrl: "/images/indusind-pinnacle.jpg",
    rating: 4.6
  },
  {
    name: "Flipkart Axis Bank",
    issuer: "Axis Bank",
    type: "Shopping",
    annualFee: 500,
    joiningFee: 500,
    minIncome: 300000,
    rewards: new Map([
      ['flipkart', 5],
      ['shopping', 4],
      ['travel', 2],
      ['default', 1]
    ]),
    features: [
      "5% unlimited cashback on Flipkart",
      "4% cashback on Myntra, Cleartrip",
      "No foreign transaction fee",
      "Welcome vouchers worth ₹500"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 65,
      minCreditScore: 700,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Flipkart cashback", value: "5% unlimited" },
      { category: "Partner", description: "Myntra, Cleartrip", value: "4% cashback" },
      { category: "Welcome", description: "Welcome vouchers", value: "₹500 worth" }
    ],
    imageUrl: "/images/flipkart-axis.jpg",
    rating: 4.0
  },
  {
    name: "Standard Chartered Manhattan",
    issuer: "Standard Chartered",
    type: "Rewards",
    annualFee: 1999,
    joiningFee: 1999,
    minIncome: 400000,
    rewards: new Map([
      ['dining', 5],
      ['entertainment', 5],
      ['travel', 3],
      ['shopping', 2],
      ['default', 1]
    ]),
    features: [
      "5X rewards on dining & entertainment",
      "Movie ticket offers",
      "Dining privileges",
      "Flexible reward redemption"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCreditScore: 750,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Dining", description: "Restaurant rewards", value: "5X points" },
      { category: "Entertainment", description: "Movie & events", value: "5X points" },
      { category: "Offers", description: "Dining discounts", value: "Up to 20% off" }
    ],
    imageUrl: "/images/sc-manhattan.jpg",
    rating: 3.9
  },
  {
    name: "Kotak 811 #DreamDifferent",
    issuer: "Kotak Mahindra Bank",
    type: "Cashback",
    annualFee: 500,
    joiningFee: 500,
    minIncome: 250000,
    rewards: new Map([
      ['shopping', 4],
      ['fuel', 2],
      ['utility', 1],
      ['default', 1]
    ]),
    features: [
      "4% cashback on online shopping",
      "2% cashback on fuel",
      "1% cashback on utility bills",
      "Zero forex markup"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCreditScore: 700,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Online shopping", value: "4% cashback" },
      { category: "Fuel", description: "Petrol pump transactions", value: "2% cashback" },
      { category: "Forex", description: "International transactions", value: "Zero markup" }
    ],
    imageUrl: "/images/kotak-811.jpg",
    rating: 3.7
  },
  {
    name: "HSBC Cashback",
    issuer: "HSBC Bank",
    type: "Cashback",
    annualFee: 750,
    joiningFee: 750,
    minIncome: 500000,
    rewards: new Map([
      ['shopping', 6],
      ['dining', 6],
      ['travel', 3],
      ['default', 1.5]
    ]),
    features: [
      "6% cashback on online shopping",
      "6% cashback on dining",
      "3% cashback on travel",
      "No capping on cashback"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCreditScore: 750,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Online shopping", value: "6% unlimited" },
      { category: "Dining", description: "Restaurant spend", value: "6% unlimited" },
      { category: "Travel", description: "Travel bookings", value: "3% cashback" }
    ],
    imageUrl: "/images/hsbc-cashback.jpg",
    rating: 4.4
  },
  {
    name: "Yes First Exclusive",
    issuer: "Yes Bank",
    type: "Travel",
    annualFee: 2999,
    joiningFee: 2999,
    minIncome: 600000,
    rewards: new Map([
      ['travel', 6],
      ['dining', 4],
      ['shopping', 2],
      ['default', 1]
    ]),
    features: [
      "6X rewards on travel",
      "Complimentary airport lounge access",
      "Travel insurance coverage",
      "Concierge services"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCreditScore: 750,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Travel", description: "Travel bookings", value: "6X reward points" },
      { category: "Lounge", description: "Airport lounge access", value: "6 visits/year" },
      { category: "Insurance", description: "Travel insurance", value: "Up to ₹25 lakhs" }
    ],
    imageUrl: "/images/yes-first-exclusive.jpg",
    rating: 3.8
  },
  {
    name: "RBL Bank World Safari",
    issuer: "RBL Bank",
    type: "Travel",
    annualFee: 3500,
    joiningFee: 3500,
    minIncome: 500000,
    rewards: new Map([
      ['travel', 6],
      ['fuel', 5],
      ['dining', 3],
      ['default', 1]
    ]),
    features: [
      "6X rewards on travel",
      "5X rewards on fuel",
      "Airport lounge access",
      "Travel protection benefits"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCreditScore: 750,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Travel", description: "Travel spend", value: "6X reward points" },
      { category: "Fuel", description: "Fuel stations", value: "5X reward points" },
      { category: "Lounge", description: "Domestic lounge", value: "4 visits/year" }
    ],
    imageUrl: "/images/rbl-world-safari.jpg",
    rating: 3.6
  },
  {
    name: "IDFC FIRST Wealth",
    issuer: "IDFC FIRST Bank",
    type: "Premium",
    annualFee: 10000,
    joiningFee: 10000,
    minIncome: 1000000,
    rewards: new Map([
      ['travel', 4],
      ['dining', 4],
      ['shopping', 3],
      ['default', 2]
    ]),
    features: [
      "Premium airport lounge access",
      "Golf course privileges",
      "Spa and wellness benefits",
      "Concierge services"
    ],
    eligibility: {
      minAge: 25,
      maxAge: 65,
      minCreditScore: 800,
      employmentType: ["Salaried", "Self-employed", "Business"]
    },
    benefits: [
      { category: "Lounge", description: "Airport lounge access", value: "Unlimited domestic" },
      { category: "Golf", description: "Golf privileges", value: "Complimentary rounds" },
      { category: "Spa", description: "Spa services", value: "Discounted rates" }
    ],
    imageUrl: "/images/idfc-wealth.jpg",
    rating: 4.3
  },
  {
    name: "BOB Eterna",
    issuer: "Bank of Baroda",
    type: "Rewards",
    annualFee: 2999,
    joiningFee: 2999,
    minIncome: 400000,
    rewards: new Map([
      ['dining', 4],
      ['shopping', 3],
      ['travel', 3],
      ['fuel', 2],
      ['default', 1]
    ]),
    features: [
      "4X rewards on dining",
      "3X rewards on shopping & travel",
      "Airport lounge access",
      "Fuel surcharge waiver"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCreditScore: 700,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Dining", description: "Restaurant spend", value: "4X reward points" },
      { category: "Shopping", description: "Retail purchases", value: "3X reward points" },
      { category: "Lounge", description: "Domestic lounge", value: "6 visits/year" }
    ],
    imageUrl: "/images/bob-eterna.jpg",
    rating: 3.5
  },
  {
    name: "Citi Rewards",
    issuer: "Citibank",
    type: "Rewards",
    annualFee: 1000,
    joiningFee: 1000,
    minIncome: 350000,
    rewards: new Map([
      ['dining', 10],
      ['entertainment', 10],
      ['shopping', 2],
      ['default', 1]
    ]),
    features: [
      "10X rewards on dining & entertainment",
      "No expiry on reward points",
      "Flexible redemption options",
      "Movie ticket discounts"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCreditScore: 750,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Dining", description: "Restaurant spend", value: "10X reward points" },
      { category: "Entertainment", description: "Movies, events", value: "10X reward points" },
      { category: "Flexibility", description: "Point redemption", value: "No expiry" }
    ],
    imageUrl: "/images/citi-rewards.jpg",
    rating: 4.1
  },
  {
    name: "Federal Bank Celesta",
    issuer: "Federal Bank",
    type: "Shopping",
    annualFee: 999,
    joiningFee: 999,
    minIncome: 300000,
    rewards: new Map([
      ['shopping', 8],
      ['dining', 4],
      ['travel', 2],
      ['default', 1]
    ]),
    features: [
      "8X rewards on online shopping",
      "4X rewards on dining",
      "Welcome gift vouchers",
      "Cashback on milestone achievement"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCreditScore: 700,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Online shopping", value: "8X reward points" },
      { category: "Dining", description: "Restaurant spend", value: "4X reward points" },
      { category: "Welcome", description: "Welcome vouchers", value: "₹1000 worth" }
    ],
    imageUrl: "/images/federal-celesta.jpg",
    rating: 3.7
  },
  {
    name: "AU Small Finance Zenith",
    issuer: "AU Small Finance Bank",
    type: "Cashback",
    annualFee: 399,
    joiningFee: 399,
    minIncome: 200000,
    rewards: new Map([
      ['utility', 5],
      ['shopping', 3],
      ['fuel', 2],
      ['default', 1]
    ]),
    features: [
      "5% cashback on utility bills",
      "3% cashback on shopping",
      "2% cashback on fuel",
      "Low annual fee"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 65,
      minCreditScore: 650,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Utility", description: "Bill payments", value: "5% cashback" },
      { category: "Shopping", description: "Online shopping", value: "3% cashback" },
      { category: "Fuel", description: "Petrol pumps", value: "2% cashback" }
    ],
    imageUrl: "/images/au-zenith.jpg",
    rating: 3.9
  },
  {
    name: "Punjab National Bank RuPay Select",
    issuer: "Punjab National Bank",
    type: "Fuel",
    annualFee: 500,
    joiningFee: 500,
    minIncome: 250000,
    rewards: new Map([
      ['fuel', 10],
      ['grocery', 5],
      ['utility', 2],
      ['default', 1]
    ]),
    features: [
      "10% cashback on fuel",
      "5% cashback on grocery",
      "UPI transaction rewards",
      "RuPay network benefits"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 65,
      minCreditScore: 650,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Fuel", description: "Fuel stations", value: "10% cashback" },
      { category: "Grocery", description: "Grocery stores", value: "5% cashback" },
      { category: "UPI", description: "UPI transactions", value: "Reward points" }
    ],
    imageUrl: "/images/pnb-rupay-select.jpg",
    rating: 3.4
  },
  {
    name: "Indian Bank Platinum",
    issuer: "Indian Bank",
    type: "Travel",
    annualFee: 1999,
    joiningFee: 1999,
    minIncome: 400000,
    rewards: new Map([
      ['travel', 5],
      ['dining', 3],
      ['shopping', 2],
      ['default', 1]
    ]),
    features: [
      "5X rewards on travel",
      "Airport lounge access",
      "Travel insurance",
      "Fuel surcharge waiver"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCreditScore: 700,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Travel", description: "Travel bookings", value: "5X reward points" },
      { category: "Lounge", description: "Domestic lounge", value: "4 visits/year" },
      { category: "Insurance", description: "Travel insurance", value: "Up to ₹20 lakhs" }
    ],
    imageUrl: "/images/indian-bank-platinum.jpg",
    rating: 3.6
  },
  {
    name: "Canara Bank Platinum",
    issuer: "Canara Bank",
    type: "Rewards",
    annualFee: 750,
    joiningFee: 750,
    minIncome: 300000,
    rewards: new Map([
      ['shopping', 4],
      ['dining', 3],
      ['fuel', 2],
      ['default', 1]
    ]),
    features: [
      "4X rewards on shopping",
      "3X rewards on dining",
      "Fuel surcharge waiver",
      "Easy EMI options"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCreditScore: 650,
      employmentType: ["Salaried", "Self-employed"]
    },
    benefits: [
      { category: "Shopping", description: "Retail purchases", value: "4X reward points" },
      { category: "Dining", description: "Restaurant spend", value: "3X reward points" },
      { category: "Fuel", description: "Fuel surcharge", value: "Waiver up to ₹500" }
    ],
    imageUrl: "/images/canara-platinum.jpg",
    rating: 3.3
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/credit_card_recommender');
    
    console.log('Connected to MongoDB');

    // Clear existing cards
    await Card.deleteMany({});
    console.log('Cleared existing cards');

    // Insert new cards
    const insertedCards = await Card.insertMany(creditCards);
    console.log(`Inserted ${insertedCards.length} credit cards`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { creditCards, seedDatabase };