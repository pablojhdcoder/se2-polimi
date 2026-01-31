const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticateToken } = require('../utils/authMiddleware');

router.post('/manual', authenticateToken, tripController.startManualTrip);
router.post('/automatic', authenticateToken, tripController.startAutomaticTrip);
router.patch('/:id/route', authenticateToken, tripController.updateTrack);

module.exports = router;
