// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
const source = `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`;
const lines = source.split('\n').map((text, index) => ({
  number: index + 1,
  text,
  tokens: text
    .split(/(\b(?:def|for|in|return)\b)/)
    .filter(Boolean)
    .map((content) => ({
      content,
      ...(/^(def|for|in|return)$/.test(content)
        ? { color: '#cf222e', colorDark: '#ff7b72' }
        : {})
    }))
}));
export function Pattern() {
  return (
    <div className='w-full max-w-2xl'>
      <CodeBlock lines={lines} showLineNumbers label='Python code'>
        <CodeBlockHeader>
          <CodeBlockTitle>fib.py</CodeBlockTitle>
          <div className='ml-auto flex items-center gap-1.5'>
            <span className='text-ui-muted-foreground text-xs'>
              No shiki on the client
            </span>
            <CodeBlockCopyButton value={source} />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}
