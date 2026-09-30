'use client';

/**
 * MenuMain Component
 *
 * @description The site header's Blog dropdown: blog categories on the left and the three most recent
 * posts on the right. Built on MenuDropdownPanel, so render it inside a NavigationMenuList.
 *
 * @author Ahmad Assaf
 * @version 3.0.0
 */

import MenuDropdownPanel from '../MenuDropdownPanel';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { NavigationMenuLink, NavigationMenuLinkPrimitive } from '../../core/NavigationMenu';
import formatDate from '../../../utilities/formatDate';
import { useSiteConfig } from '../../../utilities/SiteConfig';

/**
 * Recent-posts column rendered inside the dropdown panel
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.allPosts - Blog post objects; the three most recent are shown
 * @param {string} [props.locale] - Locale for date formatting
 * @returns {JSX.Element} The recent-posts panel column
 */
const RecentPosts = ({ allPosts, locale }) => (
  <div className='border-t border-border bg-surface-muted p-2 sm:border-s sm:border-t-0'>
    <div className='flex items-center justify-between px-3 py-2'>
      <h3 className='text-sm font-semibold text-text-muted'>Recent posts</h3>
      <NavigationMenuLinkPrimitive asChild className='gap-1 p-0 text-xs hover:bg-transparent focus:bg-transparent'>
        <Link href='/blog' variant='muted'>
          See all
          <Icon name='ArrowRight' decorative size='xs' />
        </Link>
      </NavigationMenuLinkPrimitive>
    </div>
    <ul className='m-0 grid list-none gap-0.5 p-0'>
      {allPosts.slice(0, 3).map((post) => (
        <li key={ post.slug }>
          <NavigationMenuLink variant='panel' href={ `/blog/${post.slug}` } description={ formatDate(post.date, locale) }>
            <span className='block truncate'>{post.title}</span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Renders the Blog dropdown with categories and recent posts
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.categories - Blog category objects ({ id, title, description })
 * @param {Array<Object>} props.allPosts - Blog post objects (the three most recent are shown)
 *
 * @returns {JSX.Element} The Blog dropdown menu item
 *
 * @example
 * <MenuMain categories={blogCategories} allPosts={recentPosts} />
 */
const MenuMain = ({ categories, allPosts = [] }) => {
  const { metadata } = useSiteConfig();

  return <MenuDropdownPanel name='Blog' categories={ categories } aside={ <RecentPosts allPosts={ allPosts } locale={ metadata.locale } /> } />;
};

export default MenuMain;
