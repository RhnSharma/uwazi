// eslint-disable-next-line import/no-extraneous-dependencies
const { defaults } = require('jest-config');

module.exports = {
  name: 'server',
  displayName: 'Server',
  testMatch: ['**/api/**/specs/*spec.(j|t)s?(x)', '**/shared/**/specs/*spec.(j|t)s?(x)'],
  testEnvironment: 'node',
  rootDir: '../',
  modulePathIgnorePatterns: ['<rootDir>/prod'],
  setupFilesAfterEnv: ['<rootDir>/app/setUpJestServer.js'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'd.ts'],
  moduleNameMapper: {
    '^api/(.*)': '<rootDir>/app/api/$1',
    '^shared/(.*)': '<rootDir>/app/shared/$1',
  },
};
