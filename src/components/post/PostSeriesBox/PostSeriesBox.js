'use client';

/**
 * PostSeriesBox Component
 *
 * @description Beautiful, collapsible series navigation component that displays related posts in a blog post series.
 * Shows the series title and can be expanded to reveal all posts with the current post highlighted.
 * Features smooth animations and elegant design with improved UX.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useId, useState } from 'react';

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';

/**
 * Renders a beautiful, collapsible series navigation box with related posts
 *
 * @description Displays an elegant card containing the series name with expand/collapse functionality.
 * When collapsed, shows only the series title with a chevron indicator. When expanded, reveals
 * all posts in the series with the current post highlighted. Features smooth animations,
 * progress indication, and modern design aesthetics.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.series - Array of posts in the series
 * @param {string} props.series[].slug - URL slug for the post
 * @param {string} props.series[].title - Title of the post
 * @param {string} props.series[].series - Name of the series (same for all posts)
 * @param {number} [props.series[].order] - Optional order number for the post
 * @param {string} props.slug - Current post's slug for highlighting
 *
 * @returns {JSX.Element} Collapsible series navigation card with post list
 *
 * @example
 * // Basic usage with series data
 * const seriesPosts = [
 *   { slug: 'post-1', title: 'Part 1: Introduction', series: 'React Tutorial', order: 1 },
 *   { slug: 'post-2', title: 'Part 2: Components', series: 'React Tutorial', order: 2 }
 * ];
 * <PostSeriesBox series={seriesPosts} slug="post-1" />
 */
const PostSeriesBox = ({ className, classNames = {}, series, slug }) => {
  const [ isExpanded, setIsExpanded ] = useState(false);
  const contentId = useId();

  if (!series || series.length === 0) return null;

  const currentPostIndex = series.findIndex((post) => post.slug === slug);
  const completedCount = currentPostIndex >= 0 ? currentPostIndex + 1 : 0;
  const totalCount = series.length;
  const progressPercentage = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={ cn('mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-border-dark dark:bg-gray-800', className, classNames.root) }>

      {/* Header - Always Visible */}
      <Button
        variant='ghost'
        tone='gray'
        size='sm'
        onClick={ () => setIsExpanded(!isExpanded) }
        className={ cn('w-full cursor-pointer rounded-none p-3 text-left font-normal hover:bg-transparent dark:hover:bg-transparent sm:p-4', classNames.trigger) }
        aria-expanded={ isExpanded }
        aria-controls={ contentId }
      >
        <div className='flex w-full items-center justify-between gap-4'>
          <div className='flex min-w-0 flex-1 items-center gap-2 sm:gap-3'>
            <Icon name='Square3Stack3DIcon' size='sm' decorative className='text-blue-500' />
            <span className='truncate text-sm font-medium text-gray-900 dark:text-gray-100'>
              {series[0].series}
            </span>
          </div>

          <div className='flex flex-shrink-0 items-center space-x-2'>
            <div
              className='h-1 w-12 overflow-hidden rounded-control bg-gray-200 dark:bg-gray-700 sm:w-16'
              role='progressbar'
              aria-label='Series progress'
              aria-valuemin='0'
              aria-valuemax={ totalCount }
              aria-valuenow={ completedCount }
            >
              <div
                className='h-full rounded-control bg-green-600 transition-[width] duration-300 motion-reduce:transition-none'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className='whitespace-nowrap text-xs text-gray-500 dark:text-gray-400'>
              {completedCount}/{totalCount}
            </span>

            <Icon
              name='ChevronDown'
              size='sm'
              decorative
              className={ `text-gray-400 transition-transform duration-200 motion-reduce:transition-none ${
                isExpanded ? 'rotate-180' : ''
              }` }
            />
          </div>
        </div>
      </Button>

      {/* Expandable Content */}
      <div
        id={ contentId }
        hidden={ !isExpanded }
        className={ cn(`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? 'max-h-[500px] sm:max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } motion-reduce:transition-none`, classNames.body) }
      >
        <div className='px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-border-dark'>
          <div className='mt-3 sm:mt-4 space-y-2 overflow-y-auto max-h-[450px] sm:max-h-80'>
            {series.map((post, index) => {
              const isCurrentPost = post.slug === slug;
              const isCompleted = index <= currentPostIndex && currentPostIndex >= 0;

              const getCircleComponent = () => {
                if (isCurrentPost) return <div className='w-2 h-2 bg-green-600 rounded-full' />;

                if (isCompleted) return <div className='w-2 h-2 bg-blue-600 rounded-full' />;

                return <div className='w-2 h-2 border border-gray-300 dark:border-border-dark rounded-full' />;
              };

              return (
                <div key={ post.slug } className='flex items-start sm:items-center space-x-2 sm:space-x-3 py-1'>
                  <div className='flex-shrink-0 mt-1 sm:mt-0'>
                    {getCircleComponent()}
                  </div>

                  {post.order && (
                    <span className='text-xs text-gray-500 dark:text-gray-400 w-4 flex-shrink-0'>
                      {post.order}.
                    </span>
                  )}

                  <div className='flex-1 min-w-0'>
                    {isCurrentPost ? (
                      <span aria-current='step' className='block text-xs font-medium text-gray-900 dark:text-gray-100 sm:inline sm:text-sm'>
                        {post.title}
                      </span>
                    ) : (
                      <Link
                        href={ `/blog/${post.slug}` }
                        className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 block sm:inline'
                      >
                        {post.title}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSeriesBox;
