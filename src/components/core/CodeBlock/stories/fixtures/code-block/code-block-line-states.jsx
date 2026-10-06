'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '@gaudi/design-system/core/CodeBlock';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
const code = `export async function checkout(cart: Cart) {
  const totals = computeTotals(cart)

  const session = await payments.createSession({
    amount: totals.total,
    currency: cart.currency,
    currency: cart.currency ?? "EUR",
  })

  audit.record("checkout.started", session.id)
  return session
}`;
const states = [
  { key: 'lines', label: 'Highlighted lines' },
  { key: 'words', label: 'Highlighted words' },
  { key: 'diff', label: 'Diff' },
  { key: 'diagnostics', label: 'Diagnostics' }
];
/* Focus dims everything outside the step, for walking through a file. */
const steps = [
  { value: 'totals', label: 'Totals', lines: '2' },
  { value: 'session', label: 'Session', lines: '4-8' },
  { value: 'audit', label: 'Audit', lines: '10-11' }
];
export function Pattern() {
  const [on, setOn] = useState({
    lines: true,
    words: true,
    diff: true,
    diagnostics: true
  });
  const [step, setStep] = useState('');
  const focus = steps.find((entry) => entry.value === step);
  return (
    <div className='flex w-full max-w-2xl flex-col gap-3'>
      <div
        role='group'
        aria-label='Line states'
        className='flex flex-wrap items-center gap-x-4 gap-y-2'
      >
        {states.map((state) => (
          <Label key={state.key} className='gap-2 text-sm font-normal'>
            <Switch
              size='sm'
              checked={on[state.key]}
              onCheckedChange={(checked) =>
                setOn((current) => ({ ...current, [state.key]: checked }))
              }
            />
            {state.label}
          </Label>
        ))}
      </div>

      <CodeBlock
        code={code}
        language='typescript'
        showLineNumbers
        highlightedLines={on.lines ? '4-5' : undefined}
        highlightedWords={on.words ? ['computeTotals', 'createSession'] : undefined}
        diff={on.diff ? { removed: [6], added: [7] } : undefined}
        lineLevels={
          on.diagnostics ? { warning: [10], info: [11] } : undefined
        }
        focusedLines={focus?.lines}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>checkout.ts</CodeBlockTitle>
          {on.diagnostics && (
            <>
              <Badge variant='warning-light'>1 warning</Badge>
              <Badge variant='info-light'>1 hint</Badge>
            </>
          )}
          <div className='ml-auto flex items-center gap-2'>
            <ToggleGroup
              aria-label='Focus step'
              variant='outline'
              size='sm'
              spacing={0}
              type='single'
              value={step}
              onValueChange={setStep}
            >
              {steps.map((entry) => (
                <ToggleGroupItem key={entry.value} value={entry.value}>
                  {entry.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}
