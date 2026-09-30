import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Calendar } from './index';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { previewSource } from '../../../../.storybook/stories/previewSource';

export default { title: 'Core/Calendar', component: Calendar, tags: ['autodocs'] };

function CalendarPreview(args) {
  const [date, setDate] = useState(new Date(2026, 8, 15));
  return <ExampleFrame className='p-0 sm:p-4'><Calendar mode='single' selected={date} onSelect={setDate} defaultMonth={new Date(2026, 8, 1)} {...args} /></ExampleFrame>;
}

export const Playground = {
  args: { numberOfMonths: 1, showOutsideDays: true, captionLayout: 'label', disabled: false },
  argTypes: {
    numberOfMonths: { control: 'select', options: [1, 2] },
    showOutsideDays: { control: 'boolean' },
    captionLayout: { control: 'select', options: ['label', 'dropdown'] },
    disabled: { control: 'boolean' }
  },
  render: (args) => <CalendarPreview {...args} />,
  parameters: { docs: { source: { type: 'dynamic', transform: (_, context) => previewSource('Calendar', context.args, {
    imports: "import { useState } from 'react';\nimport { Calendar } from '@gaudi/design-system/core/Calendar';",
    before: "export function DatePicker() {\n  const [date, setDate] = useState(new Date(2026, 8, 15));\n  return (\n",
    after: '\n  );\n}'
  }).replace('<Calendar\n', '<Calendar\n  mode="single"\n  selected={date}\n  onSelect={setDate}\n  defaultMonth={new Date(2026, 8, 1)}\n') } } },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const day = canvas.getAllByRole('button').find(button => button.textContent === '16');
    await userEvent.click(day);
    await waitFor(() => expect(canvas.getByRole('button', {name: 'Wednesday, September 16th, 2026, selected'})).toHaveAttribute('data-selected-single', 'true'));
  }
};
