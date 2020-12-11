module.exports = {
  clearMocks: true,
  coverageDirectory: 'out/coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  testEnvironment: 'node',
};
