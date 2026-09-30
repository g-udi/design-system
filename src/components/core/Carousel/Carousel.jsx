'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

import Button from '../Button';
import DialogPortal from '../DialogPortal';
import Icon from '../Icon';
import Link from '../Link';
import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';

export const carouselVariants = createVariants({
  'base': 'relative w-full',
  'defaultVariants': {
    'size': 'md',
    'variant': 'standard'
  },
  'variants': {
    'size': {
      'lg': 'max-w-6xl',
      'md': 'max-w-5xl',
      'sm': 'max-w-3xl'
    },
    'variant': {
      'apple': '',
      'rail': '',
      'standard': ''
    }
  }
});

export const carouselSlideVariants = createVariants({
  'base': 'relative isolate overflow-hidden border bg-gray-950 text-white shadow-sm dark:border-gray-800',
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md'
  },
  'variants': {
    'radius': {
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'none': 'rounded-none',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'min-h-[420px]',
      'md': 'min-h-[340px]',
      'sm': 'min-h-[260px]'
    }
  }
});

export const carouselCardVariants = createVariants({
  'base': 'group relative isolate flex shrink-0 snap-start overflow-hidden border bg-gray-950 text-white shadow-sm transition duration-200 focus-within:ring-2 focus-within:ring-gray-400 focus-within:ring-offset-2 dark:border-gray-800 dark:focus-within:ring-offset-gray-950',
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md'
  },
  'variants': {
    'radius': {
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'none': 'rounded-none',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'min-h-[460px] w-[320px] md:w-[380px]',
      'md': 'min-h-[400px] w-[280px] md:w-[340px]',
      'sm': 'min-h-[320px] w-[240px] md:w-[280px]'
    }
  }
});

const getItemKey = (item, index) => item.id ?? `${item.title}-${index}`;
const getItemImageAlt = (item) => item.alt ?? item.imageAlt ?? item.title ?? 'Carousel item image';

const getNextIndex = (current, direction, count, loop) => {
  if (!count) return 0;
  const next = current + direction;

  if (loop) return (next + count) % count;

  return Math.min(Math.max(next, 0), count - 1);
};

const CarouselImage = ({ alt, className, image }) => {
  if (!image) return (
    <div className={ cn('absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-blue-950', className) } aria-hidden='true' />
  );

  return <img src={ image } alt={ alt ?? '' } loading='lazy' className={ cn('absolute inset-0 size-full object-cover', className) } />;
};

const CarouselControl = ({ children, className, disabled, label, onClick }) => (
  <button
    aria-label={ label }
    className={ cn(
      'inline-flex size-11 items-center justify-center rounded-control border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-700 dark:hover:text-blue-300 dark:focus-visible:ring-offset-gray-950', className
    ) }
    disabled={ disabled }
    type='button'
    onClick={ onClick }
  >
    {children}
  </button>
);

const StandardSlide = ({ classNames, item, radius, size }) => (
  <article className={ carouselSlideVariants({ 'className': classNames.slide, radius, size }) }>
    <CarouselImage image={ item.image } alt={ getItemImageAlt(item) } className={ classNames.image } />
    <div className='absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/70 to-gray-950/20' aria-hidden='true' />
    <div className={ cn('relative z-10 flex min-h-[inherit] max-w-2xl flex-col justify-end p-6 sm:p-8', classNames.content) }>
      {item.eyebrow ? <p className={ cn('text-xs font-semibold uppercase !text-white/80 drop-shadow-md', classNames.eyebrow) }>{item.eyebrow}</p> : null}
      <h3 className={ cn('mt-2 text-2xl font-bold leading-tight !text-white drop-shadow-md sm:text-4xl', classNames.title) }>{item.title}</h3>
      {item.description ? <p className={ cn('mt-3 max-w-xl text-sm leading-6 !text-white/95 drop-shadow-md sm:text-base', classNames.description) }>{item.description}</p> : null}
      {item.href ? (
        <div className={ cn('mt-5', classNames.action) }>
          <Button href={ item.href } size='sm' tone='accent' variant='solid'>{item.action || 'Read more'}</Button>
        </div>
      ) : null}
    </div>
  </article>
);

const AppleCard = ({ classNames, isActive, item, onOpen, radius, size }) => (
  <article className={ carouselCardVariants({ 'className': cn(isActive && 'bg-blue-950 shadow-md', classNames.card), radius, size }) }>
    <CarouselImage image={ item.image } alt={ getItemImageAlt(item) } className={ cn(isActive && !item.image && 'from-blue-950 via-blue-900 to-indigo-950', classNames.image) } />
    <div className={ cn('absolute inset-0 bg-linear-to-t', isActive ? 'from-blue-950/95 via-blue-950/55 to-blue-900/10' : 'from-gray-950 via-gray-950/60 to-gray-950/15') } aria-hidden='true' />
    <button
      aria-label={ `Open ${item.title}` }
      className='absolute inset-0 z-20 cursor-pointer focus-visible:outline-none'
      type='button'
      onClick={ onOpen }
    />
    <div className={ cn('relative z-10 flex size-full flex-col justify-between p-5 sm:p-6', classNames.content) }>
      <div>
        {item.eyebrow ? <p className={ cn('text-xs font-semibold uppercase !text-white/80 drop-shadow-md', classNames.eyebrow) }>{item.eyebrow}</p> : null}
        <h3 className={ cn('mt-2 text-xl font-bold leading-tight !text-white drop-shadow-md sm:text-2xl', classNames.title) }>{item.title}</h3>
      </div>
      {item.description ? <p className={ cn('max-w-[18rem] text-sm leading-6 !text-white/95 drop-shadow-md', classNames.description) }>{item.description}</p> : null}
    </div>
  </article>
);

const CarouselDialog = ({ classNames, item, onClose }) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();

        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault();

        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ item, onClose ]);

  if (!item) return null;

  return (
    <DialogPortal initialFocusRef={ closeButtonRef }>
      <div ref={ dialogRef } className={ cn('fixed inset-0 z-50 flex items-center justify-center p-4', classNames.dialog) } role='dialog' aria-modal='true' aria-labelledby={ titleId }>
        <div
          aria-hidden='true'
          className={ cn('absolute inset-0 bg-gray-950/70 backdrop-blur-sm', classNames.overlay) }
          onClick={ onClose }
        />
        <article className='relative z-10 max-h-[85vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-950 sm:p-8'>
          <button
            ref={ closeButtonRef }
            aria-label='Close carousel card'
            className='absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-control bg-gray-100 text-gray-700 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 motion-reduce:transition-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            type='button'
            onClick={ onClose }
          >
            <Icon name='X' decorative size='sm' />
          </button>
          {item.image ? <img src={ item.image } alt={ getItemImageAlt(item) } loading='lazy' className='mb-6 aspect-video w-full rounded-md object-cover' /> : null}
          {item.eyebrow ? <p className='text-xs font-semibold uppercase text-blue-600 dark:text-blue-400'>{item.eyebrow}</p> : null}
          <h2 id={ titleId } className='mt-2 text-3xl font-bold text-gray-950 dark:text-white'>{item.title}</h2>
          {item.description ? <p className='mt-4 text-base leading-7 text-gray-700 dark:text-gray-300'>{item.description}</p> : null}
          {item.content ? <div className='mt-6 text-sm leading-7 text-gray-700 dark:text-gray-300'>{item.content}</div> : null}
          {item.href ? <Link href={ item.href } className='mt-6 inline-flex font-semibold'>{item.action || 'Read more'}</Link> : null}
        </article>
      </div>
    </DialogPortal>
  );
};

const Carousel = ({
  ariaLabel = 'Carousel',
  className,
  classNames = {},
  controls = true,
  items = [],
  loop = false,
  radius,
  size,
  variant
}) => {
  const [ current, setCurrent ] = useState(0);
  const [ openItem, setOpenItem ] = useState(null);
  const headingId = useId();
  const itemRefs = useRef([]);
  const itemCount = items.length;
  const activeItem = items[current] || items[0];
  const canGoPrevious = loop || current > 0;
  const canGoNext = loop || current < itemCount - 1;
  const normalizedVariant = variant || carouselVariants.defaultVariants.variant;
  const isApple = normalizedVariant === 'apple' || normalizedVariant === 'rail';
  const status = useMemo(() => (itemCount ? `${current + 1} of ${itemCount}` : 'No carousel items'), [ current, itemCount ]);

  const goTo = (index) => setCurrent(Math.min(Math.max(index, 0), itemCount - 1));
  const move = (direction) => setCurrent((value) => getNextIndex(value, direction, itemCount, loop));

  useEffect(() => {
    if (!isApple) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    itemRefs.current[current]?.scrollIntoView({
      'behavior': reduceMotion ? 'auto' : 'smooth',
      'block': 'nearest',
      'inline': 'center'
    });
  }, [ current, isApple ]);

  if (!itemCount) return null;

  return (
    <section
      aria-label={ ariaLabel }
      aria-roledescription='carousel'
      role='region'
      tabIndex={ 0 }
      className={ carouselVariants({ 'className': cn('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400', className, classNames.root), size, 'variant': normalizedVariant }) }
      onKeyDown={ (event) => {
        if (event.key === 'ArrowLeft') move(-1);
        if (event.key === 'ArrowRight') move(1);
      } }
    >
      <p className='sr-only' aria-live='polite'>{status}</p>
      <div className={ cn('flex items-center justify-between gap-4', classNames.header) }>
        <h2 id={ headingId } className='sr-only'>{ariaLabel}</h2>
        {controls ? (
          <div className={ cn('ml-auto flex items-center gap-2', classNames.controls) }>
            <CarouselControl label='Previous slide' disabled={ !canGoPrevious } className={ classNames.control } onClick={ () => move(-1) }>
              <Icon name='ArrowLeft' decorative size='sm' />
            </CarouselControl>
            <CarouselControl label='Next slide' disabled={ !canGoNext } className={ classNames.control } onClick={ () => move(1) }>
              <Icon name='ArrowRight' decorative size='sm' />
            </CarouselControl>
          </div>
        ) : null}
      </div>

      <div className={ cn('mt-4', classNames.viewport) } aria-labelledby={ headingId }>
        {isApple ? (
          <div className={ cn('flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', classNames.track) }>
            {items.map((item, index) => (
              <div
                key={ getItemKey(item, index) }
                className='shrink-0'
                ref={ (node) => {
                  itemRefs.current[index] = node;
                } }
              >
                <AppleCard
                  classNames={ classNames }
                  isActive={ index === current }
                  item={ item }
                  radius={ radius }
                  size={ size }
                  onOpen={ () => {
                    goTo(index);
                    setOpenItem(item);
                  } }
                />
              </div>
            ))}
          </div>
        ) : (
          <StandardSlide item={ activeItem } classNames={ classNames } radius={ radius } size={ size } />
        )}
      </div>

      <div className={ cn('mt-4 flex items-center justify-center gap-1 sm:gap-2', classNames.indicators) }>
        {items.map((item, index) => (
          <button
            key={ getItemKey(item, index) }
            aria-label={ `Go to slide ${index + 1}` }
            aria-current={ index === current ? 'true' : undefined }
            className={ cn(
              'group/indicator inline-flex size-11 items-center justify-center rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950', classNames.indicator
            ) }
            type='button'
            onClick={ () => goTo(index) }
          >
            <span
              aria-hidden='true'
              className={ cn(
                'h-2.5 rounded-control transition-all motion-reduce:transition-none',
                index === current ? 'w-7 bg-blue-600' : 'w-2.5 bg-gray-300 group-hover/indicator:bg-gray-400 dark:bg-gray-700 dark:group-hover/indicator:bg-gray-600'
              ) }
            />
          </button>
        ))}
      </div>

      {isApple ? <CarouselDialog item={ openItem } classNames={ classNames } onClose={ () => setOpenItem(null) } /> : null}
    </section>
  );
};

export default Carousel;
