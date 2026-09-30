import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Icon from '../../core/Icon';
import MenuLogo from '../MenuLogo';
import MenuSearch from './MenuSearch';

const docs = getComponentDocs('Navigation/MenuSearch');

export default {
  title: 'Navigation/MenuSearch',
  id: 'navigation-menusearch',
  component: MenuSearch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

const links = ['Publications', 'Projects', 'Thoughts'];

// The entry in its two homes: the desktop header and the full-width row of the mobile sheet.
function SearchPlacements({ setOpen }) {
  const [requests, setRequests] = useState(0);
  const open = (next) => {
    setRequests((count) => count + 1);
    setOpen(next);
  };
  return (
    <div className='grid gap-3'>
      <header className='flex items-center gap-4 rounded-xl border border-gray-200 px-3 py-1 dark:border-gray-800'>
        <MenuLogo className='h-8 w-8' />
        <nav aria-label='Header' className='hidden flex-1 gap-4 text-sm font-medium text-gray-700 sm:flex dark:text-gray-300'>
          {links.map((link) => <span key={link}>{link}</span>)}
        </nav>
        <MenuSearch className='ml-auto w-44 sm:w-48 lg:w-48 xl:w-48' setOpen={open} />
      </header>
      <div className='mx-auto flex w-full max-w-sm items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800'>
        <MenuSearch className='w-full sm:w-full lg:w-full xl:w-full' setOpen={open} />
        <span className='flex size-11 shrink-0 items-center justify-center text-gray-500'><Icon name='X' decorative size='sm' /></span>
      </div>
      <p role='status' className='text-center text-xs text-gray-500 dark:text-gray-400'>
        {requests ? `Command launcher requested ${requests === 1 ? 'once' : `${requests} times`}` : 'Click either entry or press Enter on it to request the launcher.'}
      </p>
    </div>
  );
}

export const Playground = {
  args: { setOpen: fn() },
  parameters: {
    docs: {
      description: { story: 'The search entry in the desktop header, beside the logo and links, and as the full-width row of the mobile sheet. Both call `setOpen(true)`; the status line shows each request.' },
      source: playgroundSource('MenuSearch', {
        imports: "import { useState } from 'react';\nimport { CmdLauncher, MenuSearch } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);",
        attributes: ['setOpen={setOpen}'],
        after: '\n<CmdLauncher open={open} setOpen={setOpen} />'
      })
    }
  },
  render: (args) => <SearchPlacements {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [header, sheet] = canvas.getAllByRole('button', { name: 'Open search' });
    await expect(header).toHaveTextContent('Search');
    await userEvent.click(header);
    await expect(args.setOpen).toHaveBeenCalledWith(true);
    await expect(canvas.getByRole('status')).toHaveTextContent('requested once');
    sheet.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.setOpen).toHaveBeenCalledTimes(2);
    await expect(canvas.getByRole('status')).toHaveTextContent('requested 2 times');
  }
};
