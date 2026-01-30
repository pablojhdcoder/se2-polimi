const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');
const { authenticateToken } = require('../utils/authMiddleware');

router.post('/', authenticateToken, pathController.createPath);
router.get('/', pathController.getPaths);
router.get('/:id', pathController.getPathById);

module.exports = router;
