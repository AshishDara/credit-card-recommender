import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CardRecommendations = ({ recommendations = [] }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const navigate = useNavigate();

  const toggleCardSelection = (cardId) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleCompareCards = () => {
    if (selectedCards.length >= 2) {
      navigate('/compare', { state: { cardIds: selectedCards } });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCardTypeIcon = (type) => {
    const icons = {
      'Travel': '✈️',
      'Cashback': '💰',
      'Rewards': '🎁',
      'Fuel': '⛽',
      'Shopping': '🛒',
      'Premium': '💎',
      'Business': '💼'
    };
    return icons[type] || '💳';
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">💳</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Recommendations Yet
        </h3>
        <p className="text-gray-600">
          Complete the conversation to get personalized credit card recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Personalized Recommendations
            </h2>
            <p className="text-gray-600">
              Based on your profile, here are the top {recommendations.length} credit cards for you
            </p>
          </div>
          {selectedCards.length >= 2 && (
            <button
              onClick={handleCompareCards}
              className="btn-primary"
            >
              Compare {selectedCards.length} Cards
            </button>
          )}
        </div>
        {selectedCards.length > 0 && selectedCards.length < 2 && (
          <p className="text-sm text-gray-500 mt-2">
            Select at least 2 cards to compare
          </p>
        )}
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={rec.card._id}
            className={`card card-hover p-6 transition-all duration-300 ${
              selectedCards.includes(rec.card._id) 
                ? 'ring-2 ring-primary-500 border-primary-500' 
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              {/* Card Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">
                    {getCardTypeIcon(rec.card.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {rec.card.name}
                    </h3>
                    <p className="text-gray-600">
                      {rec.card.issuer} • {rec.card.type}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(rec.score)}`}>
                      {rec.score}% Match
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {rec.card.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Annual Fee</p>
                    <p className="font-semibold">
                      {rec.card.annualFee === 0 ? 'Free' : formatCurrency(rec.card.annualFee)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Min Income</p>
                    <p className="font-semibold">
                      {formatCurrency(rec.card.minIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Best Rewards</p>
                    <p className="font-semibold">
                      {Math.max(...Array.from(rec.card.rewards.values()))}% back
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joining Fee</p>
                    <p className="font-semibold">
                      {rec.card.joiningFee === 0 ? 'Free' : formatCurrency(rec.card.joiningFee)}
                    </p>
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Why this card is recommended for you:
                  </h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {rec.reasoning}
                  </p>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Key Features:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.card.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {rec.card.features.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{rec.card.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Reward Rates */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Reward Rates:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Array.from(rec.card.rewards.entries()).slice(0, 4).map(([category, rate]) => (
                      <div key={category} className="text-xs">
                        <span className="text-gray-600 capitalize">{category}:</span>
                        <span className="font-medium ml-1">{rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Checkbox */}
              <div className="ml-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCards.includes(rec.card._id)}
                    onChange={() => toggleCardSelection(rec.card._id)}
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Select to compare
                  </span>
                </label>
              </div>
            </div>

            {/* Rank Badge */}
            <div className="absolute top-4 left-4">
              <div className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Next Steps
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
            Select multiple cards to compare features side-by-side
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
            Visit the bank's website to check current offers and apply
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
            Ensure you meet the eligibility criteria before applying
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CardRecommendations;