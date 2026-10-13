'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';

export interface PropRow { name: string; type: string; default?: string | null; required?: boolean; description: string; subcomponent?: boolean; passthrough?: boolean; api?: boolean }

const rowKind = (row: PropRow) => (row.subcomponent ? 'sub-component' : row.passthrough ? 'pass-through' : row.api ? 'helper' : null);

/**
 * API reference as compact rows: name, type and a required marker; each row expands to its description
 * and default. Rows are Collapsible buttons, so they work with the keyboard and stay tidy on phones.
 */
export function PropsList({ rows, label, testId }: { rows: PropRow[]; label: string; testId?: string }) {
  const [open, setOpen] = useState<number[]>([]);
  const allOpen = open.length === rows.length;
  const toggle = (index: number, next: boolean) => setOpen((current) => (next ? [...current, index] : current.filter((entry) => entry !== index)));

  return (
    <div className='not-prose my-4 overflow-hidden rounded-(--ds-radius-card) border border-border bg-background' data-testid={testId}>
      <div className='flex items-center justify-between gap-2 border-b border-border bg-surface-muted px-3 py-1.5'>
        <span className='text-sm font-medium text-text-muted'>{rows.length} {label}{rows.length === 1 ? '' : 's'}</span>
        <Button variant='ghost' tone='neutral' size='sm' onClick={() => setOpen(allOpen ? [] : rows.map((_, index) => index))} aria-label={`${allOpen ? 'Collapse' : 'Expand'} all ${label}s`}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>
      <ul className='divide-y divide-border'>
        {rows.map((row, index) => {
          const isOpen = open.includes(index);
          const hasDefault = row.default && row.default !== 'null' && row.default !== '—';
          return (
            <li key={`${row.name}-${index}`} data-prop={row.name}>
              <Collapsible open={isOpen} onOpenChange={(next: boolean) => toggle(index, next)}>
                <CollapsibleTrigger className='group flex w-full min-w-0 items-center gap-x-3 px-3 py-2.5 text-start hover:bg-surface-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ds-color-focus)'>
                  <span className='flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3'>
                    <span className='flex shrink-0 items-baseline gap-1.5'>
                      <code className='font-mono text-sm font-medium text-text'>{row.name}</code>
                      {row.required ? <span className='text-xs font-medium text-danger'>required</span> : null}
                      {rowKind(row) ? <span className='text-xs text-text-subtle'>{rowKind(row)}</span> : null}
                    </span>
                    <code className='min-w-0 max-w-full self-start truncate font-mono text-xs text-text-muted sm:self-auto'>{row.type}</code>
                  </span>
                  <Icon name='ChevronDown' decorative size='sm' className='shrink-0 text-text-subtle transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none' />
                </CollapsibleTrigger>
                <CollapsibleContent className='px-3 pb-3'>
                  <div className='flex flex-col gap-2 text-sm'>
                    {row.description ? <p className='text-text'>{row.description}</p> : null}
                    <dl className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs'>
                      <dt className='text-text-subtle'>Type</dt>
                      <dd><code className='font-mono break-words text-text-muted'>{row.type}</code></dd>
                      {row.default !== undefined ? (
                        <>
                          <dt className='text-text-subtle'>Default</dt>
                          <dd>{hasDefault ? <code className='font-mono break-words text-text-muted'>{row.default}</code> : <span className='text-text-muted'>—</span>}</dd>
                        </>
                      ) : null}
                    </dl>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
