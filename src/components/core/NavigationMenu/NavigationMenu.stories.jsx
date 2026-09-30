import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { previewSource } from '../../../../.storybook/stories/previewSource';
import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from './NavigationMenu';

const docs = getComponentDocs('Core/NavigationMenu');
const categories = [
  { label: 'All articles', meta: 'Latest first', description: 'Long-form writing, design system notes, and engineering essays.' },
  { label: 'Data', meta: 'Category', description: 'Knowledge graphs, semantic web, linked data, and retrieval systems.' },
  { label: 'Engineering', meta: 'Category', description: 'Implementation notes for frontend architecture and developer tooling.' },
  { label: 'Design systems', meta: 'Tag', description: 'Design system decisions, component APIs, and editorial UI patterns.' }
];
const work = [
  { label: 'Publications', description: 'Research, papers, talks, and conference material.' },
  { label: 'Projects', description: 'Software, experiments, and reusable tools.' }
];
const footerLinks = ['Blog', 'Publications', 'Projects', 'About'];
const href = (label) => `#${label.toLowerCase().replace(' ', '-')}`;
const panel = (items, columns = 2) => (
  <NavigationMenuPanel columns={columns}>
    {items.map(({ label, ...item }) => <NavigationMenuLink key={label} href={href(label)} variant='panel' {...item}>{label}</NavigationMenuLink>)}
  </NavigationMenuPanel>
);

const nest = (code) => code.trim().replace(/^/gm, '  ');
const tag = (component, props, children) => previewSource(component, props, children === undefined ? {} : { children: nest(children) }).trim();
const dropdownSource = (props, items, columns = 2) => tag('NavigationMenuDropdown', props, tag('NavigationMenuPanel', { columns },
  items.map(({ label, ...item }) => tag('NavigationMenuLink', { href: href(label), variant: 'panel', ...item }, label)).join('\n')));
const menuSource = ({ label, columns, ...dropdown }) => `import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from '@gaudi/design-system';\n\n${
  tag('NavigationMenu', { label }, tag('NavigationMenuList', {}, [
    tag('NavigationMenuLink', { href: href('Blog'), active: true }, 'Blog'),
    dropdownSource({ label: 'Categories', ...dropdown }, categories, columns),
    dropdownSource({ label: 'Work', width: 'lg' }, work),
    tag('NavigationMenuLink', { href: href('About') }, 'About')
  ].join('\n')))}`;
const button = (canvas, name) => canvas.getByRole('button', { name });

export default {
  title: 'Core/NavigationMenu',
  id: 'core-navigationmenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    label: 'text',
    defaultOpen: 'boolean',
    align: ['start', 'center', 'end'],
    width: ['sm', 'md', 'lg', 'xl'],
    columns: [1, 2, 3]
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { label: 'Main navigation', defaultOpen: true, align: 'start', width: 'xl', columns: 2 },
  parameters: { docs: { source: { type: 'dynamic', language: 'jsx', transform: (_code, { args }) => menuSource(args) } } },
  decorators: [(Story) => <div className='min-h-80'><Story /></div>],
  render: ({ label, columns, ...dropdown }) => (
    <NavigationMenu label={label}>
      <NavigationMenuList>
        <NavigationMenuLink href={href('Blog')} active>Blog</NavigationMenuLink>
        <NavigationMenuDropdown key={String(dropdown.defaultOpen)} label='Categories' {...dropdown}>{panel(categories, columns)}</NavigationMenuDropdown>
        <NavigationMenuDropdown label='Work' width='lg'>{panel(work)}</NavigationMenuDropdown>
        <NavigationMenuLink href={href('About')}>About</NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const categoriesButton = button(canvas, 'Categories');
    const workButton = button(canvas, 'Work');
    await expect(canvas.getByRole('navigation', { name: args.label })).toBeVisible();
    await expect(canvas.getByText('Blog').closest('[aria-current="page"]')).not.toBeNull();
    await expect(categoriesButton).toHaveAttribute('aria-expanded', String(args.defaultOpen));
    await userEvent.click(workButton);
    await expect(categoriesButton).toHaveAttribute('aria-expanded', 'false');
    await expect(workButton).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.queryByText(categories[0].label)).toBeNull();
    await expect(canvas.getByText(work[0].label)).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(workButton).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(workButton);
    await userEvent.click(canvasElement.ownerDocument.body);
    await expect(workButton).toHaveAttribute('aria-expanded', 'false');
  }
};

export const Compact = {
  parameters: { docs: { description: { story: 'Without dropdowns the menu is a labelled list of links, suitable for footers and secondary navigation.' } } },
  render: () => (
    <NavigationMenu label='Footer navigation'>
      <NavigationMenuList className='gap-4'>
        {footerLinks.map((label) => <NavigationMenuLink key={label} href={href(label)}>{label}</NavigationMenuLink>)}
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const navigation = within(within(canvasElement).getByRole('navigation', { name: 'Footer navigation' }));
    await expect(navigation.getAllByRole('listitem')).toHaveLength(footerLinks.length);
    await expect(navigation.queryByRole('button')).toBeNull();
  }
};
