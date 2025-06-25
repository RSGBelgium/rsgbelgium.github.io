const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    // Handle CSS Modules (if any) - adjust if you only use global CSS or Tailwind
    '\\.module\\.css$': 'identity-obj-proxy',
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // Next.js app router uses server components by default, which Jest can't handle well out of the box for rendering.
  // We might need to mock server components or use specific testing strategies for them.
  // For now, this config focuses on client components or components that can be tested in jsdom.
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
