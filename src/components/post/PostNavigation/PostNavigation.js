/**
 * PostNavigation Component
 *
 * @description Navigation component that provides links to previous and next blog posts.
 * Features responsive design that stacks vertically on mobile devices and displays
 * side-by-side on larger screens. Only renders when there are adjacent posts available.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';

/**
 * Renders navigation links to adjacent blog posts
 *
 * @description Contextual navigation component that displays links to the previous and next
 * blog posts in the chronological sequence. Features responsive layout that adapts to
 * different screen sizes and only renders when adjacent posts exist.
 *
 * @param {Object} props - Component props
 * @param {Object|null} props.next - Next blog post object
 * @param {string} props.next.href - Prepared destination for the next post
 * @param {string} props.next.title - Title of the next post
 * @param {Object|null} props.prev - Previous blog post object
 * @param {string} props.prev.href - Prepared destination for the previous post
 * @param {string} props.prev.title - Title of the previous post
 * @param {2|3|4|5|6} [props.headingLevel=2] - Semantic level for the previous/next labels
 * @param {string} [props.type='Post'] - Content type (Post or Thought)
 *
 * @returns {JSX.Element} Post navigation links with responsive layout
 *
 * @example
 * // Basic usage with both posts
 * const nextPost = { href: '/articles/next-post', title: 'Next Post Title' };
 * const prevPost = { href: '/articles/prev-post', title: 'Previous Post Title' };
 * <PostNavigation next={nextPost} prev={prevPost} />
 *
 * @example
 * // Usage with only one adjacent post
 * <PostNavigation next={null} prev={prevPost} />
 */
const headingElements = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };
const labelClasses = 'mb-1 flex items-center gap-1.5 text-xs text-text-muted';
const titleClasses = 'block font-semibold text-text transition-colors group-hover:text-accent';

const PostNavigation = ({ headingLevel = 2, next, prev, type = 'Post' }) => {
  const isThought = type === 'Thought';
  const label = isThought ? 'Thought' : 'Article';
  const Heading = headingElements[headingLevel] || headingElements[2];

  if (!next?.href && !prev?.href) return null;

  return (
    <nav aria-label={ `${label} navigation` } className='mt-10 text-sm font-medium leading-5'>
      <div className='flex justify-between gap-6 max-sm:flex-col max-sm:gap-0'>
        {prev?.href && (
          <Link
            className='group block max-w-[46%] py-4 max-sm:max-w-full max-sm:py-3'
            href={ prev.href }
            variant='bare'
          >
            <Heading className={ labelClasses }>
              <Icon name='ArrowLeft' decorative size='xs' className='transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none' />
              Previous {label}
            </Heading>
            <span className={ titleClasses }>
              {prev.title}
            </span>
          </Link>
        )}
        {next?.href && (
          <Link
            className='group ml-auto block max-w-[46%] py-4 text-right max-sm:ml-0 max-sm:max-w-full max-sm:py-3 max-sm:text-left'
            href={ next.href }
            variant='bare'
          >
            <Heading className={ cn(labelClasses, 'justify-end max-sm:justify-start') }>
              Next {label}
              <Icon name='ArrowRight' decorative size='xs' className='transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none' />
            </Heading>
            <span className={ titleClasses }>
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default PostNavigation;
