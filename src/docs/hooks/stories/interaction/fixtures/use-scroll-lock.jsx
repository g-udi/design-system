import { useState } from 'react';
import Button from '../../../../../components/core/Button';
import { useFocusTrap } from '../../../../../hooks/a11y/use-focus-trap.js';
import { useEventListener } from '../../../../../hooks/interaction/use-event-listener.js';
import { useScrollLock } from '../../../../../hooks/interaction/use-scroll-lock.js';

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

export { FullScreenMenu };
