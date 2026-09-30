// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
const code = `export function Hero({ headline, snippet }: HeroProps) {
  const seats = useSeatCount()

  return (
    <section className="dark bg-ui-background py-24">
      <h1 className="text-4xl font-semibold">{headline}</h1>
      <img src={cover} />
      <pre className="overflow-x-auto">{snippet}</pre>
      <CodeBlock code={snippet} language="tsx" showLineNumbers />
      <a onClick={goToPricing}>Start free</a>
      <p>{seats} seats claimed</p>
    </section>
  )
}`;
export function Pattern() {
  return (
    <div className='dark w-full max-w-2xl'>
      <CodeBlock
        code={code}
        language='tsx'
        showLineNumbers
        highlightedLines={[5]}
        highlightedWords={['useSeatCount']}
        diff={{ removed: [8], added: [9] }}
        lineLevels={{ error: [10], warning: [7], info: [11] }}
      >
        <CodeBlockHeader>
          <span
            aria-hidden='true'
            className='flex shrink-0 items-center gap-1.5'
          >
            <span className='size-2.5 rounded-full bg-[#ff5f57]' />
            <span className='size-2.5 rounded-full bg-[#febc2e]' />
            <span className='size-2.5 rounded-full bg-[#28c840]' />
          </span>
          <CodeBlockTitle className='ml-1'>hero.tsx</CodeBlockTitle>
          <CodeBlockCopyButton className='ml-auto' />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}
