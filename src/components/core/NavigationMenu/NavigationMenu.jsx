'use client';

import { createContext, useCallback, useContext, useId, useLayoutEffect, useState } from 'react';

import Link from '../Link';
import { cn } from '../../../utilities/cn';
import {
  NavigationMenu as NavigationMenuRoot,
  NavigationMenuContent,
  NavigationMenuItem as NavigationMenuItemPart,
  NavigationMenuLink as NavigationMenuLinkPart,
  NavigationMenuList as NavigationMenuListPart,
  NavigationMenuTrigger
} from './parts/navigation-menu.jsx';

// Lets a dropdown ask the root to open it on mount (`defaultOpen`).
const OpenItemContext = createContext(() => {});
// Dropdowns open on click only: cancelling the pointer handlers turns off the parts' hover-to-open timers.
const clickOnly = { 'onPointerLeave': (event) => event.preventDefault(), 'onPointerMove': (event) => event.preventDefault() };

/**
 * Site navigation built on the NavigationMenu parts: a labelled landmark whose dropdowns open on
 * click, close on Escape or an outside click, and sit under their own trigger.
 */
export const NavigationMenu = ({ children, className, label = 'Main navigation' }) => {
  const [ value, setValue ] = useState('');
  const openOnMount = useCallback((item) => setValue(item), []);

  return (
    <NavigationMenuRoot
      aria-label={ label }
      value={ value }
      onValueChange={ setValue }
      viewport={ false }
      className={ cn('z-10 w-full max-w-none flex-none justify-start', className) }
    >
      <OpenItemContext.Provider value={ openOnMount }>{children}</OpenItemContext.Provider>
    </NavigationMenuRoot>
  );
};

export const NavigationMenuList = ({ children, className }) => (
  <NavigationMenuListPart className={ cn('m-0 flex-wrap justify-start gap-1 p-0', className) }>{children}</NavigationMenuListPart>
);

export const NavigationMenuItem = NavigationMenuItemPart;

const topLevelClassName = 'h-auto min-h-8 px-3 py-1.5 text-sm font-medium text-text hover:text-accent pointer-coarse:min-h-11';

export const NavigationMenuLink = ({ active = false, children, className, description, href, meta, variant = 'link' }) => {
  const link = (
    <NavigationMenuLinkPart asChild active={ active }>
      <Link
        href={ href }
        variant='bare'
        className={ cn(
          'group/nav-link',
          variant === 'link' && [ topLevelClassName, 'data-active:text-accent' ],
          variant === 'panel' && 'grid grid-cols-[minmax(0,1fr)] items-start gap-0.5 px-3 py-2 text-start',
          className
        ) }
      >
        {variant === 'panel' ? <span className='text-sm font-medium text-text group-hover/nav-link:text-accent'>{children}</span> : children}
        {description ? <span className='block text-xs leading-5 text-text-muted'>{description}</span> : null}
        {meta ? <span className='mt-0.5 block text-xs font-medium uppercase text-text-subtle'>{meta}</span> : null}
      </Link>
    </NavigationMenuLinkPart>
  );

  // Top-level links are list items of the menu bar; panel links sit inside a dropdown's own layout.
  return variant === 'link' ? <NavigationMenuItemPart>{link}</NavigationMenuItemPart> : link;
};

// The content part sizes itself `md:w-auto`; each width restates the breakpoint so it wins there too.
const panelWidths = { 'lg': 'w-[28rem] md:w-[28rem]', 'md': 'w-80 md:w-80', 'sm': 'w-64 md:w-64', 'xl': 'w-[36rem] md:w-[36rem]' };
const panelAlignment = { 'center': 'left-1/2 -translate-x-1/2', 'end': 'right-0 left-auto', 'start': 'left-0' };
const VIEWPORT_GUTTER = 16;

// Nudges an open panel back inside the viewport when its alignment would push it past an edge.
const keepInViewport = (node) => {
  if (!node) return undefined;

  const clamp = () => {
    node.style.marginLeft = '';
    const { left, right } = node.getBoundingClientRect();
    const overflowEnd = right - (window.innerWidth - VIEWPORT_GUTTER);
    const shift = left < VIEWPORT_GUTTER ? VIEWPORT_GUTTER - left : Math.min(0, -overflowEnd);

    if (shift) node.style.marginLeft = `${shift}px`;
  };

  clamp();
  window.addEventListener('resize', clamp);

  return () => window.removeEventListener('resize', clamp);
};

export const NavigationMenuDropdown = ({ align = 'start', children, className, defaultOpen = false, label, panelClassName, trigger, width = 'lg' }) => {
  const value = useId();
  const openOnMount = useContext(OpenItemContext);

  useLayoutEffect(() => {
    if (defaultOpen) openOnMount(value);
  }, [ defaultOpen, openOnMount, value ]);

  return (
    <NavigationMenuItemPart value={ value } className={ className }>
      <NavigationMenuTrigger { ...clickOnly } className={ cn(topLevelClassName, 'data-open:text-accent') }>{trigger || label}</NavigationMenuTrigger>
      <NavigationMenuContent
        ref={ keepInViewport }
        onPointerLeave={ clickOnly.onPointerLeave }
        className={ cn(
          'absolute top-full z-50 mt-2 max-w-[calc(100vw-2rem)] p-2',
          panelWidths[width],
          panelAlignment[align] || panelAlignment.start,
          panelClassName
        ) }
      >
        {children}
      </NavigationMenuContent>
    </NavigationMenuItemPart>
  );
};

export const NavigationMenuPanel = ({ children, className, columns = 2 }) => (
  <div className={ cn('grid gap-1', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-3', className) }>
    {children}
  </div>
);

export default NavigationMenu;
