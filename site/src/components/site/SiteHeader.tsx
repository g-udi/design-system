'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
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
    <Link href='/' className='inline-flex items-center gap-2 font-semibold text-text no-underline' data-plain>
      {/* Dark tile on light themes, white tile on dark ones. */}
      <Image src='/brand/gaudi-icon-dark.svg' alt='' aria-hidden width={28} height={28} priority className='size-7 dark:hidden' />
      <Image src='/brand/gaudi-icon-light.svg' alt='' aria-hidden width={28} height={28} priority className='hidden size-7 dark:block' />
      <span className='whitespace-nowrap'>{siteConfig.name}</span>
      <span className='sr-only'>{siteConfig.product} home</span>
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
    <div className='ms-auto flex shrink-0 items-center gap-1'>
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

/** Stand-alone header for the home and themes pages. Docs pages use the AppShell header. */
export function SiteHeader() {
  return (
    <header className='site-header'>
      <div className='mx-auto flex h-14 max-w-[90rem] items-center gap-3 px-4 sm:px-6'>
        <Brand />
        <TopNavMenu className='ms-4 hidden lg:flex' />
        <HeaderActions />
      </div>
      <TopNavLinks className='overflow-x-auto border-t border-border px-2 py-1 lg:hidden' />
    </header>
  );
}
