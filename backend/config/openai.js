const { OpenAI } = require('openai');

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('⚠️  OpenAI API key not found. LLM features will be disabled.');
}

module.exports = openai;