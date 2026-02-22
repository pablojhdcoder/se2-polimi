module.exports = function(api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';
  const plugins = [];
  if (!isTest) {
    plugins.push([
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@navigation': './src/navigation',
          '@storage': './src/storage',
          '@sensors': './src/sensors',
        },
      },
    ]);
  }
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
