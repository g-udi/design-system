/**
 * Thoughts Section Component
 *
 * @description Special display component for thoughts on the homepage.
 * Shows thoughts in a minimal, tweet-like list layout.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import Button from '../../core/Button';
import Link from '../../core/Link';

/**
 * Renders a special thoughts section for the homepage
 *
 * @param {Object} props - Component props
 * @param {Array} props.thoughts - Array of thought objects to display
 *
 * @returns {JSX.Element} Thoughts section with minimal list layout
 */
export default function ThoughtsSection({ thoughts }) {
  return (
    <div className='py-6'>
      {/* Section Header */}
      <div className='mb-4'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl'>
          Recent Thoughts
        </h2>
      </div>

      {/* Thoughts List */}
      <div className='space-y-4'>
        {thoughts.slice(0, -1).map((thought) => (
          <article key={ thought.slug } className='group'>
            <Link
              href={ `/thoughts/${thought.slug}` }
              variant='bare'
              className='block'
            >
              <div className='flex items-start gap-2 mb-1'>
                <h3 className='text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400'>
                  {thought.title}
                </h3>
                {thought.featured && (
                  <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
                    Featured
                  </span>
                )}
              </div>

              {/* Summary */}
              {thought.summary && (
                <p className='text-base leading-7 text-gray-600 dark:text-gray-400'>
                  {thought.summary}
                </p>
              )}
            </Link>
          </article>
        ))}
      </div>

      {/* Last Thought with View All Button */}
      {thoughts.length > 0 && (
        <div className='flex flex-col gap-4 pt-4 md:flex-row md:items-start md:justify-between'>
          <article className='group flex-1'>
            <Link
              href={ `/thoughts/${thoughts[thoughts.length - 1].slug}` }
              variant='bare'
              className='block'
            >
              <div className='flex items-start gap-2 mb-1'>
                <h3 className='text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400'>
                  {thoughts[thoughts.length - 1].title}
                </h3>
                {thoughts[thoughts.length - 1].featured && (
                  <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
                    Featured
                  </span>
                )}
              </div>

              {/* Summary */}
              {thoughts[thoughts.length - 1].summary && (
                <p className='text-base leading-7 text-gray-600 dark:text-gray-400'>
                  {thoughts[thoughts.length - 1].summary}
                </p>
              )}
            </Link>
          </article>

          {/* View All Button */}
          <div className='flex justify-end md:flex-shrink-0 md:pt-1'>
            <Button variant='outline' tone='accent' size='md' href='/thoughts' aria-label='View all thoughts'>
              View All Thoughts
              <svg className='h-4 w-4 transition-transform group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 } d='M9 5l7 7-7 7' />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
