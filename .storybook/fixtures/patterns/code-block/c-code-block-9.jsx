import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockWrapToggle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
const output = `$ turbo build --filter @acme/web
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
export function Pattern() {
  return (
    <div className='w-full max-w-2xl'>
      <CodeBlock
        code={output}
        language='bash'
        highlight={false}
        label='Build output'
      >
        <CodeBlockHeader>
          <CodeBlockTitle>Terminal</CodeBlockTitle>
          <div className='ml-auto flex items-center gap-1.5'>
            <CodeBlockWrapToggle />
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}
