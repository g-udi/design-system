import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import CmdLauncher from './CmdLauncher';

const docs = getComponentDocs('Core/CmdLauncher');
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
const openLauncher = async (canvasElement) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'Search content' }));
  const dialog = await body().findByRole('dialog');
  const palette = within(dialog);
  await palette.findByText('Explore content');
  return { dialog, palette };
};
const command = (palette, label) =>
  palette.getAllByText(label).map((node) => node.closest('.command-palette-list-item')).find(Boolean);
const expectClosed = () => waitFor(() => expect(body().queryByRole('dialog')).not.toBeInTheDocument());

function LauncherExample(props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant='outline' tone='neutral' onClick={() => setOpen(true)}>
        Search content
      </Button>
      <CmdLauncher open={open} setOpen={setOpen} {...props} />
    </>
  );
}

export default {
  title: 'Core/CmdLauncher',
  id: 'core-cmdlauncher',
  component: CmdLauncher,
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
      source: playgroundSource('CmdLauncher', {
        imports: "import { useState } from 'react';\nimport { CmdLauncher } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);",
        attributes: ['open={open}', 'setOpen={setOpen}']
      })
    }
  },
  render: (args) => <LauncherExample {...args} />,
  play: async ({ canvasElement }) => {
    const { dialog, palette } = await openLauncher(canvasElement);
    const search = palette.getByRole('textbox');
    const visibleItems = () => [...dialog.querySelectorAll('.command-palette-list-item')].filter((item) => item.offsetParent !== null);

    await expect(palette.getByText('Navigate')).toBeInTheDocument();
    await expect(palette.getByText('Select')).toBeInTheDocument();
    await userEvent.keyboard('{End}');
    await expect(visibleItems().at(-1)).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(visibleItems()[0]).toHaveAttribute('aria-selected', 'true');

    await userEvent.type(search, 'semantic');
    await expect(await palette.findByText('Semantic Web')).toBeInTheDocument();
    await expect(palette.getByText('12 posts')).toBeInTheDocument();
    await userEvent.clear(search);
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
    const post = (await palette.findByText('An Introduction to Knowledge Graphs')).closest('.command-palette-list-item');
    await expect(post.querySelector('[data-cmdk-item-meta]')).toHaveTextContent('data');
    await back();

    await userEvent.click(command(palette, 'Projects'));
    await expect(await palette.findByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(dialog.querySelector('[data-cmdk-list]')).toHaveProperty('scrollTop', 0);
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
