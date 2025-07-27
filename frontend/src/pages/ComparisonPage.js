import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { compareAPI } from '../utils/api';

const ComparisonPage = () => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const cardIds = useMemo(() => location.state?.cardIds || [], [location.state?.cardIds]);

  useEffect(() => {
    if (cardIds.length < 2) {
      navigate('/');
      return;
    }

    const fetchComparison = async () => {
      try {
        setLoading(true);
        const data = await compareAPI.compareCards(cardIds);
        setComparison(data.comparison);
      } catch (err) {
        setError(err.message || 'Failed to load comparison');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [cardIds, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                ← Back
              </button>
              <div className="text-2xl font-bold gradient-text">
                💳 Card Comparison
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Comparing {comparison.cards.length} Cards
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {comparison.comparison.summary.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.category}
              </h3>
              <div className="space-y-1">
                {item.cards.map((cardName, idx) => (
                  <p key={idx} className="text-primary-600 font-medium">
                    {cardName}
                  </p>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {item.reason}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Detailed Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  {comparison.cards.map((card) => (
                    <th
                      key={card._id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{getCardTypeIcon(card.type)}</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {card.name}
                          </div>
                          <div className="text-gray-600">
                            {card.issuer}
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Basic Info */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Card Type
                  </td>
                  {comparison.cards.map((card) => (
                    <td key={`${card._id}-type`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {card.type}
                    </td>
                  ))}
                </tr>
                
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Annual Fee
                  </td>
                  {comparison.cards.map((card) => (
                    <td key={`${card._id}-annual`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {card.annualFee === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        formatCurrency(card.annualFee)
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Joining Fee
                  </td>
                  {comparison.cards.map((card) => (
                    <td key={`${card._id}-joining`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {card.joiningFee === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        formatCurrency(card.joiningFee)
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Min Income Required
                  </td>
                  {comparison.cards.map((card) => (
                    <td key={`${card._id}-income`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(card.minIncome)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rating
                  </td>
                  {comparison.cards.map((card) => (
                    <td key={`${card._id}-rating`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{card.rating}/5</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Reward Rates */}
                {Object.entries(comparison.comparison.rewards).map(([category, data]) => (
                  <tr key={category} className={category.includes('shopping') ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {category} Rewards
                    </td>
                    {comparison.cards.map((card) => {
                      const rate = card.rewards.get ? card.rewards.get(category) : 0;
                      const isBest = data.bestCards.includes(card.name);
                      return (
                        <td key={`${card._id}-${category}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={isBest ? 'font-bold text-green-600' : ''}>
                            {rate || 0}%
                          </span>
                          {isBest && <span className="ml-1">🏆</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Key Features */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Key Features
                  </td>
                  {comparison.cards.map((card) => (
                    <td key={`${card._id}-features`} className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        {card.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {feature}
                          </div>
                        ))}
                        {card.features.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{card.features.length - 3} more
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fees Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fee Comparison Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Lowest Annual Fee</h4>
              <p className="text-primary-600">
                {formatCurrency(comparison.comparison.fees.lowestAnnualFee.value)}
              </p>
              <p className="text-sm text-gray-600">
                {comparison.comparison.fees.lowestAnnualFee.cards.join(', ')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Lowest Joining Fee</h4>
              <p className="text-primary-600">
                {formatCurrency(comparison.comparison.fees.lowestJoiningFee.value)}
              </p>
              <p className="text-sm text-gray-600">
                {comparison.comparison.fees.lowestJoiningFee.cards.join(', ')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Completely Free Cards</h4>
              {comparison.comparison.fees.freeCards.length > 0 ? (
                <div>
                  <p className="text-green-600">Available</p>
                  <p className="text-sm text-gray-600">
                    {comparison.comparison.fees.freeCards.join(', ')}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">None</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComparisonPage;