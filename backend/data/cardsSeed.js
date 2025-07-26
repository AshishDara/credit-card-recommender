const Card = require('../models/Card');

const cardsSeedData = [
  {
    name: "HDFC Bank Regalia Credit Card",
    issuer: "HDFC Bank",
    category: "premium",
    joiningFee: 2500,
    annualFee: 2500,
    rewardType: "points",
    rewardRate: 4,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 750
    },
    benefits: [
      "4 reward points per Rs. 150 spent",
      "Airport lounge access",
      "Complimentary movie tickets",
      "Golf privileges"
    ],
    spendingCategories: [
      { category: "dining", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "travel", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 0 }
    ],
    specialPerks: ["Airport lounge access", "Movie ticket discounts", "Golf privileges"],
    imageUrl: "https://example.com/hdfc-regalia.jpg",
    applyLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia",
    rating: 4.2
  },
  {
    name: "SBI SimplyCLICK Credit Card",
    issuer: "State Bank of India",
    category: "cashback",
    joiningFee: 499,
    annualFee: 499,
    rewardType: "cashback",
    rewardRate: 5,
    eligibility: {
      minIncome: 200000,
      minCreditScore: 700
    },
    benefits: [
      "5% cashback on online shopping",
      "1% cashback on other purchases",
      "Fuel surcharge waiver"
    ],
    spendingCategories: [
      { category: "online", rewardMultiplier: 1, cashbackRate: 5 },
      { category: "fuel", rewardMultiplier: 1, cashbackRate: 1 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1 }
    ],
    specialPerks: ["Online shopping rewards", "Fuel surcharge waiver"],
    imageUrl: "https://example.com/sbi-simplyclick.jpg",
    applyLink: "https://www.sbi.co.in/web/personal-banking/cards/credit-cards/simplyclick",
    rating: 4.0
  },
  {
    name: "ICICI Bank Amazon Pay Credit Card",
    issuer: "ICICI Bank",
    category: "cashback",
    joiningFee: 0,
    annualFee: 0,
    rewardType: "cashback",
    rewardRate: 5,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 720
    },
    benefits: [
      "5% cashback on Amazon purchases",
      "2% cashback on bill payments",
      "1% cashback on other purchases"
    ],
    spendingCategories: [
      { category: "online", rewardMultiplier: 1, cashbackRate: 5 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1 }
    ],
    specialPerks: ["Amazon Prime benefits", "No annual fee"],
    imageUrl: "https://example.com/icici-amazon.jpg",
    applyLink: "https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay",
    rating: 4.3
  },
  {
    name: "Axis Bank Ace Credit Card",
    issuer: "Axis Bank",
    category: "cashback",
    joiningFee: 499,
    annualFee: 499,
    rewardType: "cashback",
    rewardRate: 5,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 700
    },
    benefits: [
      "5% cashback on bill payments",
      "4% cashback on Google Pay transactions",
      "2% cashback on Swiggy and Zomato"
    ],
    spendingCategories: [
      { category: "dining", rewardMultiplier: 1, cashbackRate: 2 },
      { category: "online", rewardMultiplier: 1, cashbackRate: 4 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1.5 }
    ],
    specialPerks: ["Google Pay cashback", "Food delivery rewards"],
    imageUrl: "https://example.com/axis-ace.jpg",
    applyLink: "https://www.axisbank.com/retail/cards/credit-card/ace-credit-card",
    rating: 4.1
  },
  {
    name: "HDFC Bank Millennia Credit Card",
    issuer: "HDFC Bank",
    category: "cashback",
    joiningFee: 1000,
    annualFee: 1000,
    rewardType: "cashback",
    rewardRate: 5,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 720
    },
    benefits: [
      "5% cashback on online shopping",
      "2.5% cashback on offline spends",
      "1% cashback on other purchases"
    ],
    spendingCategories: [
      { category: "online", rewardMultiplier: 1, cashbackRate: 5 },
      { category: "shopping", rewardMultiplier: 1, cashbackRate: 2.5 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1 }
    ],
    specialPerks: ["Online shopping focus", "No forex markup"],
    imageUrl: "https://example.com/hdfc-millennia.jpg",
    applyLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia",
    rating: 4.0
  },
  {
    name: "IndusInd Bank Tiger Credit Card",
    issuer: "IndusInd Bank",
    category: "fuel",
    joiningFee: 250,
    annualFee: 250,
    rewardType: "cashback",
    rewardRate: 3,
    eligibility: {
      minIncome: 200000,
      minCreditScore: 650
    },
    benefits: [
      "5% cashback on fuel purchases",
      "1% cashback on grocery",
      "1% cashback on other purchases"
    ],
    spendingCategories: [
      { category: "fuel", rewardMultiplier: 1, cashbackRate: 5 },
      { category: "groceries", rewardMultiplier: 1, cashbackRate: 1 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1 }
    ],
    specialPerks: ["Fuel rewards", "Low annual fee"],
    imageUrl: "https://example.com/indusind-tiger.jpg",
    applyLink: "https://www.indusind.com/in/en/personal/cards/credit-cards/tiger.html",
    rating: 3.8
  },
  {
    name: "Citi Rewards Credit Card",
    issuer: "Citibank",
    category: "travel",
    joiningFee: 1000,
    annualFee: 1000,
    rewardType: "points",
    rewardRate: 2,
    eligibility: {
      minIncome: 250000,
      minCreditScore: 700
    },
    benefits: [
      "2 reward points per Rs. 100 spent",
      "10X rewards on dining",
      "5X rewards on travel"
    ],
    spendingCategories: [
      { category: "dining", rewardMultiplier: 10, cashbackRate: 0 },
      { category: "travel", rewardMultiplier: 5, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 2, cashbackRate: 0 }
    ],
    specialPerks: ["Dining rewards", "Travel benefits"],
    imageUrl: "https://example.com/citi-rewards.jpg",
    applyLink: "https://www.online.citibank.co.in/products-services/credit-cards/citi-rewards",
    rating: 3.9
  },
  {
    name: "Standard Chartered Super Value Titanium Credit Card",
    issuer: "Standard Chartered",
    category: "lifestyle",
    joiningFee: 750,
    annualFee: 750,
    rewardType: "cashback",
    rewardRate: 5,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 720
    },
    benefits: [
      "5% cashback on dining and entertainment",
      "2% cashback on grocery and departmental stores",
      "1% cashback on other purchases"
    ],
    spendingCategories: [
      { category: "dining", rewardMultiplier: 1, cashbackRate: 5 },
      { category: "entertainment", rewardMultiplier: 1, cashbackRate: 5 },
      { category: "groceries", rewardMultiplier: 1, cashbackRate: 2 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1 }
    ],
    specialPerks: ["Dining & entertainment focus", "Grocery rewards"],
    imageUrl: "https://example.com/sc-super-value.jpg",
    applyLink: "https://www.sc.com/in/credit-cards/super-value-titanium/",
    rating: 3.7
  },
  {
    name: "HSBC Cashback Credit Card",
    issuer: "HSBC",
    category: "cashback",
    joiningFee: 999,
    annualFee: 999,
    rewardType: "cashback",
    rewardRate: 1.5,
    eligibility: {
      minIncome: 350000,
      minCreditScore: 720
    },
    benefits: [
      "1.5% cashback on all purchases",
      "No category restrictions",
      "No cashback capping"
    ],
    spendingCategories: [
      { category: "all", rewardMultiplier: 1, cashbackRate: 1.5 }
    ],
    specialPerks: ["Flat cashback rate", "No restrictions", "International acceptance"],
    imageUrl: "https://example.com/hsbc-cashback.jpg",
    applyLink: "https://www.hsbc.co.in/credit-cards/products/cashback/",
    rating: 3.8
  },
  {
    name: "Kotak 811 #Dream Different Credit Card",
    issuer: "Kotak Mahindra Bank",
    category: "lifestyle",
    joiningFee: 500,
    annualFee: 500,
    rewardType: "points",
    rewardRate: 4,
    eligibility: {
      minIncome: 200000,
      minCreditScore: 680
    },
    benefits: [
      "4 reward points per Rs. 150 spent",
      "1% fuel surcharge waiver",
      "BookMyShow offers"
    ],
    spendingCategories: [
      { category: "fuel", rewardMultiplier: 1, cashbackRate: 1 },
      { category: "entertainment", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 0 }
    ],
    specialPerks: ["Entertainment benefits", "Fuel surcharge waiver"],
    imageUrl: "https://example.com/kotak-811.jpg",
    applyLink: "https://www.kotak.com/en/personal-banking/cards/credit-cards/811-dreamdifferent.html",
    rating: 3.6
  },
  {
    name: "Yes Bank Prosperity Rewards Plus Credit Card",
    issuer: "Yes Bank",
    category: "premium",
    joiningFee: 2999,
    annualFee: 2999,
    rewardType: "points",
    rewardRate: 6,
    eligibility: {
      minIncome: 500000,
      minCreditScore: 750
    },
    benefits: [
      "6 reward points per Rs. 100 spent",
      "Airport lounge access",
      "Golf privileges",
      "Concierge services"
    ],
    spendingCategories: [
      { category: "travel", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "dining", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 0 }
    ],
    specialPerks: ["Premium benefits", "Lounge access", "Concierge services"],
    imageUrl: "https://example.com/yes-prosperity.jpg",
    applyLink: "https://www.yesbank.in/personal-banking/cards/credit-cards/prosperity-rewards-plus",
    rating: 4.1
  },
  {
    name: "RBL Bank Shoprite Credit Card",
    issuer: "RBL Bank",
    category: "shopping",
    joiningFee: 499,
    annualFee: 499,
    rewardType: "cashback",
    rewardRate: 3,
    eligibility: {
      minIncome: 200000,
      minCreditScore: 650
    },
    benefits: [
      "5% cashback on e-commerce",
      "2% cashback on departmental stores",
      "1% cashback on other purchases"
    ],
    spendingCategories: [
      { category: "online", rewardMultiplier: 1, cashbackRate: 5 },
      { category: "shopping", rewardMultiplier: 1, cashbackRate: 2 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1 }
    ],
    specialPerks: ["E-commerce focus", "Shopping rewards"],
    imageUrl: "https://example.com/rbl-shoprite.jpg",
    applyLink: "https://www.rblbank.com/cards/credit-cards/shoprite",
    rating: 3.5
  },
  {
    name: "American Express Membership Rewards Credit Card",
    issuer: "American Express",
    category: "premium",
    joiningFee: 4500,
    annualFee: 4500,
    rewardType: "points",
    rewardRate: 1,
    eligibility: {
      minIncome: 600000,
      minCreditScore: 780
    },
    benefits: [
      "1 Membership Reward point per Rs. 50 spent",
      "Airport lounge access",
      "Exclusive dining privileges",
      "Travel insurance"
    ],
    spendingCategories: [
      { category: "travel", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "dining", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 0 }
    ],
    specialPerks: ["Premium network", "Exclusive privileges", "Global acceptance"],
    imageUrl: "https://example.com/amex-mrcc.jpg",
    applyLink: "https://www.americanexpress.com/in/credit-cards/membership-rewards/",
    rating: 4.3
  },
  {
    name: "HDFC Bank MoneyBack Credit Card",
    issuer: "HDFC Bank",
    category: "cashback",
    joiningFee: 500,
    annualFee: 500,
    rewardType: "cashback",
    rewardRate: 2,
    eligibility: {
      minIncome: 200000,
      minCreditScore: 650
    },
    benefits: [
      "2% cashback on online spends",
      "1% cashback on other purchases",
      "Fuel surcharge waiver"
    ],
    spendingCategories: [
      { category: "online", rewardMultiplier: 1, cashbackRate: 2 },
      { category: "fuel", rewardMultiplier: 1, cashbackRate: 1 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 1 }
    ],
    specialPerks: ["Entry-level card", "Simple rewards"],
    imageUrl: "https://example.com/hdfc-moneyback.jpg",
    applyLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/moneyback",
    rating: 3.7
  },
  {
    name: "SBI Card PRIME",
    issuer: "SBI Card",
    category: "premium",
    joiningFee: 2999,
    annualFee: 2999,
    rewardType: "points",
    rewardRate: 5,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 750
    },
    benefits: [
      "5 reward points per Rs. 100 spent",
      "10X rewards on dining and movies",
      "Airport lounge access"
    ],
    spendingCategories: [
      { category: "dining", rewardMultiplier: 10, cashbackRate: 0 },
      { category: "entertainment", rewardMultiplier: 10, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 5, cashbackRate: 0 }
    ],
    specialPerks: ["High reward rate", "Lounge access", "Movie benefits"],
    imageUrl: "https://example.com/sbi-prime.jpg",
    applyLink: "https://www.sbicard.com/en/personal/credit-cards/premium/sbi-card-prime.page",
    rating: 4.0
  },
  {
    name: "ICICI Bank Coral Credit Card",
    issuer: "ICICI Bank",
    category: "lifestyle",
    joiningFee: 500,
    annualFee: 500,
    rewardType: "points",
    rewardRate: 2,
    eligibility: {
      minIncome: 200000,
      minCreditScore: 650
    },
    benefits: [
      "2 reward points per Rs. 100 spent",
      "Dining privileges",
      "Movie ticket offers"
    ],
    spendingCategories: [
      { category: "dining", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "entertainment", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 2, cashbackRate: 0 }
    ],
    specialPerks: ["Lifestyle benefits", "Entry-level premium"],
    imageUrl: "https://example.com/icici-coral.jpg",
    applyLink: "https://www.icicibank.com/personal-banking/cards/credit-card/coral",
    rating: 3.6
  },
  {
    name: "Axis Bank MY ZONE Credit Card",
    issuer: "Axis Bank",
    category: "lifestyle",
    joiningFee: 500,
    annualFee: 500,
    rewardType: "points",
    rewardRate: 4,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 700
    },
    benefits: [
      "4 EDGE reward points per Rs. 200 spent",
      "BookMyShow offers",
      "Dining discounts"
    ],
    spendingCategories: [
      { category: "entertainment", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "dining", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 1, cashbackRate: 0 }
    ],
    specialPerks: ["Entertainment focus", "Youth-oriented"],
    imageUrl: "https://example.com/axis-myzone.jpg",
    applyLink: "https://www.axisbank.com/retail/cards/credit-card/my-zone-credit-card",
    rating: 3.8
  },
  {
    name: "HDFC Bank Business MoneyBack Credit Card",
    issuer: "HDFC Bank",
    category: "cashback",
    joiningFee: 1000,
    annualFee: 1000,
    rewardType: "cashback",
    rewardRate: 2,
    eligibility: {
      minIncome: 300000,
      minCreditScore: 700
    },
    benefits: [
      "2% cashback on business spends",
      "1% cashback on other purchases",
      "Higher credit limit"
    ],
    spendingCategories: [
      { category: "all", rewardMultiplier: 1, cashbackRate: 2 }
    ],
    specialPerks: ["Business-focused", "Higher limits"],
    imageUrl: "https://example.com/hdfc-business-moneyback.jpg",
    applyLink: "https://www.hdfcbank.com/business/pay/cards/credit-cards/business-moneyback",
    rating: 3.9
  },
  {
    name: "IndusInd Bank Platinum Aura Edge Credit Card",
    issuer: "IndusInd Bank",
    category: "premium",
    joiningFee: 2500,
    annualFee: 2500,
    rewardType: "points",
    rewardRate: 3,
    eligibility: {
      minIncome: 400000,
      minCreditScore: 720
    },
    benefits: [
      "3 reward points per Rs. 100 spent",
      "Airport lounge access",
      "Golf privileges",
      "Concierge services"
    ],
    spendingCategories: [
      { category: "travel", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "fuel", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 3, cashbackRate: 0 }
    ],
    specialPerks: ["Premium benefits", "Travel perks"],
    imageUrl: "https://example.com/indusind-aura.jpg",
    applyLink: "https://www.indusind.com/in/en/personal/cards/credit-cards/platinum-aura-edge.html",
    rating: 4.0
  },
  {
    name: "Bank of Baroda PREMIER Credit Card",
    issuer: "Bank of Baroda",
    category: "travel",
    joiningFee: 1499,
    annualFee: 1499,
    rewardType: "points",
    rewardRate: 2,
    eligibility: {
      minIncome: 250000,
      minCreditScore: 680
    },
    benefits: [
      "2 reward points per Rs. 100 spent",
      "Travel insurance",
      "Airport lounge access"
    ],
    spendingCategories: [
      { category: "travel", rewardMultiplier: 3, cashbackRate: 0 },
      { category: "fuel", rewardMultiplier: 2, cashbackRate: 0 },
      { category: "all", rewardMultiplier: 2, cashbackRate: 0 }
    ],
    specialPerks: ["Travel insurance", "Government bank reliability"],
    imageUrl: "https://example.com/bob-premier.jpg",
    applyLink: "https://www.bankofbaroda.in/personal-banking/cards/credit-cards/premier",
    rating: 3.5
  }
];

const seedCards = async () => {
  try {
    await Card.deleteMany({});
    await Card.insertMany(cardsSeedData);
    console.log('Credit cards data seeded successfully');
  } catch (error) {
    console.error('Error seeding cards data:', error);
  }
};

module.exports = { cardsSeedData, seedCards };