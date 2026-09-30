import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { articles } from '../../../../.storybook/fixtures/application/data';
import Pill from '../../core/Pill';
import ResourceList from './ResourceList';

const docs = getComponentDocs('Blocks/Application/ResourceList');
const items = articles.slice(0, 4);
const renderItem = (article) => (
  <div className='ds-actions justify-between'>
    <div>
      <p className='ds-label'>{article.title}</p>
      <p className='ds-description'>
        {article.author} · {article.updated}
      </p>
    </div>
    <Pill tone='neutral' variant='soft'>
      {article.status}
    </Pill>
  </div>
);

export default {
  title: 'Blocks/Application/ResourceList',
  component: ResourceList,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', loading: 'boolean', emptyTitle: 'text', emptyDescription: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Recent articles', loading: false },
  parameters: {
    docs: { source: playgroundSource('ResourceList', { imports: "import { ResourceList } from '@gaudi/design-system';" }) }
  },
  render: (args) => <ResourceList items={items} renderItem={renderItem} {...args} />,
  play: async ({ args, canvasElement }) => {
    const list = within(within(canvasElement).getByRole('list', { name: args.label }));
    await expect(list.getAllByRole('listitem')).toHaveLength(items.length);
    await expect(list.getByText(items[0].title)).toBeVisible();
  }
};

export const Loading = {
  parameters: { docs: { description: { story: '`loading` swaps the rows for skeletons, marks the list busy, and announces a status message.' } } },
  render: () => <ResourceList label='Recent articles' loading />,
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', { name: 'Loading Recent articles' });
    await expect(status.parentElement).toHaveAttribute('aria-busy', 'true');
  }
};

export const Empty = {
  parameters: { docs: { description: { story: 'With no items, `emptyTitle` and `emptyDescription` explain the state and suggest the next step.' } } },
  render: () => (
    <ResourceList
      label='Saved articles'
      emptyTitle='Your reading list is open'
      emptyDescription='Save an article and come back to it when you have time.'
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Your reading list is open')).toBeVisible();
  }
};
