import { useState } from 'react';
import Button from '../../../../../components/core/Button';
import Skeleton from '../../../../../components/core/Skeleton';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useInView } from '../../../../../hooks/layout/use-in-view.js';

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

function IntersectionFallback({ initialInView }) {
  const [ref, inView] = useInView({ initialInView });
  return <Readout><span ref={ref}>{inView ? 'In view' : 'Outside view'}</span></Readout>;
}

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

export { LazyComments, IntersectionFallback, LoadMore };
