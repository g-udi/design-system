import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import Button from '../../../core/Button';
import PageHeader from '..';

const docs = getComponentDocs('Blocks/Page Header');
const posts = [ 'Contract tests protect observable behaviour', 'Notes on local-first software', 'Design tokens in practice', 'Why server components change data loading', 'Readable code review comments', 'Shipping a design system to two apps', 'Measuring reading time honestly', 'Small APIs age well' ];

export default {
  title: 'Blocks/Page Header',
  id: 'layout-page-header',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', titleAs: ['h1', 'h2'], titleVariant: ['title-md', 'display-lg', 'heading-lg', 'heading-md'], eyebrow: 'text', description: 'text', divider: 'boolean', sticky: 'boolean' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { eyebrow: 'Archive', title: 'Projects', titleAs: 'h1', titleVariant: 'title-md', description: 'Open-source tools and experiments, newest first.', divider: true, sticky: false },
  parameters: {
    docs: {
      source: playgroundSource('PageHeader', {
        imports: "import PageHeader from '@gaudi/design-system/layout/PageHeader';\nimport Button from '@gaudi/design-system/core/Button';",
        attributes: ["actions={ <Button size='sm' variant='outline' tone='neutral' href='/feed.xml'>RSS feed</Button> }"]
      })
    }
  },
  render: (args) => <PageHeader {...args} actions={ <Button size='sm' variant='outline' tone='neutral' href='/feed.xml'>RSS feed</Button> } />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { name: args.title });
    await expect(heading.tagName).toBe(args.titleAs.toUpperCase());
    await expect(canvas.getByText(args.description)).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'RSS feed' })).toBeVisible();
  }
};

export const StickyListHeading = {
  name: 'Sticky list heading',
  parameters: { docs: { description: { story: 'A section heading that stays pinned on the page background while its list scrolls beneath it. The region is labelled by the heading.' } } },
  render: () => (
    <div className='h-80 overflow-y-auto' tabIndex={0} aria-label='Post archive preview'>
      <section aria-labelledby='page-header-all-posts'>
        <PageHeader sticky titleAs='h2' titleVariant='heading-lg' titleId='page-header-all-posts' title='All posts' actions={ <span className='text-sm tabular-nums text-text-muted'>{posts.length} posts</span> } />
        <ul className='grid gap-6 pt-4'>
          {posts.map((post) => <li key={post} className='text-base text-text'>{post}</li>)}
        </ul>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'All posts' })).toBeVisible();
    const header = canvasElement.querySelector('[data-slot="page-header"]');
    await expect(getComputedStyle(header).position).toBe('sticky');
    await expect(header).toHaveAttribute('data-sticky');
  }
};
