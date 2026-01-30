const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken } = require('../utils/authMiddleware');

router.post('/', authenticateToken, ratingController.addRating);
router.delete('/:id', authenticateToken, ratingController.removeRating);

module.exports = router;
