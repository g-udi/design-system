// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockWrapToggle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
const code = `export const contentSecurityPolicy = "default-src 'self'; script-src 'self' 'nonce-{NONCE}' https://cdn.example.com; style-src 'self' 'nonce-{NONCE}'; img-src 'self' data: https://images.example.com; font-src 'self' data:; connect-src 'self' https://api.example.com"`;
export function Pattern() {
  const [wrap, setWrap] = useState(true);
  return (
    <div className='w-full max-w-2xl'>
      <CodeBlock
        code={code}
        language='typescript'
        wrap={wrap}
        onWrapChange={setWrap}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>security-headers.ts</CodeBlockTitle>
          <div className='ml-auto flex items-center gap-1.5'>
            <Badge variant='info-light'>{wrap ? 'Wrapped' : 'Scrolling'}</Badge>
            <CodeBlockWrapToggle size='xs' />
            <Separator orientation='vertical' className='h-4' />
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}
