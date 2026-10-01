'use client';
import { useState } from 'react';
import { DonutChart } from '../../../../src/components/mdx/Chart/index.js';

// Essays published this year by topic; the smallest topics fold into Other.
const topics = [
  { label: 'Engineering', value: 34, posts: [ 'Notes on local-first software', 'Small tools, long lifetimes' ] },
  { label: 'Data', value: 27, posts: [ 'Designing for real data', 'A practical guide to knowledge graphs' ] },
  { label: 'Writing', value: 19, posts: [ 'Writing that survives a reorg' ] },
  { label: 'Management', value: 12, posts: [ 'Running a calm team' ] },
  { label: 'Hiring', value: 3, posts: [ 'Interviews worth having' ] },
  { label: 'Tools', value: 3, posts: [ 'A desk setup, revisited' ] },
  { label: 'Travel', value: 2, posts: [ 'Working from Lisbon' ] }
];

export function Pattern() {
  const [selected, setSelected] = useState(null);
  const members = selected?.isOther ? topics.filter((topic) => selected.members.includes(topic.label)) : selected ? topics.filter((topic) => topic.label === selected.label) : [];
  return (
    <div className='grid w-full max-w-3xl gap-4 md:grid-cols-[minmax(0,1fr)_16rem]'>
      <DonutChart
        ariaLabel='Essays by topic this year'
        title='Essays by topic'
        description='Select a slice with a click or Enter to list its essays.'
        data={topics}
        otherThreshold={0.05}
        centerLabel='Essays'
        valueLabel='Essays'
        onSelect={(slice) => setSelected(slice)}
        height={300}
        className='my-0'
      />
      <section aria-live='polite' aria-labelledby='topic-essays-heading' className='rounded-xl border border-border bg-surface p-4'>
        <h3 id='topic-essays-heading' className='text-sm font-semibold text-text'>{selected ? selected.label : 'No topic selected'}</h3>
        {members.length ? (
          <ul className='mt-3 grid gap-2 text-sm text-text-muted'>
            {members.flatMap((topic) => topic.posts).map((post) => <li key={post}>{post}</li>)}
          </ul>
        ) : (
          <p className='mt-3 text-sm text-text-muted'>Pick a slice to see the essays behind it.</p>
        )}
      </section>
    </div>
  );
}
