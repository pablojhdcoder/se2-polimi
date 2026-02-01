const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');
const { authenticateToken } = require('../utils/authMiddleware');

router.post('/', authenticateToken, pathController.createPath);
router.get('/', pathController.getPaths);
router.get('/nearby', pathController.getNearbyPaths);
router.get('/related', pathController.getRelatedPaths);
router.get('/saved', authenticateToken, pathController.getSavedPaths);
router.get('/mine', authenticateToken, pathController.getMyPaths);
router.patch('/:id', authenticateToken, pathController.patchPath);
router.get('/:id', pathController.getPathById);
router.post('/:id/save', authenticateToken, pathController.savePath);
router.delete('/:id/save', authenticateToken, pathController.unsavePath);

module.exports = router;
