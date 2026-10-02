import { useRef, useState } from 'react';
import Button from '../../components/core/Button';
import { example, hookMeta } from '../story-helpers.jsx';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

export default {
  title: 'Hooks/State/useIsomorphicLayoutEffect',
  id: 'hooks-state-useisomorphiclayouteffect',
  tags: ['autodocs'],
  ...hookMeta('useIsomorphicLayoutEffect')
};

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

export const MeasureBeforePaint = {
  name: 'Measure before paint',
  parameters: example('The excerpt checks whether it overflows before the browser paints, so "Read more" appears only when needed and without a flash. On the server it falls back to useEffect.', `
import { useIsomorphicLayoutEffect } from '@gaudi/design-system/hooks';

useIsomorphicLayoutEffect(() => {
  const node = ref.current;
  setOverflows(node.scrollHeight > node.clientHeight + 1);
}, [expanded]);`),
  render: () => <Excerpt />
};
