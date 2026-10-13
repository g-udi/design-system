import { useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Progress from '@gaudi/design-system/core/Progress';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useScrollPosition } from '@gaudi/design-system/hooks/layout/use-scroll-position';

function ReadingPanel() {
  const panelRef = useRef(null);
  const scrollY = useScrollPosition({ targetRef: panelRef });
  const node = panelRef.current;
  const max = node ? node.scrollHeight - node.clientHeight : 0;
  const percent = max > 0 ? Math.round((scrollY / max) * 100) : 0;
  return (
    <div className='grid gap-2'>
      <Progress label='Reading progress' value={percent} valueText={`${percent}% read`} />
      <div className='flex items-center justify-between gap-2'>
        <Readout label='Scrolled'>{Math.round(scrollY)}px</Readout>
        <Button size='sm' variant='ghost' tone='neutral' disabled={scrollY < 40} onClick={() => panelRef.current?.scrollTo({ top: 0 })}>Back to top</Button>
      </div>
      <div ref={panelRef} tabIndex={0} role='region' aria-label='Essay' className='h-44 overflow-y-auto rounded-(--ds-radius-control) border border-border p-3 text-sm leading-7'>
        {Array.from({ length: 10 }, (_, index) => <p key={index}>Section {index + 1}: calm interfaces leave room for the reader to think.</p>)}
      </div>
    </div>
  );
}

function ReplacedScrollPanel() {
  const [version, setVersion] = useState(0);
  const ref = useRef(null);
  const scrollY = useScrollPosition({ targetRef: ref });
  return (
    <div className='grid gap-2'>
      <Button onClick={() => setVersion((current) => current + 1)}>Replace scroller</Button>
      <Readout>{scrollY}px</Readout>
      <div key={version} ref={ref} role='region' aria-label='Replaceable scroller' tabIndex={0} className='h-32 overflow-auto'>
        <div className='h-96'>Reading content</div>
      </div>
    </div>
  );
}

function PageHeader() {
  const scrollY = useScrollPosition();
  return <Readout label='Page scrolled'>{Math.round(scrollY)}px — a sticky header could shrink after 64px ({scrollY > 64 ? 'compact' : 'full'}).</Readout>;
}

export { ReadingPanel, ReplacedScrollPanel, PageHeader };
