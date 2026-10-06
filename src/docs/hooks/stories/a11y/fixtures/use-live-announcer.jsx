import { useMemo, useState } from 'react';
import Button from '../../../../../components/core/Button';
import Input from '../../../../../components/core/Input';
import { Field, FieldLabel } from '../../../../../components/core/Field/index.js';
import { useDebounceValue } from '../../../../../hooks/state/use-debounce-value.js';
import { useIsomorphicLayoutEffect } from '../../../../../hooks/state/use-isomorphic-layout-effect.js';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useLiveAnnouncer } from '../../../../../hooks/a11y/use-live-announcer.js';

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

export { SaveDraft, posts, SearchResults };
