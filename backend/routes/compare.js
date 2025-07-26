const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compareController');

// Compare cards
router.post('/', compareController.compareCards);

// Get comparison data for specific cards
router.get('/:cardIds', compareController.getComparisonData);

module.exports = router;