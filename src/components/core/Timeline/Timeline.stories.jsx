import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { activity } from '../../../../.storybook/fixtures/application/data';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { AvatarGroup } from '../Avatar';
import Button from '../Button';
import Timeline from './Timeline';

const docs = getComponentDocs('Core/Timeline');
// An editorial feed: every entry carries an icon, a timestamp and host content (actions, quotes, files).
const events = [
  {
    id: 'review',
    title: 'Review requested',
    description: 'Sam asked Lee and you to review the draft.',
    time: '12 minutes ago',
    dateTime: '2026-09-29T10:48:00Z',
    icon: <RegistryIcon lucide='GitPullRequest' className='size-4 text-accent' />,
    children: (
      <div className='mt-2 flex items-center gap-2'>
        <AvatarGroup avatars={[{ id: 'sam', name: 'Sam Rivera' }, { id: 'lee', name: 'Lee Chen' }]} size='sm' label='Reviewers' />
        <Button size='sm' variant='outline'>Open review</Button>
      </div>
    )
  },
  {
    id: 'comment',
    title: 'Lee left 3 comments',
    time: '1 hour ago',
    dateTime: '2026-09-29T10:00:00Z',
    icon: <RegistryIcon lucide='MessageSquare' className='size-4' />,
    children: (
      <blockquote className='mt-2 border-s-2 border-border ps-3 text-sm text-text-muted'>
        “Could the schema diagram come before the table?”
      </blockquote>
    )
  },
  {
    id: 'notes',
    title: 'Research notes updated',
    description: 'Three references were added to the bibliography.',
    time: 'Yesterday',
    dateTime: '2026-09-28T16:20:00Z',
    icon: <RegistryIcon lucide='Paperclip' className='size-4' />,
    children: (
      <span className='mt-2 inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs'>
        <RegistryIcon lucide='FileText' className='size-3.5 text-text-muted' />
        references.pdf <span className='text-text-muted'>2.4 MB</span>
      </span>
    )
  },
  {
    id: 'published',
    title: 'Article published',
    description: 'A practical guide to knowledge graphs is live.',
    time: '2 days ago',
    dateTime: '2026-09-27T09:00:00Z',
    icon: <RegistryIcon lucide='CircleCheck' className='size-4 text-success' />
  }
];
const sourceItems = events.map(({ id, title, description, time, dateTime }) => ({ id, title, description, time, dateTime }));

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
      description: { story: 'An editorial feed where each entry has an icon, a timestamp and its own content: reviewers with an action, a quoted comment, an attached file. `label` names the list and is shown as its visible heading.' },
      source: playgroundSource('Timeline', {
        imports: `import { Timeline } from '@gaudi/design-system';\n\nconst items = ${JSON.stringify(sourceItems, null, 2)};`,
        attributes: ['items={items}']
      })
    }
  },
  render: (args) => (
    <section className='mx-auto grid max-w-lg gap-3'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='text-base font-semibold'>{args.label}</h3>
        <span className='text-xs text-text-muted'>{events.length} events</span>
      </div>
      <Timeline items={events} {...args} />
    </section>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.label })).toBeVisible();
    const list = canvas.getByRole('list', { name: args.label });
    await expect(within(list).getAllByRole('listitem').filter((item) => item.parentElement === list)).toHaveLength(events.length);
    await expect(within(list).getByText(events[0].time)).toHaveAttribute('datetime', events[0].dateTime);
    await expect(within(list).getByRole('button', { name: 'Open review' })).toBeVisible();
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
