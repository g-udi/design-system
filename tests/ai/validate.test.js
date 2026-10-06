import assert from 'node:assert/strict';
import test from 'node:test';
import { loadMetadata } from '../../cli/metadata.mjs';
import { parseImports, parseJsx, validateUsage } from '../../cli/validate.mjs';

const metadata = loadMetadata();
const rules = (result, kind = 'errors') => result[kind].map((issue) => issue.rule);

test('parses imports and brace-aware JSX attributes', () => {
  const imports = parseImports("import Button, { buttonVariants as v } from '@gaudi/design-system/core/Button';\nimport '@gaudi/design-system/global.css';");
  assert.deepEqual(imports[0].bindings, [{ imported: 'default', local: 'Button' }, { imported: 'buttonVariants', local: 'v' }]);
  assert.equal(imports[1].specifier, '@gaudi/design-system/global.css');
  const [element] = parseJsx("<Button onClick={() => a > b} variant='soft' label={'Save'} {...rest}>x</Button>");
  assert.deepEqual(element.attributes.map(({ name, literal }) => [name, literal]), [['onClick', null], ['variant', 'soft'], ['label', 'Save']]);
});

test('accepts idiomatic usage', () => {
  const result = validateUsage(metadata, `import Button from '@gaudi/design-system/core/Button';
import { Field, FieldLabel } from '@gaudi/design-system/core/Field';
import '@gaudi/design-system/global.css';
export const Save = ({ t }) => (
  <div className='flex gap-2 ps-4 text-start bg-surface text-text-muted'>
    <Button variant='solid' tone='accent' size='md' onClick={save}>{t('save')}</Button>
    <Button size='icon' aria-label={t('more')} variant='ghost' />
  </div>
);`);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.deepEqual(result.warnings, []);
});

test('rejects private paths, missing exports and invalid variant values', () => {
  const result = validateUsage(metadata, `import X from '@gaudi/design-system/src/components/core/Button/Button.jsx';
import { Dialog, NotAThing } from '@gaudi/design-system';
import Button from '@gaudi/design-system/core/Button';
<Button variant='primary'>Go</Button>`);
  assert.equal(result.valid, false);
  assert.deepEqual(rules(result).sort(), ['import-name', 'import-path', 'variant-value']);
  assert.match(result.errors.find((issue) => issue.rule === 'import-path').message, /not a public entry/);
});

test('flags undocumented props and icon buttons without names', () => {
  const result = validateUsage(metadata, "import Button from '@gaudi/design-system/core/Button';\n<Button size='icon' colour='red' />");
  assert.ok(rules(result).includes('a11y-name'));
  assert.ok(rules(result, 'warnings').includes('unknown-prop'));
});

test('flags hard-coded English in label props and English defaults', () => {
  const result = validateUsage(metadata, "import Dialog from '@gaudi/design-system/core/Dialog';\n<Dialog title='Edit profile' />");
  assert.ok(rules(result, 'warnings').includes('i18n-literal'));
  assert.ok(result.info.some((issue) => issue.rule === 'i18n-default' && /closeLabel/.test(issue.message)));
});

test('flags physical direction classes with logical replacements, raw colours and space-*', () => {
  const result = validateUsage(metadata, `<div className="ml-2 md:pr-4 -left-1 text-right rounded-tl bg-blue-500 bg-[#ff0000] space-y-2" />;
const x = cn('border-l', active && 'mr-auto');`);
  const messages = result.warnings.map((issue) => issue.message).join('\n');
  for (const [physical, logical] of [['ml-2', 'ms-2'], ['md:pr-4', 'md:pe-4'], ['-left-1', '-start-1'], ['text-right', 'text-end'], ['rounded-tl', 'rounded-ss'], ['border-l', 'border-s'], ['mr-auto', 'me-auto']]) {
    assert.ok(messages.includes(`"${physical}"`) && messages.includes(`"${logical}"`), `${physical} -> ${logical}`);
  }
  assert.ok(rules(result, 'warnings').includes('palette-color'));
  assert.ok(rules(result, 'warnings').includes('raw-color'));
  assert.ok(rules(result, 'info').includes('gap'));
});
