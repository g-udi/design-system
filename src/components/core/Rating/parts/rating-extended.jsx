// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
  const handleStarClick = (starRating) => {
    if (editable && onRatingChange) {
      onRatingChange(starRating);
    }
  };
  const handleStarMouseEnter = (starRating) => {
    if (editable) {
      setHoveredRating(starRating);
    }
  };
  const handleStarMouseLeave = () => {
    if (editable) {
      setHoveredRating(null);
    }
  };
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const filled = displayRating >= i;
      const partiallyFilled = displayRating > i - 1 && displayRating < i;
      const fillPercentage = partiallyFilled
        ? (displayRating - (i - 1)) * 100
        : 0;
      stars.push(
        <div
          key={i}
          className={cn('relative', editable && 'cursor-pointer')}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarMouseEnter(i)}
          onMouseLeave={handleStarMouseLeave}
        >
          {/* Background star (empty) */}
          <RegistryIcon
            lucide='StarIcon'
            data-slot='rating-star-empty'
            className={cn(starVariants({ size }), 'text-ui-muted-foreground')}
          />

          {/* Filled star */}
          <div
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
                'fill-yellow-400 text-yellow-400'
              )}
            />
          </div>
        </div>
      );
    }
    return stars;
  };
  return (
    <div
      data-slot='rating'
      className={cn(ratingVariants({ size }), className)}
      {...props}
    >
      <div className='flex items-center'>{renderStars()}</div>
      {showValue && (
        <span
          data-slot='rating-value'
          className={cn(valueVariants({ size }), starClassName)}
        >
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
export { Rating };
