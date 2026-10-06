import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../support/renderComponent.js';

const load = () => loadComponent(new URL('../../../../src/components/blocks/Forms/Forms.jsx', import.meta.url));

test('Forms validators return a message only when the value fails', async () => {
  const { validators } = await load();
  assert.equal(validators.required('Required.')(''), 'Required.');
  assert.equal(validators.required('Required.')([]), 'Required.');
  assert.equal(validators.required('Required.')('x'), '');
  assert.match(validators.email()('maya@'), /email address/);
  assert.equal(validators.email()('maya@example.com'), '');
  // Optional fields: format checks pass on empty values and leave required-ness to `required`.
  assert.equal(validators.email()(''), '');
  assert.equal(validators.minLength(3)('ab'), 'Use at least 3 characters.');
  assert.equal(validators.maxLength(3)('abcd'), 'Use 3 characters or fewer.');
  assert.equal(validators.pattern(/^\d+$/, 'Digits only.')('12a'), 'Digits only.');
  assert.equal(validators.min(25)('10'), 'Enter 25 or more.');
  assert.equal(validators.max(100)('101'), 'Enter 100 or less.');
});

test('FormErrorSummary renders nothing before a submit and links each error after one', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { FormErrorSummary } = await load();
  const form = (submitCount) => ({ submitCount, errors: { email: 'Enter your email.', name: 'Enter your name.' }, id: (name) => `f-${name}` });
  assert.equal(renderToStaticMarkup(h(FormErrorSummary, { form: form(0) })), '');
  const html = renderToStaticMarkup(h(FormErrorSummary, { form: form(1), labels: { email: 'Email' } }));
  assert.match(html, /data-slot="form-error-summary"/);
  assert.match(html, /role="alert"/);
  assert.match(html, /tabindex="-1"/i);
  assert.match(html, /Fix 2 problems to continue/);
  assert.match(html, /href="#f-email"[^>]*>Email: Enter your email\./);
  assert.match(html, /href="#f-name"[^>]*>Enter your name\./);
});

test('EditableField shows the value with a named Edit button, and CharacterCount counts down', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { EditableField, CharacterCount } = await load();
  const html = renderToStaticMarkup(h(EditableField, { label: 'Subject', value: 'Export drops a column' }));
  assert.match(html, /data-slot="editable-field"/);
  assert.match(html, /aria-label="Edit Subject"/);
  assert.match(html, /Export drops a column/);
  const empty = renderToStaticMarkup(h(EditableField, { label: 'Phone', value: '' }));
  assert.match(empty, /Not set/);
  assert.match(renderToStaticMarkup(h(CharacterCount, { value: 'hello', max: 20 })), /15 characters left/);
  assert.match(renderToStaticMarkup(h(CharacterCount, { value: 'hello world', max: 5 })), /6 over the limit/);
});

test('useFormValidation exposes field props with stable ids and no errors before interaction', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { useFormValidation, validators } = await load();
  let snapshot;
  function Probe() {
    const form = useFormValidation({ initialValues: { email: 'x' }, rules: { email: validators.email() } });
    snapshot = { field: form.field('email', { describedBy: 'hint' }), errorId: form.errorId('email'), errors: form.errors, isValid: form.isValid };
    return null;
  }
  renderToStaticMarkup(h(Probe));
  assert.equal(snapshot.field.value, 'x');
  assert.equal(snapshot.field.name, 'email');
  assert.equal(snapshot.field['aria-invalid'], undefined);
  assert.equal(snapshot.field['aria-describedby'], 'hint');
  assert.ok(snapshot.errorId.startsWith(snapshot.field.id));
  assert.deepEqual(snapshot.errors, {});
  assert.equal(snapshot.isValid, true);
});

test('validators reject whitespace and invalid numbers without stateful regex drift', async () => {
  const { validators } = await load();
  assert.equal(validators.required('Required.')('   '), 'Required.');
  assert.equal(validators.min(1)('unknown'), 'Enter 1 or more.');
  assert.equal(validators.max(10)(Infinity), 'Enter 10 or less.');
  const expression = /^ok$/g;
  expression.lastIndex = 1;
  const validate = validators.pattern(expression);
  assert.equal(validate('ok'), '');
  assert.equal(validate('ok'), '');
  assert.equal(expression.lastIndex, 1);
});
