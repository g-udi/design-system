import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import { useFocusTrap } from '@gaudi/design-system/hooks/a11y/use-focus-trap';
import { useEventListener } from '@gaudi/design-system/hooks/interaction/use-event-listener';
import { useScrollLock } from '@gaudi/design-system/hooks/interaction/use-scroll-lock';

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
              <li><Link href='#posts' variant='nav'>Posts</Link></li>
              <li><Link href='#projects' variant='nav'>Projects</Link></li>
              <li><Link href='#about' variant='nav'>About</Link></li>
            </ul>
          </nav>
          <Button className='w-fit' onClick={() => setOpen(false)}>Close menu</Button>
        </div>
      ) : null}
    </>
  );
}

export { FullScreenMenu };
