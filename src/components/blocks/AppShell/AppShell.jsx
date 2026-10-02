'use client';

import { useId, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../core/Sheet';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import { cn } from '../../../utilities/cn';
import { useAppShellFrame } from './parts/frame.jsx';

/**
 * Content remains in normal document flow; no global scroll or storage policy.
 *
 * `layout='sidebar'` (default) puts the brand and navigation in a rail; `layout='topbar'` moves them
 * into the header for sidebar-free apps. `aside` adds a complementary detail rail beside the content
 * (it stacks under the content below xl), and `statusBar` adds a footer strip under the content. Below
 * the lg breakpoint navigation moves into a menu sheet in either layout. Wrap it in `AppShellFrame` to
 * present it as an app window inside a page or a documentation preview.
 */
export default function AppShell({
  brand,
  navigation,
  children,
  header,
  footer,
  aside,
  statusBar,
  layout = 'sidebar',
  navigationLabel = 'Workspace navigation',
  asideLabel = 'Details',
  menuLabel = 'Open navigation',
  skipLabel = 'Skip to content',
  className
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  // Inside an AppShellFrame the menu sheet opens within the window.
  const frame = useAppShellFrame();
  const nav = <nav aria-label={navigationLabel}>{navigation}</nav>;
  const topbar = layout === 'topbar';
  return (
    <div className={cn('ds-app-shell', className)} data-layout={layout}>
      <a className='ds-skip-link' href={`#${id}`}>
        {skipLabel}
      </a>
      {topbar ? null : (
        <aside className='ds-app-rail'>
          <div className='ds-app-brand'>{brand}</div>
          {nav}
          {footer && <div className='ds-app-rail-footer'>{footer}</div>}
        </aside>
      )}
      <div className='ds-app-workspace'>
        <header className='ds-app-header'>
          <div className='ds-app-mobile-nav'>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size='xs' tone='neutral' variant='ghost' aria-label={menuLabel}>
                  <Icon name='Menu' decorative size='sm' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' aria-describedby={undefined} container={frame?.container ?? undefined}>
                <SheetHeader>
                  <SheetTitle>{navigationLabel}</SheetTitle>
                </SheetHeader>
                <div
                  className='px-3'
                  onClick={(event) => {
                    if (event.target.closest('a')) setOpen(false);
                  }}
                >
                  {nav}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {topbar ? (
            <>
              <div className='ds-app-brand'>{brand}</div>
              <div className='ds-app-topnav'>{nav}</div>
            </>
          ) : null}
          {header}
        </header>
        <div className='ds-app-body' data-aside={aside ? 'true' : undefined}>
          <main id={id} tabIndex={-1} className='ds-app-content'>
            {children}
          </main>
          {aside ? (
            <aside aria-label={asideLabel} className='ds-app-aside'>
              {aside}
            </aside>
          ) : null}
        </div>
        {statusBar ? <div className='ds-app-status'>{statusBar}</div> : null}
      </div>
    </div>
  );
}
