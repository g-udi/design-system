'use client';
import { useState } from 'react';
import {
  ansiToLines,
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockWrapToggle
} from '../../../../src/components/core/CodeBlock/parts/code-block-extended.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
/* 1. Agent stdout with SGR colour codes, parsed by ansiToLines. The colours
   retint through the --code-ansi-* variables. */
const stdout = [
  '\x1B[1m$ vitest run tests/checkout\x1B[0m',
  '',
  ' \x1B[32m\u2713\x1B[0m tests/checkout/totals.test.ts \x1B[90m(8 tests)\x1B[0m \x1B[33m41ms\x1B[0m',
  ' \x1B[32m\u2713\x1B[0m tests/checkout/coupons.test.ts \x1B[90m(5 tests)\x1B[0m \x1B[33m12ms\x1B[0m',
  ' \x1B[31m\u2717\x1B[0m tests/checkout/refunds.test.ts \x1B[90m(3 tests)\x1B[0m',
  '   \x1B[31mAssertionError\x1B[0m: expected \x1B[36m402\x1B[0m to be \x1B[36m204\x1B[0m',
  '   \x1B[90mat\x1B[0m refunds.test.ts\x1B[90m:\x1B[0m\x1B[33m18\x1B[0m',
  '',
  ' \x1B[1mTests\x1B[0m  \x1B[32m13 passed\x1B[0m \x1B[90m|\x1B[0m \x1B[31m1 failed\x1B[0m \x1B[90m(14)\x1B[0m'
].join('\n');
/* 2. Lines coloured ahead of time, the shape a server component passes
   down: no highlighter runs on the client. */
const ok = { color: 'var(--ds-color-success)', colorDark: 'var(--ds-color-success)' };
const err = { color: 'var(--ds-color-danger)', colorDark: 'var(--ds-color-danger)' };
const dim = { color: 'var(--ds-color-text-muted)', colorDark: 'var(--ds-color-text-muted)' };
const cyan = { color: 'var(--ds-color-info)', colorDark: 'var(--ds-color-info)' };
const rows = [
  [{ content: '$ ', ...dim }, { content: 'vitest run' }],
  [{ content: 'RUN ', ...cyan }, { content: 'v4.1.9 ~/acme/web', ...dim }],
  [],
  [{ content: '\u2713 ', ...ok }, { content: 'tests/checkout.test.ts ' }, { content: '(12 tests) 84ms', ...dim }],
  [{ content: '\u2717 ', ...err }, { content: 'tests/session.test.ts ' }, { content: '(1 failed) 102ms', ...dim }],
  [],
  [{ content: 'FAIL ', ...err }, { content: 'session refresh keeps the device id' }],
  [{ content: '  expected ', ...dim }, { content: '"dev_4812"', ...ok }, { content: ' to equal ', ...dim }, { content: '"dev_4811"', ...err }],
  [],
  [{ content: 'Tests ', ...dim }, { content: '1 failed', ...err }, { content: ' | ', ...dim }, { content: '21 passed', ...ok }, { content: ' (22)', ...dim }]
];
const tokenLines = rows.map((tokens, index) => ({
  number: index + 1,
  tokens,
  text: tokens.map((token) => token.content).join('')
}));
/* 3. Plain command output: highlight={false} skips the grammar. */
const build = `$ turbo build --filter @acme/web
\xB7 Packages in scope: @acme/web
\xB7 Running build in 1 package
@acme/web:build: \u25B2 Next.js 16.3.0
@acme/web:build: Creating an optimized production build ...
@acme/web:build: \u2713 Compiled successfully in 42.1s
@acme/web:build: Route (app)                                Size     First Load JS
@acme/web:build: \u250C \u25CB /                                      5.12 kB         112 kB
@acme/web:build: \u2514 \u25CB /pricing                               2.94 kB         109 kB
 Tasks:    1 successful, 1 total
 Time:     48.331s`;
const sources = {
  ansi: { label: 'ANSI', title: 'vitest', props: { lines: ansiToLines(stdout) } },
  tokens: {
    label: 'Pre-coloured',
    title: 'vitest',
    props: { lines: tokenLines },
    copy: tokenLines.map((line) => line.text).join('\n')
  },
  plain: {
    label: 'Plain',
    title: 'turbo build',
    props: { code: build, language: 'bash', highlight: false }
  }
};
export function Pattern() {
  const [source, setSource] = useState('ansi');
  const active = sources[source];
  return (
    <div className='flex w-full max-w-2xl flex-col gap-3'>
      <ToggleGroup
        aria-label='Output source'
        variant='outline'
        size='sm'
        spacing={0}
        type='single'
        value={source}
        onValueChange={(next) => setSource(next || source)}
        className='self-start'
      >
        {Object.entries(sources).map(([value, entry]) => (
          <ToggleGroupItem key={value} value={value}>
            {entry.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Forced dark, like a real terminal, in both site themes. */}
      <div className='dark'>
        <CodeBlock key={source} {...active.props} label='Terminal output'>
          <CodeBlockHeader>
            <CodeBlockTitle>{active.title}</CodeBlockTitle>
            <div className='ml-auto flex items-center gap-1.5'>
              <CodeBlockWrapToggle />
              <CodeBlockCopyButton value={active.copy} />
            </div>
          </CodeBlockHeader>
        </CodeBlock>
      </div>
    </div>
  );
}
