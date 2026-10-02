import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import { useFocusTrap } from '../a11y/use-focus-trap.js';
import { useEventListener } from './use-event-listener.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useScrollLock } from './use-scroll-lock.js';

export default {
  title: 'Hooks/Interaction/useScrollLock',
  id: 'hooks-interaction-usescrolllock',
  tags: ['autodocs'],
  ...hookMeta('useScrollLock')
};

function FullScreenMenu() {
  const [ open, setOpen ] = useState(false);
  useScrollLock(open);
  const trapRef = useFocusTrap({ active: open });
  useEventListener('keydown', (event) => event.key === 'Escape' && setOpen(false), open ? 'document' : null);
  return (
    <>
      <Button variant='outline' tone='neutral' aria-expanded={open} onClick={() => setOpen(true)}>Open menu</Button>
      {open ? (
        <div ref={trapRef} role='dialog' aria-modal='true' aria-label='Site menu' className='fixed inset-0 z-50 grid content-start gap-4 bg-surface p-6'>
          <nav aria-label='Site'>
            <ul className='grid gap-2 text-lg font-semibold'>
              <li><a href='#posts'>Posts</a></li>
              <li><a href='#projects'>Projects</a></li>
              <li><a href='#about'>About</a></li>
            </ul>
          </nav>
          <Button className='w-fit' onClick={() => setOpen(false)}>Close menu</Button>
        </div>
      ) : null}
    </>
  );
}

export const OverlayMenu = {
  name: 'Full-screen menu',
  parameters: example('While the menu covers the page, the page behind cannot scroll and focus stays in the menu; Escape or Close restores both. Content does not shift when the scrollbar disappears.', `
import { Button } from '@gaudi/design-system';
import { useEventListener, useFocusTrap, useScrollLock } from '@gaudi/design-system/hooks';

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  useScrollLock(open);
  const trapRef = useFocusTrap({ active: open });
  useEventListener('keydown', (event) => event.key === 'Escape' && setOpen(false), open ? 'document' : null);
  return (
    <>
      <Button aria-expanded={open} onClick={() => setOpen(true)}>Open menu</Button>
      {open && (
        <div ref={trapRef} role='dialog' aria-modal='true' aria-label='Site menu' className='fixed inset-0'>
          <nav aria-label='Site'>…</nav>
          <Button onClick={() => setOpen(false)}>Close menu</Button>
        </div>
      )}
    </>
  );
}`),
  render: () => <FullScreenMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvasElement.ownerDocument.body;
    const before = body.style.overflow;
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await waitFor(() => expect(body.style.overflow).toBe('hidden'));
    await userEvent.click(within(body).getByRole('button', { name: 'Close menu' }));
    await waitFor(() => expect(body.style.overflow).toBe(before));
  }
};
