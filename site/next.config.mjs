import { realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const root = path.dirname(fileURLToPath(import.meta.url));
// The design system is the parent folder (`link:..`); webpack follows the symlink to it.
const designSystem = realpathSync(path.join(root, 'node_modules/@gaudi/design-system'));
const own = (name) => realpathSync(path.join(root, 'node_modules', name));

const staticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // The dev badge otherwise appears inside every isolated example frame.
  devIndicators: false,
  transpilePackages: ['@gaudi/design-system'],
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
  basePath: basePath || undefined,
  images: { unoptimized: true },
  ...(staticExport ? {} : {
    // Storybook (a static build in public/storybook) resolves its assets relative to index.html, so
    // links go to the file itself. Storybook used to live at the domain root; old links land there too.
    async redirects() {
      return [
        { source: '/', has: [{ type: 'query', key: 'path' }], destination: '/storybook/index.html', permanent: true },
        { source: '/iframe.html', destination: '/storybook/iframe.html', permanent: true },
        { source: '/storybook', destination: '/storybook/index.html', permanent: false }
      ];
    }
  }),
  // Keep builds deterministic; lint and typecheck run as separate scripts.
  typescript: { ignoreBuildErrors: false },
  webpack(webpackConfig, { dev, isServer }) {
    // The on-disk dev cache rewrites a pack per recompile across ~500 previews and grew past 30 GB
    // in minutes; keep the dev cache in memory.
    if (dev) webpackConfig.cache = { type: 'memory' };
    // Dev otherwise copies the design system (with inline source maps) into every lazy pattern
    // preview chunk, ~46 MB each; share it in one async chunk instead.
    if (dev && !isServer) {
      webpackConfig.optimization.splitChunks = {
        chunks: 'async',
        cacheGroups: {
          default: false,
          // maxSize splits the shared code into ~4 MB parts, so a lazy feature (search, Ask AI, a
          // playground) loads only the parts it uses instead of one ~100 MB chunk.
          shared: { name: 'preview-shared', chunks: 'async', test: /node_modules|design-system/, enforce: true, reuseExistingChunk: true, maxSize: 4 * 1024 * 1024 }
        }
      };
    }
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      // One instance of the framework peers for the site and the linked package.
      next: own('next'),
      'next-themes': own('next-themes')
    };
    // Packages the linked checkout owns (its dependencies and optional peers such as recharts and
    // @xyflow/react) resolve from its node_modules, so fixtures and components share one copy.
    webpackConfig.resolve.modules = [...(webpackConfig.resolve.modules || ['node_modules']), path.join(designSystem, 'node_modules')];
    return webpackConfig;
  }
};

export default createMDX()(config);
