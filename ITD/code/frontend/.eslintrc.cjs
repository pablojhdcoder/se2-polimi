module.exports = {
  env: {
    browser: true,
    es2022: true,
    jest: true
  },
  globals: {
    process: 'readonly'
  },
  extends: ['eslint:recommended'],
  plugins: ['react'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/react-in-jsx-scope': 'off'
  },
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['node_modules/', 'coverage/', '*.cjs', 'babel.config.js', 'metro.config.js'],
  overrides: [
    {
      files: ['**/__mocks__/**', '**/__tests__/**'],
      env: { node: true, jest: true }
    }
  ]
};
