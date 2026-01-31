const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');
const { authenticateToken } = require('../utils/authMiddleware');

router.post('/', authenticateToken, pathController.createPath);
router.get('/', pathController.getPaths);
router.get('/:id', pathController.getPathById);
router.post('/:id/save', authenticateToken, pathController.savePath);
router.delete('/:id/save', authenticateToken, pathController.unsavePath);

module.exports = router;
