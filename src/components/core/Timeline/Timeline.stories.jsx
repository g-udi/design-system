import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { activity } from '../../../../.storybook/fixtures/application/data';
import Button from '../Button';
import Icon from '../Icon';
import Timeline from './Timeline';

const docs = getComponentDocs('Core/Timeline');

export default {
  title: 'Core/Timeline',
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
      source: playgroundSource('Timeline', {
        imports: `import { Timeline } from '@gaudi/design-system';\n\nconst items = ${JSON.stringify(activity, null, 2)};`
      })
    }
  },
  render: (args) => <Timeline items={activity} {...args} />,
  play: async ({ args, canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: args.label });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(activity.length);
    await expect(within(list).getByText(activity[0].time)).toHaveAttribute('datetime', activity[0].dateTime);
  }
};

export const CustomContent = {
  parameters: { docs: { description: { story: 'An item `icon` fills the decorative marker, and `children` add host-owned content such as an action below the description.' } } },
  render: () => (
    <Timeline
      items={activity.map((item, index) => ({
        ...item,
        icon: <Icon name={index ? 'Check' : 'Clock'} decorative size='xs' />,
        children: index ? null : <Button size='sm' variant='outline'>Open review</Button>
      }))}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Open review' })).toBeVisible();
    for (const mark of canvasElement.querySelectorAll('.ds-timeline-mark')) await expect(mark).toHaveAttribute('aria-hidden', 'true');
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
