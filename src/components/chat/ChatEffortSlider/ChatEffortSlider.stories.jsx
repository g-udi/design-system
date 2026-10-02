import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { ChatEffortSlider } from './index.js';

const reviewLevels = [
  { value: 'skim', label: 'Skim', description: 'Typos and broken links only' },
  { value: 'edit', label: 'Edit', description: 'Clarity, flow and structure' },
  { value: 'deep', label: 'Deep', description: 'Argument, sources and fact checks; takes a few minutes' }
];

function Effort({ label, compact, disabled, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className='grid w-full justify-items-center gap-3'>
      <ChatEffortSlider key={defaultValue} label={label} compact={compact} disabled={disabled} value={value} onValueChange={setValue} />
      <p role='status' className='text-text-muted text-xs'>Effort: {value}</p>
    </div>
  );
}

export default {
  title: 'Chat/ChatEffortSlider',
  id: 'chat-chateffortslider',
  tags: ['autodocs'],
  ...chatMeta('ChatEffortSlider', { component: ChatEffortSlider, controls: { label: 'text', defaultValue: ['low', 'medium', 'high', 'max'], compact: 'boolean', disabled: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { label: 'Effort', defaultValue: 'medium', compact: false, disabled: false },
  parameters: {
    docs: {
      description: { story: 'How hard the assistant should think, as a stepped slider over named levels. Arrow keys move one level and the thumb announces the level name ("High effort"), not a number. `compact` drops the step labels and description for a toolbar.' },
      source: {
        language: 'jsx',
        code: `import { ChatEffortSlider } from '@gaudi/design-system/chat';

<ChatEffortSlider value={effort} onValueChange={setEffort} />`
      }
    }
  },
  render: (args) => <Effort key={args.defaultValue} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: args.label });
    await expect(thumb).toHaveAttribute('aria-valuetext', expect.stringMatching(/effort|Effort/i));
    if (!args.disabled) {
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');
      await waitFor(() => expect(canvas.getByRole('status')).not.toHaveTextContent(`Effort: ${args.defaultValue}`));
      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent(`Effort: ${args.defaultValue}`));
    }
  }
};

export const ReviewDepth = {
  name: 'Custom levels: review depth',
  parameters: { docs: { description: { story: 'Levels are data, so the same control sets how deeply Gaudi reviews a draft before publishing.' } } },
  render: () => {
    const Example = () => {
      const [value, setValue] = useState('edit');
      return <ChatEffortSlider label='Review depth' levels={reviewLevels} value={value} onValueChange={setValue} />;
    };
    return <Example />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Deep'));
    await waitFor(() => expect(canvas.getByText(/fact checks/)).toBeVisible());
  }
};
