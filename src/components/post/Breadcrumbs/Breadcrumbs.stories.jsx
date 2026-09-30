import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Typography from '../../../foundations/Typography';
import Breadcrumbs from './index';

const docs = getComponentDocs('Post/Breadcrumbs');
// A real article path: section, category, and series lead to the current post.
const pages = [
  { current: false, href: '/blog', name: 'Blog' },
  { current: false, href: '/blog/categories/engineering', name: 'Engineering' },
  { current: false, href: '/blog/series/design-systems', name: 'Design Systems' },
  { current: true, href: '/blog/design-tokens-that-scale', name: 'Design tokens that scale' }
];
const currentPage = (trail) => trail.find((page) => page.current) || trail.at(-1);

export default {
  title: 'Post/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { pages: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { pages },
  parameters: {
    docs: {
      description: { story: 'A four-level article path above the page title it leads to. Edit `pages` to add or remove levels, or move `current`: the trail and the title follow.' },
      source: playgroundSource('Breadcrumbs', {
        imports: "import { Breadcrumbs } from '@gaudi/design-system';"
      })
    }
  },
  render: (args) => (
    <div className='grid gap-3'>
      <Breadcrumbs {...args} />
      {args.pages?.length ? <Typography as='h1' variant='post-title'>{currentPage(args.pages).name}</Typography> : null}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const trail = within(within(canvasElement).getByRole('navigation', { name: 'Breadcrumb' }));
    const current = currentPage(args.pages);
    await expect(trail.getAllByRole('listitem')).toHaveLength(args.pages.length + 1);
    await expect(trail.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    for (const page of args.pages.filter((entry, index) => !entry.current && index < args.pages.length - 1))
      await expect(trail.getByRole('link', { name: page.name })).toHaveAttribute('href', page.href);
    await expect(trail.getByText(current.name)).toHaveAttribute('aria-current', 'page');
    await expect(trail.queryByRole('link', { name: current.name })).not.toBeInTheDocument();
    await expect(within(canvasElement).getByRole('heading', { level: 1, name: current.name })).toBeVisible();
  }
};
