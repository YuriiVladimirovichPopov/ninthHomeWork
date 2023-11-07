/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  rootDir: './src',
  testEnvironment: 'node',
  testTimeout: 100000, 
  testRegex: '.e2e.test.ts$'
}
