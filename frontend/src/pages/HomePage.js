import React from 'react';
import { useChat } from '../context/ChatContext';
import ChatInterface from '../components/ChatInterface';
import CardRecommendations from '../components/CardRecommendations';

const HomePage = () => {
  const { recommendations, currentStep } = useChat();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">
                💳 CreditCard AI
              </div>
              <div className="ml-4 text-sm text-gray-600">
                Your Smart Credit Card Recommendation Assistant
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Powered by AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '80vh' }}>
            <ChatInterface />
          </div>

          {/* Recommendations Panel */}
          <div className="overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {currentStep === 'recommendations_provided' && recommendations.length > 0 ? (
              <CardRecommendations recommendations={recommendations} />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to CreditCard AI
                  </h2>
                  <div className="text-gray-600 space-y-4">
                    <p>
                      I'm your personal credit card recommendation assistant. 
                      I'll help you find the perfect credit card based on your:
                    </p>
                    <div className="grid grid-cols-1 gap-3 text-left max-w-md mx-auto">
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>Income and financial profile</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>Spending habits and categories</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>Card preferences and features</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>Annual fee tolerance</span>
                      </div>
                    </div>
                    <p className="pt-4">
                      Start chatting with me to get personalized recommendations 
                      from 20+ top Indian credit cards!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Personalized Matching
            </h3>
            <p className="text-gray-600 text-sm">
              AI-powered algorithm matches you with cards based on your unique financial profile
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Recommendations
            </h3>
            <p className="text-gray-600 text-sm">
              Get top 5 credit card recommendations in seconds with detailed reasoning
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compare & Decide
            </h3>
            <p className="text-gray-600 text-sm">
              Compare multiple cards side-by-side to make the best decision for your needs
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>
              © 2024 CreditCard AI. Built with React, Node.js, and OpenAI.
            </p>
            <p className="mt-2">
              All credit card information is for educational purposes only. 
              Please verify details with respective banks before applying.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;