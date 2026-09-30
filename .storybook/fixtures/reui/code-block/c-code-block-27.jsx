// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ansiToLines,
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
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
const lines = ansiToLines(stdout);
export function Pattern() {
  return (
    <div className='dark w-full max-w-2xl'>
      <CodeBlock lines={lines} label='Test run output'>
        <CodeBlockHeader>
          <CodeBlockTitle>Terminal</CodeBlockTitle>
          <CodeBlockCopyButton className='ml-auto' />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}
