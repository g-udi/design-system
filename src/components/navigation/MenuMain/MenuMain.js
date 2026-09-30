'use client';

/**
 * MenuMain Component
 *
 * @description Main navigation dropdown component that displays both blog categories and recent posts.
 * This comprehensive navigation menu combines category browsing with recent post discovery,
 * providing users with multiple pathways to explore blog content. Features a two-section layout
 * with categories on the left and recent posts in a highlighted right column.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import MenuDropdownPanel from '../MenuDropdownPanel';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
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
  <div className='bg-gray-50/80 p-2 dark:bg-gray-800/60'>
    <div className='flex items-center justify-between px-3 py-2'>
      <h3 className='text-sm font-semibold leading-5 text-gray-500 dark:text-gray-400'>Recent posts</h3>
      <Link href={ `/blog` } className='inline-flex items-center gap-1 text-xs font-medium leading-5 text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300'>
        See all
        <Icon name='ArrowRight' decorative size='xs' />
      </Link>
    </div>
    <ul role='list' className='space-y-0.5 pb-1'>
      {allPosts.slice(0, 3).map((post) => (
        <li key={ post.slug } className='group relative rounded-lg px-3 py-2 hover:bg-white dark:hover:bg-gray-800'>
          <time dateTime={ post.date } className='block text-xs font-normal leading-5 text-gray-600 dark:text-gray-300'>{formatDate(post.date, locale)}</time>
          <Link href={ `/blog/${post.slug}` } className='block truncate text-sm font-medium leading-5 text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'>
            {post.title}
            <span className='absolute inset-0'></span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Renders the main navigation dropdown with categories and recent posts
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.categories - Array of blog category objects ({ id, title, description })
 * @param {Array<Object>} props.allPosts - Array of all blog post objects (recent 3 will be shown)
 *
 * @returns {JSX.Element} Main navigation dropdown with categories and recent posts
 *
 * @example
 * <MenuMain categories={blogCategories} allPosts={recentPosts} />
 */
const MenuMain = ({ categories, allPosts }) => {
  const { metadata } = useSiteConfig();

  return <MenuDropdownPanel name='Blog' categories={ categories } aside={ <RecentPosts allPosts={ allPosts } locale={ metadata.locale } /> } />;
};

export default MenuMain;
