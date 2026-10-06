import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const manifest = JSON.parse(read('package.json'));
const readme = read('README.md');
const credits = readme.slice(readme.indexOf('### Credits & acknowledgements'));
const installedLicense = (name) => JSON.parse(read(`node_modules/${name}/package.json`)).license;

test('every dependency and peer dependency is in the credits inventory with its current licence', () => {
  const rows = new Map([...credits.matchAll(/^\| \[([^\]]+)\]\([^)]+\) \| ([^|]+) \|/gm)].map(([, name, license]) => [name, license.trim()]));
  for (const name of Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies })) {
    assert.ok(rows.has(name), `${name} is missing from README.md#credits--acknowledgements`);
    assert.equal(rows.get(name), installedLicense(name), `${name}: recorded licence differs from node_modules/${name}/package.json`);
  }
});

test('every development dependency is credited', () => {
  for (const name of Object.keys(manifest.devDependencies)) {
    // Storybook addons are credited together as "the a11y, docs, themes and vitest addons".
    const credited = credits.includes(`\`${name}\``) || credits.includes(`[${name}]`) || (name.startsWith('@storybook/addon-') && credits.includes(name.replace('@storybook/addon-', '')));
    assert.ok(credited, `${name} is missing from README.md#credits--acknowledgements`);
  }
});

test('adapted-code licence texts ship with the package', () => {
  assert.ok(manifest.files.includes('THIRD_PARTY_LICENSES'));
  const notices = read('THIRD_PARTY_LICENSES');
  for (const holder of ['Keenthemes', 'pqoqubbw', 'Lucide', 'Alexis Munoz', 'Jakub Antalik', 'Alexander Chen', 'Vercel', 'Sohab Sk', 'Pablo Hdez']) assert.match(notices, new RegExp(holder), holder);
  for (const file of ['src/icons/animated/LICENSE', 'src/icons/animated/LUCIDE-LICENSE', 'src/components/chat/ChatPersona/orbs/LICENSE']) {
    assert.ok(existsSync(new URL(file, root)), file);
  }
});

test('Gaudi ships its own MIT licence', () => {
  assert.equal(manifest.license, 'MIT');
  assert.ok(manifest.files.includes('LICENSE'));
  assert.match(read('LICENSE'), /^MIT License\n\nCopyright \(c\) 2026 Ahmad Assaf\n/);
  assert.match(readme, /\[MIT License\]\(LICENSE\)/);
});

test('brand logos carry the trademark notice and recorded provenance', () => {
  const trademark = /trademarks of their respective owners, used for identification only[;,] (?:and )?no endorsement (?:is )?implied/i;
  assert.match(credits, trademark);
  assert.match(read('src/icons/brands/README.md').replace(/\s+/g, ' '), /trademarks of their respective owners\. They are used for identification only, and no endorsement is implied/);
  assert.match(read('THIRD_PARTY_LICENSES'), /kept by owner decision/);
});
