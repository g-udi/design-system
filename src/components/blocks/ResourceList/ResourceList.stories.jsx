import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { articles } from '../../../../.storybook/fixtures/application/data';
import Avatar from '../../core/Avatar';
import Icon from '../../core/Icon';
import Pill from '../../core/Pill';
import ResourceList from './ResourceList';

const docs = getComponentDocs('Blocks/ResourceList');
const label = 'Recent articles';
const emptyTitle = 'No articles yet';
// Each status gets its own tone so the list reads at a glance.
const statusTones = { Published: 'green', 'In review': 'amber', Draft: 'gray' };
const categoryIcons = { Engineering: 'Braces', Design: 'Palette', Research: 'FlaskConical' };
const authorTones = { 'Maya Chen': 'indigo', 'Sam Rivera': 'amber', 'Alex Morgan': 'teal' };
const items = articles.slice(0, 4).map(({ id, title, status, category, author, words, updated }) => ({ id, title, status, category, author, words, updated }));
const renderItem = (article) => (
  <div className='flex items-center gap-3'>
    <span className='bg-surface-muted text-text-muted grid size-10 shrink-0 place-items-center rounded-md'>
      <Icon name={categoryIcons[article.category] || 'FileText'} decorative size='sm' />
    </span>
    <div className='min-w-0 flex-1'>
      <p className='ds-label truncate'>{article.title}</p>
      <p className='ds-description flex items-center gap-1.5'>
        <Avatar name={article.author} size='2xs' tone={authorTones[article.author]} />
        <span className='truncate'>{article.author} · {article.updated} · {article.words.toLocaleString('en')} words</span>
      </p>
    </div>
    <Pill size='sm' variant='soft' tone={statusTones[article.status] || 'gray'} className='shrink-0'>
      {article.status}
    </Pill>
  </div>
);

export default {
  title: 'Blocks/To Sort/ResourceList', id: 'blocks-application-resourcelist',
  component: ResourceList,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { items: 'object', loading: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { items, loading: false },
  parameters: {
    docs: {
      description: { story: 'Articles across categories, authors, and publishing states. Edit `items` to change rows (an empty array shows the empty state) and toggle `loading` for skeleton rows.' },
      source: playgroundSource('ResourceList', {
        imports: "import { ResourceList } from '@gaudi/design-system';",
        attributes: [`label='${label}'`, 'renderItem={(article) => <ArticleRow article={article} />}']
      })
    }
  },
  render: (args) => <ResourceList label={label} renderItem={renderItem} emptyTitle={emptyTitle} emptyDescription='Start a draft and it will appear here.' {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    if (args.loading) {
      await expect(canvas.getByRole('status', { name: `Loading ${label}` })).toBeInTheDocument();
      return;
    }
    if (!args.items.length) {
      await expect(canvas.getByText(emptyTitle)).toBeVisible();
      return;
    }
    const list = within(canvas.getByRole('list', { name: label }));
    await expect(list.getAllByRole('listitem')).toHaveLength(args.items.length);
    for (const item of args.items) await expect(list.getByText(item.title)).toBeVisible();
  }
};

export const States = {
  parameters: { docs: { description: { story: '`loading` swaps the rows for skeletons, marks the list busy, and announces a status; with no items, `emptyTitle` and `emptyDescription` explain the state and suggest the next step.' } } },
  render: () => (
    <div className='grid gap-6 sm:grid-cols-2'>
      <section className='grid gap-2' aria-label='Loading example'>
        <p className='ds-description'>Loading</p>
        <ResourceList label='Recent articles' loading />
      </section>
      <section className='grid gap-2' aria-label='Empty example'>
        <p className='ds-description'>Empty</p>
        <ResourceList
          label='Saved articles'
          emptyTitle='Your reading list is open'
          emptyDescription='Save an article and come back to it when you have time.'
        />
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status', { name: 'Loading Recent articles' });
    await expect(status.parentElement).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByText('Your reading list is open')).toBeVisible();
  }
};
