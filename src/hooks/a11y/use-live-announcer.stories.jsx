import { useMemo, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import { Field, FieldLabel } from '../../components/core/Field/index.js';
import { useDebounceValue } from '../state/use-debounce-value.js';
import { useIsomorphicLayoutEffect } from '../state/use-isomorphic-layout-effect.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useLiveAnnouncer } from './use-live-announcer.js';

export default {
  title: 'Hooks/A11y/useLiveAnnouncer',
  id: 'hooks-a11y-useliveannouncer',
  tags: ['autodocs'],
  ...hookMeta('useLiveAnnouncer')
};

function SaveDraft() {
  const { announce } = useLiveAnnouncer();
  const [ saved, setSaved ] = useState(null);
  const save = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSaved(time);
    announce(`Draft saved at ${time}`);
  };
  const fail = () => announce('Could not publish: the title is missing', 'assertive');
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap gap-2'>
        <Button onClick={save}>Save draft</Button>
        <Button variant='outline' tone='danger' onClick={fail}>Publish without a title</Button>
      </div>
      <Readout>{saved ? `Saved at ${saved}` : 'Not saved yet'}</Readout>
    </div>
  );
}

export const SaveFeedback = {
  name: 'Polite and assertive messages',
  parameters: example("Saving announces politely, after whatever the screen reader is saying; the failed publish interrupts with `'assertive'`. Focus stays on the button either way.", `
import { Button } from '@gaudi/design-system';
import { useLiveAnnouncer } from '@gaudi/design-system/hooks';

export function DraftActions({ saveDraft, publish }) {
  const { announce } = useLiveAnnouncer();
  return (
    <>
      <Button onClick={async () => { await saveDraft(); announce('Draft saved'); }}>Save draft</Button>
      <Button onClick={async () => {
        const error = await publish();
        if (error) announce(\`Could not publish: \${error}\`, 'assertive');
      }}>Publish</Button>
    </>
  );
}`),
  render: () => <SaveDraft />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save draft' }));
    await waitFor(() => expect(document.querySelector('[data-gaudi-live-announcer="polite"]')).toHaveTextContent(/Draft saved at/));
  }
};

const posts = [ 'Designing calm interfaces', 'Design tokens in practice', 'Knowledge graphs for blogs', 'Writing accessible charts', 'Static sites at scale' ];

function SearchResults() {
  const [ query, setQuery ] = useState('');
  const debounced = useDebounceValue(query, 400);
  const results = useMemo(() => posts.filter((post) => post.toLowerCase().includes(debounced.toLowerCase())), [ debounced ]);
  const { announce } = useLiveAnnouncer();
  useIsomorphicLayoutEffect(() => {
    if (debounced) announce(`${results.length} ${results.length === 1 ? 'result' : 'results'} for ${debounced}`);
  }, [ announce, debounced, results.length ]);
  return (
    <div className='grid gap-3'>
      <Field>
        <FieldLabel>Search posts</FieldLabel>
        <Input type='search' value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Try "design"' />
      </Field>
      <ul className='grid gap-1 text-sm'>{results.map((post) => <li key={post}>{post}</li>)}</ul>
    </div>
  );
}

export const ResultCount = {
  name: 'Result count after typing settles',
  parameters: example('The count is announced once typing pauses (with `useDebounceValue`), not on every keystroke.', `
const debounced = useDebounceValue(query, 400);
const results = useMemo(() => search(debounced), [debounced]);
const { announce } = useLiveAnnouncer();

useEffect(() => {
  if (debounced) announce(\`\${results.length} results for \${debounced}\`);
}, [announce, debounced, results.length]);`),
  render: () => <SearchResults />,
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('searchbox', { name: 'Search posts' }), 'design');
    await waitFor(() => expect(document.querySelector('[data-gaudi-live-announcer="polite"]')).toHaveTextContent('2 results for design'), { timeout: 3000 });
  }
};
