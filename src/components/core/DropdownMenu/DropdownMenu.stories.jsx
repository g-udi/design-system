import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import DropdownMenu, { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './DropdownMenu';

const docs = getComponentDocs('Core/DropdownMenu');
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const openMenu = async (canvasElement, name) => {
  const trigger = within(canvasElement).getByRole('button', { name });
  await userEvent.click(trigger);
  return { trigger, menu: within(await page(canvasElement).findByRole('menu')) };
};
const playgroundCode = playgroundSource('DropdownMenu', {
  attributes: ["trigger={<Button variant='outline'>Article actions</Button>}"],
  imports: "import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@gaudi/design-system';",
  children: [
    '  <DropdownMenuLabel>Manage article</DropdownMenuLabel>',
    '  <DropdownMenuItem onSelect={duplicate}>Duplicate</DropdownMenuItem>',
    '  <DropdownMenuItem disabled>Publish</DropdownMenuItem>',
    '  <DropdownMenuSeparator />',
    '  <DropdownMenuItem destructive onSelect={archive}>Archive</DropdownMenuItem>'
  ].join('\n')
});

function ActionsExample(args) {
  const [status, setStatus] = useState('');
  return (
    <>
      <DropdownMenu {...args} trigger={<Button variant='outline'>Article actions</Button>}>
        <DropdownMenuLabel>Manage article</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setStatus('Article duplicated in this example.')}>Duplicate</DropdownMenuItem>
        <DropdownMenuItem disabled>Publish</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => setStatus('Article archived in this example.')}>
          Archive
        </DropdownMenuItem>
      </DropdownMenu>
      <p role='status'>{status}</p>
    </>
  );
}

export default {
  title: 'Core/DropdownMenu',
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
      source: playgroundCode
    }
  },
  render: (args) => <ActionsExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const { trigger, menu } = await openMenu(canvasElement, 'Article actions');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await expect(menu.getByRole('menuitem', { name: 'Publish' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{ArrowDown}');
    await expect(menu.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(menu.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);

    const reopened = await openMenu(canvasElement, 'Article actions');
    await userEvent.click(reopened.menu.getByRole('menuitem', { name: 'Duplicate' }));
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Article duplicated in this example.');
  }
};

function CheckboxExample() {
  const [shown, setShown] = useState(true);
  return (
    <>
      <DropdownMenu trigger={<Button variant='outline'>Visible columns</Button>}>
        <DropdownMenuCheckboxItem checked={shown} onCheckedChange={setShown}>Author</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked disabled>Title</DropdownMenuCheckboxItem>
      </DropdownMenu>
      <p className='ds-description'>Author column: {shown ? 'visible' : 'hidden'}</p>
    </>
  );
}
export const CheckboxItems = {
  parameters: {
    docs: { description: { story: '`DropdownMenuCheckboxItem` takes controlled `checked` and `onCheckedChange`, and a disabled item keeps a required choice fixed.' } }
  },
  render: () => <CheckboxExample />,
  play: async ({ canvasElement }) => {
    const { menu } = await openMenu(canvasElement, 'Visible columns');
    await expect(menu.getByRole('menuitemcheckbox', { name: 'Title' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(menu.getByRole('menuitemcheckbox', { name: 'Author' }));
    await expect(within(canvasElement).getByText('Author column: hidden')).toBeVisible();
  }
};
