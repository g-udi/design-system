'use client';

import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import Link from '../Link';
import { cn } from '../../../utilities/cn';

export const NavigationMenu = ({ children, className, label = 'Main navigation' }) => (
  <nav aria-label={ label } className={ cn('relative z-10 flex w-full items-center', className) }>{children}</nav>
);

export const NavigationMenuList = ({ children, className }) => (
  <div role='list' className={ cn('m-0 flex w-full flex-row flex-wrap items-center gap-2 p-0', className) }>{children}</div>
);
export const NavigationMenuItem = forwardRef(({ children, className }, ref) => <div ref={ ref } role='listitem' className={ cn('relative m-0 p-0', className) }>{children}</div>);
NavigationMenuItem.displayName = 'NavigationMenuItem';

export const NavigationMenuLink = ({ active = false, children, className, description, href, meta, variant = 'link' }) => {
  const link = (
    <Link
      href={ href }
      variant='bare'
      aria-current={ active ? 'page' : undefined }
      className={ cn(
        'group/nav-link transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950',
        variant === 'link' && [
          'inline-flex min-h-8 items-center rounded-lg px-3 py-1.5 text-sm font-medium pointer-coarse:min-h-11',
          'text-gray-900 hover:bg-gray-100 hover:text-blue-600',
          'dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-blue-400'
        ],
        variant === 'panel' && 'block rounded-xl px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900',
        active && variant === 'link' && 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
        className
      ) }
    >
      <span className={ cn(variant === 'panel' && 'block text-sm font-medium text-gray-950 group-hover/nav-link:text-blue-600 dark:text-gray-100 dark:group-hover/nav-link:text-blue-400') }>{children}</span>
      {description ? <span className='mt-0.5 block text-xs leading-5 text-gray-600 dark:text-gray-400'>{description}</span> : null}
      {meta ? <span className='mt-1 block text-xs font-medium uppercase text-gray-500 dark:text-gray-400'>{meta}</span> : null}
    </Link>
  );

  /*
   * Link-variant items sit directly inside NavigationMenuList (role='list'), so
   * they need a listitem wrapper AROUND the link — never a role on the link
   * itself, which would destroy its link semantics for screen readers.
   */
  if (variant === 'link') return <div role='listitem' className='m-0 p-0'>{link}</div>;

  return link;
};

export const NavigationMenuDropdown = ({ align = 'start', children, className, defaultOpen = false, label, panelClassName, trigger, width = 'lg' }) => {
  const dropdownId = useId();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const [ open, setOpen ] = useState(defaultOpen);
  const [ panelLeft, setPanelLeft ] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ open ]);

  useLayoutEffect(() => {
    if (!open || !panelRef.current || !ref.current) return undefined;

    const updateAlignment = () => {
      const panel = panelRef.current;
      const triggerElement = ref.current;

      if (!panel || !triggerElement) return;

      const panelWidth = panel.offsetWidth;
      const triggerRect = triggerElement.getBoundingClientRect();
      const viewportPadding = 16;
      const viewportWidth = window.innerWidth;
      const preferredPositions = {
        'center': {
          'left': triggerRect.left + (triggerRect.width / 2) - (panelWidth / 2),
          'right': triggerRect.left + (triggerRect.width / 2) + (panelWidth / 2)
        },
        'end': {
          'left': triggerRect.right - panelWidth,
          'right': triggerRect.right
        },
        'start': {
          'left': triggerRect.left,
          'right': triggerRect.left + panelWidth
        }
      };
      const preferred = preferredPositions[align] || preferredPositions.start;

      const left = Math.max(viewportPadding, Math.min(preferred.left, viewportWidth - viewportPadding - panelWidth));
      setPanelLeft(left - triggerRect.left);
    };

    updateAlignment();
    window.addEventListener('resize', updateAlignment);

    return () => {
      window.removeEventListener('resize', updateAlignment);
    };
  }, [ align, open ]);

  return (
    <NavigationMenuItem ref={ ref } className={ className }>
      <button
        ref={ triggerRef }
        type='button'
        className={ cn(
          'inline-flex min-h-8 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors pointer-coarse:min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950',
          'text-gray-900 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-blue-400',
          open && 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
        ) }
        aria-controls={ dropdownId }
        aria-expanded={ open }
        onClick={ () => setOpen(!open) }
      >
        <span>{trigger || label}</span>
        <svg className={ cn('h-4 w-4 text-gray-400 transition-transform', open && 'rotate-180 text-current') } viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
          <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z' clipRule='evenodd' />
        </svg>
      </button>
      {open ? (
        <div
          ref={ panelRef }
          id={ dropdownId }
          style={ { left: panelLeft } }
          className={ cn(
            'absolute top-full mt-2 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-950/10 ring-1 ring-gray-950/5 dark:border-gray-800 dark:bg-gray-950 dark:shadow-black/40 dark:ring-white/10', width === 'sm' && 'w-64', width === 'md' && 'w-80', width === 'lg' && 'w-[28rem]', width === 'xl' && 'w-[36rem]', panelClassName
          ) }
        >
          {children}
        </div>
      ) : null}
    </NavigationMenuItem>
  );
};

export const NavigationMenuPanel = ({ children, className, columns = 2 }) => (
  <div
    className={ cn(
      'grid gap-1', columns === 1 && 'grid-cols-1', columns === 2 && 'grid-cols-1 sm:grid-cols-2', columns === 3 && 'grid-cols-1 sm:grid-cols-3', className
    ) }
  >
    {children}
  </div>
);

export default NavigationMenu;
