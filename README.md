# Credit Card Recommender - MERN Stack Application

A comprehensive web-based credit card recommendation system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and AI-powered conversational agents.

## Features

- 🤖 **AI-Powered Chat Interface**: OpenAI-integrated conversational agent for personalized recommendations
- 💳 **Comprehensive Card Database**: 20+ Indian credit cards with detailed information
- 🎯 **Smart Recommendations**: ML-based matching algorithm considering income, spending habits, and preferences
- 📊 **Card Comparison**: Side-by-side comparison tool for multiple cards
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ⚡ **Real-time Chat**: Socket.io integration for seamless conversations

## Tech Stack

### Backend
- **Node.js & Express.js**: RESTful API server
- **MongoDB & Mongoose**: Database and ODM
- **OpenAI API**: Conversational AI integration
- **Socket.io**: Real-time communication
- **Additional**: Helmet, CORS, Rate limiting, JWT authentication

### Frontend
- **React.js**: User interface
- **Tailwind CSS**: Styling and responsive design
- **Axios**: HTTP client
- **React Router**: Navigation
- **Framer Motion**: Animations
- **Context API**: State management

## Project Structure

```
credit-card-recommender/
├── backend/
│   ├── controllers/          # Request handlers
│   ├── models/              # Database schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helper functions and services
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   └── server.js            # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── utils/           # Helper functions
│   │   └── App.js           # Main App component
│   └── public/              # Static assets
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AshishDara/credit-card-recommender.git
   cd credit-card-recommender
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**
   
   Backend (.env):
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/credit_card_recommender
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:3000
   ```

5. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## API Endpoints

### Chat
- `POST /api/chat/start` - Initialize new conversation
- `POST /api/chat/message` - Send user message
- `GET /api/chat/:sessionId` - Get conversation history
- `POST /api/chat/:sessionId/reset` - Reset conversation

### Cards
- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get card by ID
- `GET /api/cards/search` - Search cards

### Recommendations
- `POST /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/:sessionId` - Get recommendations by session

### Comparison
- `POST /api/compare` - Compare multiple cards
- `GET /api/compare/:cardIds` - Get comparison data

## Features in Detail

### Conversational AI Agent
- Natural language processing for user input understanding
- Context-aware dialogue management
- Dynamic question flow based on user responses
- Session persistence across conversations

### Recommendation Algorithm
- Income eligibility scoring (30 points)
- Age eligibility validation (10 points)
- Card type preference matching (25 points)
- Annual fee preference (15 points)
- Spending category matching (20 points)
- Card rating bonus points

### Card Database
The system includes comprehensive data for 20+ Indian credit cards including:
- HDFC Regalia Gold, SBI SimplyCLICK, ICICI Amazon Pay
- Axis Bank Ace, IndusInd Pinnacle, Yes First Exclusive
- And many more with detailed features, rewards, and eligibility

## Development

### Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with credit card data
- `npm test` - Run tests

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the conversational AI capabilities
- Indian banks for credit card information
- React and Node.js communities for excellent documentation
- Contributors who helped shape this project

## Disclaimer

This application is for educational and informational purposes only. Credit card information may not be current or complete. Always verify details with respective banks before making financial decisions.