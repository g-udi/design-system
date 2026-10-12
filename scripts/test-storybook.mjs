import { spawn, execFileSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Keep every module intact, with a fresh browser for each bounded group.
export function planStoryBatches(entries) {
  const stories = Object.values(entries).filter(entry => entry.type === 'story');
  if (!stories.length) throw new Error('The Storybook catalogue contains no stories.');
  const byFile = new Map();
  const seen = new Set();
  for (const story of stories) {
    if (!story.id || !story.importPath || seen.has(story.id)) throw new Error(`Invalid or duplicate catalogue story: ${story.id}`);
    seen.add(story.id);
    const ids = byFile.get(story.importPath) || [];
    ids.push(story.id);
    byFile.set(story.importPath, ids);
  }
  const batches = [];
  let batch = { files: [], ids: [] };
  for (const [file, ids] of [...byFile].sort(([a], [b]) => a.localeCompare(b))) {
    if (batch.files.length && (batch.files.length >= 20 || batch.ids.length + ids.length > 45)) {
      batches.push(batch);
      batch = { files: [], ids: [] };
    }
    batch.files.push(file);
    batch.ids.push(...ids.sort());
  }
  if (batch.files.length) batches.push(batch);
  return batches;
}

export function reconcileStoryBatch(expectedIds, events, exitCode) {
  const tests = events.filter(event => event.event === 'test-result');
  const ends = events.filter(event => event.event === 'run-end');
  const ids = tests.map(test => test.storyId).filter(Boolean);
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
  const expected = new Set(expectedIds);
  const missing = expectedIds.filter(id => !counts.has(id));
  const unexpected = [...counts.keys()].filter(id => !expected.has(id));
  const duplicates = [...counts].filter(([, count]) => count !== 1).map(([id]) => id);
  const nonpassing = tests.filter(test => test.state !== 'passed').map(test => ({ id: test.storyId, state: test.state }));
  const unknownTests = tests.filter(test => !test.storyId).length;
  const unhandledErrors = ends.flatMap(end => end.unhandledErrors || []);
  const moduleErrors = events.filter(event => event.event === 'module-end').flatMap(event => event.errors || []);
  return {
    expected: expectedIds.length, completedIds: ids, missing, unexpected, duplicates, nonpassing, unknownTests, unhandledErrors, moduleErrors,
    successful: exitCode === 0 && ends.length === 1 && ends[0].reason === 'passed'
      && expected.size === expectedIds.length && !missing.length && !unexpected.length && !duplicates.length
      && !nonpassing.length && !unknownTests && !unhandledErrors.length && !moduleErrors.length,
  };
}

export function reconcileStoryRun(expectedIds, themes, batchCount, runs) {
  return themes.map(theme => {
    const selected = runs.filter(run => run.theme === theme);
    const completed = selected.flatMap(run => run.completedIds);
    const actual = new Set(completed);
    const missing = expectedIds.filter(id => !actual.has(id));
    const unexpected = completed.filter(id => !expectedIds.includes(id));
    const batchNumbers = new Set(selected.map(run => run.batch));
    return { theme, expected: expectedIds.length, completed: completed.length, missing, unexpected,
      successful: selected.length === batchCount && batchNumbers.size === batchCount
        && Array.from({ length: batchCount }, (_, index) => index + 1).every(number => batchNumbers.has(number))
        && selected.every(run => run.successful) && !missing.length && !unexpected.length
        && completed.length === expectedIds.length && actual.size === expectedIds.length };
  });
}

async function fingerprint() {
  const paths = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
    .split('\0').filter(Boolean).sort();
  const hash = createHash('sha256');
  for (const path of paths) {
    if (!/^(src\/|tests\/|scripts\/|\.storybook\/|vitest\.config\.js|package\.json|pnpm-lock\.yaml)/.test(path)) continue;
    try { hash.update(path).update(await readFile(path)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return hash.digest('hex');
}

async function run() {
  if (process.argv.length !== 2) throw new Error('Usage: pnpm test-storybook:run (all catalogue stories, both themes; no filters or retries)');
  const catalogue = JSON.parse(await readFile('src/docs/catalogue/catalogue.json', 'utf8'));
  const batches = planStoryBatches(catalogue.entries);
  const ids = batches.flatMap(batch => batch.ids);
  const startedAt = new Date().toISOString();
  const mode = process.env.VITE_GAUDI_AUDIT === '1' ? 'responsive' : process.env.VITE_GAUDI_VISUAL === '1' ? 'visual' : 'standard';
  const directory = resolve(process.env.GAUDI_STORYBOOK_REPORT_DIR || `.storybook/verification/${startedAt.slice(0, 10)}/storybook-${mode}-${startedAt.replace(/[:.]/g, '-')}`);
  await mkdir(directory, { recursive: true });
  const manifest = { startedAt, mode, expectedIds: ids, themes: ['light', 'dark'], batches, sourceHash: await fingerprint(), runs: [] };
  await writeFile(resolve(directory, 'manifest.json'), JSON.stringify(manifest, null, 2));
  let child;
  let interrupted = false;
  const interrupt = signal => { interrupted = true; child?.kill(signal); };
  const onInterrupt = () => interrupt('SIGINT');
  const onTerminate = () => interrupt('SIGTERM');
  process.on('SIGINT', onInterrupt);
  process.on('SIGTERM', onTerminate);
  try {
    for (const theme of manifest.themes) {
      for (const [index, batch] of batches.entries()) {
        if (interrupted) break;
        const prefix = `${theme}-${String(index + 1).padStart(2, '0')}`;
        const ledgerPath = resolve(directory, `${prefix}-ledger.jsonl`);
        const log = createWriteStream(resolve(directory, `${prefix}.log`));
        const env = { ...process.env, VITE_GAUDI_THEME: theme, GAUDI_STORY_LEDGER: ledgerPath,
          GAUDI_AUDIT_REPORT_DIR: process.env.GAUDI_AUDIT_REPORT_DIR || resolve(directory, 'reports', theme) };
        const args = ['exec', 'vitest', 'run', '--config=vitest.config.js', '--project=storybook', '--no-file-parallelism', '--retry=0', ...batch.files,
          '--reporter=default', '--reporter=json', '--reporter=./.storybook/storyLedgerReporter.js', `--outputFile.json=${resolve(directory, `${prefix}-results.json`)}`];
        console.log(`${theme}: batch ${index + 1}/${batches.length}, ${batch.ids.length} expected stories`);
        const exitCode = await new Promise((accept, reject) => {
          child = spawn('pnpm', args, { env, stdio: ['ignore', 'pipe', 'pipe'] });
          child.stdout.pipe(log, { end: false });
          child.stderr.pipe(log, { end: false });
          child.on('error', reject);
          child.on('close', accept);
        });
        child = undefined;
        await new Promise(accept => log.end(accept));
        let events = [];
        try { events = (await readFile(ledgerPath, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse); }
        catch (error) { console.error(`Cannot read ${prefix} ledger: ${error.message}`); }
        const result = { theme, batch: index + 1, exitCode, ...reconcileStoryBatch(batch.ids, events, exitCode) };
        manifest.runs.push(result);
        await writeFile(resolve(directory, 'progress.json'), JSON.stringify(manifest, null, 2));
        console.log(`${prefix}: ${result.completedIds.length}/${result.expected} completed; success=${result.successful}`);
      }
      if (interrupted) break;
    }
  } finally {
    process.off('SIGINT', onInterrupt);
    process.off('SIGTERM', onTerminate);
  }
  manifest.finalSourceHash = await fingerprint();
  manifest.sourceChanged = manifest.sourceHash !== manifest.finalSourceHash;
  manifest.coverage = reconcileStoryRun(ids, manifest.themes, batches.length, manifest.runs);
  manifest.successful = !interrupted && !manifest.sourceChanged && manifest.coverage.every(theme => theme.successful);
  manifest.completedAt = new Date().toISOString();
  await writeFile(resolve(directory, 'summary.json'), JSON.stringify(manifest, null, 2));
  console.log(`Storybook full catalogue: ${manifest.successful ? 'passed' : 'failed'}. Evidence: ${directory}`);
  if (!manifest.successful) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run();
}
