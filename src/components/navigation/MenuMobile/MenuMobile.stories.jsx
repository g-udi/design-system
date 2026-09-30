import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { categories, primaryLinks } from '../../../../.storybook/fixtures/site/navigationContent';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import MenuLogo from '../MenuLogo';
import MenuMobile from './MenuMobile';

const docs = getComponentDocs('Navigation/MenuMobile');
const page = within(document.body);
const dialogName = 'Mobile navigation';
const findDialog = async () => within(await page.findByRole('dialog', { name: dialogName }));
const expectClosed = () => waitFor(() => expect(page.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument());
// Focus assertions need a focused window; headless runs without one skip them.
const expectFocus = (canvasElement, element) => canvasElement.ownerDocument.hasFocus() && waitFor(() => expect(element).toHaveFocus());

const openMenu = async (canvasElement) => {
  const trigger = within(canvasElement).getByRole('button', { name: 'Open mobile navigation' });
  await userEvent.click(trigger);
  return { dialog: await findDialog(), trigger };
};

// MenuMobile is mounted only while open, so the host owns the open state and the trigger: here, a phone-width
// site header above the start of an article.
function MobileMenuExample({ setMobileMenuOpen, ...args }) {
  const [open, setOpen] = useState(false);
  const update = (next) => {
    setOpen(next);
    setMobileMenuOpen(next);
  };
  return (
    <div className='mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800'>
      <header className='flex items-center justify-between border-b border-gray-200 px-3 py-1 dark:border-gray-800'>
        <MenuLogo className='h-9 w-9' />
        <Button variant='ghost' tone='neutral' size='sm' className='h-11 w-11 p-0' aria-label='Open mobile navigation' aria-expanded={open} onClick={() => update(true)}>
          <Icon name='Menu' decorative size='md' />
        </Button>
      </header>
      <div aria-hidden='true' className='space-y-2 p-4'>
        <div className='h-3 w-20 rounded-full bg-blue-100 dark:bg-blue-950' />
        <div className='h-5 w-4/5 rounded-full bg-gray-200 dark:bg-gray-800' />
        <div className='h-3 w-full rounded-full bg-gray-100 dark:bg-gray-900' />
        <div className='h-3 w-2/3 rounded-full bg-gray-100 dark:bg-gray-900' />
      </div>
      {open ? <MenuMobile {...args} setMobileMenuOpen={update} /> : null}
    </div>
  );
}

export default {
  title: 'Navigation/MenuMobile',
  id: 'navigation-menumobile',
  component: MenuMobile,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { blogLink: 'object', categories: 'object', links: 'object' }),
  args: { setLauncherOpen: fn(), setMobileMenuOpen: fn() },
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  render: (args) => <MobileMenuExample {...args} />
};

export const Playground = {
  args: { blogLink: { href: '/blog', title: 'Blog' }, categories, links: primaryLinks },
  parameters: {
    docs: {
      description: { story: 'A phone-width header whose menu button opens the sheet: search, the Blog destination with every category and its description, then the other `links`. The canvas leaves the sheet open after its test, so edits to `blogLink`, `categories`, or `links` show at once; on this page, open the menu to see them.' },
      source: playgroundSource('MenuMobile', {
        imports: "import { useState } from 'react';\nimport { MenuMobile } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);\nconst [launcherOpen, setLauncherOpen] = useState(false);",
        attributes: ['setMobileMenuOpen={setOpen}', 'setLauncherOpen={setLauncherOpen}'],
        before: '{open ? (\n',
        after: '\n) : null}'
      })
    }
  },
  play: async ({ args, canvasElement }) => {
    const { dialog, trigger } = await openMenu(canvasElement);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const close = dialog.getByRole('button', { name: 'Close menu' });
    await expect(page.getByRole('dialog', { name: dialogName })).toHaveAttribute('aria-modal', 'true');
    await expectFocus(canvasElement, close);
    await expect(dialog.getByRole('link', { name: args.blogLink.title })).toHaveAttribute('href', args.blogLink.href);
    await expect(within(dialog.getByRole('list', { name: 'Blog categories' })).getAllByRole('link')).toHaveLength(args.categories.length);
    for (const link of args.links) await expect(dialog.getByRole('link', { name: link.title })).toHaveAttribute('href', link.href);

    await userEvent.keyboard('{Escape}');
    await expect(args.setMobileMenuOpen).toHaveBeenLastCalledWith(false);
    await expectClosed();
    await expectFocus(canvasElement, trigger);

    await openMenu(canvasElement);
    await userEvent.click((await findDialog()).getByRole('button', { name: 'Close menu' }));
    await expectClosed();
    // Leave the sheet open in the canvas so control edits show immediately.
    await openMenu(canvasElement);
  }
};

export const SearchHandoff = {
  args: { categories },
  parameters: { docs: { description: { story: 'The search entry closes the dialog first, then asks the host to open the command launcher.' } } },
  play: async ({ args, canvasElement }) => {
    const { dialog } = await openMenu(canvasElement);
    await userEvent.click(dialog.getByRole('button', { name: 'Open search' }));
    await expect(args.setMobileMenuOpen).toHaveBeenCalledWith(false);
    await expect(args.setLauncherOpen).toHaveBeenCalledWith(true);
    await expectClosed();
  }
};

export const WithoutCategories = {
  parameters: { docs: { description: { story: 'Without category data the dialog keeps the primary Blog destination and omits the empty category list.' } } },
  play: async ({ canvasElement }) => {
    const { dialog } = await openMenu(canvasElement);
    await expect(dialog.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
    await expect(dialog.queryByRole('list', { name: 'Blog categories' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expectClosed();
  }
};
