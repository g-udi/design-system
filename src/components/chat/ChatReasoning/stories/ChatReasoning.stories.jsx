import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatMessageReasoning } from '../index.js';
import { Pattern as ReasoningPlayground } from './fixtures/reasoning/reasoning-playground.jsx';
import PlaygroundSource from './fixtures/reasoning/reasoning-playground.jsx?raw';
import { Pattern as ThinkingThenAnswerExample } from './fixtures/reasoning/reasoning-thinking-then-answer.jsx';
import ThinkingSource from './fixtures/reasoning/reasoning-thinking-then-answer.jsx?raw';
import { Pattern as MiniThinkingExample } from './fixtures/reasoning/reasoning-mini-thinking.jsx';
import MiniThinkingSource from './fixtures/reasoning/reasoning-mini-thinking.jsx?raw';

export default {
  title: 'Chat/ChatReasoning',
  id: 'chat-chatreasoning',
  tags: ['autodocs'],
  ...chatMeta('ChatReasoning', { component: ChatMessageReasoning, controls: { streaming: 'boolean', duration: 'number', defaultOpen: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { streaming: false, duration: 6, defaultOpen: true },
  parameters: {
    docs: {
      description: { story: 'The thinking trail before an answer. While `streaming` the trigger reads "Thinking" and stays open; once it ends it reads "Thought for 6s" and folds away a second later, unless the reader opened or closed it themselves.' },
      source: { language: 'jsx', code: PlaygroundSource }
    }
  },
  render: (args) => <ReasoningPlayground {...args} />,
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: args.streaming ? /Thinking/ : /Thought for|Reasoning/ });
    await expect(trigger).toBeVisible();
  }
};

export const ThinkingThenAnswer = {
  name: 'Thinking, then the answer',
  parameters: { docs: { source: { language: 'jsx', code: ThinkingSource }, description: { story: 'Free-text reasoning instead of steps. The trail is open while the model thinks and folds into "Thought for 2s" once the answer appears.' } } },
  render: () => <ThinkingThenAnswerExample />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/Drafts that survive the train/)).toBeVisible(), { timeout: 5000 });
    // The trail folds a second after the answer lands; then the reader can open it again.
    await waitFor(() => expect(canvas.getByRole('button', { name: /Thought for/ })).toHaveAttribute('aria-expanded', 'false'), { timeout: 4000 });
    await userEvent.click(canvas.getByRole('button', { name: /Thought for/ }));
    await waitFor(() => expect(canvas.getByText(/Comparing the two headline options/)).toBeVisible());
  }
};

export const MiniThinking = {
  name: 'Mini thinking',
  parameters: { docs: { source: { language: 'jsx', code: MiniThinkingSource }, description: { story: 'A compact Activity Indicator before the answer, with changing labels and a check on completion. The detailed reasoning remains available afterward. This prepared reply uses demo timers; applications supply real activity events.' } } },
  render: () => <MiniThinkingExample />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Ready to reply'), { timeout: 10000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay thinking' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Thinking');
  }
};
