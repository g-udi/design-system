import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadMetadata, packageRoot } from '../../cli/metadata.mjs';
import { installSkill } from '../../cli/skills.mjs';

const metadata = loadMetadata();
const allExports = new Set(Object.values(metadata.exports).flat());

test('every component has an import that is a public entry and a generated doc page', () => {
  for (const component of metadata.components) {
    assert.ok(metadata.exports[component.import.path], `${component.id}: ${component.import.path}`);
    assert.ok(existsSync(path.join(packageRoot, component.docs)), component.docs);
  }
  const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  assert.equal(Object.keys(metadata.exports).length, Object.keys(manifest.exports).length);
});

test('llms.txt links only to files that exist', () => {
  const index = readFileSync(path.join(packageRoot, 'llms.txt'), 'utf8');
  const links = [...index.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
  assert.ok(links.length > 150);
  // External credits are absolute URLs; every relative link must resolve in the package.
  for (const link of links.filter((target) => !/^https:\/\//.test(target))) assert.ok(existsSync(path.join(packageRoot, link)), link);
});

test('the skill names only real exports', () => {
  const skill = readFileSync(path.join(packageRoot, 'skills/gaudi-design-system/SKILL.md'), 'utf8');
  assert.match(skill, /^---\nname: gaudi-design-system\ndescription: .+\n---\n/);
  const names = [...new Set([...skill.matchAll(/`([A-Z][A-Za-z]+|use[A-Z]\w+)(?=[` ])/g)].map((match) => match[1]))];
  assert.ok(names.length > 60);
  assert.deepEqual(names.filter((name) => !allExports.has(name)), []);
});

test('skills install writes each agent location and is idempotent', () => {
  const project = mkdtempSync(path.join(tmpdir(), 'gaudi-skill-'));
  try {
    const first = installSkill({ agent: 'all', dir: project });
    assert.deepEqual([...new Set(first.map((result) => result.file))].sort(), [
      '.claude/skills/gaudi-design-system/SKILL.md',
      '.claude/skills/gaudi-design-system/references/catalogue.md',
      '.cursor/rules/gaudi-design-system.mdc',
      '.github/instructions/gaudi-design-system.instructions.md',
      '.windsurf/rules/gaudi-design-system.md',
      'AGENTS.md'
    ]);
    assert.ok(first.every((result) => result.status === 'created'));
    assert.ok(installSkill({ agent: 'all', dir: project }).every((result) => result.status === 'unchanged'));
    const agents = readFileSync(path.join(project, 'AGENTS.md'), 'utf8');
    assert.equal(agents.match(/gaudi-design-system:start/g).length, 1);
    assert.throws(() => installSkill({ agent: 'emacs', dir: project }), /Unknown agent/);
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});
