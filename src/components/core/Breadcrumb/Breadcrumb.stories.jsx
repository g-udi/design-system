import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { BreadcrumbTrail } from './Breadcrumb';

const docs = getComponentDocs('Core/Breadcrumb');
const items = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/docs/components', label: 'Components' },
  { href: '/docs/components/navigation', label: 'Navigation' },
  { current: true, label: 'Breadcrumb' }
];

export default {
  title: 'Core/Navigation/Breadcrumb',
  id: 'core-breadcrumb',
  component: BreadcrumbTrail,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { items: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { items },
  parameters: {
    docs: {
      description: { story: 'A docs page header: a five-level trail above the page title. Every ancestor is a link and the last item marks the current page; edit `items` to change the trail and the title. Collapsed, icon and dropdown trails are in the examples below.' },
      source: playgroundSource('BreadcrumbTrail', { imports: "import { BreadcrumbTrail } from '@gaudi/design-system';" })
    }
  },
  render: (args) => (
    <header className='grid gap-2'>
      <BreadcrumbTrail {...args} />
      <h1 className='text-2xl font-semibold text-text'>{args.items.at(-1)?.label}</h1>
      <p className='text-sm text-text-muted'>A trail of links from the site root to the page you are on.</p>
    </header>
  ),
  play: async ({ args, canvasElement }) => {
    const nav = within(within(canvasElement).getByRole('navigation', { name: 'Breadcrumb' }));
    const current = args.items.at(-1);
    await expect(nav.getAllByRole('listitem')).toHaveLength(args.items.length);
    for (const { href, label } of args.items.slice(0, -1)) {
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
    await expect(nav.getByText(current.label)).toHaveAttribute('aria-current', 'page');
    await expect(nav.queryByRole('link', { name: current.label })).not.toBeInTheDocument();
  }
};
