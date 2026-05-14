import { defineConfig, devices } from '@playwright/test';
import { env } from './tests/support/env';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['list']
  ],
  outputDir: 'test-results',
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
