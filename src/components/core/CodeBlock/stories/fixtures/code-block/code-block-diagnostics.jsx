'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle
} from '@gaudi/design-system/core/CodeBlock';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
/* Each diagnostic carries the line it sits on and the replacement a fix
   applies. */
const issues = [
  {
    id: 'reduce',
    level: 'error',
    line: 3,
    before: '  const subtotal = lines.reduce((sum, amount) => sum + amount)',
    after: '  const subtotal = lines.reduce((sum, amount) => sum + amount, 0)'
  },
  {
    id: 'radix',
    level: 'warning',
    line: 4,
    before: '  const tax = parseInt(invoice.taxRate) * subtotal',
    after: '  const tax = Number(invoice.taxRate) * subtotal'
  }
];
const head = `export function totalDue(invoice: Invoice) {
  const lines = invoice.lines.map((line) => line.amount)`;
const tail = `  return subtotal + tax
}`;
export function Pattern() {
  const [fixed, setFixed] = useState([]);
  const open = issues.filter((issue) => !fixed.includes(issue.id));
  const code = [
    head,
    ...issues.map((issue) => (fixed.includes(issue.id) ? issue.after : issue.before)),
    tail
  ].join('\n');
  const levels = {};
  for (const issue of open) (levels[issue.level] ??= []).push(issue.line);
  const fix = (line) => {
    const issue = issues.find((entry) => entry.line === line);
    setFixed((current) => [...current, issue.id]);
  };
  return (
    <div className='w-full max-w-2xl'>
      <CodeBlock code={code} language='typescript' showLineNumbers lineLevels={levels}>
        <CodeBlockHeader>
          <CodeBlockTitle>invoice.ts</CodeBlockTitle>
          <div className='ml-auto flex items-center gap-1.5'>
            {open.some((issue) => issue.level === 'error') && (
              <Badge variant='destructive-light'>1 error</Badge>
            )}
            {open.some((issue) => issue.level === 'warning') && (
              <Badge variant='warning-light'>1 warning</Badge>
            )}
            {open.length === 0 && <Badge variant='success-light'>No problems</Badge>}
            {fixed.length > 0 && (
              <Button size='xs' variant='ghost' onClick={() => setFixed([])}>
                Undo
              </Button>
            )}
          </div>
        </CodeBlockHeader>

        {/* One action group is registered for the whole block and rendered in
         whichever row is active, so a long file costs a single button. It
         reads the row's state, so a fix is only offered where a diagnostic
         sits. */}
        <CodeBlockLineActions>
          {({ line, state }) =>
            state?.level === 'error' ? (
              <Button size='xs' onClick={() => fix(line)}>
                <RegistryIcon lucide='SparklesIcon' />
                Fix with AI
              </Button>
            ) : state?.level === 'warning' ? (
              <Button
                size='xs'
                variant='outline'
                className='bg-ui-background'
                onClick={() => fix(line)}
              >
                Fix line {line}
              </Button>
            ) : null
          }
        </CodeBlockLineActions>
      </CodeBlock>
    </div>
  );
}
