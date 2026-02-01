const path = require('path');
const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix @rnmapbox/maps: Mapbox.native.js imports from ./specs/RNMBXCameraGestureObserverNativeComponent
// without extension; Metro does not resolve .ts in that path, so we resolve to the .ts file explicitly.
const rnmapboxSpecPath = path.resolve(
  __dirname,
  'node_modules/@rnmapbox/maps/lib/module/specs/RNMBXCameraGestureObserverNativeComponent.ts'
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isTargetSpec =
    moduleName.endsWith('RNMBXCameraGestureObserverNativeComponent') ||
    moduleName.endsWith('specs/RNMBXCameraGestureObserverNativeComponent');
  const fromMapbox =
    context.originModulePath && context.originModulePath.includes('@rnmapbox/maps');
  if (isTargetSpec && fromMapbox && fs.existsSync(rnmapboxSpecPath)) {
    return { type: 'sourceFile', filePath: rnmapboxSpecPath };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
