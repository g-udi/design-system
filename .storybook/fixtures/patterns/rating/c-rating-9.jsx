'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Rating } from '../../../../src/components/core/Rating/parts/rating-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';

const feedback = (rating) =>
  rating <= 2 ? "We're sorry to hear that" : rating <= 3 ? 'Thanks for your feedback' : 'Glad you enjoyed it!';

export function Pattern() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const submit = (event) => {
    event.preventDefault();
    toast.success(`Rated ${rating} out of 5`, { description: 'Your review is posted.' });
    setRating(0);
    setReview('');
  };
  return (
    <Card className='mx-auto w-full max-w-xs'>
      <CardContent>
        <form className='grid gap-3' onSubmit={submit}>
          <div className='flex flex-col items-center gap-2'>
            <h3 className='text-sm font-semibold'>Write a review</h3>
            <Rating rating={rating} onRatingChange={setRating} editable showValue />
            <p className='min-h-4 text-xs text-text-muted'>{rating > 0 ? feedback(rating) : 'Choose a score to continue'}</p>
          </div>
          <div className='grid gap-1.5'>
            <Label htmlFor='review-text'>Your review</Label>
            <Textarea
              id='review-text'
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder='Tell us what you think...'
              rows={3}
            />
          </div>
          <Button type='submit' disabled={rating === 0} size='sm' className='w-full'>
            Submit review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
