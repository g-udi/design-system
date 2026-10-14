'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@gaudi/design-system/core/DropdownMenu';
import { useMediaQuery } from '@gaudi/design-system/hooks';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@gaudi/design-system/core/Sheet';
import {
  NavigationMenuContent,
  NavigationMenuItemPrimitive as NavigationMenuItem,
  NavigationMenuLinkPrimitive as NavigationMenuLink,
  NavigationMenuListPrimitive as NavigationMenuList,
  NavigationMenuRoot as NavigationMenu,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@gaudi/design-system/core/NavigationMenu';
import { isActive, topNav } from '@/lib/nav';
import { isMenuActive, menuSections, type MenuSection } from '@/lib/navMenu';
import { siteConfig } from '../../../site.config';
import { SearchDialog } from './SearchDialog';
import { ModeMenu, PresetMenu } from './ThemeControls';

export function Brand() {
  return (
    <Link href='/' className='inline-flex shrink-0 items-center font-semibold text-text no-underline' aria-label={`${siteConfig.product} home`} data-plain>
      <GaudiBrand className='site-brand' logoClassName='size-7' />
    </Link>
  );
}

/** Primary links. Hidden on narrow widths, where the docs sheet carries them. */
export function TopNavLinks({ className = '' }: { className?: string }) {
  const pathname = usePathname() || '/';
  return (
    <nav aria-label='Primary' className={className}>
      <ul className='flex items-center gap-0.5'>
        {topNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className='site-nav-link' aria-current={isActive(pathname, item) ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Compact section switcher for the documentation rail and phone drawer. */
export function TopNavDropdown() {
  const pathname = usePathname() || '/';
  const desktop = useMediaQuery('(min-width: 1280px)');
  const current = topNav.find((item) => isActive(pathname, item)) || topNav[0];
  if (desktop) return null;
  return (
    <div className='mb-5 xl:hidden'>
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' tone='neutral' className='min-h-[2.75rem] w-full justify-between' aria-label={`Section: ${current.label}`}>
            {current.label}
            <Icon name='ChevronsUpDown' decorative size='sm' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label='Site sections' align='start' sideOffset={6} collisionPadding={12} className='z-[calc(var(--ds-z-overlay)+10)]'>
          {topNav.map((item) => (
            <DropdownMenuItem key={item.href} asChild className='min-h-[2.75rem] justify-between gap-3'>
              <Link href={item.href} aria-current={isActive(pathname, item) ? 'page' : undefined}>
                {item.label}
                {isActive(pathname, item) ? <Icon name='Check' decorative size='sm' /> : null}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  );
}

function MenuPanel({ section }: { section: MenuSection }) {
  return (
    <div className='w-[min(46rem,calc(100vw-2rem))] p-2'>
      <div className='flex flex-col gap-2'>
        <ul className='grid gap-1 sm:grid-cols-2'>
          {section.links.map((link) => (
            <li key={link.href}>
              <NavigationMenuLink asChild>
                <Link href={link.href} className='flex flex-row items-start gap-3 rounded-(--ds-radius-control) p-2 no-underline'>
                  <span aria-hidden='true' className='grid size-8 shrink-0 place-items-center rounded-(--ds-radius-control) border border-border bg-surface text-text-muted'>
                    <Icon name={link.icon} decorative size='sm' />
                  </span>
                  <span className='flex min-w-0 flex-col gap-0.5'>
                    <span className='text-sm font-medium text-text'>{link.title}</span>
                    <span className='line-clamp-2 text-xs leading-snug text-text-muted'>{link.description}</span>
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
        <Link href={section.footer.href} className='ms-2 mt-auto inline-flex w-fit items-center gap-1 text-xs font-medium text-accent'>
          {section.footer.label} <Icon name='ArrowRight' decorative size='xs' />
        </Link>
      </div>
    </div>
  );
}

/** Desktop primary navigation: Gaudi NavigationMenu dropdowns with a preview card and icon links. */
export function TopNavMenu({ className = '' }: { className?: string }) {
  const pathname = usePathname() || '/';
  const themes = topNav.find((item) => item.href === '/themes');
  return (
    <NavigationMenu aria-label='Primary' className={className}>
      <NavigationMenuList>
        {menuSections.map((section) => (
          <NavigationMenuItem key={section.label}>
            <NavigationMenuTrigger data-current={isMenuActive(pathname, section) || undefined} className='data-current:text-text data-current:font-semibold'>
              {section.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <MenuPanel section={section} />
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        {themes ? (
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href={themes.href} aria-current={isActive(pathname, themes) ? 'page' : undefined}>{themes.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ) : null}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/** Search, Ask AI (when a server is available), colour mode, theme preset and GitHub. */
export function HeaderActions() {
  return (
    <div className='site-header-actions ms-auto flex shrink-0 items-center gap-1'>
      <SearchDialog />
      <PresetMenu />
      <ModeMenu />
      {/* Below sm the header has no room once Ask AI is on; the footer and page menus still link GitHub. */}
      <Button href={siteConfig.github} variant='ghost' tone='neutral' size='icon-sm' aria-label='Gaudi on GitHub' target='_blank' rel='noreferrer' className='hidden sm:inline-flex'>
        <Icon name='Github' decorative size='sm' />
      </Button>
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  return (
    <div className='flex xl:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant='ghost' tone='neutral' size='icon-sm' aria-label='Open site navigation' className='site-menu-trigger'>
            <Icon name='Menu' decorative size='sm' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='site-navigation-sheet' aria-describedby={undefined} onCloseAutoFocus={(event: Event) => {
          if (window.matchMedia('(min-width: 1280px)').matches) {
            event.preventDefault();
            document.querySelector<HTMLAnchorElement>('.site-header a[href="/"]')?.focus();
          }
        }}>
          <SheetHeader><SheetTitle>Explore Gaudi</SheetTitle></SheetHeader>
          <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6' onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) setOpen(false);
          }}>
            <TopNavLinks className='site-mobile-links' />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** Stand-alone header for the home and themes pages. Docs pages use the AppShell header. */
export function SiteHeader() {
  return (
    <header className='site-header'>
      <a href='#main' className='ds-skip-link'>Skip to content</a>
      <div className='site-header-row mx-auto flex min-h-14 max-w-[90rem] items-center gap-3 px-4 sm:px-6'>
        <MobileNav />
        <Brand />
        <TopNavMenu className='ms-4 hidden xl:flex' />
        <HeaderActions />
      </div>
    </header>
  );
}
