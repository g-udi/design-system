import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
const before = `function total(items) {
  let sum = 0
  for (let i = 0; i < items.length; i++) {
    sum = sum + items[i].price
  }
  return sum
}`;
const after = `const total = (items) =>
  items.reduce((sum, item) => sum + item.price, 0)`;
export function Pattern() {
  return (
    <Frame className='w-full max-w-2xl'>
      <FramePanel className='p-0!'>
        <CodeBlock
          code={before}
          language='typescript'
          variant='ghost'
          showLineNumbers
        >
          <CodeBlockHeader>
            <CodeBlockTitle>Before</CodeBlockTitle>
            <CodeBlockCopyButton className='ml-auto' />
          </CodeBlockHeader>
        </CodeBlock>
      </FramePanel>
      <FramePanel className='p-0!'>
        <CodeBlock
          code={after}
          language='typescript'
          variant='ghost'
          showLineNumbers
        >
          <CodeBlockHeader>
            <CodeBlockTitle>After</CodeBlockTitle>
            <CodeBlockCopyButton className='ml-auto' />
          </CodeBlockHeader>
        </CodeBlock>
      </FramePanel>
    </Frame>
  );
}
