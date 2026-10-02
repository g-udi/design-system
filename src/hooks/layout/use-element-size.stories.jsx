import { useState } from 'react';
import Card from '../../components/core/Card';
import Button from '../../components/core/Button';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { useElementSize } from './use-element-size.js';

export default {
  title: 'Hooks/Layout/useElementSize',
  id: 'hooks-layout-useelementsize',
  tags: ['autodocs'],
  ...hookMeta('useElementSize')
};

function ContainerCard() {
  const [ narrow, setNarrow ] = useState(false);
  const [ ref, { width, height } ] = useElementSize();
  const compact = width > 0 && width < 360;
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center gap-3'>
        <Button size='sm' variant='outline' tone='neutral' aria-pressed={narrow} onClick={() => setNarrow(!narrow)}>{narrow ? 'Widen the container' : 'Narrow the container'}</Button>
        <Readout label='Measured'><Value>{`${width} × ${height}`}</Value></Readout>
      </div>
      <div ref={ref} className='transition-[max-width] motion-reduce:transition-none' style={{ maxWidth: narrow ? 300 : '100%' }}>
        <Card variant='outline' padding='sm' title='Designing calm interfaces' titleLevel={4}>
          <div className={compact ? 'grid gap-2' : 'flex items-center justify-between gap-3'}>
            <span className='text-sm text-text-muted'>8 min read · Design</span>
            <Button size='sm' className='w-fit'>{compact ? 'Read' : 'Continue reading'}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export const ContainerLayout = {
  name: 'Layout from the container width',
  parameters: example('The card stacks and shortens its button when its own container is narrow, whatever the window width. Prefer CSS container queries when only styles change.', `
import { Button, Card } from '@gaudi/design-system';
import { useElementSize } from '@gaudi/design-system/hooks';

export function PostCard({ post }) {
  const [ref, { width }] = useElementSize();
  const compact = width > 0 && width < 360;
  return (
    <div ref={ref}>
      <Card title={post.title}>
        <Button>{compact ? 'Read' : 'Continue reading'}</Button>
      </Card>
    </div>
  );
}`),
  render: () => <ContainerCard />
};
