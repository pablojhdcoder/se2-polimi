const weatherService = require('../services/external/weatherService');

/**
 * GET /weather?lat=&lon=
 * Returns current weather for the given coordinates (e.g. path origin).
 * No auth required so create-path screen can fetch as soon as origin is set.
 */
const getWeather = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Valid query parameters lat and lon are required' });
    }
    const weather = await weatherService.getCurrentWeather(lat, lon);
    res.status(200).json(weather);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeather,
};
