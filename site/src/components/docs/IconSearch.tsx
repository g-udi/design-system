'use client';

import { useDeferredValue, useState } from 'react';
import Icon from '@gaudi/design-system/core/Icon';
import Input from '@gaudi/design-system/core/Input';

/** Every registry icon, filterable; names are what `<Icon name='…' />` accepts. */
export function IconSearch({ names }: { names: string[] }) {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const visible = deferred ? names.filter((name) => name.toLowerCase().includes(deferred)) : names;
  return (
    <div className='not-prose my-6' data-docs-example>
      <Input type='search' aria-label='Filter icons' placeholder={`Filter ${names.length} icons…`} value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} />
      <p className='mt-2 text-xs text-text-muted' aria-live='polite'>{visible.length} icons</p>
      <ul className='mt-3 grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2'>
        {visible.map((name) => (
          <li key={name} className='flex min-w-0 flex-col items-center gap-2 rounded-(--ds-radius-control) border border-border p-3'>
            <Icon name={name} decorative size='md' />
            <code className='w-full truncate text-center text-[0.6875rem]' title={name}>{name}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
