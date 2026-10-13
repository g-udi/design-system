import { useRef, useState } from 'react';
import Kbd from '@gaudi/design-system/core/Kbd';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useEventListener } from '@gaudi/design-system/hooks/interaction/use-event-listener';

function WindowSize() {
  const [ size, setSize ] = useState(() => (typeof window === 'undefined' ? null : { width: window.innerWidth, height: window.innerHeight }));
  useEventListener('resize', () => setSize({ width: window.innerWidth, height: window.innerHeight }));
  return <Readout label='Window'>{size ? <Value>{`${size.width} × ${size.height}`}</Value> : '—'}</Readout>;
}

function LastKey() {
  const [ key, setKey ] = useState(null);
  useEventListener('keydown', (event) => setKey(event.key), 'document');
  return (
    <div className='grid gap-2'>
      <p className='text-sm text-text-muted'>Press any key while this page has focus.</p>
      <Readout label='Last key'>{key ? <Kbd>{key === ' ' ? 'Space' : key}</Kbd> : 'none yet'}</Readout>
    </div>
  );
}

function ScrollPanel() {
  const panelRef = useRef(null);
  const [ progress, setProgress ] = useState(0);
  useEventListener('scroll', () => {
    const node = panelRef.current;
    setProgress(Math.round((node.scrollTop / (node.scrollHeight - node.clientHeight)) * 100));
  }, panelRef, { passive: true });
  return (
    <div className='grid gap-2'>
      <Readout label='Read'>{progress}%</Readout>
      <div ref={panelRef} tabIndex={0} role='region' aria-label='Release notes' className='h-40 overflow-y-auto rounded-(--ds-radius-control) border border-border p-3 text-sm leading-7'>
        {Array.from({ length: 12 }, (_, index) => <p key={index}>Release note {index + 1}: smaller bundles, calmer motion and clearer focus rings.</p>)}
      </div>
    </div>
  );
}

export { WindowSize, LastKey, ScrollPanel };
