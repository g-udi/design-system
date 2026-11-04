import { Pattern as ActivityPlayground } from './fixtures/activity-indicator/activity-indicator-playground.jsx';
import PlaygroundSource from './fixtures/activity-indicator/activity-indicator-playground.jsx?raw';
import { Pattern as ReplyStatus } from './fixtures/activity-indicator/activity-indicator-reply-lifecycle.jsx';
import ReplySource from './fixtures/activity-indicator/activity-indicator-reply-lifecycle.jsx?raw';
import { expect, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatActivityIndicator, activityStates } from '../index.js';

export default {
  title: 'Chat/ChatActivityIndicator',
  id: 'chat-activityindicator',
  tags: ['autodocs'],
  ...chatMeta('ChatActivityIndicator', { component: ChatActivityIndicator, controls: { state: activityStates, variant: ['inline', 'badge', 'compact'], showLabel: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { state: 'thinking', variant: 'inline', showLabel: true },
  parameters: {
    docs: {
      description: { story: 'What the assistant is doing right now. Busy states (thinking, streaming, tool) move; settled states (done, error) hold still and show an icon, so the state never depends on motion or colour alone. It is a polite status: each change is announced once. With reduced motion the dots fade slowly instead of moving.' },
      source: { language: 'jsx', code: PlaygroundSource }
    }
  },
  render: (args) => <ActivityPlayground {...args} />,
  play: async ({ args, canvasElement }) => {
    const indicator = canvasElement.querySelector('[data-slot="activity-indicator"]');
    await expect(indicator).toHaveAttribute('data-state', args.state);
    await expect(within(canvasElement).getByRole('status')).toBeInTheDocument();
  }
};

export const ReplyLifecycle = {
  name: 'A reply from thinking to done',
  parameters: { docs: { source: { language: 'jsx', code: ReplySource }, description: { story: 'The compact indicator follows a reply: thinking, then a tool with a custom label, then writing, then done.' } } },
  render: () => <ReplyStatus />,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement).getByRole('status')).toHaveTextContent('Done'), { timeout: 6000 });
  }
};
