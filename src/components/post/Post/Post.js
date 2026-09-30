/**
 * Post Component
 *
 * @description Individual blog post preview component that displays post metadata and title
 * in a structured list format. Features responsive design, draft indication, and hover effects.
 * Used in blog listings to provide a consistent post preview experience.
 *
 * @author Ahmad Assaf
 * @version 1.1.0
 */

import Typography from '../../../foundations/Typography';
import { categoryHref } from '../../../utilities/taxonomy';
import formatDate from '../../../utilities/formatDate';
import Link from '../../core/Link';
import Pill from '../../core/Pill';

/**
 * Enhanced clean post component
 *
 * @description Clean, typography-focused post preview with subtle improvements
 * while maintaining the minimal aesthetic. Enhanced spacing, hover states, and metadata display.
 *
 * @param {Object} props - Component props
 * @param {Object} props.frontMatter - Post front matter (title, date, slug, category, subtitle, draft)
 * @param {string} [props.locale] - Locale passed to the date formatter
 * @param {string} [props.titleAs='h3'] - Heading element used for the post title
 */
const Post = ({ frontMatter = {}, locale, titleAs = 'h3' }) => {
  const baseUrl = frontMatter.type === 'Thought' ? '/thoughts' : '/blog';

  return (
    <li className='group'>
      <article className='border-b border-border-muted py-3 dark:border-border-dark last:border-b-0'>
        <div className='min-w-0'>
          <div className='mb-1 flex items-center gap-2 text-sm'>
            <Typography
              as='time'
              variant='post-meta'
              dateTime={ frontMatter.date }
              className='font-medium transition-colors duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300'
            >
              {formatDate(frontMatter.date, locale)}
            </Typography>

            {frontMatter.category && (
              <>
                <span className='text-gray-300 dark:text-gray-600'>·</span>
                <Pill href={ categoryHref(frontMatter.category) } tone='blue' variant='subtle' size='xs' radius='md' className='my-0 mr-0 normal-case tracking-normal capitalize'>
                  {frontMatter.category}
                </Pill>
              </>
            )}

            {frontMatter.draft && (
              <>
                <span className='text-gray-300 dark:text-gray-600'>·</span>
                <Pill tone='amber' variant='soft' size='xs' className='my-0 mr-0'>Draft</Pill>
              </>
            )}
          </div>

          <Typography variant='index-list-title' as={ titleAs } className='mb-1'>
            <Link href={ `${baseUrl}/${frontMatter.slug}` } className='font-semibold transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
              {frontMatter.title}
            </Link>
          </Typography>

          {frontMatter.subtitle && (
            <Typography variant='paragraph-sm' className='line-clamp-2 leading-5 dark:text-gray-300'>
              {frontMatter.subtitle}
            </Typography>
          )}
        </div>
      </article>
    </li>
  );
};

export default Post;
