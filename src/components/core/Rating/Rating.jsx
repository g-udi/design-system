'use client';
import { useState } from 'react';
import { getNextIndex } from '../../../hooks/a11y/use-arrow-key-nav.js';
import { cva } from 'class-variance-authority';
import { cn } from '../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
const ratingVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-2',
      default: 'gap-2.5',
      lg: 'gap-3'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});
const starVariants = cva('', {
  variants: {
    size: {
      sm: ' size-4',
      default: ' size-5',
      lg: ' size-6'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});
const valueVariants = cva('text-ui-muted-foreground w-5', {
  variants: {
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});
function Rating({
  rating,
  maxRating = 5,
  size,
  className,
  starClassName,
  showValue = false,
  editable = false,
  onRatingChange,
  ...props
}) {
  const limit = Number.isFinite(maxRating) ? Math.max(1, Math.trunc(maxRating)) : 5;
  const currentRating = Number.isFinite(rating) ? Math.min(limit, Math.max(0, rating)) : 0;
  const [hoveredRating, setHoveredRating] = useState(null);
  const displayRating =
    editable && hoveredRating !== null ? hoveredRating : currentRating;
  const selected = Math.round(currentRating);
  const select = (starRating) => onRatingChange?.(starRating);
  // Radio-group keyboard model: arrows move and select, Home/End jump to the ends.
  const handleKeyDown = (event, starRating) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const next = getNextIndex(starRating - 1, event.key, { count: limit, orientation: 'both', dir: getComputedStyle(event.currentTarget).direction });
    if (next == null) return;
    event.preventDefault();
    event.currentTarget.parentElement.children[next]?.focus();
    select(next + 1);
  };
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= limit; i++) {
      const filled = displayRating >= i;
      const partiallyFilled = displayRating > i - 1 && displayRating < i;
      const fillPercentage = partiallyFilled
        ? (displayRating - (i - 1)) * 100
        : 0;
      const Star = editable ? 'button' : 'span';
      const control = editable && {
        type: 'button',
        role: 'radio',
        'aria-checked': selected === i,
        'aria-label': `${i} star${i === 1 ? '' : 's'}`,
        // Roving tabindex: only the selected star (or the first) is in the tab order.
        tabIndex: selected === i || (selected < 1 && i === 1) ? 0 : -1,
        onClick: () => select(i),
        onKeyDown: (event) => handleKeyDown(event, i),
        onMouseEnter: () => setHoveredRating(i),
        onMouseLeave: () => setHoveredRating(null)
      };
      stars.push(
        <Star
          key={i}
          className={cn(
            'relative block',
            editable &&
              'cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ui-primary'
          )}
          {...control}
        >
          <RegistryIcon
            lucide='StarIcon'
            data-slot='rating-star-empty'
            className={cn(starVariants({ size }), 'text-ui-muted-foreground', starClassName)}
          />

          <span
            className='absolute inset-0 overflow-hidden'
            style={{
              width: filled ? '100%' : `${fillPercentage}%`
            }}
          >
            <RegistryIcon
              lucide='StarIcon'
              data-slot='rating-star-filled'
              className={cn(
                starVariants({ size }),
                'fill-warning text-warning',
                starClassName
              )}
            />
          </span>
        </Star>
      );
    }
    return stars;
  };
  // Editable ratings are a radio group; read-only ratings are a single labelled image.
  const semantics = editable
    ? { role: 'radiogroup', 'aria-label': 'Rating' }
    : { role: 'img', 'aria-label': `Rated ${currentRating} out of ${limit}` };
  return (
    <div
      data-slot='rating'
      className={cn(ratingVariants({ size }), className)}
      {...semantics}
      {...props}
    >
      <div className='flex items-center'>{renderStars()}</div>
      {showValue && (
        <span
          data-slot='rating-value'
          className={valueVariants({ size })}
        >
          {(displayRating ?? 0).toFixed(1)}
        </span>
      )}
    </div>
  );
}
export { Rating };
