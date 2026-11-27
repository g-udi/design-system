'use client';
import { useId, useState } from 'react';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { Rating } from '@gaudi/design-system/core/Rating';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import { FieldRoot as Field, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';

const feedback = (rating) =>
  rating <= 2 ? "We're sorry to hear that" : rating <= 3 ? 'Thanks for your feedback' : 'Glad you enjoyed it!';

export function Pattern() {
  const toastId = useId();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const submit = (event) => {
    event.preventDefault();
    toast.success(`Rated ${rating} out of 5`, { toasterId: toastId, description: 'Your review is posted.' });
    setRating(0);
    setReview('');
  };
  return (
    <>
      <ToastProvider id={toastId} />
    <Card className='mx-auto w-full max-w-xs'>
      <CardContent>
        <form className='grid gap-3' onSubmit={submit}>
          <div className='flex flex-col items-center gap-2'>
            <h3 className='text-sm font-semibold'>Write a review</h3>
            <Rating rating={rating} onRatingChange={setRating} editable showValue />
            <p className='min-h-4 text-xs text-text-muted'>{rating > 0 ? feedback(rating) : 'Choose a score to continue'}</p>
          </div>
          <Field>
            <FieldLabel htmlFor={`${toastId}-review-text`}>Your review</FieldLabel>
            <Textarea
              id={`${toastId}-review-text`}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder='What worked, and what could be clearer?'
              rows={3}
            />
          </Field>
          <Button type='submit' disabled={rating === 0} size='sm' className='w-full'>
            Submit review
          </Button>
        </form>
      </CardContent>
    </Card>
    </>
  );
}
