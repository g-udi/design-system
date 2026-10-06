'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import {
  SelectRoot as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

// A select sharing a row with an input and a button, sized to its content while
// the input takes the remaining width.
const members = [{ name: 'Anouk Brennan', status: 'active' }, { name: 'Ilse Moreland', status: 'active' }, { name: 'Rhian Mitchum', status: 'inactive' }];

export function Pattern() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [results, setResults] = useState(null);
  return (
    <form className='mx-auto grid w-full max-w-md gap-2' onSubmit={(event) => {
      event.preventDefault();
      setResults(members.filter((member) => (status === 'all' || member.status === status) && member.name.toLowerCase().includes(query.toLowerCase())));
    }}>
      <div className='flex min-w-0 items-center gap-2'>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} aria-label='Search members' placeholder='Search members' className='min-w-0 flex-1' />
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger aria-label='Filter by status' className='w-28 shrink-0'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type='submit'>Search</Button>
      </div>
      {results && <p role='status' className='text-sm text-text-muted'>{results.length ? results.map((member) => member.name).join(', ') : 'No members found.'}</p>}
    </form>
  );
}
