'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../core/Sheet';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import { useMediaQuery } from '../../../hooks/environment/use-media-query.js';
import { getFocusableElements } from '../../../hooks/shared/dom.js';
import { cn } from '../../../utilities/cn';
import { useAppShellFrame } from './AppShellFrame.jsx';

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
  const viewportCompact = useMediaQuery('(max-width: 1023px)');
  const compact = frame?.compact ?? viewportCompact;
  const shell = useRef(null);
  const menuTrigger = useRef(null);
  useEffect(() => { if (!compact) setOpen(false); }, [compact]);
  const nav = <nav aria-label={navigationLabel}>{navigation}</nav>;
  const topbar = layout === 'topbar';
  return (
    <div ref={shell} className={cn('ds-app-shell', className)} data-layout={layout} data-frame-compact={frame?.compact == null ? undefined : String(frame.compact)}>
      <a className='ds-skip-link' href={`#${id}`}>
        {skipLabel}
      </a>
      {topbar ? null : (
        <aside tabIndex={-1} className='ds-app-rail'>
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
                <Button ref={menuTrigger} size='xs' tone='neutral' variant='ghost' aria-label={menuLabel}>
                  <Icon name='Menu' decorative size='sm' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' aria-describedby={undefined} container={frame?.container ?? undefined} onCloseAutoFocus={(event) => {
                event.preventDefault();
                const panel = shell.current?.querySelector(topbar ? '.ds-app-topnav' : '.ds-app-rail');
                const target = menuTrigger.current?.getClientRects().length ? menuTrigger.current : getFocusableElements(panel)[0] || panel;
                target?.focus();
              }}>
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
              <div tabIndex={-1} className='ds-app-topnav'>{nav}</div>
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
