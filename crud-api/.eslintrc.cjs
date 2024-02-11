module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['node_modules', 'build', '.env'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
  },
};
