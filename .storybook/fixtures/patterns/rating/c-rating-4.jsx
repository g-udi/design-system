'use client';
import { useState } from 'react';
import { Rating } from '../../../../src/components/core/Rating/parts/rating-extended.jsx';
import { toast } from 'sonner';
export function Pattern() {
  const [productRating, setProductRating] = useState(0);
  const handleRatingChange = (rating) => {
    setProductRating(rating);
    toast.success(`Rated ${rating} out of 5`);
  };
  return (
    <div className='space-y-8'>
      <Rating
        rating={productRating}
        editable={true}
        onRatingChange={handleRatingChange}
        showValue={true}
      />
    </div>
  );
}
