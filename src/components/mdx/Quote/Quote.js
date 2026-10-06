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
import Icon from '../../core/Icon';

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
  <figure className='mx-auto min-w-0 max-w-(--breakpoint-md) wrap-anywhere text-center'>
    <Icon name='Quote' decorative className='mx-auto mb-3 size-10 text-text-subtle' />
    <blockquote className='border-none'>
      <p className='text-2xl font-medium italic text-text'>{text}</p>
    </blockquote>
    {author || title || image ? (
      <figcaption className='mt-6 flex flex-wrap items-center justify-center gap-3'>
        {image ? <Avatar src={ image } name={ author } alt={ imageAlt || (author ? `${author} portrait` : '') } shape='circle' size='sm' /> : null}
        <div className='grid min-w-0 gap-1'>
          {author ? <cite className='font-medium not-italic text-text'>{author}</cite> : null}
          {title ? <span className='text-sm text-text-muted'>{title}</span> : null}
        </div>
      </figcaption>
    ) : null}
  </figure>
);

export default Quote;
