module.exports = {
  displayName: 'Tech Assignment',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  rootDir: __dirname,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage/',
};
