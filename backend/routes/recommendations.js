const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendationsController');

// Get personalized recommendations
router.post('/', recommendationsController.getRecommendations);

// Get recommendations by session ID
router.get('/:sessionId', recommendationsController.getRecommendationsBySession);

module.exports = router;