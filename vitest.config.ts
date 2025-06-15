
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/__tests__/**',
        'vitest.config.ts',
      ],
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
});
