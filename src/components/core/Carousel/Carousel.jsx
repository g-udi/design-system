'use client';

import { useEffect, useId, useRef, useState } from 'react';

import Button from '../Button';
import Dialog from '../Dialog';
import Icon from '../Icon';
import Link from '../Link';
import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import { Carousel as CarouselRoot, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './parts/carousel.jsx';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-subtle focus-visible:ring-offset-2 focus-visible:ring-offset-surface';
const radiusVariants = {
  'lg': 'rounded-lg',
  'md': 'rounded-md',
  'none': 'rounded-none',
  'sm': 'rounded-sm'
};
// Slides sit on artwork, so their surface and text use the theme-stable dark surface and inverse text.
const mediaSurface = 'relative isolate overflow-hidden border border-border bg-surface-dark text-text-inverse shadow-sm';
const overlayText = 'text-text-inverse drop-shadow-md';

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
  'base': mediaSurface,
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md'
  },
  'variants': {
    'radius': radiusVariants,
    'size': {
      'lg': 'min-h-[420px]',
      'md': 'min-h-[340px]',
      'sm': 'min-h-[260px]'
    }
  }
});

export const carouselCardVariants = createVariants({
  'base': `group flex ${mediaSurface} transition duration-200 focus-within:ring-2 focus-within:ring-text-subtle focus-within:ring-offset-2 focus-within:ring-offset-surface`,
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md'
  },
  'variants': {
    'radius': radiusVariants,
    'size': {
      'lg': 'min-h-[460px] w-[320px] md:w-[380px]',
      'md': 'min-h-[400px] w-[280px] md:w-[340px]',
      'sm': 'min-h-[320px] w-[240px] md:w-[280px]'
    }
  }
});

const getItemKey = (item, index) => item.id ?? `${item.title}-${index}`;
const getItemImageAlt = (item) => item.alt ?? item.imageAlt ?? item.title ?? 'Carousel item image';

const CarouselImage = ({ alt, className, image }) => (image
  ? <img src={ image } alt={ alt ?? '' } loading='lazy' className={ cn('absolute inset-0 size-full object-cover', className) } />
  : <div className={ cn('absolute inset-0 bg-linear-to-br from-surface-dark to-accent-dark', className) } aria-hidden='true' />);

const Scrim = ({ className }) => (
  <div className={ cn('absolute inset-0 bg-linear-to-t from-surface-dark', className) } aria-hidden='true' />
);

const StandardSlide = ({ classNames, item, radius, size }) => (
  <article className={ carouselSlideVariants({ 'className': classNames.slide, radius, size }) }>
    <CarouselImage image={ item.image } alt={ getItemImageAlt(item) } className={ classNames.image } />
    <Scrim className='via-surface-dark/70 to-surface-dark/20' />
    <div className={ cn('relative z-10 flex min-h-[inherit] max-w-2xl flex-col justify-end p-6 sm:p-8', classNames.content) }>
      {item.eyebrow ? <p className={ cn('text-xs font-semibold uppercase opacity-80', overlayText, classNames.eyebrow) }>{item.eyebrow}</p> : null}
      <h3 className={ cn('mt-2 text-2xl font-bold leading-tight sm:text-4xl', overlayText, classNames.title) }>{item.title}</h3>
      {item.description ? <p className={ cn('mt-3 max-w-xl text-sm leading-6 sm:text-base', overlayText, classNames.description) }>{item.description}</p> : null}
      {item.href ? (
        <div className={ cn('mt-5', classNames.action) }>
          <Button href={ item.href } size='sm' tone='accent' variant='solid'>{item.action || 'Read more'}</Button>
        </div>
      ) : null}
    </div>
  </article>
);

const RailCard = ({ classNames, isActive, item, onOpen, radius, size }) => (
  <article className={ carouselCardVariants({ 'className': cn(isActive && 'border-accent shadow-md', classNames.card), radius, size }) }>
    <CarouselImage image={ item.image } alt={ getItemImageAlt(item) } className={ classNames.image } />
    <Scrim className='via-surface-dark/60 to-surface-dark/15' />
    <button
      aria-label={ `Open ${item.title}` }
      className='absolute inset-0 z-20 cursor-pointer focus-visible:outline-none'
      type='button'
      onClick={ onOpen }
    />
    <div className={ cn('relative z-10 flex flex-1 flex-col justify-between p-5 sm:p-6', classNames.content) }>
      <div>
        {item.eyebrow ? <p className={ cn('text-xs font-semibold uppercase opacity-80', overlayText, classNames.eyebrow) }>{item.eyebrow}</p> : null}
        <h3 className={ cn('mt-2 text-xl font-bold leading-tight sm:text-2xl', overlayText, classNames.title) }>{item.title}</h3>
      </div>
      {item.description ? <p className={ cn('max-w-[18rem] text-sm leading-6', overlayText, classNames.description) }>{item.description}</p> : null}
    </div>
  </article>
);

const CarouselDialog = ({ classNames, item, onClose }) => {
  const titleId = useId();
  const closeButtonRef = useRef(null);

  if (!item) return null;

  return (
    <Dialog
      variant='bare'
      open
      onOpenChange={ (open) => !open && onClose() }
      initialFocusRef={ closeButtonRef }
      label={ item.title }
      contentProps={ { 'aria-labelledby': titleId } }
      className={ cn('fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/70 p-4 backdrop-blur-sm', classNames.overlay, classNames.dialog) }
    >
      <article className='relative max-h-[85vh] w-full max-w-3xl overflow-auto rounded-lg border border-border bg-surface p-6 text-text shadow-xl sm:p-8'>
        <Button
          ref={ closeButtonRef }
          aria-label='Close carousel card'
          className='absolute right-4 top-4'
          size='icon-sm'
          tone='neutral'
          variant='ghost'
          onClick={ onClose }
        >
          <Icon name='X' decorative size='sm' />
        </Button>
        {item.image ? <img src={ item.image } alt={ getItemImageAlt(item) } loading='lazy' className='mb-6 aspect-video w-full rounded-md object-cover' /> : null}
        {item.eyebrow ? <p className='text-xs font-semibold uppercase text-accent'>{item.eyebrow}</p> : null}
        <h2 id={ titleId } className='mt-2 pr-10 text-3xl font-bold'>{item.title}</h2>
        {item.description ? <p className='mt-4 text-base leading-7 text-text-muted'>{item.description}</p> : null}
        {item.content ? <div className='mt-6 text-sm leading-7 text-text-muted'>{item.content}</div> : null}
        {item.href ? <Link href={ item.href } className='mt-6 inline-flex font-semibold'>{item.action || 'Read more'}</Link> : null}
      </article>
    </Dialog>
  );
};

/** The convenience carousel: items rendered as slides or rail cards on top of the CarouselRoot parts. */
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
  const [ api, setApi ] = useState();
  const [ current, setCurrent ] = useState(0);
  const [ openItem, setOpenItem ] = useState(null);
  const normalizedVariant = variant || carouselVariants.defaultVariants.variant;
  const isRail = normalizedVariant === 'apple' || normalizedVariant === 'rail';
  const itemCount = items.length;

  useEffect(() => {
    if (!api) return undefined;
    const sync = () => setCurrent(api.selectedScrollSnap());
    sync();
    api.on('select', sync);
    api.on('reInit', sync);
    return () => {
      api.off('select', sync);
      api.off('reInit', sync);
    };
  }, [ api ]);

  if (!itemCount) return null;

  return (
    <CarouselRoot
      aria-label={ ariaLabel }
      // Rail cards keep one snap per card, so every card can become the active one.
      opts={ { 'align': 'start', 'containScroll': isRail ? 'keepSnaps' : 'trimSnaps', loop } }
      setApi={ setApi }
      tabIndex={ 0 }
      className={ carouselVariants({ 'className': cn(focusRing, className, classNames.root), size, 'variant': normalizedVariant }) }
    >
      <p className='sr-only' aria-live='polite'>{`${current + 1} of ${itemCount}`}</p>
      {controls ? (
        <div className={ cn('mb-4 flex items-center justify-end gap-2', classNames.header, classNames.controls) }>
          <CarouselPrevious className={ cn('static', classNames.control) } />
          <CarouselNext className={ cn('static', classNames.control) } />
        </div>
      ) : null}

      <CarouselContent className={ cn(isRail && 'pb-1', classNames.track) }>
        {items.map((item, index) => (
          <CarouselItem
            key={ getItemKey(item, index) }
            aria-label={ `${index + 1} of ${itemCount}` }
            className={ isRail ? 'basis-auto' : undefined }
            // Off-screen slides leave the tab order and the accessibility tree.
            inert={ !isRail && index !== current ? true : undefined }
          >
            {isRail ? (
              <RailCard
                classNames={ classNames }
                isActive={ index === current }
                item={ item }
                radius={ radius }
                size={ size }
                onOpen={ () => {
                  api?.scrollTo(index);
                  setOpenItem(item);
                } }
              />
            ) : (
              <StandardSlide item={ item } classNames={ classNames } radius={ radius } size={ size } />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className={ cn('mt-4 flex items-center justify-center gap-1 sm:gap-2', classNames.indicators) }>
        {items.map((item, index) => (
          <button
            key={ getItemKey(item, index) }
            aria-label={ `Go to slide ${index + 1}` }
            aria-current={ index === current ? 'true' : undefined }
            className={ cn('group/indicator inline-flex size-11 items-center justify-center rounded-control', focusRing, classNames.indicator) }
            type='button'
            onClick={ () => api?.scrollTo(index) }
          >
            <span
              aria-hidden='true'
              className={ cn(
                'h-2.5 rounded-control transition-all motion-reduce:transition-none',
                index === current ? 'w-7 bg-accent' : 'w-2.5 bg-border group-hover/indicator:bg-text-subtle'
              ) }
            />
          </button>
        ))}
      </div>

      {isRail ? <CarouselDialog item={ openItem } classNames={ classNames } onClose={ () => setOpenItem(null) } /> : null}
    </CarouselRoot>
  );
};

export default Carousel;
