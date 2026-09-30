/**
 * PostHeader Component
 *
 * @description Comprehensive blog post header component that displays all post metadata,
 * including title, subtitle, category, tags, publication date, reading time, and sharing options.
 * Features responsive design and conditional rendering based on table of contents presence.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Icon from '../../core/Icon';
import Link from '../../core/Link';
import Pill from '../../core/Pill';
import PostSeriesBox from '../PostSeriesBox';
import Typography from '../../../foundations/Typography';
import { cn } from '../../../utilities/cn';
import { categoryHref, tagHref } from '../../../utilities/taxonomy';

/**
 * Renders the complete blog post header with metadata and navigation
 *
 * @description Full-featured post header that adapts its width based on table of contents presence.
 * Displays category metadata, draft indicators, title/subtitle, timestamps, tags, sharing options,
 * and series information when available. Features responsive design for different screen sizes.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.frontMatter={}] - Post metadata object
 * @param {string} props.frontMatter.title - Post title
 * @param {string} props.frontMatter.subtitle - Post subtitle
 * @param {string} props.frontMatter.category - Post category
 * @param {string} props.frontMatter.date - Publication date
 * @param {string} [props.frontMatter.updated] - Last updated date
 * @param {boolean} [props.frontMatter.draft] - Draft status
 * @param {boolean} [props.frontMatter.tableOfContents] - Whether to show TOC
 * @param {Array<string>} [props.frontMatter.tags] - Post tags
 * @param {string} props.frontMatter.slug - Post URL slug
 * @param {Object} props.frontMatter.readingTime - Reading time object
 * @param {string} props.frontMatter.readingTime.text - Formatted reading time
 * @param {string} props.frontMatter.fileName - Source file name
 * @param {string} [props.frontMatter.externalLink] - External link for source
 * @param {Array} [props.frontMatter.seriesPosts] - Related series posts
 * @param {Object} [props.siteMetadata={}] - Site configuration object
 * @param {string} props.siteMetadata.locale - Site locale for date formatting
 * @param {Array} props.toc - Table of contents array
 * @param {1|2|3|4|5|6} [props.titleLevel=1] - Semantic heading level for the post title
 *
 * @returns {JSX.Element} Complete post header with all metadata
 *
 * @example
 * // Basic usage with post data
 * <PostHeader
 *   frontMatter={postMetadata}
 *   siteMetadata={siteConfig}
 *   toc={tableOfContents}
 * />
 */
const titleElements = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

const isValidPostDate = (date) => date && !Number.isNaN(new Date(date).getTime());

const PostHeader = ({ className, classNames = {}, frontMatter = {}, siteMetadata = {}, titleLevel = 1, tocControl }) => (
  <div className={ cn('w-full pt-6 max-xl:w-full', className, classNames.root) }>

    <div className={ cn('mb-2 flex flex-wrap items-center gap-3', classNames.meta) }>
      {frontMatter.category && (
        <Link
          href={ categoryHref(frontMatter.category) }
          className={ cn('flex w-fit cursor-pointer items-center gap-2 text-xs font-normal text-gray-600 hover:text-gray-800 sm:text-sm dark:text-gray-400 dark:hover:text-gray-200', classNames.category) }
        >
          <div className='size-2 flex-shrink-0 rounded-full bg-green-500'></div>
          {frontMatter.category.charAt(0).toUpperCase() + frontMatter.category.slice(1)}
        </Link>
      )}
      {isValidPostDate(frontMatter.updated || frontMatter.date) ? (
        <span className='inline-flex items-center gap-3 whitespace-nowrap'>
          {frontMatter.category ? <span aria-hidden='true' className='text-gray-300 dark:text-gray-600'>·</span> : null}
          <PostDate date={ frontMatter.updated || frontMatter.date } locale={ siteMetadata.locale } />
        </span>
      ) : null}
      {frontMatter.draft && <Pill tone='amber' variant='soft' size='xs' className='my-0 mr-0'>Draft</Pill>}
    </div>
    <div className={ cn('text-left', classNames.body) }>
      <Typography as={ titleElements[titleLevel] || titleElements[1] } variant='post-title' className={ cn('pb-3', classNames.title) }>
        {frontMatter.title}
      </Typography>
      <Typography variant='post-subtitle' className={ classNames.subtitle }>
        {frontMatter.subtitle}
      </Typography>
    </div>

    {tocControl ? (
      <PostTimestamps
        action={ tocControl }
        className={ cn('mt-4 hidden lg:flex', classNames.timestamps) }
        readingTime={ frontMatter.readingTime?.text }
      />
    ) : null}

    {frontMatter.tags ? (
      <div className={ cn('my-5 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between', classNames.actions) }>
        <div className={ cn('flex flex-wrap gap-2', classNames.tags) }>
          {frontMatter.tags.map((tag) => (
            <Pill key={ tag } href={ tagHref(tag) } tone='gray' variant='subtle' size='sm' radius='md' className={ cn('my-0 mr-0 bg-gray-100 text-xs normal-case tracking-normal capitalize dark:bg-gray-800 sm:text-sm', classNames.tag) }>
              {tag}
            </Pill>
          ))}
        </div>
      </div>
    ) : null}

    {frontMatter.seriesPosts && (
      <PostSeriesBox series={ frontMatter.seriesPosts } slug={ frontMatter.slug } className={ classNames.series } />
    )}

  </div>
);

export default PostHeader;

export const PostDate = ({ className, date, locale }) => {
  const postDate = new Date(date);
  const isValidDate = isValidPostDate(date);
  const formattedDate = isValidDate ? postDate.toLocaleDateString(locale, {
    'day': 'numeric',
    'month': 'short',
    'year': 'numeric'
  }) : '';

  if (!isValidDate) return null;

  return (
    <time dateTime={ date } className={ cn('text-xs font-normal tabular-nums text-gray-500 dark:text-gray-400', className) }>
      {formattedDate}
    </time>
  );
};

export const PostReadingTime = ({ className, readingTime }) => {
  if (!readingTime) return null;

  return (
    <span className={ cn('inline-flex items-center gap-2 text-xs font-normal', className) }>
      <Icon name='BookOpen' size='sm' decorative className='text-gray-400' />
      <span>{readingTime}</span>
    </span>
  );
};

/**
 * Renders post timestamps including publication date and reading time
 *
 * @description Displays the post's publication/update date and estimated reading time
 * with appropriate icons. Features semantic markup and accessibility attributes.
 *
 * @param {Object} props - Component props
 * @param {string} props.date - Publication or update date (ISO format)
 * @param {string} props.locale - Locale for date formatting
 * @param {string} props.readingTime - Formatted reading time string
 *
 * @returns {JSX.Element} Timestamp display with icons and formatted date
 *
 * @example
 * // Basic usage
 * <PostTimestamps
 *   date="2024-01-01"
 *   locale="en-US"
 *   readingTime="5 min read"
 * />
 */
export const PostTimestamps = ({ action, className, date, locale, readingTime }) => {
  return (
    <div className={ cn('flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-normal text-gray-600 dark:text-gray-400', className) }>
      {action || null}
      <PostDate date={ date } locale={ locale } className='text-current' />
      {date && readingTime ? <span aria-hidden='true' className='text-gray-300 dark:text-gray-600'>·</span> : null}
      <PostReadingTime readingTime={ readingTime } className='text-current' />
    </div>
  );
};
