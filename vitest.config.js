// SUBSTITUI: vitest.config.js (raiz do projeto)
// Mudanças em relação ao original:
//   1. coverage.include agora pega *Service.js E *Controller.js
//   2. Adicionado threshold para functions (80%) além de lines
//   3. Adicionado reporter 'json' para Stryker ler

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/config/setupTests.js'],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests-e2e/**', 'src/modules/album/__tests__/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json'],
      reportsDirectory: './coverage',
      include: [
        'src/modules/photo/*Service.js',
        'src/modules/photo/*Controller.js',
        'src/modules/user/*Service.js',
        'src/modules/category/*Service.js',
        'src/modules/comment/*Service.js',
      ],
      exclude: [
        'src/modules/**/__tests__/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
      },
    },
  },
});