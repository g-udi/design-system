// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
const notationDiff = {
  line(node, line) {
    if (line === 2) node.properties.class = 'line diff remove';
    if (line === 3) node.properties.class = 'line diff add';
  }
};
const code = `export function slugify(input: string) {
  return input.toLowerCase().replace(/ /g, "-")
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
}`;
const transformers = [notationDiff];
export function Pattern() {
  return (
    <div className='w-full max-w-2xl'>
      <CodeBlock
        code={code}
        language='typescript'
        showLineNumbers
        transformers={transformers}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>slugify.ts</CodeBlockTitle>
          <CodeBlockCopyButton className='ml-auto' />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}
