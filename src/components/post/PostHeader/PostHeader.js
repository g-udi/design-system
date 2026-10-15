/**
 * PostHeader Component
 *
 * @description Blog post header with the post's metadata, title, tags, and series navigation.
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
import formatDate from '../../../utilities/formatDate';

const titleElements = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

const isValidPostDate = (date) => date && !Number.isNaN(new Date(date).getTime());

const MetaSeparator = () => <span aria-hidden='true' className='text-text-subtle'>·</span>;

/**
 * Renders the blog post header: category, date, draft badge, title, subtitle, reading time, tags, and series.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.frontMatter={}] - Post metadata with id, prepared category/tags { id, label, href }, date, readingTime.text and seriesPosts
 * @param {Object} [props.siteMetadata={}] - Site configuration; `locale` formats the date
 * @param {React.ReactNode} [props.tocControl] - Control at the right end of the tags row, such as a contents sidebar toggle
 * @param {1|2|3|4|5|6} [props.titleLevel=1] - Semantic heading level for the post title
 * @param {string} [props.titleVariant='post-title'] - Shared Typography variant for the title, independent of its heading level
 * @param {string} [props.subtitleVariant='post-subtitle'] - Shared Typography variant for the subtitle
 * @param {string} [props.className] - Root classes
 * @param {Object} [props.classNames] - Part classes (root, meta, category, body, title, subtitle, timestamps, actions, tags, tag, series)
 * @returns {JSX.Element} Post header
 *
 * @example
 * <PostHeader frontMatter={post} siteMetadata={{ locale: 'en-US' }} tocControl={<ContentsToggle />} />
 */
const PostHeader = ({ className, classNames = {}, frontMatter = {}, siteMetadata = {}, titleLevel = 1, titleVariant = 'post-title', subtitleVariant = 'post-subtitle', tocControl }) => {
  const category = typeof frontMatter.category === 'string' ? { label: frontMatter.category } : frontMatter.category;
  const date = frontMatter.updated || frontMatter.date;
  const readingTime = frontMatter.readingTime?.text;
  // One quiet meta line: category · date · reading time, each separated only where both sides exist.
  const meta = [
    category ? (
      <Link key='category' href={ category.href } variant='muted' className={ cn('inline-flex items-center gap-2 text-sm font-medium', classNames.category) }>
        <span aria-hidden='true' className='size-2 shrink-0 rounded-full bg-success' />
        {category.label}
      </Link>
    ) : null,
    isValidPostDate(date) ? <PostDate key='date' date={ date } locale={ siteMetadata.locale } className='text-sm text-current' /> : null,
    readingTime ? <PostReadingTime key='reading' readingTime={ readingTime } className='text-sm text-current' /> : null
  ].filter(Boolean);

  return (
  <div className={ cn('w-full pt-6 pb-2', className, classNames.root) }>

    <div className={ cn('flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-muted', classNames.meta, classNames.timestamps) }>
      {meta.map((item, index) => (
        <span key={ item.key } className='inline-flex items-center gap-3 whitespace-nowrap'>
          {index > 0 ? <MetaSeparator /> : null}
          {item}
        </span>
      ))}
      {frontMatter.draft && <Pill tone='amber' variant='soft' size='xs'>Draft</Pill>}
    </div>

    <div className={ cn('mt-4 text-left', classNames.body) }>
      <Typography as={ titleElements[titleLevel] || titleElements[1] } variant={ titleVariant } className={ cn('text-pretty', classNames.title) }>
        {frontMatter.title}
      </Typography>
      {frontMatter.subtitle ? (
        <Typography as='p' variant={ subtitleVariant } className={ cn('mt-3 max-w-3xl text-pretty text-text-muted', classNames.subtitle) }>
          {frontMatter.subtitle}
        </Typography>
      ) : null}
    </div>

    {/* Tags on the left; an optional contents control at the right end, above the contents sidebar. */}
    {frontMatter.tags?.length || tocControl ? (
      <div className={ cn('mt-6 flex items-start gap-3', classNames.actions) }>
        {frontMatter.tags?.length ? (
          <ul aria-label='Tags' className={ cn('m-0 flex min-w-0 flex-1 list-none flex-wrap gap-2 p-0', classNames.tags) }>
            {frontMatter.tags.map((tag) => (
              <li key={ typeof tag === 'string' ? tag : tag.id ?? tag.href ?? tag.label }>
                <Pill href={ typeof tag === 'string' ? undefined : tag.href } tone='gray' variant='outline' size='sm' radius='md' className={ cn('font-normal sm:text-sm', classNames.tag) }>
                  {typeof tag === 'string' ? tag : tag.label}
                </Pill>
              </li>
            ))}
          </ul>
        ) : null}
        {tocControl ? <span className='ml-auto inline-flex shrink-0 items-center'>{tocControl}</span> : null}
      </div>
    ) : null}

    {frontMatter.seriesPosts && (
      <PostSeriesBox series={ frontMatter.seriesPosts } currentId={ frontMatter.id } className={ cn('mt-6', classNames.series) } />
    )}

  </div>
  );
};

export default PostHeader;

export const PostDate = ({ className, date, locale }) => {
  if (!isValidPostDate(date)) return null;

  return (
    <time dateTime={ date } className={ cn('text-xs font-normal tabular-nums text-text-muted', className) }>
      {formatDate(date, locale, { month: 'short' })}
    </time>
  );
};

export const PostReadingTime = ({ className, readingTime }) => {
  if (!readingTime) return null;

  return (
    <span className={ cn('inline-flex items-center gap-2 text-xs font-normal', className) }>
      <Icon name='BookOpen' size='sm' decorative className='text-text-subtle' />
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
    <div className={ cn('flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-normal text-text-muted', className) }>
      {action || null}
      <PostDate date={ date } locale={ locale } className='text-current' />
      {date && readingTime ? <MetaSeparator /> : null}
      <PostReadingTime readingTime={ readingTime } className='text-current' />
    </div>
  );
};
