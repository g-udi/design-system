import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Breadcrumbs from './index';

const docs = getComponentDocs('Post/Breadcrumbs');
const pages = [
  { current: false, href: '/blog', name: 'Blog' },
  { current: true, href: '/blog/design-systems', name: 'Design Systems' }
];

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
    docs: { source: playgroundSource('Breadcrumbs', { imports: "import { Breadcrumbs } from '@gaudi/design-system';" }) }
  },
  render: (args) => <Breadcrumbs {...args} />,
  play: async ({ canvasElement }) => {
    const trail = within(within(canvasElement).getByRole('navigation', { name: 'Breadcrumb' }));
    await expect(trail.getByRole('list')).toBeVisible();
    await expect(trail.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    await expect(trail.getByRole('link', { name: pages[0].name })).toHaveAttribute('href', pages[0].href);
    await expect(trail.getByText(pages[1].name)).toHaveAttribute('aria-current', 'page');
    await expect(trail.queryByRole('link', { name: pages[1].name })).not.toBeInTheDocument();
  }
};
