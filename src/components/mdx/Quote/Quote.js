/**
 * Quote Component
 *
 * @description A pull quote for article content: the quotation, then the author, their role and an
 * optional portrait (the core Avatar, which falls back to initials if the image fails).
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Avatar from '../../core/Avatar';

/**
 * @param {Object} props - Component props
 * @param {string} props.text - The quotation
 * @param {string} [props.author] - The name of the quote's author
 * @param {string} [props.title] - The author's title or position
 * @param {string} [props.image] - Portrait URL for the author
 * @param {string} [props.imageAlt] - Portrait alternative text (defaults to "<author> portrait")
 * @returns {JSX.Element} A figure element containing the quote
 *
 * @example
 * <Quote
 *   text="Innovation distinguishes between a leader and a follower."
 *   author="Steve Jobs"
 *   title="Co-founder of Apple"
 *   image="/static/images/profiles/steve-jobs.jpg"
 * />
 */
const Quote = ({ author, title, image, imageAlt, text }) => (
  <figure className='mx-auto max-w-(--breakpoint-md) text-center'>
    <svg className='mx-auto mb-3 size-10 text-text-subtle' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 18 14'>
      <path d='M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z'/>
    </svg>
    <blockquote className='border-none'>
      <p className='text-2xl font-medium italic text-text'>{text}</p>
    </blockquote>
    {author || title || image ? (
      <figcaption className='mt-6 flex items-center justify-center gap-3'>
        {image ? <Avatar src={ image } name={ author } alt={ imageAlt || (author ? `${author} portrait` : '') } shape='circle' size='sm' /> : null}
        <div className='flex items-center divide-x-2 divide-border'>
          {author ? <cite className='pe-3 font-medium not-italic text-text'>{author}</cite> : null}
          {title ? <span className='ps-3 text-sm text-text-muted'>{title}</span> : null}
        </div>
      </figcaption>
    ) : null}
  </figure>
);

export default Quote;
