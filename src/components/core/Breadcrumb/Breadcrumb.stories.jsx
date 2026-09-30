import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbTrail
} from './Breadcrumb';

const docs = getComponentDocs('Core/Breadcrumb');
const items = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { current: true, label: 'Design Systems' }
];
const trail = (canvasElement, name) => within(within(canvasElement).getByRole('navigation', { name }));

export default {
  title: 'Core/Breadcrumb',
  id: 'core-breadcrumb',
  component: BreadcrumbTrail,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', items: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { label: 'Breadcrumb', items },
  parameters: { docs: { source: playgroundSource('BreadcrumbTrail', { imports: "import { BreadcrumbTrail } from '@gaudi/design-system';" }) } },
  render: (args) => <BreadcrumbTrail {...args} />,
  play: async ({ args, canvasElement }) => {
    const nav = trail(canvasElement, args.label);
    const current = args.items.find((item) => item.current);
    await expect(nav.getAllByRole('listitem')).toHaveLength(args.items.length);
    for (const { href, label } of args.items.filter((item) => !item.current)) {
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
    await expect(nav.getByText(current.label)).toHaveAttribute('aria-current', 'page');
    await expect(nav.queryByRole('link', { name: current.label })).not.toBeInTheDocument();
  }
};

export const Composed = {
  parameters: { docs: { description: { story: 'Compose `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbEllipsis`, and `BreadcrumbPage` to collapse long paths or customise each part.' } } },
  render: () => (
    <Breadcrumb label='Article breadcrumb'>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href='/'>Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Current article</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const nav = trail(canvasElement, 'Article breadcrumb');
    await expect(nav.getAllByRole('listitem')).toHaveLength(3);
    await expect(nav.getByLabelText('More pages')).toBeVisible();
    await expect(nav.queryByRole('link', { name: 'More pages' })).not.toBeInTheDocument();
    await expect(nav.getByText('Current article')).toHaveAttribute('aria-current', 'page');
  }
};
