// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useCodeBlockConfig
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
const code = Array.from(
  { length: 26 },
  (_, index) =>
    `export const rule${index + 120} = { id: ${index + 120}, enabled: true }`
).join('\n');
function CollapsibleArea({ children }) {
  const { expanded } = useCodeBlockConfig('CollapsibleArea');
  return (
    <ScrollArea
      className={cn(
        'rounded-[inherit]',
        /* overflow-hidden makes collapsed mean collapsed - without it the
         reader could wheel through everything under the "Show more" fade.
         The 208px cap is chosen to LAND near maxLines' 8 rows, not derived
         from it. */
        !expanded &&
          '**:data-[slot=scroll-area-viewport]:max-h-52 **:data-[slot=scroll-area-viewport]:overflow-hidden'
      )}
    >
      {children}
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
export function Pattern() {
  return (
    <div className='w-full max-w-2xl'>
      <CodeBlock
        code={code}
        language='typescript'
        showLineNumbers
        startLine={120}
        maxLines={8}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>rules.generated.ts</CodeBlockTitle>
          <CodeBlockCopyButton className='ml-auto' />
        </CodeBlockHeader>
        <CollapsibleArea>
          <CodeBlockContent />
        </CollapsibleArea>
        <CodeBlockExpandButton />
      </CodeBlock>
    </div>
  );
}
