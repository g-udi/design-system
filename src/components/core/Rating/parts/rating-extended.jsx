'use client';
import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
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
      sm: 'w-4 h-4',
      default: 'w-5 h-5',
      lg: 'w-6 h-6'
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
  const [hoveredRating, setHoveredRating] = useState(null);
  const displayRating =
    editable && hoveredRating !== null ? hoveredRating : rating;
  const selected = Math.round(rating ?? 0);
  const select = (starRating) => onRatingChange?.(starRating);
  // Radio-group keyboard model: arrows move and select, Home/End jump to the ends.
  const handleKeyDown = (event, starRating) => {
    const next = {
      ArrowRight: starRating + 1,
      ArrowUp: starRating + 1,
      ArrowLeft: starRating - 1,
      ArrowDown: starRating - 1,
      Home: 1,
      End: maxRating
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = Math.min(maxRating, Math.max(1, next));
    event.currentTarget.parentElement.children[target - 1].focus();
    select(target);
  };
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
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
              'cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ui-ring'
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
    : { role: 'img', 'aria-label': `Rated ${rating ?? 0} out of ${maxRating}` };
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
