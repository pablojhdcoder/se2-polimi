const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticateToken } = require('../utils/authMiddleware');

router.post('/manual', authenticateToken, tripController.startManualTrip);
router.post('/automatic', authenticateToken, tripController.startAutomaticTrip);
router.get('/me', authenticateToken, tripController.getMyTrips);
router.get('/:id', authenticateToken, tripController.getTripById);
router.patch('/:id/route', authenticateToken, tripController.updateTrack);

module.exports = router;
