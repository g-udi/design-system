import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { HeaderExample, collectionLabels, indexedLabel } from './fixtures/HeaderCommanderExample.jsx';
import headerSource from './fixtures/HeaderCommanderExample.jsx?raw';
import Button from '../../Button';
import Commander from '../Commander';

const docs = getComponentDocs('Core/Commander');
const blockedPostAction = fn();
const collections = {
  navigation: [
    { id: 'home', title: 'Home', href: '/', cmdIcon: 'HomeIcon' },
    { id: 'blog', title: 'Blog', href: '/blog', cmdIcon: 'BookOpenIcon' },
    { id: 'about', title: 'About me', href: '/about', cmdIcon: 'FingerPrintIcon' }
  ],
  posts: [
    { category: 'data_platform', id: 'knowledge-entry', href: '/articles/knowledge-graphs', slug: 'knowledge-graphs', title: 'An Introduction to Knowledge Graphs' },
    { category: 'engineering', href: '/articles/design-systems-editorial-rhythm', slug: 'design-systems-editorial-rhythm', title: 'Design systems keep editorial rhythm predictable' },
    { category: 'productivity', disabled: true, onClick: blockedPostAction, href: '/articles/project-notes-for-engineering-work', slug: 'project-notes-for-engineering-work', title: 'Project notes for engineering work' }
  ],
  projects: [
    {
      description: 'Design-system notes, tokens, and reusable interface work.',
      slug: 'gaudi',
      href: '/work/gaudi',
      subtitle: 'Automate and simplify new machine setups.',
      title: 'Gaudi'
    },
    { description: 'A compact reading and annotation surface.', slug: 'booklight', href: '/work/booklight', title: 'Booklight' }
  ],
  publications: [{ href: '', id: 'semantic-search-notes', title: 'Semantic Search Notes', venue: 'Gaudi Papers', year: 2024 }],
  tags: [
    { count: 12, id: 'semantic-web', name: 'Semantic Web', slug: 'semantic-web', href: '/topics/semantic-web' },
    { count: 8, id: 'design-systems', name: 'Design Systems', slug: 'design-systems', href: '/topics/design-systems' },
    { count: 5, id: 'knowledge-graphs', name: 'Knowledge Graphs', slug: 'knowledge-graphs', href: '/topics/knowledge-graphs' }
  ],
  thoughts: [
    { href: '/notes/small-ui-contracts', slug: 'small-ui-contracts', summary: 'Short notes on reusable interface contracts.', title: 'Small UI contracts' },
    { href: '/notes/keeping-search-fast', slug: 'keeping-search-fast', summary: 'How command search stays useful as content grows.', title: 'Keeping search fast' }
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

const auditState = async (context, state) => {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({ ...context, id: `${context.id}--${state}` });
};

export default {
  title: 'Core/Overlays & Menus/Commander',
  id: 'core-commander',
  component: Commander,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    navigation: 'object',
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
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => previewSource('HeaderExample', args, { before: `${publicSource(headerSource, new URL('./fixtures/HeaderCommanderExample.jsx', import.meta.url))}\n\n` }) }
    }
  },
  render: (args) => <HeaderExample {...args} />,
  play: async (context) => {
    const { args, canvasElement } = context;
    const canvas = within(canvasElement);
    for (const [key, label] of collectionLabels) await expect(canvas.getByText(indexedLabel(label, args[key]?.length || 0))).toBeInTheDocument();

    const { dialog, palette } = await openLauncher(canvasElement, 'Open search');
    await auditState(context, 'open');
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

    const startedDark = document.documentElement.classList.contains('dark');
    try {
      await userEvent.click(command(palette, 'Switch theme'));
      await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(!startedDark));
      await expect(dialog).toBeVisible();
    } finally {
      if (document.documentElement.classList.contains('dark') !== startedDark) {
        await userEvent.click(command(palette, 'Switch theme'));
        await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(startedDark));
      }
    }
    await expect(dialog).toBeVisible();

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
  play: async (context) => {
    const { canvasElement } = context;
    const { dialog, palette } = await openLauncher(canvasElement);
    await auditState(context, 'open');
    const back = async () => {
      await userEvent.keyboard('{Escape}');
      await expect(await palette.findByText('Explore content')).toBeInTheDocument();
    };

    await userEvent.click(command(palette, 'Posts'));
    const post = (await palette.findByText('An Introduction to Knowledge Graphs')).closest('[cmdk-item]');
    await expect(post.querySelector('[data-cmdk-item-meta]')).toHaveTextContent('data_platform');
    await auditState(context, 'posts');
    await expect(getComputedStyle(post.querySelector('[data-cmdk-item-meta]')).textTransform).toBe('none');
    // A page opens with its first entry selected and the search field focused.
    await expect(post).toHaveAttribute('aria-selected', 'true');
    await expect(palette.getByRole('combobox', { name: 'Search commands' })).toHaveFocus();
    const disabledPost = command(palette, 'Project notes for engineering work');
    await expect(disabledPost).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(disabledPost, { pointerEventsCheck: 0 });
    await expect(blockedPostAction).not.toHaveBeenCalled();
    await expect(dialog).toBeVisible();
    palette.getByRole('combobox', { name: 'Search commands' }).focus();
    await back();

    await userEvent.click(command(palette, 'Projects'));
    await expect(await palette.findByRole('group', { name: 'Projects' })).toBeVisible();
    await expect(dialog.querySelector('[cmdk-list]')).toHaveProperty('scrollTop', 0);
    await expect(palette.getByText(collections.projects[0].subtitle)).toBeInTheDocument();
    await auditState(context, 'projects');
    await expect(palette.queryByText(collections.projects[0].description)).not.toBeInTheDocument();
    await back();

    await userEvent.click(command(palette, 'Publications'));
    await expect(await palette.findByText('2024')).toHaveAttribute('data-cmdk-item-meta');
    await auditState(context, 'publications');
    await expect(palette.queryByText('Gaudi Papers')).not.toBeInTheDocument();
    await back();

    await userEvent.keyboard('{Escape}');
    await expectClosed();
  }
};
