'use client';

import { useEffect, useState } from 'react';
import { useInterval } from '../../../hooks/state/use-interval.js';
import Button from '../../core/Button/index.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { cn } from '../../../utilities/cn';
import { CarouselContent, CarouselItem, CarouselRoot } from '../../core/Carousel';
import { Avatar, AvatarFallback, AvatarImage } from '../../core/Avatar/AvatarPrimitives.jsx';
import { Rating } from '../../core/Rating/Rating.jsx';

/**
 * A screen frame: the main column (a form, wizard or settings) beside an optional
 * `aside` panel such as an image, a testimonial or a logo wall. The aside sits at the
 * `end` or `start` and hides below md so the form always comes first on phones.
 */
export default function Screen({ aside, asideSide = 'end', asideClassName, header, footer, children, className }) {
  return (
    <div data-slot='screen' className={cn('bg-surface grid min-h-[34rem] w-full overflow-hidden rounded-xl border', aside && 'md:grid-cols-2', className)}>
      <div className='flex min-w-0 flex-col'>
        {header ? <div data-slot='screen-header' className='flex items-center justify-between gap-3 px-6 py-4'>{header}</div> : null}
        <div className='grid flex-1 place-items-center px-6 py-8 sm:px-10'>
          <div className='w-full max-w-sm'>{children}</div>
        </div>
        {footer ? <div data-slot='screen-footer' className='text-text-muted flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs'>{footer}</div> : null}
      </div>
      {aside ? (
        <div data-slot='screen-aside' className={cn('relative hidden min-w-0 overflow-hidden md:block', asideSide === 'start' && 'md:order-first', asideClassName)}>
          {aside}
        </div>
      ) : null}
    </div>
  );
}

const initials = (name) => name.split(' ').map((part) => part[0]).join('');

/**
 * Customer quotes for an aside. With more than one quote it rotates every `interval`
 * milliseconds, pausing while hovered or focused and when reduced motion is preferred;
 * the dots move between quotes by hand.
 */
export function ScreenTestimonial({ quotes = [], rating, interval = 6000, className }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (!api) return undefined;
    const sync = () => setCurrent(api.selectedScrollSnap());
    sync();
    api.on('select', sync);
    return () => api.off('select', sync);
  }, [api]);
  useInterval(() => api.scrollNext(), api && !hovered && !focused && quotes.length > 1 && !reducedMotion && interval > 0 ? interval : null);
  return (
    <figure
      data-slot='screen-testimonial'
      className={cn('grid gap-4', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      {rating ? <Rating rating={rating} size='sm' /> : null}
      <CarouselRoot setApi={setApi} opts={{ loop: true }} aria-label='Customer quotes'>
        <CarouselContent>
          {quotes.map((quote) => (
            <CarouselItem key={quote.name}>
              <blockquote className='text-lg leading-relaxed font-medium text-balance'>“{quote.quote}”</blockquote>
              <div className='mt-4 flex items-center gap-3'>
                <Avatar className='size-9'>
                  {quote.avatar ? <AvatarImage src={quote.avatar} alt={quote.name} /> : null}
                  <AvatarFallback>{initials(quote.name)}</AvatarFallback>
                </Avatar>
                <span className='grid text-sm'>
                  <span className='font-medium'>{quote.name}</span>
                  <span className='text-text-muted'>{quote.role}</span>
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselRoot>
      {quotes.length > 1 ? (
        <div className='-ms-1.5 flex'>
          {quotes.map((quote, index) => (
            // A 24px hit area around a slim bar keeps the dots easy to press.
            <Button
              key={quote.name}
              variant='ghost'
              size='icon-xs'
              type='button'
              aria-label={`Show quote from ${quote.name}`}
              aria-current={index === current || undefined}
              onClick={() => api?.scrollTo(index)}
              className='grid h-6 min-w-6 cursor-pointer place-items-center px-1.5'
            >
              <span aria-hidden='true' className={cn('h-1.5 rounded-(--ds-radius-control) transition-all motion-reduce:transition-none', index === current ? 'bg-text w-5' : 'bg-text-muted/40 w-1.5')} />
            </Button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}

export { Screen };
