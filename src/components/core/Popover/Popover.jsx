'use client';

import { forwardRef, useEffect, useId, useRef, useState } from 'react';

import { cn } from '../../../utilities/cn';

export const Popover = forwardRef(({ children, className }, ref) => <div ref={ ref } className={ cn('relative inline-block', className) }>{children}</div>);
Popover.displayName = 'Popover';

export const PopoverTrigger = forwardRef(({ children, className, onClick, ...props }, ref) => (
  <button ref={ ref } type='button' className={ cn('ds-motion-press inline-flex min-h-8 items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-800 shadow-xs hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900', className) } onClick={ onClick } { ...props }>
    {children}
  </button>
));
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverContent = ({ children, className, id }) => (
  <div id={ id } className={ cn('ds-motion-popover absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200', className) }>
    {children}
  </div>
);

export const PopoverRoot = ({ children, className, trigger }) => {
  const [ open, setOpen ] = useState(false);
  const panelId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);

    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [ open ]);

  return (
    <Popover ref={ rootRef } className={ className }>
      <PopoverTrigger
        ref={ triggerRef }
        aria-controls={ open ? panelId : undefined }
        aria-expanded={ open }
        aria-haspopup='dialog'
        onClick={ () => setOpen(!open) }
      >
        {trigger}
      </PopoverTrigger>
      {open ? <PopoverContent id={ panelId }>{children}</PopoverContent> : null}
    </Popover>
  );
};

export default PopoverRoot;
