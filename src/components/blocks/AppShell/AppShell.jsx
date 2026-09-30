'use client';

import { useId, useState } from 'react';
import Dialog from '../../core/Dialog';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import { cn } from '../../../utilities/cn';

/** Content remains in normal document flow; no global scroll or storage policy. */
export default function AppShell({
  brand,
  navigation,
  children,
  header,
  footer,
  navigationLabel = 'Workspace navigation',
  menuLabel = 'Open navigation',
  skipLabel = 'Skip to content',
  className
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const nav = <nav aria-label={navigationLabel}>{navigation}</nav>;
  return (
    <div className={cn('ds-app-shell', className)}>
      <a className='ds-skip-link' href={`#${id}`}>
        {skipLabel}
      </a>
      <aside className='ds-app-rail'>
        <div className='ds-app-brand'>{brand}</div>
        {nav}
        {footer && <div className='ds-app-rail-footer'>{footer}</div>}
      </aside>
      <div className='ds-app-workspace'>
        <header className='ds-app-header'>
          <div className='ds-app-mobile-nav'>
            <Dialog
              open={open}
              onOpenChange={setOpen}
              variant='sheet'
              title={navigationLabel}
              trigger={
                <Button
                  size='xs'
                  tone='neutral'
                  variant='ghost'
                  aria-label={menuLabel}
                >
                  <Icon name='Menu' decorative size='sm' />
                </Button>
              }
            >
              <div
                onClick={(event) => {
                  if (event.target.closest('a')) setOpen(false);
                }}
              >
                {nav}
              </div>
            </Dialog>
          </div>
          {header}
        </header>
        <main id={id} tabIndex={-1} className='ds-app-content'>
          {children}
        </main>
      </div>
    </div>
  );
}
