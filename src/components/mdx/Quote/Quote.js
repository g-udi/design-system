/**
 * Quote Component
 *
 * @description Elegant quote block component for displaying testimonials, citations, or notable quotes.
 * Features decorative quote icons, author attribution, and optional profile images.
 * Used within MDX content to highlight important quotes or testimonials with proper semantic markup.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Image from 'next/image';

/**
 * Renders a styled quote block with author attribution
 *
 * @param {Object} props - Component props
 * @param {string} props.author - The name of the quote's author
 * @param {string} [props.title] - The author's title or position
 * @param {string} [props.image] - Optional profile image URL for the author
 * @param {string} props.text - The quote text content
 * @returns {JSX.Element} A figure element containing the styled quote
 *
 * @example
 * // In MDX content - Basic quote:
 * <Quote
 *   text="This is a profound statement that deserves highlighting."
 *   author="John Doe"
 *   title="Software Engineer"
 * />
 *
 * @example
 * // In MDX content - Quote with profile image:
 * <Quote
 *   text="Innovation distinguishes between a leader and a follower."
 *   author="Steve Jobs"
 *   title="Co-founder of Apple"
 *   image="/static/images/profiles/steve-jobs.jpg"
 * />
 */
const Quote = ({ author, title, image, imageAlt, text }) => (
  <figure className='mx-auto max-w-(--breakpoint-md) text-center'>
    <svg className='mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 18 14'>
      <path d='M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z'/>
    </svg>
    <blockquote className='border-none'>
      <p className='text-2xl font-medium italic text-gray-900 dark:text-white'>{text}</p>
    </blockquote>
    {(author || title || image) ? (
      <figcaption className='mt-6 flex items-center justify-center space-x-3 rtl:space-x-reverse'>
        { image ? <Image className='h-6 w-6 rounded-control' src={ image } alt={ imageAlt || (author ? `${author} portrait` : '') } /> : null }
        <div className='flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700 rtl:divide-x-reverse'>
          {author ? <cite className='pe-3 font-medium text-gray-900 dark:text-white'>{author}</cite> : null}
          {title ? <span className='ps-3 text-sm text-gray-500 dark:text-gray-400'>{title}</span> : null}
        </div>
      </figcaption>
    ) : null}
  </figure>
);

export default Quote;
