const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const { seedCards } = require('./data/cardsSeed');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database');
    
    await seedCards();
    console.log('Database seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();