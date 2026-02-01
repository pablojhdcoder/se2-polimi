const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const pathRoutes = require('./pathRoutes');
const ratingRoutes = require('./ratingRoutes');
const tripRoutes = require('./tripRoutes');
const potholeRoutes = require('./potholeRoutes');

router.use('/auth', authRoutes);
router.use('/paths', pathRoutes);
router.use('/ratings', ratingRoutes);
router.use('/reviews', ratingRoutes); // alias: same API as ratings for frontend compatibility
router.use('/trips', tripRoutes);
router.use('/potholes', potholeRoutes);

module.exports = router;
