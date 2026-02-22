/**
 * Expo config. Used instead of app.json when present.
 * Loads EXPO_PUBLIC_* from .env (Expo loads .env automatically).
 * Mapbox plugin reads RNMAPBOX_MAPS_DOWNLOAD_TOKEN at prebuild for native SDK download.
 */
const appJson = require('./app.json');

// Plugin @rnmapbox/maps uses RNMAPBOX_MAPS_DOWNLOAD_TOKEN (fallback to EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN)
if (!process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN && process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    plugins: [
      ...appJson.expo.plugins.filter((p) => (Array.isArray(p) ? p[0] : p) !== '@rnmapbox/maps'),
      '@rnmapbox/maps',
    ],
  },
};
