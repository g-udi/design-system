import { auditOpenMenus } from './auditOpenStates.js';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ActionsExample, article, actions, triggerLabel } from './fixtures/ArticleActionsExample.jsx';
import actionSource from './fixtures/ArticleActionsExample.jsx?raw';
import DropdownMenu from '../DropdownMenu';

const docs = getComponentDocs('Core/DropdownMenu');
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const openMenu = async (canvasElement, name) => {
  const trigger = within(canvasElement).getByRole('button', { name });
  await userEvent.click(trigger);
  return { trigger, menu: within(await page(canvasElement).findByRole('menu')) };
};
export default {
  title: 'Core/Overlays & Menus/DropdownMenu', id: 'core-dropdownmenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { align: ['start', 'center', 'end'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { align: 'end', onOpenChange: fn() },
  parameters: {
    docs: {
      description: {
        story: 'The action menu for one article, open so every item kind is visible: icons with shortcuts, two checkbox toggles, an unavailable Publish, and a destructive Archive. `align` lines the menu up with the start, centre, or end of its trigger.'
      },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => previewSource('ActionsExample', args, { before: `${publicSource(actionSource, new URL('./fixtures/ArticleActionsExample.jsx', import.meta.url))}\n\n` }) }
    }
  },
  render: (args) => <ActionsExample {...args} />,
  play: async (context) => {
    const { args, canvasElement } = context;
    await auditOpenMenus(context);
    const body = page(canvasElement);
    const trigger = within(canvasElement).getByRole('button', { name: triggerLabel });
    if (trigger.getAttribute('aria-expanded') !== 'true') await userEvent.click(trigger);
    const content = await body.findByRole('menu');
    const menu = within(content);
    await expect(content).toHaveAttribute('data-align', args.align);
    await expect(menu.getByRole('menuitem', { name: /Publish/ })).toHaveAttribute('aria-disabled', 'true');
    await expect(menu.getByRole('menuitemcheckbox', { name: 'Pin to top' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(menu.getByRole('menuitemcheckbox', { name: 'Show in feed' }));
    await expect(await body.findByRole('menuitemcheckbox', { name: 'Show in feed' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(body.getByRole('menuitemcheckbox', { name: 'Pin to top' }));
    await expect(body.getByRole('menuitemcheckbox', { name: 'Pin to top' })).toHaveAttribute('aria-checked', 'false');
    await expect(within(canvasElement).getByText(article.meta)).not.toHaveTextContent('Pinned');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);

    const reopened = await openMenu(canvasElement, triggerLabel);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard('{ArrowDown}');
    await expect(reopened.menu.getByRole('menuitem', { name: /Edit/ })).toHaveFocus();
    await userEvent.click(reopened.menu.getByRole('menuitem', { name: /Duplicate/ }));
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent(actions[1].status);
    const clipboard = navigator.clipboard;
    const descriptor = Object.getOwnPropertyDescriptor(clipboard, 'writeText');
    const writeText = fn().mockResolvedValue(undefined);
    try {
      Object.defineProperty(clipboard, 'writeText', { configurable: true, value: writeText });
      const copyMenu = await openMenu(canvasElement, triggerLabel);
      await userEvent.click(copyMenu.menu.getByRole('menuitem', { name: /Copy link/ }));
      await waitFor(() => expect(writeText).toHaveBeenCalledWith('https://example.com/articles/knowledge-graphs'));
      await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Article link copied.');
    } finally {
      if (descriptor) Object.defineProperty(clipboard, 'writeText', descriptor);
      else delete clipboard.writeText;
    }
  }
};
