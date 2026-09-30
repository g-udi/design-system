import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { lucideIconOptimizeDeps, mermaidOptimizeDeps, rechartsOptimizeDeps } from './viteOptimizeDeps.js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lodashEsDir = resolve(rootDir, 'node_modules/lodash-es');
const nextRuntimeConfig = resolve(rootDir, 'node_modules/next/dist/shared/lib/runtime-config.external.js');
const storybookVendorChunkTarget = 320 * 1024;
const storybookLargeChunkTarget = 480 * 1024;
const storybookDocsWarningLimit = 850;

const storybookCodeSplittingGroups = [
  {
    'maxSize': storybookLargeChunkTarget,
    'minSize': 0,
    'name': 'vendor-recharts',
    'priority': 120,
    'test': /[\\/]node_modules[\\/]recharts[\\/]/
  },
  {
    'maxSize': storybookVendorChunkTarget,
    'minSize': 0,
    'name': 'vendor-motion',
    'priority': 110,
    'test': /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/
  },
  {
    'maxSize': storybookLargeChunkTarget,
    'minSize': 0,
    'name': 'vendor-a11y',
    'priority': 100,
    'test': /[\\/]node_modules[\\/](@axe-core|axe-core)[\\/]/
  },
  {
    'maxSize': storybookVendorChunkTarget,
    'minSize': 0,
    'name': 'vendor-icons',
    'priority': 90,
    'test': /[\\/]node_modules[\\/]lucide-react[\\/]/
  },
  /*
   * The Storybook runtime carries module state (e.g. the storybook/test
   * focus accessor installed behind a module-scoped guard), so it must not
   * be duplicated into per-entry chunk variants: `entriesAware` produced
   * several copies of the same modules, and a second copy's init read the
   * first copy's accessor with `this === HTMLElement.prototype`, throwing
   * "Illegal invocation". Plain size-based splitting keeps every module in
   * exactly one shared chunk.
   */
  {
    'maxSize': storybookVendorChunkTarget,
    'minSize': 0,
    'name': 'vendor-storybook',
    'priority': 70,
    'test': /[\\/]node_modules[\\/](@storybook|storybook)[\\/]/
  }
];

const mergeCodeSplitting = (codeSplitting) => {
  if (codeSplitting === false) return false;

  const options = typeof codeSplitting === 'object' ? codeSplitting : {};

  return {
    ...options,
    'groups': [
      ...storybookCodeSplittingGroups,
      ...(options.groups || [])
    ]
  };
};

const config = {
  'addons': [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes'
  ],
  'docs': {
    'autodocs': 'tag'
  },
  'features': {
    'changeDetection': false
  },
  'framework': {
    'name': '@storybook/nextjs-vite',
    'options': {}
  },
  'staticDirs': [ './public' ],
  'stories': [
    './stories/**/*.stories.@(js|jsx|mdx)',
    '../src/components/**/!(*Patterns).stories.@(js|jsx|mdx)',
    '../src/components/**/*Patterns.stories.@(js|jsx|mdx)'
  ],
  'viteFinal': (viteConfig) => {
    const { rollupOptions = {}, ...buildConfig } = viteConfig.build || {};
    const frameworkAliases = Array.isArray(viteConfig.resolve?.alias)
      ? viteConfig.resolve.alias
      : Object.entries(viteConfig.resolve?.alias || {}).map(([ find, replacement ]) => ({ find, replacement }));
    const rolldownOutput = buildConfig.rolldownOptions?.output || {};
    const rollupOutput = rollupOptions.output || {};
    const output = {
      ...rollupOutput,
      ...rolldownOutput,
      'codeSplitting': mergeCodeSplitting(rolldownOutput.codeSplitting || rollupOutput.codeSplitting)
    };

    return {
      ...viteConfig,
      'build': {
        ...buildConfig,
        'chunkSizeWarningLimit': Math.max(buildConfig.chunkSizeWarningLimit || 0, storybookDocsWarningLimit),
        'rolldownOptions': {
          ...buildConfig.rolldownOptions,
          'output': output
        }
      },
      'optimizeDeps': {
        ...viteConfig.optimizeDeps,
        'include': [
          ...(viteConfig.optimizeDeps?.include || []),
          'storybook/internal/components',
          '@radix-ui/react-accordion',
          ...lucideIconOptimizeDeps,
          ...mermaidOptimizeDeps,
          ...rechartsOptimizeDeps
        ],
        'rolldownOptions': {
          ...viteConfig.optimizeDeps?.rolldownOptions,
          'moduleTypes': {
            ...viteConfig.optimizeDeps?.rolldownOptions?.moduleTypes,
            '.js': 'jsx'
          },
          'transform': {
            ...viteConfig.optimizeDeps?.rolldownOptions?.transform,
            'jsx': 'react-jsx'
          }
        }
      },
      'plugins': [
        ...(viteConfig.plugins || []),
        tailwindcss()
      ],
      'resolve': {
        ...viteConfig.resolve,
        'alias': [
          {
            'find': /^next\/config$/,
            'replacement': nextRuntimeConfig
          },
          {
            'find': /^lodash\/(.+)\.js$/,
            'replacement': `${lodashEsDir}/$1.js`
          },
          {
            'find': /^lodash\/(.+)$/,
            'replacement': `${lodashEsDir}/$1.js`
          },
          ...frameworkAliases
        ]
      }
    };
  }
};

export default config;
