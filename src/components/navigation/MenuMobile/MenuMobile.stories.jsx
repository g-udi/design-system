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
// site header above the start of an article. The sheet renders into this frame, not the body, so it never covers
// the docs page; the transform makes the frame the containing block for the sheet's fixed overlay.
function MobileMenuExample({ initiallyOpen = false, setMobileMenuOpen, ...args }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [frame, setFrame] = useState(null);
  const update = (next) => {
    setOpen(next);
    setMobileMenuOpen(next);
  };
  return (
    <div ref={setFrame} data-testid='phone-frame' className={`mx-auto w-full max-w-sm transform-gpu overflow-hidden rounded-card border border-border ${open ? 'h-[36rem]' : ''}`}>
      <header className='flex items-center justify-between border-b border-border px-3 py-1'>
        <MenuLogo className='size-9' />
        <Button variant='ghost' tone='neutral' size='icon' className='size-11' aria-label='Open mobile navigation' aria-expanded={open} onClick={() => update(true)}>
          <Icon name='Menu' decorative size='md' />
        </Button>
      </header>
      <div aria-hidden='true' className='space-y-2 p-4'>
        <div className='h-3 w-20 rounded-control bg-accent-muted' />
        <div className='h-5 w-4/5 rounded-control bg-border/60' />
        <div className='h-3 w-full rounded-control bg-border/60' />
        <div className='h-3 w-2/3 rounded-control bg-border/60' />
      </div>
      {open && frame ? <MenuMobile {...args} container={frame} setMobileMenuOpen={update} /> : null}
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
      description: { story: 'A phone-width header with the sheet open: search, the Blog destination with every category and its description, then the other `links`, so edits to them show at once; an empty `categories` array drops the category list. By default the sheet renders into the body; here `container` keeps it, and the isolation, inside the phone frame.' },
      source: playgroundSource('MenuMobile', {
        imports: "import { useState } from 'react';\nimport { MenuMobile } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);\nconst [launcherOpen, setLauncherOpen] = useState(false);",
        attributes: ['setMobileMenuOpen={setOpen}', 'setLauncherOpen={setLauncherOpen}'],
        before: '{open ? (\n',
        after: '\n) : null}'
      })
    }
  },
  render: (args) => <MobileMenuExample {...args} initiallyOpen />,
  play: async ({ args, canvasElement }) => {
    // The sheet starts open; the Close button dismisses it.
    const dialog = await findDialog();
    await expect(page.getByRole('dialog', { name: dialogName })).toHaveAttribute('aria-modal', 'true');
    // `container` renders the menu inside the frame; everything outside the dialog is hidden from assistive technology.
    await expect(within(canvasElement).getByTestId('phone-frame').querySelector('header').closest('[aria-hidden="true"]')).not.toBeNull();
    await expectFocus(canvasElement, dialog.getByRole('button', { name: 'Close menu' }));
    await expect(dialog.getByRole('link', { name: args.blogLink.title })).toHaveAttribute('href', args.blogLink.href);
    await expect(within(dialog.getByRole('list', { name: 'Blog categories' })).getAllByRole('link')).toHaveLength(args.categories.length);
    for (const link of args.links) await expect(dialog.getByRole('link', { name: link.title })).toHaveAttribute('href', link.href);
    await userEvent.click(dialog.getByRole('button', { name: 'Close menu' }));
    await expect(args.setMobileMenuOpen).toHaveBeenLastCalledWith(false);
    await expectClosed();

    // Opened from the trigger, Escape closes it and returns focus to the trigger.
    const { dialog: reopened, trigger } = await openMenu(canvasElement);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expectFocus(canvasElement, reopened.getByRole('button', { name: 'Close menu' }));
    await userEvent.keyboard('{Escape}');
    await expectClosed();
    await expectFocus(canvasElement, trigger);
    // Leave the sheet open, as it starts, so control edits show immediately.
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
