'use client';
import { useId, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../core/Sheet/parts/sheet.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

// Choosing a chat or a file finishes the trip into the navigation Sheet; folders and menus keep it open.
const closeSheetTargets = '[data-chat-session], [role="treeitem"]:not([aria-expanded]), [data-close-sheet]';

const LABELS = {
  navigation: 'Chats and files',
  openNavigation: 'Open chats',
  closeNavigation: 'Close',
  details: 'Details',
  openDetails: 'Open details',
  conversation: 'Conversation'
};

/**
 * The frame for a chat: an optional navigation column (sessions, files), a header, the thread, the
 * composer and an optional details column (plan, activity).
 *
 * - `variant='page'` lays the columns side by side from md (details from xl); below that the navigation
 *   and details open in Sheets from header buttons.
 * - `variant='sidebar'` is a narrow assistant panel beside other work: one column, with the navigation
 *   in a Sheet.
 *
 * The thread (`children`) owns its own scrolling, normally a MessageScroller, so the page never scrolls.
 */
function ChatShell({
  variant = 'page',
  title,
  subtitle,
  navigation,
  details,
  headerActions,
  composer,
  labels: labelOverrides,
  className,
  children
}) {
  const labels = { ...LABELS, ...labelOverrides };
  const [navOpen, setNavOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const titleId = useId();
  const navButton = useRef(null);
  const detailsButton = useRef(null);
  const page = variant === 'page';
  // The Sheets open from state, so hand focus back to the button that opened them.
  const returnFocus = (button) => (event) => {
    event.preventDefault();
    button.current?.focus();
  };
  return (
    <div
      data-slot='chat-shell'
      data-variant={variant}
      className={cn(
        'ds-part-chat-shell bg-surface grid h-full min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border',
        page && navigation && 'md:grid-cols-[16rem_minmax(0,1fr)]',
        page && navigation && details && 'xl:grid-cols-[16rem_minmax(0,1fr)_18rem]',
        page && !navigation && details && 'xl:grid-cols-[minmax(0,1fr)_18rem]',
        className
      )}
    >
      {page && navigation ? (
        <aside aria-label={labels.navigation} className='bg-surface-muted hidden min-h-0 flex-col gap-4 overflow-y-auto border-e p-3 md:flex'>
          {navigation}
        </aside>
      ) : null}
      <section aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : labels.conversation} className='flex min-h-0 min-w-0 flex-col'>
        <header data-slot='chat-header' className='flex min-w-0 items-center gap-2 border-b px-3 py-2'>
          {navigation ? (
            <Button ref={navButton} size='icon-sm' variant='ghost' aria-label={labels.openNavigation} className={cn(page && 'md:hidden')} onClick={() => setNavOpen(true)}>
              <RegistryIcon lucide={page ? 'PanelLeft' : 'History'} />
            </Button>
          ) : null}
          <div className='grid min-w-0 flex-1'>
            {title ? <h2 id={titleId} className='truncate text-sm font-semibold'>{title}</h2> : null}
            {subtitle ? <p className='text-text-muted truncate text-xs'>{subtitle}</p> : null}
          </div>
          <div className='flex shrink-0 items-center gap-1'>
            {headerActions}
            {details ? (
              <Button ref={detailsButton} size='icon-sm' variant='ghost' aria-label={labels.openDetails} className={cn(page && 'xl:hidden')} onClick={() => setDetailsOpen(true)}>
                <RegistryIcon lucide='ListChecks' />
              </Button>
            ) : null}
          </div>
        </header>
        <div data-slot='chat-thread' className='relative flex min-h-0 flex-1 flex-col'>{children}</div>
        {composer ? <div data-slot='chat-composer' className='border-t p-3'>{composer}</div> : null}
      </section>
      {page && details ? (
        <aside aria-label={labels.details} className='hidden min-h-0 flex-col gap-4 overflow-y-auto border-s p-3 xl:flex'>
          {details}
        </aside>
      ) : null}

      {navigation ? (
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side='left' className='flex flex-col gap-4 p-4 pt-12' onCloseAutoFocus={returnFocus(navButton)}>
            <SheetHeader className='sr-only'>
              <SheetTitle>{labels.navigation}</SheetTitle>
              <SheetDescription>{labels.navigation}</SheetDescription>
            </SheetHeader>
            <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto' onClick={(event) => event.target.closest(closeSheetTargets) && setNavOpen(false)}>
              {navigation}
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
      {details ? (
        <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
          <SheetContent side='right' className='flex flex-col gap-4 p-4' onCloseAutoFocus={returnFocus(detailsButton)}>
            <SheetHeader>
              <SheetTitle>{labels.details}</SheetTitle>
              <SheetDescription className='sr-only'>{labels.details}</SheetDescription>
            </SheetHeader>
            <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto'>{details}</div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}

export { ChatShell };
