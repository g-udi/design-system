import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { GANTT_SCALES, Gantt, GanttNav, GanttView } from './index.js';

const docs = getComponentDocs('Core/Gantt');
const day = (date) => new Date(2026, 5, date);
// A product launch: three workstreams, finished, in-flight and upcoming work, and dependency lines between phases.
const resources = [
  { id: 'design', title: 'Design', children: [{ id: 'research', title: 'User research' }, { id: 'wireframes', title: 'Wireframes' }, { id: 'visual', title: 'Visual design' }] },
  { id: 'build', title: 'Build', children: [{ id: 'api', title: 'API' }, { id: 'frontend', title: 'Frontend' }, { id: 'qa', title: 'QA pass' }] },
  { id: 'launch', title: 'Launch', children: [{ id: 'docs', title: 'Docs and changelog' }, { id: 'release', title: 'Release' }] }
];
// Only palette colours the theme emits, so every bar is tinted.
const bar = (resourceId, title, start, end, color, progress, dependencies) => ({
  id: `bar-${resourceId}`, title, resourceId, start: day(start), end: day(end), allDay: true, color, progress, dependencies
});
const events = [
  bar('research', 'User research', 1, 6, 'var(--color-sky-500)', 100),
  bar('wireframes', 'Wireframes', 6, 11, 'var(--color-violet-500)', 100, ['bar-research']),
  bar('visual', 'Visual design', 11, 17, 'var(--color-purple-500)', 60, ['bar-wireframes']),
  bar('api', 'API', 8, 19, 'var(--color-cyan-500)', 45),
  bar('frontend', 'Frontend', 15, 24, 'var(--color-emerald-500)', 20, ['bar-visual']),
  bar('qa', 'QA pass', 24, 27, 'var(--color-orange-500)', 0, ['bar-frontend', 'bar-api']),
  bar('docs', 'Docs and changelog', 22, 27, 'var(--color-pink-500)', 10),
  bar('release', 'Release 4.2', 27, 28, 'var(--color-pink-500)', 0, ['bar-qa'])
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
      description: { story: 'A product launch across design, build and launch workstreams, with finished, in-flight and upcoming bars, progress, and dependency lines between phases. `defaultScale` zooms the same plan from single days to a whole year.' },
      source: playgroundSource('Gantt', {
        imports: "import { Gantt, GanttNav, GanttView } from '@gaudi/design-system';",
        children: '  <GanttNav />\n  <GanttView />'
      })
    }
  },
  render: (args) => (
    <Gantt key={args.defaultScale} defaultEvents={events} defaultDate={today} resources={resources} treePanel={{ width: 200 }} className='h-[580px] w-full' {...args}>
      <GanttNav />
      <GanttView />
    </Gantt>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByText('Wireframes')).not.toHaveLength(0);
    await expect(canvasElement.querySelector('[data-slot="gantt-view"]')).toHaveAttribute('data-scale', args.defaultScale);
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onDateChange).toHaveBeenCalled();
    await expect(args.onDateChange.mock.lastCall[0].getTime()).toBeGreaterThan(today.getTime());
  }
};
