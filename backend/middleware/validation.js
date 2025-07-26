const validateChatMessage = (req, res, next) => {
  const { sessionId, message } = req.body;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Valid session ID is required' });
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Valid message is required' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
  }

  next();
};

const validatePreferences = (req, res, next) => {
  const { preferences } = req.body;

  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ error: 'Valid preferences object is required' });
  }

  if (!preferences.monthlyIncome || typeof preferences.monthlyIncome !== 'number' || preferences.monthlyIncome <= 0) {
    return res.status(400).json({ error: 'Valid monthly income is required' });
  }

  next();
};

const validateCardIds = (req, res, next) => {
  const { cardIds } = req.body;

  if (!cardIds || !Array.isArray(cardIds)) {
    return res.status(400).json({ error: 'Card IDs array is required' });
  }

  if (cardIds.length === 0 || cardIds.length > 10) {
    return res.status(400).json({ error: 'Please provide 1-10 card IDs' });
  }

  // Check if all IDs are valid MongoDB ObjectIds
  const mongoose = require('mongoose');
  const invalidIds = cardIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
  
  if (invalidIds.length > 0) {
    return res.status(400).json({ error: 'Invalid card ID format' });
  }

  next();
};

const sanitizeInput = (req, res, next) => {
  // Basic input sanitization
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};

module.exports = {
  validateChatMessage,
  validatePreferences,
  validateCardIds,
  sanitizeInput
};