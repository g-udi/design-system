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

import Button from '../../core/Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../core/Accordion';
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
 * @param {Array<{ id: string|number, href?: string, title: string, series: string, order?: number }>} props.series - Prepared posts in reading order
 * @param {string|number} props.currentId - Current post's stable ID
 * @param {string} [props.className] - Root classes
 * @param {{ root?: string, trigger?: string, body?: string }} [props.classNames] - Part classes
 * @returns {JSX.Element|null} Collapsible series card, or nothing when `series` is empty
 *
 * @example
 * <PostSeriesBox series={seriesPosts} currentId='post-1' />
 */
const PostSeriesBox = ({ className, classNames = {}, series, currentId }) => {
  if (!series?.length) return null;

  const currentIndex = currentId == null ? -1 : series.findIndex((post) => post.id === currentId);
  const completedCount = currentIndex + 1;
  const totalCount = series.length;

  return (
    <Collapsible asChild>
    <Card variant='outline' padding='none' className={ cn('group/series mb-6 h-auto', className, classNames.root) }>
      <CollapsibleTrigger asChild>
      <Button
        variant='ghost'
        tone='neutral'
        size='sm'
        className={ cn('w-full rounded-none p-3 text-left font-normal hover:bg-surface-muted sm:p-4', classNames.trigger) }
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
            className='text-text-subtle transition-transform duration-200 group-data-[state=open]/series:rotate-180 motion-reduce:transition-none'
          />
        </span>
      </Button>
      </CollapsibleTrigger>

      <CollapsibleContent asChild>
      <ol className={ cn('grid max-h-80 gap-2 overflow-y-auto border-t border-border px-3 py-3 sm:px-4 sm:py-4', classNames.body) }>
        {series.map((post, index) => {
          const isCurrent = index === currentIndex;
          const state = isCurrent ? 'current' : index < currentIndex ? 'done' : 'upcoming';

          return (
            <li key={ post.id } className='flex items-baseline gap-2 text-xs sm:gap-3 sm:text-sm'>
              <span aria-hidden='true' className={ cn('size-2 shrink-0 self-center rounded-full', markerClasses[state]) } />
              {post.order != null && <span className='w-4 shrink-0 text-xs text-text-muted'>{post.order}.</span>}
              {isCurrent ? (
                <span aria-current='step' className='min-w-0 font-medium text-text'>{post.title}</span>
              ) : (
                <Link href={ post.href } variant='muted' className='min-w-0 font-normal'>{post.title}</Link>
              )}
            </li>
          );
        })}
      </ol>
      </CollapsibleContent>
    </Card>
    </Collapsible>
  );
};

export default PostSeriesBox;
