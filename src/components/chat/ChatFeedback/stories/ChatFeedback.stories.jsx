import { useState } from 'react';
import Button from '../../../core/Button/index.js';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatMessageFeedback } from '../index.js';

const reply = 'Open with the train scene, then the sync bug, then the fix. Cut the history section to two sentences.';

export default {
  title: 'Chat/ChatFeedback',
  id: 'chat-chatfeedback',
  tags: ['autodocs'],
  ...chatMeta('ChatFeedback', { component: ChatMessageFeedback, controls: { defaultRating: ['none', 'up', 'down'], regenerate: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { defaultRating: 'none', regenerate: true, onRatingChange: fn() },
  argTypes: { onRatingChange: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'Actions under a finished reply: copy, rate up or down (pressed buttons, controlled with `rating` / `onRatingChange`) and regenerate. Each action confirms in a visually hidden status, so screen readers hear it once.' },
      source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';\nexport function FeedbackExample({ onRegenerate }) {\n  const [rating, setRating] = useState(null);\n  const reply = 'Open with the train scene, then the sync bug, then the fix.';\n  return <div className='grid gap-2'><p>{reply}</p><ChatMessageFeedback copyText={reply} rating={rating} onRatingChange={setRating} onRegenerate={onRegenerate} /></div>;\n}" }
    }
  },
  render: ({ defaultRating, regenerate, onRatingChange }) => (
    <div className='grid w-full max-w-xl gap-2 text-sm'>
      <p>{reply}</p>
      <ChatMessageFeedback key={defaultRating} copyText={reply} defaultRating={defaultRating === 'none' ? null : defaultRating} onRatingChange={onRatingChange} onRegenerate={regenerate ? () => {} : undefined} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const up = canvas.getByRole('button', { name: 'Good reply' });
    await expect(up).toHaveAttribute('aria-pressed', String(args.defaultRating === 'up'));
    await expect(canvas.queryByRole('button', { name: 'Regenerate' }) !== null).toBe(args.regenerate);
  }
};

/** A rating that asks one follow-up question when the reply missed. */
function RateAndExplain() {
  const [rating, setRating] = useState(null);
  const [reason, setReason] = useState('');
  return (
    <div className='grid w-full max-w-xl gap-3 text-sm'>
      <p>{reply}</p>
      <ChatMessageFeedback copyText={reply} rating={rating} onRatingChange={setRating} />
      {rating === 'down' ? (
        <fieldset className='grid gap-2'>
          <legend className='text-text-muted text-xs'>What was off?</legend>
          <div className='flex flex-wrap gap-2'>
            {['Too long', 'Wrong tone', 'Missed the point'].map((option) => (
              <Button key={option} size='xs' variant='outline' tone='neutral' type='button' aria-pressed={reason === option} onClick={() => setReason(option)} className='aria-pressed:border-accent aria-pressed:text-accent rounded-(--ds-radius-control) border px-2 py-1 text-xs'>
                {option}
              </Button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <p role='status' className='text-text-muted text-xs'>{reason ? `Noted: ${reason.toLowerCase()}. Gaudi will adjust the next reply.` : ''}</p>
    </div>
  );
}

export const RatingWithAReason = {
  name: 'Rating with a reason',
  parameters: { docs: { description: { story: 'A controlled rating: a thumbs down opens one quick question, and the answer is confirmed in a status line.' } } },
  render: () => <RateAndExplain />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Bad reply' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Too long' }));
    await waitFor(() => expect(canvas.getByText(/Noted: too long/)).toBeVisible());
  }
};
