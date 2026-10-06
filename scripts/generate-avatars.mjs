// Writes the Storybook demo avatars (.storybook/public/avatars/person-NN.svg) from the
// deterministic generator in src/docs/fixtures/site/avatars.js. Run after changing the generator.
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAvatarSvg } from '../src/docs/fixtures/site/avatars.js';

const count = 51;
const directory = resolve(dirname(fileURLToPath(import.meta.url)), '../.storybook/public/avatars');

await mkdir(directory, { recursive: true });
for (const file of await readdir(directory)) if (/^person-\d+\.svg$/.test(file)) await rm(resolve(directory, file));
for (let index = 1; index <= count; index += 1) {
  const name = `person-${String(index).padStart(2, '0')}`;
  await writeFile(resolve(directory, `${name}.svg`), createAvatarSvg(name));
}
console.log(`Wrote ${count} avatars to ${directory}`);
