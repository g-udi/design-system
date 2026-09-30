import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import CmdLauncher from '../CmdLauncher';
import Icon from '../Icon';
import CmdLauncherShortcut from './CmdLauncherShortcut';

const docs = getComponentDocs('Core/CmdLauncherShortcut');
// The hint only teaches the shortcut; the launcher it points to owns the Cmd/Ctrl + K listener.
const archive = {
  posts: [
    { category: 'data', slug: 'knowledge-graphs', title: 'An Introduction to Knowledge Graphs' },
    { category: 'engineering', slug: 'design-systems-editorial-rhythm', title: 'Design systems keep editorial rhythm predictable' }
  ],
  tags: [
    { count: 12, id: 'semantic-web', name: 'Semantic Web', slug: 'semantic-web' },
    { count: 8, id: 'design-systems', name: 'Design Systems', slug: 'design-systems' }
  ]
};

function SearchHero() {
  const [open, setOpen] = useState(false);
  return (
    <section aria-labelledby='archive-search-title' className='mx-auto flex max-w-sm flex-col items-center text-center'>
      <span className='grid size-12 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200'>
        <Icon name='Command' decorative size='md' />
      </span>
      <h2 id='archive-search-title' className='mt-4 text-lg font-semibold text-gray-950 dark:text-gray-100'>Search the archive</h2>
      <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>Jump to any post or tag without leaving the page you are reading.</p>
      <CmdLauncherShortcut />
      <CmdLauncher open={open} setOpen={setOpen} {...archive} />
    </section>
  );
}

export default {
  title: 'Core/CmdLauncherShortcut',
  id: 'core-cmdlaunchershortcut',
  component: CmdLauncherShortcut,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  parameters: {
    docs: {
      description: { story: 'An archive search prompt. The hint teaches the shortcut and a real CmdLauncher answers it: press ⌘K or Ctrl+K in the preview to open it.' },
      source: playgroundSource('CmdLauncherShortcut', {
        imports: "import { useState } from 'react';\nimport { CmdLauncher, CmdLauncherShortcut } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);",
        before: '<h2>Search the archive</h2>\n<p>Jump to any post or tag without leaving the page you are reading.</p>\n',
        after: '\n<CmdLauncher open={open} setOpen={setOpen} posts={posts} tags={tags} />'
      })
    }
  },
  render: () => <SearchHero />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const keys = canvasElement.querySelectorAll('kbd');
    await expect(canvas.getByRole('heading', { name: 'Search the archive' })).toBeVisible();
    await expect(canvas.getByText('Press').parentElement).toHaveTextContent('Press⌘+Kto start');
    await expect(keys).toHaveLength(2);
    await expect(keys[0]).toHaveTextContent('⌘');
    await expect(keys[1]).toHaveTextContent('K');

    await userEvent.keyboard('{Control>}k{/Control}');
    const dialog = await body.findByRole('dialog');
    await expect(await within(dialog).findByText('Explore content')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  }
};
