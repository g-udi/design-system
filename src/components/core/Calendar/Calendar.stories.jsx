import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource, previewSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Calendar } from './index';

const docs = getComponentDocs('Core/Calendar');
const day = (month, date) => new Date(2026, month, date);
const month = day(8, 1);
// A stay booking: the first days of September have passed and 10–12 September are already booked.
const disabled = [{ before: day(8, 3) }, { from: day(8, 10), to: day(8, 12) }];
const disabledSource = 'disabled={[{ before: new Date(2026, 8, 3) }, { from: new Date(2026, 8, 10), to: new Date(2026, 8, 12) }]}';
// Each mode starts with a selection of its own shape; the range spans September into October.
const selections = {
  single: { value: day(8, 15), source: 'new Date(2026, 8, 15)' },
  multiple: { value: [day(8, 15), day(8, 17), day(8, 22)], source: '[new Date(2026, 8, 15), new Date(2026, 8, 17), new Date(2026, 8, 22)]' },
  range: { value: { from: day(8, 24), to: day(9, 2) }, source: '{ from: new Date(2026, 8, 24), to: new Date(2026, 9, 2) }' }
};
const short = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const nights = (from, to) => Math.round((to - from) / 86400000);
const summaries = {
  single: (date) => (date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Pick a date'),
  multiple: (dates = []) => `${dates.length} ${dates.length === 1 ? 'date' : 'dates'} selected`,
  range: ({ from, to } = {}) => {
    if (!from) return 'Pick a check-in date';
    if (!to) return `${short(from)} – pick a check-out date`;
    return `${short(from)} – ${short(to)} · ${nights(from, to)} nights`;
  }
};
// Clicking 16 September selects it in every mode; the range keeps its end and moves its start.
const afterPicking = {
  single: summaries.single(day(8, 16)),
  multiple: summaries.multiple([...selections.multiple.value, day(8, 16)]),
  range: summaries.range({ from: day(8, 16), to: selections.range.value.to })
};

function CalendarPreview({ mode, ...args }) {
  const [selected, setSelected] = useState(selections[mode].value);
  return (
    <Calendar
      {...args}
      className='mx-auto'
      mode={mode}
      selected={selected}
      onSelect={setSelected}
      defaultMonth={month}
      disabled={disabled}
      footer={<p className='pt-3 text-center text-sm text-ui-muted-foreground'>{summaries[mode](selected)}</p>}
    />
  );
}

export default {
  title: 'Core/Advanced Inputs/Calendar',
  id: 'core-calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    mode: Object.keys(selections),
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
  args: { mode: 'range', numberOfMonths: 2, showOutsideDays: true, captionLayout: 'label' },
  parameters: {
    docs: {
      description: { story: 'A stay booking with past and already-booked dates disabled. `mode` switches between one date, several dates, and a range that spans two months; the footer summarises the current selection.' },
      source: {
        ...playgroundSource('Calendar'),
        transform: (_source, { args }) => previewSource('Calendar', args, {
          imports: "import { useState } from 'react';\nimport { Calendar } from '@gaudi/design-system';",
          attributes: ['selected={selected}', 'onSelect={setSelected}', 'defaultMonth={new Date(2026, 8, 1)}', disabledSource],
          before: `export function StayPicker() {\n  const [selected, setSelected] = useState(${selections[args.mode].source});\n  return (\n`,
          after: '\n  );\n}'
        })
      }
    }
  },
  render: (args) => <CalendarPreview key={args.mode} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = canvas.getByText(summaries[args.mode](selections[args.mode].value));
    const dayButton = (name) => canvas.getAllByRole('button', { name })[0];
    await expect(footer.closest('[role="status"]')).toBeInTheDocument();
    await expect(dayButton(/September 11th, 2026/)).toBeDisabled();
    await userEvent.click(dayButton(/September 16th, 2026/));
    await waitFor(() => expect(dayButton('Wednesday, September 16th, 2026, selected')).toBeVisible());
    await waitFor(() => expect(canvas.getByText(afterPicking[args.mode]).closest('[role="status"]')).toBeInTheDocument());
  }
};
