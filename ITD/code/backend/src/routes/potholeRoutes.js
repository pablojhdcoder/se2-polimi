const express = require('express');
const router = express.Router();
const potholeController = require('../controllers/potholeController');
const { authenticateToken } = require('../utils/authMiddleware');

router.post('/', authenticateToken, potholeController.reportPothole);
router.get('/path/:pathId', potholeController.getPotholesByPath);

module.exports = router;
