import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { categories, primaryLinks } from '../../../../.storybook/fixtures/site/navigationContent';
import Button from '../../core/Button';
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

// MenuMobile is mounted only while open, so the host owns the open state and the trigger.
function MobileMenuExample({ setMobileMenuOpen, ...args }) {
  const [open, setOpen] = useState(false);
  const update = (next) => {
    setOpen(next);
    setMobileMenuOpen(next);
  };
  return (
    <>
      <Button variant='solid' tone='accent' onClick={() => update(true)}>Open mobile navigation</Button>
      {open ? <MenuMobile {...args} setMobileMenuOpen={update} /> : null}
    </>
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
    docs: { source: playgroundSource('MenuMobile', { imports: "import { MenuMobile } from '@gaudi/design-system';" }) }
  },
  play: async ({ args, canvasElement }) => {
    const { dialog, trigger } = await openMenu(canvasElement);
    const close = dialog.getByRole('button', { name: 'Close menu' });
    await expect(page.getByRole('dialog', { name: dialogName })).toHaveAttribute('aria-modal', 'true');
    await expectFocus(canvasElement, close);
    await expect(dialog.getByRole('link', { name: args.blogLink.title })).toHaveAttribute('href', args.blogLink.href);
    await expect(within(dialog.getByRole('list', { name: 'Blog categories' })).getAllByRole('link')).toHaveLength(args.categories.length);
    await expect(dialog.getByRole('link', { name: args.links[0].title })).toHaveAttribute('href', args.links[0].href);

    await userEvent.keyboard('{Escape}');
    await expect(args.setMobileMenuOpen).toHaveBeenLastCalledWith(false);
    await expectClosed();
    await expectFocus(canvasElement, trigger);

    await openMenu(canvasElement);
    await userEvent.click((await findDialog()).getByRole('button', { name: 'Close menu' }));
    await expectClosed();
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
