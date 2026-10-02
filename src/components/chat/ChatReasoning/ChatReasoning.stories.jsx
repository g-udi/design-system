import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { MessageReasoning, MessageReasoningStep } from './index.js';

const steps = [
  { text: 'Read the draft and the three reader replies', status: 'done' },
  { text: 'Find where the argument loses the reader', status: 'done' },
  { text: 'Suggest a tighter opening', status: 'running' }
];

export default {
  title: 'Chat/ChatReasoning',
  id: 'chat-chatreasoning',
  tags: ['autodocs'],
  ...chatMeta('ChatReasoning', { component: MessageReasoning, controls: { streaming: 'boolean', duration: 'number', defaultOpen: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { streaming: false, duration: 6, defaultOpen: true },
  parameters: {
    docs: {
      description: { story: 'The thinking trail before an answer. While `streaming` the trigger reads "Thinking" and stays open; once it ends it reads "Thought for 6s" and folds away a second later, unless the reader opened or closed it themselves.' },
      source: {
        language: 'jsx',
        code: `import { MessageReasoning, MessageReasoningStep } from '@gaudi/design-system/chat';

<MessageReasoning streaming={streaming} duration={6}>
  <MessageReasoningStep status='done'>Read the draft and the three reader replies</MessageReasoningStep>
  <MessageReasoningStep status='running'>Suggest a tighter opening</MessageReasoningStep>
</MessageReasoning>`
      }
    }
  },
  render: ({ streaming, duration, defaultOpen }) => (
    <div className='w-full max-w-xl'>
      <MessageReasoning key={`${defaultOpen}`} streaming={streaming} duration={duration} defaultOpen={defaultOpen}>
        {steps.map((step) => (
          <MessageReasoningStep key={step.text} status={streaming ? step.status : 'done'}>{step.text}</MessageReasoningStep>
        ))}
      </MessageReasoning>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: args.streaming ? /Thinking/ : /Thought for|Reasoning/ });
    await expect(trigger).toBeVisible();
  }
};

/** A reply that thinks for a few seconds, then answers; the trail folds away by itself. */
function ThinkThenAnswer() {
  const [phase, setPhase] = useState('thinking');
  useEffect(() => {
    if (phase !== 'thinking') return undefined;
    const timer = setTimeout(() => setPhase('answered'), 1800);
    return () => clearTimeout(timer);
  }, [phase]);
  return (
    <div className='grid w-full max-w-xl gap-3 text-sm'>
      <MessageReasoning streaming={phase === 'thinking'} duration={2}>
        Comparing the two headline options against the post&apos;s first paragraph, then checking the length against the 60-character limit for the newsletter subject line.
      </MessageReasoning>
      {phase === 'answered' ? <p>Go with <strong>“Drafts that survive the train”</strong>: it promises the payoff and fits the subject line.</p> : null}
      <div>
        <button type='button' className='text-accent text-xs underline-offset-4 hover:underline' onClick={() => setPhase('thinking')}>Ask again</button>
      </div>
    </div>
  );
}

export const ThinkingThenAnswer = {
  name: 'Thinking, then the answer',
  parameters: { docs: { description: { story: 'Free-text reasoning instead of steps. The trail is open while the model thinks and folds into "Thought for 2s" once the answer appears.' } } },
  render: () => <ThinkThenAnswer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/Drafts that survive the train/)).toBeVisible(), { timeout: 5000 });
    // The trail folds a second after the answer lands; then the reader can open it again.
    await waitFor(() => expect(canvas.getByRole('button', { name: /Thought for/ })).toHaveAttribute('aria-expanded', 'false'), { timeout: 4000 });
    await userEvent.click(canvas.getByRole('button', { name: /Thought for/ }));
    await waitFor(() => expect(canvas.getByText(/Comparing the two headline options/)).toBeVisible());
  }
};
