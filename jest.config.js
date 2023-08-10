const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',

    '!src/styles/*.js',
    '!src/pages/_app.jsx',
    '!src/**/*.test.{js,jsx}',
    '!src/utils/testUtils.js',
    '!src/pages/_document.jsx',
  ],
  testRegex: 'src.*\\.test\\.js$',
  coverageDirectory: '__tests__/coverage',
  coverageReporters: ['json', 'html'],
  coverageThreshold: {
    global: {
      lines: 90,
      branches: 80,
      functions: 90,
      statements: 90,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
