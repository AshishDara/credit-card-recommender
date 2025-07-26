# Credit Card Recommendation System

A complete MERN stack application that provides personalized credit card recommendations using AI-powered conversations and intelligent recommendation algorithms.

![Credit Card Recommender](https://github.com/user-attachments/assets/f6d60e07-3c34-4faf-bd98-266a341da129)

## 🚀 Features

### 🤖 AI-Powered Conversational Agent
- Natural language processing using OpenAI GPT
- Smart conversation flow to understand user preferences
- Fallback responses when AI service is unavailable
- Context-aware dialogue that remembers previous answers

### 📊 Intelligent Recommendation Engine
- **Multi-factor scoring algorithm** with weighted criteria:
  - Income eligibility (25% weight)
  - Spending pattern matching (30% weight)
  - Benefit alignment (20% weight)
  - Credit score compatibility (15% weight)
  - Cost-benefit analysis (10% weight)
- **Real-time reward simulations** showing annual benefits
- **Personalized explanations** for each recommendation

### 💳 Comprehensive Credit Card Database
- **20+ Indian credit cards** with detailed metadata
- Cards from major issuers: HDFC, SBI, ICICI, Axis Bank, Citibank, American Express, and more
- Complete information including fees, rewards, benefits, and eligibility criteria
- Real-time filtering and search capabilities

### 🎯 Modern User Interface
- **Responsive chat interface** with real-time messaging
- **Beautiful card recommendation displays** with visual comparisons
- **Mobile-optimized design** with gradient backgrounds
- **Interactive comparison tools** for multiple cards

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express.js** - RESTful API server
- **MongoDB** & **Mongoose** - Database and ODM
- **OpenAI API** - Conversational AI capabilities
- **Security**: Helmet, CORS, rate limiting, input validation

### Frontend
- **React** with **TypeScript** - Component-based UI
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client for API communication
- **Context API** - State management

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key (optional, fallbacks available)

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/credit_card_recommender
   
   # OpenAI (Optional - fallbacks available)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Server
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB service
   # For Ubuntu/Debian: sudo systemctl start mongod
   # For macOS: brew services start mongodb-community
   # For Windows: net start MongoDB
   
   # Seed the database with credit card data
   npm run seed
   ```

4. **Start Backend Server**
   ```bash
   npm run dev  # Development with nodemon
   # or
   npm start    # Production
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

3. **Start Frontend Server**
   ```bash
   npm start
   ```

4. **Access Application**
   ```
   Open http://localhost:3000 in your browser
   ```

## 🔧 API Documentation

### Chat Endpoints
```
POST /api/chat/start           # Start new conversation
POST /api/chat/message         # Send message
GET  /api/chat/history/:id     # Get conversation history
POST /api/chat/reset/:id       # Reset conversation
```

### Card Endpoints
```
GET  /api/cards                # Get all cards (with filters)
GET  /api/cards/:id            # Get specific card
GET  /api/cards/category/:cat  # Get cards by category
GET  /api/cards/search/:query  # Search cards
POST /api/cards/compare        # Compare multiple cards
```

### Recommendation Endpoints
```
GET  /api/recommendations/:sessionId    # Get personalized recommendations
POST /api/recommendations/manual        # Get recommendations with manual preferences
POST /api/recommendations/explain       # Get recommendation explanation
POST /api/recommendations/calculate-rewards  # Calculate reward simulation
```

## 💡 Usage Guide

### 1. Start Conversation
- Open the application in your browser
- The AI assistant will greet you and start gathering information

### 2. Provide Your Details
- **Monthly Income**: Share your approximate monthly income
- **Spending Habits**: Describe your primary spending categories (fuel, dining, travel, etc.)
- **Preferred Benefits**: Mention what you value (cashback, travel rewards, lounge access)
- **Credit Score**: Optionally provide your credit score range
- **Existing Cards**: Share any current credit cards you have

### 3. Get Recommendations
- Once enough information is gathered, click "Get Recommendations"
- View personalized card suggestions with detailed explanations
- See annual reward simulations and net benefits
- Compare multiple cards side by side

### 4. Make Informed Decisions
- Review match percentages and reasoning for each recommendation
- Understand the cost-benefit analysis
- Click "Apply Now" to visit the issuer's website

## 🎯 Recommendation Algorithm

The system uses a sophisticated multi-factor scoring algorithm:

### Scoring Factors
1. **Income Eligibility (25%)**: Ensures you meet the card's income requirements
2. **Spending Pattern Match (30%)**: Aligns card benefits with your spending habits
3. **Benefit Alignment (20%)**: Matches card perks with your preferences
4. **Credit Score Compatibility (15%)**: Considers your creditworthiness
5. **Cost-Benefit Analysis (10%)**: Evaluates annual fees vs. potential rewards

### Smart Features
- **Dynamic scoring** based on individual spending patterns
- **Reward simulations** showing estimated annual benefits
- **Fallback responses** when AI service is unavailable
- **Comprehensive explanations** for each recommendation

## 📱 Features Showcase

### Conversational Interface
- Natural language processing for user inputs
- Context-aware responses
- Progressive information gathering
- Real-time typing indicators

### Recommendation Display
- Visual card representations
- Match percentage indicators
- Detailed benefit breakdowns
- Annual reward calculations
- One-click application links

### Card Database
- 20+ premium Indian credit cards
- Complete fee and benefit information
- Real eligibility criteria
- Up-to-date card details

## 🚦 Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend && npm test

# Frontend tests (when implemented)
cd frontend && npm test
```

### Build for Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
```

## 🔒 Security Features

- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS protection** for cross-origin requests
- **Helmet.js** for security headers
- **Environment variable** protection for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ using the MERN stack and AI technology**