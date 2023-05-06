module.exports = {
  extends: [require('path').resolve(__dirname, '../../.eslintrc.js')],
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
