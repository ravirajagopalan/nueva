module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^next/dynamic$': '<rootDir>/__mocks__/nextDynamic.js',
    '^next/headers$': '<rootDir>/__mocks__/nextHeaders.js',
    '^next/navigation$': '<rootDir>/__mocks__/nextNavigation.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};