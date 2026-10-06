import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { Linter } from 'eslint';

const root = fileURLToPath(new URL('../../', import.meta.url));

test('DS consumers use specialized email and number editors that support caret selection', () => {
  const linter = new Linter();
  const failures = [];
  const config = {
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { choices: { rules: { specialized: {
      create(context) {
        return { JSXOpeningElement(node) {
          if (!['Input', 'FieldInput', 'InputGroupInput', 'input'].includes(node.name.name)) return;
          const type = node.attributes.find(attribute => attribute.name?.name === 'type')?.value;
          const value = type?.value ?? type?.expression?.value;
          if (value === 'email' || value === 'number') context.report({ node, message: `Use ${value === 'email' ? 'EmailInput' : 'NumberField'}; native ${value} inputs cannot expose their caret position.` });
        } };
      },
    } } } },
    rules: { 'choices/specialized': 'error' },
  };
  for (const file of readdirSync(resolve(root, 'src'), { recursive: true }).filter(file => /\.(js|jsx)$/.test(file))) {
    const messages = linter.verify(readFileSync(resolve(root, 'src', file), 'utf8'), config, { allowInlineConfig: false });
    failures.push(...messages.map(message => `${file}:${message.line}: ${message.message}`));
  }
  assert.deepEqual(failures, []);
});
