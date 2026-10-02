import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { previewSource } from '../../../../.storybook/stories/previewSource';
import Icon from '../Icon';
import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from './NavigationMenu';

const docs = getComponentDocs('Core/NavigationMenu');
const categories = [
  { label: 'All articles', icon: 'BookOpen', meta: 'Latest first', description: 'Long-form writing, design system notes, and engineering essays.' },
  { label: 'Data', icon: 'Network', meta: 'Category', description: 'Knowledge graphs, semantic web, linked data, and retrieval systems.' },
  { label: 'Engineering', icon: 'Terminal', meta: 'Category', description: 'Implementation notes for frontend architecture and developer tooling.' },
  { label: 'Design systems', icon: 'Palette', meta: 'Tag', description: 'Design system decisions, component APIs, and editorial UI patterns.' }
];
const work = [
  { label: 'Publications', icon: 'GraduationCap', meta: '24 papers', description: 'Research, papers, talks, and conference material.' },
  { label: 'Projects', icon: 'Briefcase', meta: '12 tools', description: 'Software, experiments, and reusable tools.' }
];
const href = (label) => `#${label.toLowerCase().replace(' ', '-')}`;
const panel = (items, columns = 2) => (
  <NavigationMenuPanel columns={columns}>
    {items.map(({ label, icon, ...item }) => (
      <NavigationMenuLink key={label} href={href(label)} variant='panel' {...item}>
        <span className='inline-flex items-center gap-2'><Icon name={icon} decorative size='sm' color='primary' />{label}</span>
      </NavigationMenuLink>
    ))}
  </NavigationMenuPanel>
);

const nest = (code) => code.trim().replace(/^/gm, '  ');
const tag = (component, props, children) => previewSource(component, props, children === undefined ? {} : { children: nest(children) }).trim();
const dropdownSource = (props, items, columns = 2) => tag('NavigationMenuDropdown', props, tag('NavigationMenuPanel', { columns },
  items.map(({ label, icon, ...item }) => tag('NavigationMenuLink', { href: href(label), variant: 'panel', ...item }, `<Icon name='${icon}' decorative size='sm' />\n${label}`)).join('\n')));
const menuSource = ({ label, columns, ...dropdown }) => `import { Icon, NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from '@gaudi/design-system';\n\n${
  tag('NavigationMenu', { label }, tag('NavigationMenuList', {}, [
    tag('NavigationMenuLink', { href: href('Blog'), active: true }, 'Blog'),
    dropdownSource({ label: 'Categories', ...dropdown }, categories, columns),
    dropdownSource({ label: 'Work', width: 'lg' }, work),
    tag('NavigationMenuLink', { href: href('About') }, 'About')
  ].join('\n')))}`;
const button = (canvas, name) => canvas.getByRole('button', { name });

export default {
  title: 'Core/Navigation/NavigationMenu',
  id: 'core-navigationmenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    defaultOpen: 'boolean',
    align: ['start', 'center', 'end'],
    width: ['sm', 'md', 'lg', 'xl', '2xl'],
    columns: [1, 2, 3]
  }),
  parameters: {
    // An open panel adds an aria-hidden focus proxy after its trigger that hands Tab focus into the panel.
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', selector: '[aria-hidden="true"]:not([style*="clip"])' }] } },
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { label: 'Main navigation', defaultOpen: true, align: 'start', width: 'xl', columns: 2 },
  argTypes: { label: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'A blog header with a current link, two dropdown panels and a plain link. `defaultOpen` starts the Categories panel open, `align` and `width` place and size it, and `columns` sets its grid. Panels open on click and close on Escape or an outside click.' },
      source: { type: 'dynamic', language: 'jsx', transform: (_code, { args }) => menuSource(args) }
    }
  },
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
    // One panel is open at a time.
    await userEvent.click(workButton);
    await waitFor(() => expect(categoriesButton).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(workButton).toHaveAttribute('aria-expanded', 'true'));
    await waitFor(() => expect(canvas.queryByText(categories[0].label)).toBeNull());
    await expect(await canvas.findByText(work[0].label)).toBeVisible();
    // Escape closes and returns focus to the trigger; an outside click closes too.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(workButton).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(workButton).toHaveFocus());
    await userEvent.click(workButton);
    await waitFor(() => expect(workButton).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(workButton).toHaveAttribute('aria-expanded', 'false'));
    // Reopen the seeded panel so `align`, `width`, and `columns` stay visible after the test.
    if (args.defaultOpen) {
      await userEvent.click(categoriesButton);
      await expect(await canvas.findByText(categories[1].label)).toBeVisible();
    }
  }
};
