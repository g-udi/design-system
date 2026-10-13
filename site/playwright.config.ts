import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT || 3410);
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } }],
  // Reuses a running server (pnpm start / pnpm dev); otherwise starts the production build.
  webServer: process.env.BASE_URL ? undefined : {
    command: `pnpm start`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    env: { PORT: String(port) }
  }
});
