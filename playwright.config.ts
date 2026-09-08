import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
  },
  projects: [
    {
      name: 'Desktop Chrome (Admin CMS & Public)',
      testMatch: /.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'Mobile Chrome (Public Campaign Pages)',
      testMatch: /public_pages\.spec\.ts/,
      use: { ...devices['Pixel 5'], viewport: { width: 375, height: 667 } },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: './backend',
      url: 'http://127.0.0.1:5000/health',
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'npm run dev',
      cwd: './frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30000,
    }
  ],
});
