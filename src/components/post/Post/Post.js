/**
 * Post Component
 *
 * @description One entry in a blog post index: date, category, draft badge, linked title, and summary.
 *
 * @author Ahmad Assaf
 * @version 1.1.0
 */

import Typography from '../../../foundations/Typography';
import formatDate from '../../../utilities/formatDate';
import Link from '../../core/Link';
import Pill from '../../core/Pill';

const MetaSeparator = () => <span aria-hidden='true' className='text-text-subtle'>·</span>;

/**
 * Renders a post index entry as a list item; place it inside a `<ul>`.
 *
 * @param {Object} props - Component props
 * @param {Object} props.frontMatter - Prepared title, href, date, category { id, label, href }, subtitle and draft
 * @param {string} [props.locale] - Locale passed to the date formatter
 * @param {string} [props.titleAs='h3'] - Heading element used for the post title
 */
const Post = ({ frontMatter = {}, locale, titleAs = 'h3' }) => {
  const category = typeof frontMatter.category === 'string' ? { label: frontMatter.category } : frontMatter.category;

  return (
    <li className='group'>
      <article className='border-b border-border-muted py-3 last:border-b-0 dark:border-border-dark'>
        <div className='min-w-0'>
          <div className='mb-1 flex flex-wrap items-center gap-2 text-sm'>
            <Typography
              as='time'
              variant='post-meta'
              dateTime={ frontMatter.date }
              className='font-medium transition-colors duration-200 group-hover:text-text-muted'
            >
              {formatDate(frontMatter.date, locale)}
            </Typography>

            {category && (
              <>
                <MetaSeparator />
                <Pill href={ category.href } tone='blue' variant='subtle' size='xs' radius='md' className='my-0 mr-0 normal-case tracking-normal'>
                  {category.label}
                </Pill>
              </>
            )}

            {frontMatter.draft && (
              <>
                <MetaSeparator />
                <Pill tone='amber' variant='soft' size='xs' className='my-0 mr-0'>Draft</Pill>
              </>
            )}
          </div>

          <Typography variant='index-list-title' as={ titleAs } className='mb-1'>
            <Link href={ frontMatter.href } className='font-semibold group-hover:text-accent'>
              {frontMatter.title}
            </Link>
          </Typography>

          {frontMatter.subtitle && (
            <Typography variant='paragraph-sm' className='line-clamp-2 text-text-muted'>
              {frontMatter.subtitle}
            </Typography>
          )}
        </div>
      </article>
    </li>
  );
};

export default Post;
