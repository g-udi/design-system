import { useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Kbd from '../../components/core/Kbd';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { useEventListener } from './use-event-listener.js';

export default {
  title: 'Hooks/Interaction/useEventListener',
  id: 'hooks-interaction-useeventlistener',
  tags: ['autodocs'],
  ...hookMeta('useEventListener')
};

function WindowSize() {
  const [ size, setSize ] = useState(() => (typeof window === 'undefined' ? null : { width: window.innerWidth, height: window.innerHeight }));
  useEventListener('resize', () => setSize({ width: window.innerWidth, height: window.innerHeight }));
  return <Readout label='Window'>{size ? <Value>{`${size.width} × ${size.height}`}</Value> : '—'}</Readout>;
}

export const WindowEvents = {
  name: 'Window events',
  parameters: example('Listens to `resize` on window, the default target. The handler can change on every render without re-subscribing.', `
import { useEventListener } from '@gaudi/design-system/hooks';

useEventListener('resize', () => setSize({ width: window.innerWidth, height: window.innerHeight }));`),
  render: () => <WindowSize />
};

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

export const DocumentEvents = {
  name: 'Document events',
  parameters: example("Pass `'document'` to listen on the document. Check `event.target` before acting so focused controls keep their keys.", `
useEventListener('keydown', (event) => setKey(event.key), 'document');`),
  render: () => <LastKey />,
  play: async ({ canvasElement }) => {
    await userEvent.keyboard('g');
    await waitFor(() => expect(within(canvasElement).getByText('g')).toBeVisible());
  }
};

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

export const ElementRef = {
  name: 'An element through a ref',
  parameters: example('Pass a ref to listen on an element; the listener follows the node if it re-mounts. Scroll listeners are passive so they never delay scrolling.', `
const panelRef = useRef(null);
useEventListener('scroll', () => setProgress(readProgress(panelRef.current)), panelRef, { passive: true });

<div ref={panelRef} tabIndex={0} role='region' aria-label='Release notes' className='h-40 overflow-y-auto'>…</div>`),
  render: () => <ScrollPanel />,
  play: async ({ canvasElement }) => {
    const panel = within(canvasElement).getByRole('region', { name: 'Release notes' });
    panel.scrollTop = panel.scrollHeight;
    panel.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(within(canvasElement).getByText('100%')).toBeVisible());
  }
};
