import { useRef } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Progress from '../../components/core/Progress';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useScrollPosition } from './use-scroll-position.js';

export default {
  title: 'Hooks/Layout/useScrollPosition',
  id: 'hooks-layout-usescrollposition',
  tags: ['autodocs'],
  ...hookMeta('useScrollPosition')
};

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

export const ReadingProgress = {
  name: 'Reading progress in a scroll container',
  parameters: example('With `targetRef`, the offset comes from a scroll container instead of the page; here it drives a Progress bar and enables Back to top.', `
import { Button, Progress } from '@gaudi/design-system';
import { useScrollPosition } from '@gaudi/design-system/hooks';

const panelRef = useRef(null);
const scrollY = useScrollPosition({ targetRef: panelRef });

<Button disabled={scrollY < 40} onClick={() => panelRef.current.scrollTo({ top: 0 })}>Back to top</Button>
<div ref={panelRef} tabIndex={0} role='region' aria-label='Essay' className='h-44 overflow-y-auto'>…</div>`),
  render: () => <ReadingPanel />,
  play: async ({ canvasElement }) => {
    const panel = within(canvasElement).getByRole('region', { name: 'Essay' });
    panel.scrollTop = 120;
    panel.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(within(canvasElement).getByRole('button', { name: 'Back to top' })).toBeEnabled());
  }
};

function PageHeader() {
  const scrollY = useScrollPosition();
  return <Readout label='Page scrolled'>{Math.round(scrollY)}px — a sticky header could shrink after 64px ({scrollY > 64 ? 'compact' : 'full'}).</Readout>;
}

export const PageScroll = {
  name: 'Page scroll',
  parameters: example('Without options it follows the window, for headers that shrink and back-to-top links.', `
const scrollY = useScrollPosition();
<header data-compact={scrollY > 64 || undefined}>…</header>`),
  render: () => <PageHeader />
};
