import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import Icon from '../Icon';
import Pill from '../Pill';
import { MenuSearch } from '../../blocks/Navigation';
import Commander from './Commander';

const docs = getComponentDocs('Core/Commander');
const collections = {
  posts: [
    { category: 'data', slug: 'knowledge-graphs', title: 'An Introduction to Knowledge Graphs' },
    { category: 'engineering', slug: 'design-systems-editorial-rhythm', title: 'Design systems keep editorial rhythm predictable' },
    { category: 'productivity', slug: 'project-notes-for-engineering-work', title: 'Project notes for engineering work' }
  ],
  projects: [
    {
      description: 'Design-system notes, tokens, and reusable interface work.',
      slug: 'gaudi',
      subtitle: 'Automate and simplify new machine setups.',
      title: 'Gaudi'
    },
    { description: 'A compact reading and annotation surface.', slug: 'booklight', title: 'Booklight' }
  ],
  publications: [{ href: '', id: 'semantic-search-notes', title: 'Semantic Search Notes', venue: 'Gaudi Papers', year: 2024 }],
  tags: [
    { count: 12, id: 'semantic-web', name: 'Semantic Web', slug: 'semantic-web' },
    { count: 8, id: 'design-systems', name: 'Design Systems', slug: 'design-systems' },
    { count: 5, id: 'knowledge-graphs', name: 'Knowledge Graphs', slug: 'knowledge-graphs' }
  ],
  thoughts: [
    { slug: 'small-ui-contracts', summary: 'Short notes on reusable interface contracts.', title: 'Small UI contracts' },
    { slug: 'keeping-search-fast', summary: 'How command search stays useful as content grows.', title: 'Keeping search fast' }
  ]
};

// Adds the state wiring that the scalar-only playground source cannot serialize.
const body = () => within(document.body);
const openLauncher = async (canvasElement, trigger = 'Search content') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  const dialog = await body().findByRole('dialog');
  const palette = within(dialog);
  await palette.findByText('Explore content');
  return { dialog, palette };
};
const command = (palette, label) =>
  palette.getAllByText(label).map((node) => node.closest('[cmdk-item]')).find(Boolean);
const expectClosed = () => waitFor(() => expect(body().queryByRole('dialog')).not.toBeInTheDocument());
// Each collection prop adds a page to the launcher; the header lists them so editing a control shows up before opening it.
const collectionLabels = [
  ['posts', 'Posts', 'FileText'],
  ['projects', 'Projects', 'Folder'],
  ['thoughts', 'Thoughts', 'Lightbulb'],
  ['publications', 'Publications', 'BookOpen'],
  ['tags', 'Tags', 'Tag']
];
const indexedLabel = (label, count) => `${label}: ${count}`;

function LauncherExample(props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant='outline' tone='neutral' onClick={() => setOpen(true)}>
        Search content
      </Button>
      <Commander open={open} setOpen={setOpen} {...props} />
    </>
  );
}

// A site header with a search field that opens the launcher, and the indexed collections underneath.
function HeaderExample(props) {
  const [open, setOpen] = useState(false);
  return (
    <div className='mx-auto grid w-full max-w-xl gap-3'>
      <header className='flex items-center gap-3 rounded-lg border border-border px-3 py-2'>
        <span className='font-semibold text-text'>Gaudi</span>
        <nav aria-label='Site' className='hidden gap-3 text-sm text-text-muted sm:flex'>
          <span>Blog</span>
          <span>Projects</span>
          <span>About</span>
        </nav>
        <MenuSearch className='ms-auto' setOpen={setOpen} />
      </header>
      <ul aria-label='Indexed collections' className='flex flex-wrap justify-center gap-1.5'>
        {collectionLabels.map(([key, label, icon]) => {
          const count = props[key]?.length || 0;
          return (
            <li key={key}>
              <Pill tone={count ? 'blue' : 'gray'} variant={count ? 'soft' : 'outline'} size='sm' radius='full' icon={<Icon name={icon} decorative size='xs' />}>
                <span className='sr-only'>{indexedLabel(label, count)}</span>
                <span aria-hidden='true' className={count ? undefined : 'line-through'}>{label} · {count}</span>
              </Pill>
            </li>
          );
        })}
      </ul>
      <Commander open={open} setOpen={setOpen} {...props} />
    </div>
  );
}

export default {
  title: 'Core/Overlays & Menus/Commander',
  id: 'core-commander',
  component: Commander,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    posts: 'object',
    projects: 'object',
    publications: 'object',
    tags: 'object',
    thoughts: 'object'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: collections,
  parameters: {
    docs: {
      description: {
        story: 'A site header whose MenuSearch trigger opens the launcher, with the indexed collections listed underneath. Each collection control adds a page and full-text results; empty one to remove its page. Open with the field, ⌘K, or Ctrl+K.'
      },
      source: playgroundSource('Commander', {
        imports: "import { useState } from 'react';\nimport { Commander, MenuSearch } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);",
        attributes: ['open={open}', 'setOpen={setOpen}'],
        before: '<MenuSearch setOpen={setOpen} />\n'
      })
    }
  },
  render: (args) => <HeaderExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [key, label] of collectionLabels) await expect(canvas.getByText(indexedLabel(label, args[key]?.length || 0))).toBeInTheDocument();

    const { dialog, palette } = await openLauncher(canvasElement, 'Open search');
    const search = palette.getByRole('combobox', { name: 'Search commands' });
    const items = () => [...dialog.querySelectorAll('[cmdk-item]')];
    for (const [key, label] of collectionLabels) {
      if (args[key]?.length) await expect(command(palette, label)).toBeTruthy();
    }

    await expect(palette.getByText('Navigate')).toBeInTheDocument();
    await expect(palette.getByText('Select')).toBeInTheDocument();
    await userEvent.keyboard('{End}');
    await expect(items().at(-1)).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(items()[0]).toHaveAttribute('aria-selected', 'true');

    const [tag] = args.tags || [];
    if (tag) {
      await userEvent.type(search, tag.name);
      await expect(await palette.findByText(`${tag.count} posts`)).toBeInTheDocument();
      await userEvent.clear(search);
    }
    await userEvent.type(search, 'no matching command');
    await expect(await palette.findByText('No results for “no matching command”.')).toBeVisible();
    await userEvent.clear(search);

    await userEvent.keyboard('{Escape}');
    await expectClosed();
    await userEvent.keyboard('{Control>}k{/Control}');
    await expect(await body().findByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expectClosed();
  }
};

export const CollectionPages = {
  parameters: {
    docs: {
      description: {
        story: 'Each supplied collection gets its own page with type-specific metadata. Escape returns to the root list before it closes the launcher.'
      }
    }
  },
  render: () => <LauncherExample {...collections} />,
  play: async ({ canvasElement }) => {
    const { dialog, palette } = await openLauncher(canvasElement);
    const back = async () => {
      await userEvent.keyboard('{Escape}');
      await expect(await palette.findByText('Explore content')).toBeInTheDocument();
    };

    await userEvent.click(command(palette, 'Posts'));
    const post = (await palette.findByText('An Introduction to Knowledge Graphs')).closest('[cmdk-item]');
    await expect(post.querySelector('[data-cmdk-item-meta]')).toHaveTextContent('data');
    // A page opens with its first entry selected and the search field focused.
    await expect(post).toHaveAttribute('aria-selected', 'true');
    await expect(palette.getByRole('combobox', { name: 'Search commands' })).toHaveFocus();
    await back();

    await userEvent.click(command(palette, 'Projects'));
    await expect(await palette.findByRole('group', { name: 'Projects' })).toBeVisible();
    await expect(dialog.querySelector('[cmdk-list]')).toHaveProperty('scrollTop', 0);
    await expect(palette.getByText(collections.projects[0].subtitle)).toBeInTheDocument();
    await expect(palette.queryByText(collections.projects[0].description)).not.toBeInTheDocument();
    await back();

    await userEvent.click(command(palette, 'Publications'));
    await expect(await palette.findByText('2024')).toHaveAttribute('data-cmdk-item-meta');
    await expect(palette.queryByText('Gaudi Papers')).not.toBeInTheDocument();
    await back();

    await userEvent.keyboard('{Escape}');
    await expectClosed();
  }
};
