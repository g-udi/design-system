import { ESLint } from 'eslint';
import { resolve } from 'node:path';

const eslint = new ESLint({
  overrideConfig: {
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    // A copied module may export several demos while this story uses just one.
    rules: { 'no-unused-vars': 'off', 'react-hooks/exhaustive-deps': 'off' }
  }
});
const checked = new Map();

/** Validate the exact authored source shown by Docs, including dynamic args. */
export async function checkStorySource(_context, { id, code, language = 'jsx' }) {
  if (!code || !['jsx', 'js', 'javascript'].includes(language)) return;
  if (/(?:from\s+|import\s*(?:\(\s*)?)['"]\./.test(code)) {
    throw new Error(`${id}: copied Docs source imports a private relative module; include the fixture data or use a public package entry.`);
  }
  if (!checked.has(code)) {
    checked.set(code, eslint.lintText(code, { filePath: resolve('src/docs/copied-example.jsx') })
      .then(results => results.flatMap(result => result.messages)));
  }
  const messages = await checked.get(code);
  if (messages.length) {
    throw new Error(`${id}: copied Docs source is invalid\n${messages.map(message => `${message.line}:${message.column} ${message.message}`).join('\n')}`);
  }
}
