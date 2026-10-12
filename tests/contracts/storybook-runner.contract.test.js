import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { planStoryBatches, reconcileStoryBatch, reconcileStoryRun } from '../../scripts/test-storybook.mjs';

test('finite browser groups preserve every catalogue story and keep modules intact', async () => {
  const catalogue = JSON.parse(await readFile('src/docs/catalogue/catalogue.json', 'utf8'));
  const stories = Object.values(catalogue.entries).filter(entry => entry.type === 'story');
  const batches = planStoryBatches(catalogue.entries);
  const ids = batches.flatMap(batch => batch.ids);
  assert.deepEqual([...ids].sort(), stories.map(story => story.id).sort());
  assert.equal(new Set(ids).size, stories.length);
  for (const story of stories) {
    assert.equal(batches.filter(batch => batch.files.includes(story.importPath)).length, 1);
    assert.ok(batches.find(batch => batch.files.includes(story.importPath)).ids.includes(story.id));
  }
  assert.ok(batches.every(batch => batch.files.length <= 20 && (batch.ids.length <= 45 || batch.files.length === 1)));
  assert.throws(() => planStoryBatches({}), /no stories/);
});

const passed = id => ({ event: 'test-result', storyId: id, state: 'passed' });
const end = { event: 'run-end', reason: 'passed', unhandledErrors: [] };

test('a successful process summary cannot hide unexecuted stories or a lost transport', () => {
  const result = reconcileStoryBatch(['a', 'b'], [passed('a'), end], 0);
  assert.equal(result.successful, false);
  assert.deepEqual(result.missing, ['b']);
  assert.equal(reconcileStoryBatch(['a'], [passed('a')], 0).successful, false);
  assert.equal(reconcileStoryBatch(['a'], [passed('a'), { ...end, unhandledErrors: ['RPC closed'] }], 0).successful, false);
});

test('duplicate/retried, unexpected, skipped, unknown, and failed executions do not pass', () => {
  for (const events of [
    [passed('a'), passed('a'), end],
    [passed('a'), passed('unexpected'), end],
    [{ ...passed('a'), state: 'skipped' }, end],
    [{ ...passed('a'), state: 'failed' }, end],
    [{ event: 'test-result', state: 'passed' }, end],
    [passed('a'), { event: 'module-end', errors: ['module error'] }, end],
  ]) assert.equal(reconcileStoryBatch(['a'], events, 0).successful, false);
  assert.equal(reconcileStoryBatch(['a'], [passed('a'), end], 1).successful, false);
  assert.equal(reconcileStoryBatch(['a'], [passed('a'), end], 0).successful, true);
});

test('full run requires all batches and every story once in each theme', () => {
  const runs = ['light', 'dark'].flatMap(theme => [
    { theme, batch: 1, completedIds: ['a'], successful: true },
    { theme, batch: 2, completedIds: ['b'], successful: true },
  ]);
  const check = values => reconcileStoryRun(['a', 'b'], ['light', 'dark'], 2, values).every(theme => theme.successful);
  assert.equal(check(runs), true);
  assert.equal(check(runs.slice(0, -1)), false);
  assert.equal(check(runs.filter(run => run.theme === 'light')), false);
  assert.equal(check(runs.map(run => run.theme === 'dark' ? { ...run, batch: 1 } : run)), false);
  assert.equal(check(runs.map(run => run.theme === 'dark' ? { ...run, completedIds: ['a'] } : run)), false);
  assert.equal(check(runs.map(run => run.theme === 'dark' ? { ...run, successful: false } : run)), false);
});
