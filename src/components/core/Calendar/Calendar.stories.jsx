import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Calendar } from './index';

const docs = getComponentDocs('Core/Calendar');
const initial = { selected: new Date(2026, 8, 15), month: new Date(2026, 8, 1) };
const source = playgroundSource('Calendar', {
  imports: "import { useState } from 'react';\nimport { Calendar } from '@gaudi/design-system';",
  attributes: ['selected={date}', 'onSelect={setDate}', 'defaultMonth={new Date(2026, 8, 1)}'],
  before: 'export function DatePicker() {\n  const [date, setDate] = useState(new Date(2026, 8, 15));\n  return (\n',
  after: '\n  );\n}'
});

function CalendarPreview(args) {
  const [date, setDate] = useState(initial.selected);
  return <Calendar {...args} selected={date} onSelect={setDate} defaultMonth={initial.month} />;
}

export default {
  title: 'Core/Calendar',
  id: 'core-calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    numberOfMonths: [1, 2],
    showOutsideDays: 'boolean',
    captionLayout: ['label', 'dropdown', 'dropdown-months', 'dropdown-years']
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { mode: 'single', numberOfMonths: 1, showOutsideDays: true, captionLayout: 'label' },
  parameters: {
    docs: {
      source
    }
  },
  render: (args) => <CalendarPreview {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole('button').find((button) => button.textContent === '16'));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Wednesday, September 16th, 2026, selected' })).toHaveAttribute('data-selected-single', 'true'));
  }
};
