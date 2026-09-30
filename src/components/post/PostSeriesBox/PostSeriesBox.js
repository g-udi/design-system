'use client';

/**
 * PostSeriesBox Component
 *
 * @description Collapsible series navigation for a blog post that belongs to a series. The header shows the
 * series name and reading progress; expanding it lists every part with the current post marked.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useId, useState } from 'react';

import Button from '../../core/Button';
import Card from '../../core/Card';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { ProgressRoot } from '../../core/Progress';
import { cn } from '../../../utilities/cn';

const markerClasses = {
  current: 'bg-accent',
  done: 'bg-text-subtle',
  upcoming: 'border border-text-subtle'
};

/**
 * @param {Object} props - Component props
 * @param {Array<{ slug: string, title: string, series: string, order?: number }>} props.series - Posts in the series, in reading order
 * @param {string} props.slug - Current post's slug
 * @param {string} [props.className] - Root classes
 * @param {{ root?: string, trigger?: string, body?: string }} [props.classNames] - Part classes
 * @returns {JSX.Element|null} Collapsible series card, or nothing when `series` is empty
 *
 * @example
 * <PostSeriesBox series={seriesPosts} slug='post-1' />
 */
const PostSeriesBox = ({ className, classNames = {}, series, slug }) => {
  const [ isExpanded, setIsExpanded ] = useState(false);
  const contentId = useId();

  if (!series?.length) return null;

  const currentIndex = series.findIndex((post) => post.slug === slug);
  const completedCount = currentIndex + 1;
  const totalCount = series.length;

  return (
    <Card variant='outline' padding='none' className={ cn('mb-6 h-auto', className, classNames.root) }>
      <Button
        variant='ghost'
        tone='neutral'
        size='sm'
        onClick={ () => setIsExpanded(!isExpanded) }
        className={ cn('w-full rounded-none p-3 text-left font-normal hover:bg-surface-muted sm:p-4', classNames.trigger) }
        aria-expanded={ isExpanded }
        aria-controls={ contentId }
      >
        <span className='flex min-w-0 flex-1 items-center gap-2 sm:gap-3'>
          <Icon name='Square3Stack3DIcon' size='sm' decorative className='text-accent' />
          <span className='truncate text-sm font-medium text-text'>{series[0].series}</span>
        </span>
        <span className='flex shrink-0 items-center gap-2'>
          <ProgressRoot aria-label='Series progress' value={ completedCount } max={ totalCount } className='w-12 sm:w-16' />
          <span className='whitespace-nowrap text-xs text-text-muted'>{completedCount}/{totalCount}</span>
          <Icon
            name='ChevronDown'
            size='sm'
            decorative
            className={ cn('text-text-subtle transition-transform duration-200 motion-reduce:transition-none', isExpanded && 'rotate-180') }
          />
        </span>
      </Button>

      <ol id={ contentId } hidden={ !isExpanded } className={ cn('max-h-80 space-y-2 overflow-y-auto border-t border-border px-3 py-3 sm:px-4 sm:py-4', classNames.body) }>
        {series.map((post, index) => {
          const isCurrent = index === currentIndex;
          const state = isCurrent ? 'current' : index < currentIndex ? 'done' : 'upcoming';

          return (
            <li key={ post.slug } className='flex items-baseline gap-2 text-xs sm:gap-3 sm:text-sm'>
              <span aria-hidden='true' className={ cn('size-2 shrink-0 self-center rounded-full', markerClasses[state]) } />
              {post.order && <span className='w-4 shrink-0 text-xs text-text-muted'>{post.order}.</span>}
              {isCurrent ? (
                <span aria-current='step' className='min-w-0 font-medium text-text'>{post.title}</span>
              ) : (
                <Link href={ `/blog/${post.slug}` } variant='muted' className='min-w-0 font-normal'>{post.title}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
};

export default PostSeriesBox;
