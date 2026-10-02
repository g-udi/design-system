import { useState } from 'react';
import Button from '../../components/core/Button';
import Skeleton from '../../components/core/Skeleton';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { useInView } from './use-in-view.js';

export default {
  title: 'Hooks/Layout/useInView',
  id: 'hooks-layout-useinview',
  tags: ['autodocs'],
  ...hookMeta('useInView')
};

function LazyComments() {
  const [ ref, inView ] = useInView({ rootMargin: '0px', once: true });
  return (
    <div className='grid gap-2'>
      <Readout label='Comments loaded'><Value>{inView}</Value></Readout>
      <div tabIndex={0} role='region' aria-label='Article' className='h-48 overflow-y-auto rounded-(--ds-radius-control) border border-border p-3 text-sm leading-7'>
        {Array.from({ length: 6 }, (_, index) => <p key={index}>Paragraph {index + 1} of the article. Scroll down to reach the comments.</p>)}
        <section ref={ref} aria-label='Comments' className='mt-4 grid gap-2'>
          {inView ? (
            <>
              <p className='font-medium'>3 comments</p>
              <p className='text-text-muted'>Amira: This changed how I think about motion.</p>
            </>
          ) : <Skeleton className='h-16' aria-hidden='true' />}
        </section>
      </div>
    </div>
  );
}

export const LazySection = {
  name: 'Load a section when it is reached',
  parameters: example('The comments render once their section scrolls into view, then stop observing (`once`). Use `rootMargin` to start loading a little before it is visible.', `
import { Skeleton } from '@gaudi/design-system';
import { useInView } from '@gaudi/design-system/hooks';

const [ref, inView] = useInView({ rootMargin: '200px', once: true });
<section ref={ref} aria-label='Comments'>{inView ? <Comments /> : <Skeleton className='h-16' />}</section>`),
  render: () => <LazyComments />
};

function LoadMore() {
  const [ count, setCount ] = useState(6);
  const [ ref ] = useInView({ onChange: (inView) => inView && setCount((current) => Math.min(current + 4, 18)) });
  return (
    <div tabIndex={0} role='region' aria-label='Posts' className='h-48 overflow-y-auto rounded-(--ds-radius-control) border border-border p-3'>
      <ul className='grid gap-1 text-sm'>{Array.from({ length: count }, (_, index) => <li key={index}>Post {index + 1}</li>)}</ul>
      {count < 18 ? (
        <div ref={ref} className='pt-2'>
          <Button size='sm' variant='outline' tone='neutral' onClick={() => setCount((current) => Math.min(current + 4, 18))}>Load more posts</Button>
        </div>
      ) : <p className='pt-2 text-sm text-text-muted'>All 18 posts loaded.</p>}
    </div>
  );
}

export const InfiniteList = {
  name: '"Load more" sentinel with a button',
  parameters: example('Reaching the end loads more automatically, and the same row keeps a real "Load more" button for keyboard and screen reader users.', `
const [ref] = useInView({ onChange: (inView) => inView && loadMore() });

<div ref={ref}><Button onClick={loadMore}>Load more posts</Button></div>`),
  render: () => <LoadMore />
};
