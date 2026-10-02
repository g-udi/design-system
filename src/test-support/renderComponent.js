import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Bundle only package-owned modules; resolve framework peers from the package.
export async function loadComponent(url) {
  const entry = fileURLToPath(url);
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'cjs',
    external: [
      'react',
      'react/*',
      'react-dom',
      'react-dom/*',
      'next/*',
      '@radix-ui/*',
      'radix-ui',
      'sonner',
      'cmdk'
    ],
    jsx: 'automatic',
    loader: { '.js': 'jsx' },
    logLevel: 'silent'
  });
  const module = { exports: {} };
  const require = createRequire(url);
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(
    require,
    module,
    module.exports
  );
  return module.exports;
}
export async function renderComponent(url, props = {}) {
  const module = await loadComponent(url);
  return renderToStaticMarkup(createElement(module.default, props));
}
