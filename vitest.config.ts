import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,    // Use global test APIs like `describe`, `it`, etc.
    environment: 'node',  // Set the test environment to Node.js
    include: ['tests/**/*.test.ts'],  // Specify the test files
    coverage: {
      enabled: true,  // Enable coverage reports
      reporter: ['json-summary'],  // Generate coverage reports
      include: ['src/**/*.ts'],
      exclude: ['src/server/**/*.ts'],
      reportsDirectory: 'src/utils/reports/coverage',
    },
  },
});