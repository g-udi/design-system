// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Rating } from '../../../../src/components/core/Rating/parts/rating-extended.jsx';
export function Pattern() {
  const [rating, setRating] = useState(3.5);
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col items-center gap-4'>
      <Rating rating={rating} onRatingChange={setRating} editable />
      <p className='text-ui-muted-foreground text-sm'>
        Your rating:{' '}
        <span className='text-ui-foreground font-semibold'>
          {rating.toFixed(1)}
        </span>{' '}
        / 5
      </p>
    </div>
  );
}
