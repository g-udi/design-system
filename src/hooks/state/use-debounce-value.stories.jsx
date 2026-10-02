import { useMemo, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Input from '../../components/core/Input';
import { Field, FieldDescription, FieldLabel } from '../../components/core/Field/index.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useDebounceValue } from './use-debounce-value.js';

export default {
  title: 'Hooks/State/useDebounceValue',
  id: 'hooks-state-usedebouncevalue',
  tags: ['autodocs'],
  ...hookMeta('useDebounceValue')
};

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

export const SearchFilter = {
  name: 'Filter after typing settles',
  parameters: example('The input stays instant while the filter waits for a pause, so the list does not jump on every keystroke.', `
import { Input } from '@gaudi/design-system';
import { useDebounceValue } from '@gaudi/design-system/hooks';

const [query, setQuery] = useState('');
const debounced = useDebounceValue(query, 400);
const matches = useMemo(() => tags.filter((tag) => tag.includes(debounced)), [debounced]);`),
  render: () => <TagFilter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Filter tags' }), 'mo');
    await waitFor(() => expect(canvas.getByText('"mo"')).toBeVisible(), { timeout: 2000 });
    await expect(canvas.queryByText('charts')).toBeNull();
  }
};
