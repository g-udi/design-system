import Button from '../../../core/Button/index.js';
import { useEffect, useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatActivityIndicator, activityStates } from '../index.js';

export default {
  title: 'Chat/ChatActivityIndicator',
  id: 'chat-activityindicator',
  tags: ['autodocs'],
  ...chatMeta('ChatActivityIndicator', { component: ChatActivityIndicator, controls: { state: activityStates, variant: ['inline', 'badge'], showLabel: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { state: 'thinking', variant: 'inline', showLabel: true },
  parameters: {
    docs: {
      description: { story: 'What the assistant is doing right now. Busy states (thinking, streaming, tool) move; settled states (done, error) hold still and show an icon, so the state never depends on motion or colour alone. It is a polite status: each change is announced once. With reduced motion the dots fade slowly instead of moving.' },
      source: playgroundSource('ChatActivityIndicator', { imports: "import { ChatActivityIndicator } from '@gaudi/design-system/chat';" })
    }
  },
  render: (args) => <ChatActivityIndicator {...args} />,
  play: async ({ args, canvasElement }) => {
    const indicator = canvasElement.querySelector('[data-slot="activity-indicator"]');
    await expect(indicator).toHaveAttribute('data-state', args.state);
    await expect(within(canvasElement).getByRole('status')).toBeInTheDocument();
  }
};

const run = ['thinking', 'tool', 'streaming', 'done'];

/** A reply's life cycle, announced as it changes. */
function ReplyStatus() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= run.length - 1) return undefined;
    const timer = setTimeout(() => setStep((value) => value + 1), 1100);
    return () => clearTimeout(timer);
  }, [step]);
  return (
    <div className='grid w-full max-w-sm gap-3'>
      <div className='flex items-center justify-between rounded-(--ds-radius-card) border px-3 py-2 text-sm'>
        <span className='font-medium'>Gaudi</span>
        <ChatActivityIndicator state={run[step]} showLabel labels={{ tool: 'Checking reading stats' }} />
      </div>
      <Button variant='subtle' size='xs' className='justify-self-start' onClick={() => setStep(0)}>Replay</Button>
    </div>
  );
}

export const ReplyLifecycle = {
  name: 'A reply from thinking to done',
  parameters: { docs: { description: { story: 'The indicator follows a reply: thinking, then a tool with a custom label, then writing, then done.' } } },
  render: () => <ReplyStatus />,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement).getByRole('status')).toHaveTextContent('Done'), { timeout: 6000 });
  }
};
