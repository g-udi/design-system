import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lucideIconOptimizeDeps } from './.storybook/viteOptimizeDeps.js';
import { checkStorySource } from './.storybook/checkStorySource.js';
import { captureStoryViewport, recordStoryAudit } from './.storybook/captureStoryViewport.js';

const rootDir = dirname(fileURLToPath(import.meta.url));
const lodashEsDir = resolve(rootDir, 'node_modules/lodash-es');
const auditTimeout = process.env.VITE_GAUDI_AUDIT === '1' ? 180000 : undefined;

export default defineConfig({
  server: { watch: { ignored: ['**/.storybook/verification/**'] } },
  plugins: [
    tailwindcss()
  ],
  optimizeDeps: {
    include: ['maplibre-gl', '@tanstack/react-table/static-functions', ...lucideIconOptimizeDeps]
  },
  resolve: {
    alias: [
      {
        find: /^lodash\/(.+)\.js$/,
        replacement: `${lodashEsDir}/$1.js`
      },
      {
        find: /^lodash\/(.+)$/,
        replacement: `${lodashEsDir}/$1.js`
      }
    ]
  },
  test: {
    projects: [
      {
        plugins: [
          storybookTest({
            configDir: resolve(rootDir, '.storybook'),
            storybookScript: 'pnpm storybook -- --no-open'
          })
        ],
        test: {
          name: 'storybook',
          // Overlay stories can run several full responsive/capture matrices.
          testTimeout: auditTimeout,
          hookTimeout: auditTimeout,
          browser: {
            commands: { captureStoryViewport, recordStoryAudit, checkStorySource },
            enabled: true,
            headless: true,
            instances: [
              {
                browser: 'chromium'
              }
            ],
            provider: playwright({})
          }
        }
      }
    ]
  }
});
