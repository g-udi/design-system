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
import { RegistryIcon } from '../../../icons/RegistryIcon';

const docs = getComponentDocs('Core/Breadcrumb');
const items = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/docs/components', label: 'Components' },
  { href: '/docs/components/navigation', label: 'Navigation' },
  { current: true, label: 'Breadcrumb' }
];
const trail = (canvasElement, name) => within(within(canvasElement).getByRole('navigation', { name }));
// Long paths keep the root and the last two levels; everything between collapses into an ellipsis.
const collapse = (path) => (path.length > 3 ? [path[0], null, ...path.slice(-2)] : path);
const collapsedSource = [
  '',
  "<Breadcrumb label='Collapsed breadcrumb'>",
  '  <BreadcrumbList>',
  "    <BreadcrumbItem><BreadcrumbLink href='/'><RegistryIcon lucide='HouseIcon' aria-hidden='true' /><span className='sr-only'>Home</span></BreadcrumbLink></BreadcrumbItem>",
  '    <BreadcrumbSeparator>/</BreadcrumbSeparator>',
  '    <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>',
  '    <BreadcrumbSeparator>/</BreadcrumbSeparator>',
  "    <BreadcrumbItem><BreadcrumbLink href='/docs/components/navigation'>Navigation</BreadcrumbLink></BreadcrumbItem>",
  '    <BreadcrumbSeparator>/</BreadcrumbSeparator>',
  '    <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>',
  '  </BreadcrumbList>',
  '</Breadcrumb>'
].join('\n');

function CollapsedTrail({ path }) {
  const visible = collapse(path);
  return (
    <Breadcrumb label='Collapsed breadcrumb'>
      <BreadcrumbList>
        {visible.map((item, index) => {
          const current = index === visible.length - 1;
          let content = <BreadcrumbEllipsis />;
          if (item && current) content = <BreadcrumbPage>{item.label}</BreadcrumbPage>;
          else if (item && index === 0) content = (
            <BreadcrumbLink href={item.href}>
              <RegistryIcon lucide='HouseIcon' className='size-4' aria-hidden='true' />
              <span className='sr-only'>{item.label}</span>
            </BreadcrumbLink>
          );
          else if (item) content = <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>;
          return (
            <BreadcrumbItem key={item?.label ?? 'ellipsis'}>
              {index > 0 ? <BreadcrumbSeparator>/</BreadcrumbSeparator> : null}
              {content}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default {
  title: 'Core/Breadcrumb',
  id: 'core-breadcrumb',
  component: BreadcrumbTrail,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { items: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { items },
  parameters: {
    docs: {
      description: { story: 'The same five-level path twice: the full `BreadcrumbTrail`, then a composed trail for tight headers with a home icon, slash separators, and the middle levels collapsed. Edit `items` to change both.' },
      source: playgroundSource('BreadcrumbTrail', {
        imports: "import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbTrail } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        after: collapsedSource
      })
    }
  },
  render: (args) => (
    <div className='grid justify-items-center gap-4'>
      <BreadcrumbTrail {...args} />
      <CollapsedTrail path={args.items} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const nav = trail(canvasElement, 'Breadcrumb');
    const current = args.items.at(-1);
    await expect(nav.getAllByRole('listitem')).toHaveLength(args.items.length);
    for (const { href, label } of args.items.slice(0, -1)) {
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
    await expect(nav.getByText(current.label)).toHaveAttribute('aria-current', 'page');
    await expect(nav.queryByRole('link', { name: current.label })).not.toBeInTheDocument();
    const collapsed = trail(canvasElement, 'Collapsed breadcrumb');
    const visible = collapse(args.items);
    await expect(collapsed.getAllByRole('listitem')).toHaveLength(visible.length);
    await expect(collapsed.queryByLabelText('More pages')).toEqual(visible.includes(null) ? expect.anything() : null);
    await expect(collapsed.getByText(current.label)).toHaveAttribute('aria-current', 'page');
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
