'use client';

/**
 * Site header (Blocks/Navigation)
 *
 * @description The site header: brand mark, the primary NavigationMenu (links plus the Blog or Categories
 * dropdown), search, theme switch, and the phone sheet below `lg`. Adapts its content to the current route
 * and opens the command launcher.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '../../../hooks/environment/use-media-query.js';

import CommandLauncher from '../../core/Commander';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { NavigationMenu, NavigationMenuAside, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList } from '../../core/NavigationMenu';
import BrandMark from './BrandMark.jsx';
import MenuMobile from './MenuMobile.jsx';
import MenuSearch from './MenuSearch.jsx';
import ThemeSwitch from './ThemeSwitch.jsx';
import { coreContent, sortPosts } from '../../../utilities/content';
import formatDate from '../../../utilities/formatDate';
import { useSiteConfig } from '../../../context';

/** Category destinations for a Blog or Categories panel. */
const CategoryLinks = ({ categories }) => (
  <ul className='m-0 grid list-none content-start gap-0.5 p-0'>
    {categories.map((category) => (
      <li key={ category.id }>
        <NavigationMenuLink variant='panel' href={ category.href } description={ category.description }>
          {category.title}
        </NavigationMenuLink>
      </li>
    ))}
  </ul>
);

/** The Blog panel's second block: the three most recent posts and a See all link. */
const RecentPosts = ({ locale, posts, blogLink }) => (
  <NavigationMenuAside title='Recent posts' action={blogLink ? { href: blogLink.href, label: 'See all' } : undefined}>
    <ul className='m-0 grid list-none gap-0.5 p-0'>
      {posts.slice(0, 3).map((post) => (
        <li key={ post.id ?? post.slug ?? post.href }>
          <NavigationMenuLink variant='panel' href={ post.href } description={ formatDate(post.date, locale) }>
            <span className='block truncate'>{post.title}</span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  </NavigationMenuAside>
);

/**
 * Renders the site header
 *
 * @param {Object} props - Searchable content collections for the Blog panel and the command launcher
 * @param {React.ReactNode} [props.logo] - Brand shown in the home link; defaults to the Gaudi brand mark
 * @returns {JSX.Element} The site header
 *
 * @example
 * <Menu categories={categories} posts={posts} logo={<img src='/logo.svg' alt='' className='size-10' />} />
 */
const Menu = ({
  blogLink,
  categories: categoriesProp,
  logo,
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
  const shouldShowLink = (link) => {
    if (link.hideInPath === '*') return Boolean(link.showInPath && path.includes(link.showInPath));

    return !link.hideInPath || !path.includes(link.hideInPath);
  };
  const blogPath = blogLink?.href?.replace(/\/$/, '');
  const mobileLinks = navigation.links.filter((link) => link.href.replace(/\/$/, '') !== blogPath && shouldShowLink(link));
  const isActivePath = (href) => path === href || (href !== '/' && path.startsWith(`${href}/`));
  const onBlogRoute = Boolean(blogPath && (path === blogPath || path.startsWith(`${blogPath}/`)));

  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
  const [ LauncherOpen, LauncherSetOpen ] = useState(false);
  const mobileMenuTriggerRef = useRef(null);
  const desktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (desktop) setMobileMenuOpen(false);
  }, [desktop]);

  return (
    <header className='flex min-h-14 items-center justify-between gap-4 py-3 lg:py-4'>
      <Link href='/' aria-label={ metadata.author?.name || metadata.title || 'Home' } variant='bare' className='shrink-0 text-text'>
        {logo ?? <BrandMark />}
      </Link>

      <div className='flex min-w-0 items-center gap-3 lg:gap-5'>
        <NavigationMenu label='Main navigation' className='hidden w-auto lg:flex'>
          <NavigationMenuList className='gap-2 xl:gap-4'>
            {navigation.links.filter(shouldShowLink).map((link) => (
              <NavigationMenuLink key={ link.href } href={ link.href } active={ isActivePath(link.href) } className='whitespace-nowrap'>
                {link.title}
              </NavigationMenuLink>
            ))}
            {blogLink ? onBlogRoute ? (
              <NavigationMenuDropdown label='Categories' align='center' width='md'>
                <CategoryLinks categories={ menuCategories } />
              </NavigationMenuDropdown>
            ) : (
              <NavigationMenuDropdown label={blogLink.title} align='center' width='2xl' aside={ <RecentPosts posts={ posts } locale={ metadata.locale } blogLink={blogLink} /> }>
                <CategoryLinks categories={ menuCategories } />
              </NavigationMenuDropdown>
            ) : null}
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
          navigation={navigation.links.map((link) => ({ ...link, id: link.id ?? link.href, title: link.title, href: link.href }))}
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
