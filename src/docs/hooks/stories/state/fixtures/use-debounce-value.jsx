import { useMemo, useState } from 'react';
import Input from '@gaudi/design-system/core/Input';
import { Field, FieldDescription, FieldLabel } from '@gaudi/design-system/core/Field';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useDebounceValue } from '@gaudi/design-system/hooks/state/use-debounce-value';

const tags = [ 'accessibility', 'animation', 'charts', 'css', 'data', 'design systems', 'graphs', 'motion', 'react', 'typography' ];

function TagFilter() {
  const [ query, setQuery ] = useState('');
  const debounced = useDebounceValue(query, 400);
  const matches = useMemo(() => tags.filter((tag) => tag.includes(debounced.toLowerCase())), [ debounced ]);
  return (
    <div className='grid gap-3'>
      <Field>
        <FieldLabel>Filter tags</FieldLabel>
        <Input type='search' value={query} onChange={(event) => setQuery(event.target.value)} />
        <FieldDescription>The list updates 400ms after you stop typing.</FieldDescription>
      </Field>
      <Readout label='Filtering by'>{debounced ? `"${debounced}"` : 'nothing yet'}</Readout>
      <ul className='flex flex-wrap gap-2 text-sm'>{matches.map((tag) => <li key={tag} className='rounded-(--ds-radius-control) bg-surface-muted px-2 py-0.5'>{tag}</li>)}</ul>
    </div>
  );
}

export { tags, TagFilter };
