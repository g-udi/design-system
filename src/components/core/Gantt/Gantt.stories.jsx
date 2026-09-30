import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { GANTT_SCALES, Gantt, GanttNav, GanttView } from './index.js';

const docs = getComponentDocs('Core/Gantt');
const day = (date) => new Date(2026, 5, date);
const resources = [
  { id: 'design', title: 'Design', children: [{ id: 'wireframes', title: 'Wireframes' }, { id: 'visual', title: 'Visual design' }] },
  { id: 'build', title: 'Build', children: [{ id: 'frontend', title: 'Frontend' }, { id: 'qa', title: 'QA pass' }] }
];
const bar = (resourceId, title, start, end, color, progress) => ({
  id: `bar-${resourceId}`, title, resourceId, start: day(start), end: day(end), allDay: true, color, progress
});
const events = [
  bar('wireframes', 'Wireframes', 8, 12, 'var(--color-violet-500)', 100),
  bar('visual', 'Visual design', 12, 17, 'var(--color-purple-500)', 60),
  bar('frontend', 'Frontend', 15, 24, 'var(--color-emerald-500)', 20),
  bar('qa', 'QA pass', 24, 27, 'var(--color-amber-500)')
];
const today = day(15);

export default {
  title: 'Core/Gantt',
  id: 'core-gantt',
  component: Gantt,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { defaultScale: GANTT_SCALES }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { defaultScale: 'month', onDateChange: fn(), onScaleChange: fn() },
  parameters: {
    docs: {
      source: playgroundSource('Gantt', {
        imports: "import { Gantt, GanttNav, GanttView } from '@gaudi/design-system';",
        children: '  <GanttNav />\n  <GanttView />'
      })
    }
  },
  render: (args) => (
    <Gantt key={args.defaultScale} defaultEvents={events} defaultDate={today} resources={resources} treePanel={{ width: 200 }} className='h-[420px] w-full' {...args}>
      <GanttNav />
      <GanttView />
    </Gantt>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByText('Wireframes')).not.toHaveLength(0);
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onDateChange).toHaveBeenCalled();
    await expect(args.onDateChange.mock.lastCall[0].getTime()).toBeGreaterThan(today.getTime());
  }
};
