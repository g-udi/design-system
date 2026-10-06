import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { builtinModules, createRequire } from 'node:module';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { auditWidths } from '../tests/support/responsiveWidths.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { compile } = createRequire(require.resolve('@tailwindcss/vite'))('@tailwindcss/node');
const { Scanner } = createRequire(require.resolve('@tailwindcss/vite'))('@tailwindcss/oxide');
const forbiddenFiles = /(?:^|\/)(?:stories|docs|tests|scripts|\.storybook|\.github|\.impeccable|node_modules)(?:\/|$)|\.(?:stories|contract\.test)\.|(?:^|\/)(?:AGENTS|DESIGN)\.md$/;
const privateImports = [
  'components/blocks/Navigation/MenuMobile.jsx',
  'components/core/Button/Button.jsx',
  'core/Button/Button',
  'chat/shared',
  'hooks/shared/use-now',
  'hooks/data/storage-state',
  'icons/animated/catalog/activity',
  'src/index.js',
  'package.json'
];

async function checkConsumer(directory, css) {
  cpSync(path.join(root, 'tests/fixtures/package-consumer'), directory, { recursive: true });
  writeFileSync(path.join(directory, 'app/gaudi.css'), css);
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };
  const next = require.resolve('next/dist/bin/next');
  const build = spawn(process.execPath, [next, 'build', directory], { cwd: directory, env, stdio: 'inherit', timeout: 180_000 });
  const [code, signal] = await once(build, 'exit');
  assert.equal(code, 0, `Packed consumer production build failed${signal ? ` (${signal})` : ''}`);

  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const url = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [next, 'start', directory, '-p', String(port), '-H', '127.0.0.1'], { cwd: directory, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  server.stdout.on('data', (chunk) => { output += chunk; });
  server.stderr.on('data', (chunk) => { output += chunk; });
  let browser;
  try {
    let response;
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      if (server.exitCode !== null) throw new Error(`Consumer server exited: ${output}`);
      try { response = await fetch(url); if (response.ok) break; } catch { /* The production server is starting. */ }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    assert.ok(response?.ok, `Consumer server did not start: ${output}`);
    const html = await response.text();
    for (const text of ['Server-rendered card', 'Content supplied by a server component.', 'Submit native form', 'class="katex"', '<math ', '<semantics>']) assert.ok(html.includes(text), `Missing server content: ${text}`);
    const { chromium, expect } = await import('playwright/test');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    for (const theme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: theme });
      for (const width of auditWidths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url);
        await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), theme === 'dark');
        await page.getByRole('button', { name: 'Count: 0' }).click();
        await expect(page.getByRole('button', { name: 'Count: 1' })).toBeVisible();
        const article = page.getByRole('region', { name: 'Sanitized article content' });
        await expect(article.locator('.katex')).toBeVisible();
        assert.ok(await article.locator('.katex [style]').count() > 0, 'KaTeX geometry styles were stripped in the browser');
        await expect(article.locator('math semantics')).toHaveCount(1);
        await expect(article.getByText('Blocked article link')).not.toHaveAttribute('href');
        await expect(article.getByText('Safe article label')).not.toHaveAttribute('onclick');
        await expect(article.getByText('Safe article label')).toHaveAttribute('style', 'width:2em');
        const diagram = page.getByRole('img', { name: 'Packed article diagram' });
        await expect(diagram.locator('svg')).toBeVisible({ timeout: 30_000 });
        assert.ok(await diagram.locator('svg style').count() > 0, 'Generated diagram styles were stripped');
        for (const label of ['Start', 'Done']) {
          await expect(diagram.getByText(label, { exact: true })).toBeVisible();
          await expect(diagram.locator('foreignObject').filter({ hasText: label })).toBeVisible();
        }
        const trigger = page.getByRole('button', { name: 'Open package dialog' });
        await trigger.click();
        const dialog = page.getByRole('dialog', { name: 'Package dialog' });
        await expect(dialog.getByText('Server-supplied dialog content.')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Consumer overflows at ${width}px in ${theme}`);
      }
    }
    await page.getByRole('button', { name: 'Submit native form' }).click();
    await expect(page.getByText('Native form received')).toBeVisible();
    await page.getByRole('button', { name: 'Show geographic map' }).click();
    const map = page.getByRole('region', { name: 'Packed geographic map', exact: true });
    try { await expect(map).toHaveAttribute('data-map-status', 'ready', { timeout: 30_000 }); }
    catch (error) { error.message += `\nBrowser errors: ${JSON.stringify(errors)}`; throw error; }
    await map.getByRole('button', { name: 'Packed location' }).click();
    await expect(map.getByRole('button', { name: 'Packed location' })).toHaveAttribute('aria-pressed', 'true');
    assert.deepEqual(errors, [], 'The packed consumer emitted runtime or hydration errors');
    console.log(`Production consumer verified: server components, root and leaf imports, hydration, server slots, native form, Dialog Escape/focus, sanitized KaTeX/MathML geometry, Mermaid styles/HTML labels, and blocked encoded URLs; light/dark at ${auditWidths.join(', ')}px.`);
  } finally {
    await browser?.close();
    if (server.exitCode === null) {
      server.kill('SIGTERM');
      await once(server, 'exit');
    }
  }
}

const scratch = realpathSync(mkdtempSync(path.join(tmpdir(), 'gaudi-package-')));
try {
  // Exercise npm's actual archive, including its files allowlist, rather than a source checkout.
  const [archive] = JSON.parse(execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', scratch], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  for (const { path: file } of archive.files) assert.ok(!forbiddenFiles.test(file), `Repository-only file was published: ${file}`);
  const archivePaths = new Set(archive.files.map((file) => file.path));
  for (const attribution of ['README.md', 'LICENSE', 'THIRD_PARTY_LICENSES', 'src/icons/animated/LICENSE', 'src/icons/animated/LUCIDE-LICENSE', 'src/components/chat/ChatPersona/orbs/LICENSE']) {
    assert.ok(archivePaths.has(attribution), `The package is missing bundled attribution: ${attribution}`);
  }
  const modules = path.join(scratch, 'node_modules');
  const packed = path.join(modules, '@gaudi/design-system');
  mkdirSync(packed, { recursive: true });
  execFileSync('tar', ['-xzf', path.join(scratch, archive.filename), '-C', packed, '--strip-components=1']);
  const manifest = JSON.parse(readFileSync(path.join(packed, 'package.json'), 'utf8'));
  const runtimeDependencies = { ...manifest.dependencies, ...manifest.peerDependencies };
  // Reuse installed versions without a network install. Only declared runtime packages are visible.
  for (const name of Object.keys(runtimeDependencies)) {
    const installed = path.join(root, 'node_modules', name);
    assert.ok(existsSync(installed), `Install the declared dependency before checking: ${name}`);
    const link = path.join(modules, name);
    mkdirSync(path.dirname(link), { recursive: true });
    symlinkSync(realpathSync(installed), link);
  }
  writeFileSync(path.join(scratch, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  const consumerRequire = createRequire(path.join(scratch, 'consumer.cjs'));
  const javascript = [];
  for (const [subpath, conditions] of Object.entries(manifest.exports)) {
    assert.ok(!subpath.includes('*'), `Public exports must be deliberate: ${subpath}`);
    const specifier = manifest.name + (subpath === '.' ? '' : subpath.slice(1));
    const target = typeof conditions === 'string' ? conditions : conditions.import || conditions.require || conditions.default;
    const resolved = consumerRequire.resolve(specifier);
    assert.equal(resolved, path.resolve(packed, target), `${specifier} resolves outside its declared entry`);
    assert.ok(existsSync(resolved), `${specifier} points at an unpacked file`);
    if (/\.(?:c?js|jsx)$/.test(target)) javascript.push(resolved);
  }
  for (const subpath of privateImports) {
    assert.throws(() => consumerRequire.resolve(`${manifest.name}/${subpath}`), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' }, `Private import escaped the package boundary: ${subpath}`);
  }

  // Resolve every relative import in every public JS entry, including dynamic imports and CJS presets.
  const graph = await build({
    stdin: { contents: javascript.map((file, i) => `export * as Entry${i} from ${JSON.stringify(file)};`).join('\n'), resolveDir: scratch },
    bundle: true, write: false, outfile: path.join(scratch, 'public-entries.js'),
    format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic',
    loader: { '.js': 'jsx', '.css': 'empty' }, metafile: true, logLevel: 'silent'
  });
  const externalImports = new Set(Object.values(graph.metafile.outputs).flatMap((output) => output.imports.filter((entry) => entry.external).map((entry) => entry.path)));
  for (const specifier of externalImports) {
    if (specifier.startsWith('node:') || builtinModules.includes(specifier)) continue;
    const name = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
    assert.ok(Object.hasOwn(runtimeDependencies, name), `Published source imports undeclared runtime dependency: ${specifier}`);
    consumerRequire.resolve(specifier);
  }
  for (const file of Object.keys(graph.metafile.inputs)) {
    if (file === '<stdin>') continue;
    assert.ok(path.resolve(root, file).startsWith(`${packed}${path.sep}`), `Public import escaped the packed source: ${file}`);
  }
  const visited = new Set();
  const rootEntry = Object.keys(graph.metafile.inputs).find((file) => path.resolve(root, file) === path.join(packed, 'src/index.js'));
  const visitRoot = (file) => {
    if (visited.has(file)) return;
    visited.add(file);
    for (const dependency of graph.metafile.inputs[file].imports) {
      if (dependency.external) {
        assert.ok(!/^(?:recharts|@xyflow\/react)(?:\/|$)/.test(dependency.path), `The convenience root loads an optional leaf engine: ${dependency.path} (from ${file})`);
      } else visitRoot(dependency.path);
    }
  };
  assert.ok(rootEntry, 'The public root must be part of the checked graph');
  visitRoot(rootEntry);

  const dependencies = [];
  const stylesheet = await compile(readFileSync(path.join(packed, 'src/global.css'), 'utf8'), {
    base: path.join(packed, 'src'), onDependency: (file) => dependencies.push(file)
  });
  assert.ok(stylesheet.sources.some(({ base }) => base.startsWith(packed)), 'The CSS entry must register its packed source for Tailwind scanning');
  const scanner = new Scanner({ sources: stylesheet.sources });
  const css = stylesheet.build([...scanner.scan(), 'bg-background', 'font-sans', 'bg-grid-background']);
  assert.ok(/\.bg-background\s*\{/.test(css), 'Semantic theme utilities must compile in a consumer');
  assert.ok(/\.bg-grid-background\s*\{/.test(css), 'The public stylesheet must load Gaudi grid plugins');
  assert.ok(/\.ds-motion-press/.test(css), 'Owner and foundation CSS must reach the consumer');
  assert.ok(/\.min-h-8\s*\{/.test(css), 'Tailwind must discover utilities used only by packed components');
  assert.ok(!dependencies.some((file) => file.startsWith(root) && !file.includes(`${path.sep}node_modules${path.sep}`)), 'Consumer CSS resolved a file from the source checkout');

  console.log(`Packed package verified: ${archive.files.length} files, ${Object.keys(manifest.exports).length} public entries, ${Object.keys(graph.metafile.inputs).length} reachable modules, ${externalImports.size} external imports, ${css.length} CSS bytes; private imports blocked.`);
  if (process.argv.includes('--consumer')) await checkConsumer(scratch, css);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
