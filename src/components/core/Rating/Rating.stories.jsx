import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { Rating } from './index.js';

const docs = getComponentDocs('Core/Rating');
// A stay review: read-only category scores sit above the guest's own rating, which follows the controls.
const categories = [
  { label: 'Cleanliness', score: 4.8 },
  { label: 'Location', score: 4.5 },
  { label: 'Value', score: 3.5 }
];
const featured = (canvasElement) => within(canvasElement).getByRole('group', { name: 'Your rating' });
const stars = (element) =>
  [...element.querySelectorAll('[data-slot="rating-star-empty"]')].map((star) => star.parentElement);
const hint = (editable, value, maxRating) => {
  if (!editable) return 'Submitted 12 Sep · reviews lock after posting';
  return value ? `You rated this stay ${value} of ${maxRating}` : 'Tap a star to rate your stay';
};

function RatingExample({ rating, onRatingChange, maxRating, editable, showValue, size, ...args }) {
  const [value, setValue] = useState(rating);
  const update = (next) => {
    setValue(next);
    onRatingChange(next);
  };
  return (
    <div className='mx-auto grid w-full max-w-sm gap-4 text-sm'>
      <div className='flex items-center gap-3'>
        <span className='text-3xl font-semibold tabular-nums'>4.6</span>
        <div className='grid gap-1'>
          <Rating rating={4.6} size={size} />
          <span className='text-xs text-ui-muted-foreground'>1,284 verified reviews</span>
        </div>
      </div>
      <dl className='grid gap-2'>
        {categories.map(({ label, score }) => (
          <div key={label} className='flex items-center justify-between gap-3'>
            <dt className='text-ui-muted-foreground'>{label}</dt>
            <dd><Rating rating={score} size={size} showValue={showValue} /></dd>
          </div>
        ))}
      </dl>
      <div role='group' aria-label='Your rating' className='grid gap-1.5 border-t border-ui-border pt-4'>
        <span className='font-medium'>Your rating</span>
        <Rating rating={value} maxRating={maxRating} editable={editable} showValue={showValue} size={size} onRatingChange={update} {...args} />
        <span className='text-xs text-ui-muted-foreground'>{hint(editable, value, maxRating)}</span>
      </div>
    </div>
  );
}

export default {
  title: 'Core/Rating',
  id: 'core-rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    rating: 'number',
    maxRating: 'number',
    editable: 'boolean',
    showValue: 'boolean',
    size: ['sm', 'default', 'lg']
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { rating: 3, maxRating: 5, editable: true, showValue: true, size: 'default', onRatingChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A stay review: the average and category scores are read-only, and the guest rating below follows the controls. Size and value readout apply to every row; editable swaps the hint for a locked state.' },
      source: playgroundSource('Rating', { imports: "import { Rating } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <RatingExample key={`${args.rating}-${args.maxRating}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    const group = featured(canvasElement);
    await expect(stars(group)).toHaveLength(args.maxRating);
    await expect(canvasElement.querySelectorAll('[data-slot="rating-value"]')).toHaveLength(args.showValue ? categories.length + 1 : 0);
    await expect(within(group).getByText(hint(args.editable, args.rating, args.maxRating))).toBeVisible();
    await expect(within(canvasElement).getByRole('img', { name: 'Rated 4.6 out of 5' })).toBeVisible();
    if (!args.editable) return;
    await userEvent.click(stars(group)[args.maxRating - 1]);
    await expect(args.onRatingChange).toHaveBeenLastCalledWith(args.maxRating);
    await userEvent.unhover(stars(group)[args.maxRating - 1]);
    await expect(within(group).getByText(hint(true, args.maxRating, args.maxRating))).toBeVisible();
    if (args.showValue) {
      await expect(within(group).getByText(args.maxRating.toFixed(1))).toBeVisible();
    }
    // Keyboard: the radio group follows the roving-tabindex pattern.
    const radio = (count) => within(group).getByRole('radio', { name: `${count} star${count === 1 ? '' : 's'}` });
    await userEvent.keyboard('{Home}');
    await expect(args.onRatingChange).toHaveBeenLastCalledWith(1);
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onRatingChange).toHaveBeenLastCalledWith(2);
    await expect(radio(2)).toHaveFocus();
    await expect(radio(2)).toHaveAttribute('aria-checked', 'true');
    await expect(radio(2)).toHaveAttribute('tabindex', '0');
    await expect(radio(1)).toHaveAttribute('tabindex', '-1');
    await userEvent.keyboard('{End}');
    await expect(args.onRatingChange).toHaveBeenLastCalledWith(args.maxRating);
  }
};
