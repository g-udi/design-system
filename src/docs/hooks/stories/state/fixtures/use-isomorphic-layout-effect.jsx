import { useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { useIsomorphicLayoutEffect } from '@gaudi/design-system/hooks/state/use-isomorphic-layout-effect';

const excerpt = 'Calm interfaces leave room for the reader. They hold back motion, keep controls where people expect them, and explain state changes in words. This excerpt is long enough to need a "Read more" button only when it really overflows its three lines.';

function Excerpt() {
  const ref = useRef(null);
  const [ expanded, setExpanded ] = useState(false);
  const [ overflows, setOverflows ] = useState(false);
  // Measured before paint, so the button never flashes in or out.
  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (node && !expanded) setOverflows(node.scrollHeight > node.clientHeight + 1);
  }, [ expanded ]);
  return (
    <div className='grid max-w-sm gap-2'>
      <p ref={ref} id='excerpt-text' className={expanded ? 'text-sm leading-6' : 'line-clamp-3 text-sm leading-6'}>{excerpt}</p>
      {overflows ? <Button size='sm' variant='ghost' tone='neutral' className='w-fit' aria-expanded={expanded} aria-controls='excerpt-text' onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : 'Read more'}</Button> : null}
    </div>
  );
}

export { excerpt, Excerpt };
