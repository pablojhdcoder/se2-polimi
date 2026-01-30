const potholeRepository = require('../repositories/potholeRepository');
const crypto = require('crypto');

/**
 * Handle pothole reporting
 */
const reportPothole = async (req, res, next) => {
    try {
        const { pathId, locationX, locationY, size } = req.body;
        const pothole = {
            id: crypto.randomUUID(),
            pathId,
            locationX,
            locationY,
            detectedDate: new Date(),
            size
        };

        const result = await potholeRepository.createPothole(pothole);
        res.status(201).json({
            message: 'Pothole reported successfully',
            pothole: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get potholes for a specific path
 */
const getPotholesByPath = async (req, res, next) => {
    try {
        const { pathId } = req.params;
        const potholes = await potholeRepository.getPotholesByPathId(pathId);
        res.status(200).json(potholes);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    reportPothole,
    getPotholesByPath
};
