import { useState } from 'react';
import Card from '@gaudi/design-system/core/Card';
import Button from '@gaudi/design-system/core/Button';
import Dialog from '@gaudi/design-system/core/Dialog';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useElementSize } from '@gaudi/design-system/hooks/layout/use-element-size';

function ContainerCard() {
  const [ narrow, setNarrow ] = useState(false);
  const [ articleOpen, setArticleOpen ] = useState(false);
  const [ ref, { width, height } ] = useElementSize();
  const compact = width > 0 && width < 360;
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center gap-3'>
        <Button size='sm' variant='outline' tone='neutral' aria-pressed={narrow} onClick={() => setNarrow(!narrow)}>{narrow ? 'Widen the container' : 'Narrow the container'}</Button>
        <Readout label='Measured'><Value>{`${width} × ${height}`}</Value></Readout>
      </div>
      <div ref={ref} data-testid='measured-container' className='transition-[max-width] motion-reduce:transition-none' style={{ maxWidth: narrow ? 300 : '100%' }}>
        <Card variant='outline' padding='sm' title='Designing calm interfaces' titleLevel={4}>
          <div className={compact ? 'grid gap-2' : 'flex items-center justify-between gap-3'}>
            <span className='text-sm text-text-muted'>8 min read · Design</span>
            <Button size='sm' className='w-fit' onClick={() => setArticleOpen(true)}>{compact ? 'Read' : 'Continue reading'}</Button>
          </div>
        </Card>
      </div>
      <Dialog open={articleOpen} onOpenChange={setArticleOpen} title='Designing calm interfaces'>
        <p className='text-sm leading-relaxed text-text-muted'>Give each view a clear purpose. Keep related actions together, make reading comfortable, and let secondary details appear when they are needed.</p>
      </Dialog>
    </div>
  );
}

export { ContainerCard };
