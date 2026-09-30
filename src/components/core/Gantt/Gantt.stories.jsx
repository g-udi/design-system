import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { GANTT_COLORS as COLORS, GANTT_SCALES, Gantt, GanttNav, GanttView } from './index.js';

const docs = getComponentDocs('Core/Gantt');
const day = (date) => new Date(2026, 5, date);
// A product launch: three workstreams, finished, in-flight and upcoming work, and dependency lines between phases.
const resources = [
  { id: 'design', title: 'Design', children: [{ id: 'research', title: 'User research' }, { id: 'wireframes', title: 'Wireframes' }, { id: 'visual', title: 'Visual design' }] },
  { id: 'build', title: 'Build', children: [{ id: 'api', title: 'API' }, { id: 'frontend', title: 'Frontend' }, { id: 'qa', title: 'QA pass' }] },
  { id: 'launch', title: 'Launch', children: [{ id: 'docs', title: 'Docs and changelog' }, { id: 'release', title: 'Release' }] }
];
// Bars use the colours Gantt offers, by lower-case name.
const tone = Object.fromEntries(COLORS.map(({ name, value }) => [name.toLowerCase(), value]));
const bar = (resourceId, title, start, end, color, progress, dependencies) => ({
  id: `bar-${resourceId}`, title, resourceId, start: day(start), end: day(end), allDay: true, color, progress, dependencies
});
const events = [
  bar('research', 'User research', 1, 6, tone.blue, 100),
  bar('wireframes', 'Wireframes', 6, 11, tone.violet, 100, ['bar-research']),
  bar('visual', 'Visual design', 11, 17, tone.indigo, 60, ['bar-wireframes']),
  bar('api', 'API', 8, 19, tone.teal, 45),
  bar('frontend', 'Frontend', 15, 24, tone.emerald, 20, ['bar-visual']),
  bar('qa', 'QA pass', 24, 27, tone.amber, 0, ['bar-frontend', 'bar-api']),
  bar('docs', 'Docs and changelog', 22, 27, tone.rose, 10),
  bar('release', 'Release 4.2', 27, 28, tone.pink, 0, ['bar-qa'])
];
const today = day(15);

export default {
  title: 'Core/Planning/Gantt',
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
    // Every offered colour resolves to a defined theme variable, so no event or bar renders untinted.
    for (const { value } of COLORS) {
      await expect(getComputedStyle(canvasElement).getPropertyValue(value.match(/--[\w-]+/)[0])).not.toBe('');
    }
    await expect(canvasElement.querySelector('[data-slot="gantt-view"]')).toHaveAttribute('data-scale', args.defaultScale);
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onDateChange).toHaveBeenCalled();
    await expect(args.onDateChange.mock.lastCall[0].getTime()).toBeGreaterThan(today.getTime());
  }
};
