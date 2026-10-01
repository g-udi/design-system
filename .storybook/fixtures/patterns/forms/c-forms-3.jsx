'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '../../../../src/components/core/Field/parts/field.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Rating } from '../../../../src/components/core/Rating/parts/rating-extended.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';

const scores = Array.from({ length: 11 }, (_, score) => String(score));
const reasons = ['Writing quality', 'Depth', 'Code samples', 'Diagrams', 'Length', 'Topic'];
const rules = {
  rating: validators.required('Rate the article before sending.'),
  score: validators.required('Choose a score from 0 to 10.')
};
// No rating yet is null, so the required check catches it.
const initialValues = { rating: null, score: '', reasons: [], comment: '' };

export function Pattern() {
  const form = useFormValidation({ initialValues, rules, validateOn: 'submit' });
  const [done, setDone] = useState(false);
  const { values, errors } = form;
  const answered = [values.rating > 0, values.score !== '', values.reasons.length > 0, values.comment.trim() !== ''].filter(Boolean).length;

  if (done) {
    return (
      <div role='status' className='mx-auto grid w-full max-w-lg gap-2 rounded-lg border p-6 text-center'>
        <p className='text-lg font-semibold'>Thank you for the feedback</p>
        <p className='text-text-muted text-sm'>You rated this article {values.rating} out of 5. It helps decide what to write next.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(() => setDone(true))} aria-labelledby='survey-title' className='mx-auto grid w-full max-w-lg gap-5 rounded-lg border p-5 sm:p-6'>
      <div className='grid gap-2'>
        <div className='flex items-baseline justify-between gap-3'>
          <h2 id='survey-title' className='text-lg font-semibold'>How was this article?</h2>
          <span className='text-text-muted text-xs tabular-nums'>{answered} of 4 answered</span>
        </div>
        <Progress value={(answered / 4) * 100} aria-label='Questions answered' />
      </div>
      <FormErrorSummary form={form} labels={{ rating: 'Overall', score: 'Recommend' }} />
      <Field data-invalid={errors.rating ? true : undefined}>
        <FieldLabel id={form.id('rating-label')}>Overall</FieldLabel>
        <Rating
          id={form.id('rating')}
          rating={values.rating ?? 0}
          editable
          size='lg'
          onRatingChange={(rating) => form.setValue('rating', rating)}
          aria-labelledby={form.id('rating-label')}
          aria-describedby={errors.rating ? form.errorId('rating') : undefined}
        />
        <FieldError id={form.errorId('rating')}>{errors.rating}</FieldError>
      </Field>
      <FieldSet>
        <FieldLegend variant='label' id={form.id('score-label')}>How likely are you to recommend it to a colleague?</FieldLegend>
        <ToggleGroup
          id={form.id('score')}
          type='single'
          variant='outline'
          size='sm'
          spacing={0}
          value={values.score}
          onValueChange={(score) => form.setValue('score', score)}
          aria-labelledby={form.id('score-label')}
          aria-describedby={[form.id('score-hint'), errors.score ? form.errorId('score') : null].filter(Boolean).join(' ')}
          className='grid w-full grid-cols-11'
        >
          {scores.map((score) => (
            <ToggleGroupItem key={score} value={score} aria-label={`${score} out of 10`} className='min-w-0 px-0'>{score}</ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldDescription id={form.id('score-hint')} className='flex justify-between'>
          <span>Not likely</span>
          <span>Very likely</span>
        </FieldDescription>
        <FieldError id={form.errorId('score')}>{errors.score}</FieldError>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant='label' id={form.id('reasons-label')}>
          What stood out? <span className='text-text-muted font-normal'>(optional)</span>
        </FieldLegend>
        <ToggleGroup type='multiple' variant='outline' size='sm' value={values.reasons} onValueChange={(next) => form.setValue('reasons', next)} aria-labelledby={form.id('reasons-label')} className='flex flex-wrap justify-start'>
          {reasons.map((reason) => (
            <ToggleGroupItem key={reason} value={reason}>{reason}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>
      <Field>
        <FieldLabel htmlFor={form.id('comment')}>
          Anything else? <span className='text-text-muted font-normal'>(optional)</span>
        </FieldLabel>
        <Textarea {...form.field('comment')} rows={3} placeholder='What would make it more useful?' />
      </Field>
      <div className='flex justify-end'>
        <Button type='submit'>Send feedback</Button>
      </div>
    </form>
  );
}
