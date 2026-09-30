'use client';

/**
 * Main Navigation Menu Component
 *
 * @description The site header: logo, the primary NavigationMenu (links plus the Blog or Categories
 * dropdown), search, theme switch, and the mobile menu below `lg`. Adapts its content to the current route
 * and opens the command launcher.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import CommandLauncher from '../../core/Commander';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from '../../core/NavigationMenu';
import MenuDropdownPanel from '../MenuDropdownPanel';
import ThemeLogo from '../MenuLogo';
import MenuMain from '../MenuMain';
import MenuMobile from '../MenuMobile';
import MenuSearch from '../MenuSearch';
import ThemeSwitch from '../../../utilities/ThemeSwitcher';
import { coreContent, sortPosts } from '../../../utilities/content';
import { useSiteConfig } from '../../../utilities/SiteConfig';

/**
 * Renders the site header
 *
 * @param {Object} props - Searchable content collections for the Blog panel and the command launcher
 * @returns {JSX.Element} The site header
 *
 * @example
 * <Menu categories={categories} posts={posts} />
 */
const Menu = ({
  categories: categoriesProp,
  posts: postsProp,
  projects: projectsProp,
  publications: publicationsProp,
  tags: tagsProp,
  thoughts: thoughtsProp
}) => {
  const path = usePathname();
  const { metadata, navigation } = useSiteConfig();

  // Memoize expensive operations
  const posts = useMemo(() => coreContent(sortPosts(postsProp || [])), [ postsProp ]);
  const projects = useMemo(() => coreContent(sortPosts(projectsProp || [])), [ projectsProp ]);
  const thoughts = useMemo(() => coreContent(sortPosts(thoughtsProp || [])), [ thoughtsProp ]);
  const menuCategories = categoriesProp || [];
  const menuPublications = publicationsProp || [];
  const menuTags = tagsProp || [];
  const blogLink = navigation.links.find((link) => link.href === '/blog' || link.href === '/blog/');
  const shouldShowLink = (link) => {
    if (link.hideInPath === '*') return Boolean(link.showInPath && path.includes(link.showInPath));

    return !link.hideInPath || !path.includes(link.hideInPath);
  };
  const mobileLinks = navigation.links.filter((link) => link !== blogLink && shouldShowLink(link));
  const isActivePath = (href) => path === href || (href !== '/' && path.startsWith(`${href}/`));
  const onBlogRoute = path.includes('/blog');

  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
  const [ LauncherOpen, LauncherSetOpen ] = useState(false);
  const mobileMenuTriggerRef = useRef(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setMobileMenuOpen(false);
    };

    closeOnDesktop(desktopQuery);
    desktopQuery.addEventListener('change', closeOnDesktop);

    return () => desktopQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <header className='flex min-h-14 items-center justify-between gap-4 py-3 lg:py-4'>
      <Link href='/' aria-label={ metadata.author.name || metadata.title || 'Home' } variant='bare' className='shrink-0 text-text'>
        <ThemeLogo />
      </Link>

      <div className='flex min-w-0 items-center gap-3 lg:gap-5'>
        <NavigationMenu label='Main navigation' className='hidden w-auto lg:flex'>
          <NavigationMenuList className='gap-2 xl:gap-4'>
            {navigation.links.filter(shouldShowLink).map((link) => (
              <NavigationMenuLink key={ link.href } href={ link.href } active={ isActivePath(link.href) } className='whitespace-nowrap'>
                {link.title}
              </NavigationMenuLink>
            ))}
            {onBlogRoute
              ? <MenuDropdownPanel name='Categories' categories={ menuCategories } />
              : <MenuMain categories={ menuCategories } allPosts={ posts } />}
          </NavigationMenuList>
        </NavigationMenu>

        <MenuSearch className='hidden lg:block' setOpen={ LauncherSetOpen } />

        <ThemeSwitch />

        <Button ref={ mobileMenuTriggerRef } variant='ghost' tone='neutral' size='icon' className='size-11 lg:hidden' onClick={ () => setMobileMenuOpen(true) }>
          <span className='sr-only'>Open main menu</span>
          <Icon name='Menu' decorative size='md' />
        </Button>

        {mobileMenuOpen ? (
          <MenuMobile
            blogLink={ blogLink }
            categories={ menuCategories }
            links={ mobileLinks }
            setMobileMenuOpen={ setMobileMenuOpen }
            setLauncherOpen={ LauncherSetOpen }
          />
        ) : null}
        <CommandLauncher
          tags={ menuTags }
          projects={ projects }
          posts={ posts }
          thoughts={ thoughts }
          publications={ menuPublications }
          open={ LauncherOpen }
          restoreFocusRef={ mobileMenuTriggerRef }
          setOpen={ LauncherSetOpen }
        />
      </div>
    </header>
  );
};

export default Menu;
