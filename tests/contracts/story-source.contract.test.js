import assert from 'node:assert/strict';
import test from 'node:test';
import { checkStorySource } from '../../.storybook/checkStorySource.js';

test('the Storybook audit rejects copied JSX with missing data or invalid composition', async () => {
  await assert.rejects(checkStorySource(null, { id: 'missing-data', code: "import { Button } from '@gaudi/design-system';\n<Button onClick={save}>{label}</Button>" }), /save.*not defined/);
  await assert.rejects(checkStorySource(null, { id: 'adjacent-roots', code: '<div /><div />' }), /Adjacent JSX/);
  await assert.rejects(checkStorySource(null, { id: 'private-fixture', code: "import { samples } from './fixtures.js';\n<div>{samples.length}</div>" }), /private relative module/);
  await checkStorySource(null, { id: 'complete', code: "import { Button } from '@gaudi/design-system';\nexport function Example({ save, label }) { return <Button onClick={save}>{label}</Button>; }" });
  await checkStorySource(null, { id: 'mdx', language: 'mdx', code: '# Article with <Callout />' });
});
