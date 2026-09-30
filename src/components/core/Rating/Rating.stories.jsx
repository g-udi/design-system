import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { Rating } from './index.js';

const docs = getComponentDocs('Core/Rating');
const stars = (canvasElement) =>
  [...canvasElement.querySelectorAll('[data-slot="rating-star-empty"]')].map((star) => star.parentElement);

function RatingExample({ rating, onRatingChange, ...args }) {
  const [value, setValue] = useState(rating);
  const update = (next) => {
    setValue(next);
    onRatingChange(next);
  };
  return <Rating rating={value} onRatingChange={update} {...args} />;
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
    docs: { source: playgroundSource('Rating', { imports: "import { Rating } from '@gaudi/design-system';" }) }
  },
  render: (args) => <RatingExample key={args.rating} {...args} />,
  play: async ({ args, canvasElement }) => {
    await expect(stars(canvasElement)).toHaveLength(args.maxRating);
    if (!args.editable) return;
    await userEvent.click(stars(canvasElement)[args.maxRating - 1]);
    await expect(args.onRatingChange).toHaveBeenLastCalledWith(args.maxRating);
    await userEvent.unhover(stars(canvasElement)[args.maxRating - 1]);
    if (args.showValue) {
      await expect(within(canvasElement).getByText(args.maxRating.toFixed(1))).toBeVisible();
    }
  }
};
