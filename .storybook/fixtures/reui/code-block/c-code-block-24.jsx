// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const broken = `export function totalDue(invoice: Invoice) {
  const lines = invoice.lines.map((line) => line.amount)
  const subtotal = lines.reduce((sum, amount) => sum + amount)
  return subtotal + invoice.tax
}`;
const patched = `export function totalDue(invoice: Invoice) {
  const lines = invoice.lines.map((line) => line.amount)
  const subtotal = lines.reduce((sum, amount) => sum + amount, 0)
  return subtotal + invoice.tax
}`;
export function Pattern() {
  const [fixed, setFixed] = useState(false);
  return (
    <div className='w-full max-w-2xl'>
      <CodeBlock
        code={fixed ? patched : broken}
        language='typescript'
        showLineNumbers
        lineLevels={fixed ? void 0 : { error: [3] }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>invoice.ts</CodeBlockTitle>
          <div className='ml-auto flex items-center gap-1.5'>
            {fixed ? (
              <>
                <Badge variant='success-light'>Patch applied</Badge>
                <Button
                  size='xs'
                  variant='ghost'
                  onClick={() => setFixed(false)}
                >
                  Undo
                </Button>
              </>
            ) : (
              <Badge variant='destructive-light'>
                Empty array crashes reduce
              </Badge>
            )}
          </div>
        </CodeBlockHeader>

        {/*
      The action is scoped to the line that actually carries the diagnostic:
      the render prop receives that line's state, so one group serves the
      whole block and still only offers the fix where there is something to
      fix.
    */}
        <CodeBlockLineActions>
          {({ state }) =>
            state?.level === 'error' ? (
              <Button size='xs' onClick={() => setFixed(true)}>
                <RegistryIcon lucide='SparklesIcon' />
                Fix with AI
              </Button>
            ) : null
          }
        </CodeBlockLineActions>
      </CodeBlock>
    </div>
  );
}
