const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cardsController');

// Get all cards
router.get('/', cardsController.getAllCards);

// Get card by ID
router.get('/:id', cardsController.getCardById);

// Search cards
router.get('/search', cardsController.searchCards);

module.exports = router;