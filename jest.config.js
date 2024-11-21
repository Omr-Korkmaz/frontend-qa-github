module.exports = {
    preset: 'jest-preset-angular',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    },
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    transform: {
      '^.+\\.(ts|js|html)$': 'jest-preset-angular',
    },
    moduleNameMapper: {
      '@app/(.*)': '<rootDir>/src/app/$1',
      '@environments/(.*)': '<rootDir>/src/environments/$1',
    },
    collectCoverage: true,
    coverageReporters: ['html'],
    coverageDirectory: '<rootDir>/coverage/',
  };
  