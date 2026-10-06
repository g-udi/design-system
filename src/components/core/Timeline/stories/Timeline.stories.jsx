import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { events, PlaygroundDemo } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { activity } from '../../../../docs/fixtures/application/data';
import Timeline from '../Timeline';

const docs = getComponentDocs('Core/Timeline');
// An editorial feed: every entry carries an icon, a timestamp and host content (actions, quotes, files).
const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Data Display/Timeline', id: 'core-timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Editorial activity' },
  parameters: {
    docs: {
      description: { story: 'An editorial feed where each entry has an icon, a timestamp and its own content: reviewers with an action, a quoted comment, an attached file. `label` names the list and is shown as its visible heading.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.label })).toBeVisible();
    const list = canvas.getByRole('list', { name: args.label });
    await expect(within(list).getAllByRole('listitem').filter((item) => item.parentElement === list)).toHaveLength(events.length);
    await expect(within(list).getByText(events[0].time)).toHaveAttribute('datetime', events[0].dateTime);
    await userEvent.click(within(list).getByRole('button', { name: 'Open review' }));
    await waitFor(() => expect(within(document.body).getByText('Knowledge graphs review')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(list).getByRole('button', { name: 'Open review' })).toHaveFocus());
    for (const mark of canvasElement.querySelectorAll('[data-slot="timeline-indicator"]')) await expect(mark).toHaveAttribute('aria-hidden', 'true');
    list.setAttribute('dir', 'rtl');
    try {
      const bounds = list.getBoundingClientRect();
      for (const mark of list.querySelectorAll('[data-slot="timeline-indicator"]')) {
        const marker = mark.getBoundingClientRect();
        const item = mark.closest('[data-slot="timeline-item"]').getBoundingClientRect();
        await expect(marker.left).toBeGreaterThanOrEqual(item.right);
        await expect(marker.right).toBeLessThanOrEqual(bounds.right + 1);
      }
    } finally {
      list.removeAttribute('dir');
    }
  }
};

export const LongContent = {
  parameters: { docs: { description: { story: 'Long titles and descriptions wrap inside the item instead of escaping the timeline on narrow screens.' } } },
  render: () => (
    <Timeline
      items={[
        {
          id: 'long',
          title: 'A deliberately detailed activity title that should remain readable on a narrow phone',
          description:
            'References include research from multiple sources, with long filenames and notes that wrap instead of escaping the timeline.',
          time: activity[1].time,
          dateTime: activity[1].dateTime
        }
      ]}
    />
  )
};
