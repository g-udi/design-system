import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Avatar from '../Avatar';
import Button from '../Button';
import Icon from '../Icon';
import DropdownMenu, { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './DropdownMenu';
import { DropdownMenuShortcut } from './parts/dropdown-menu.jsx';

const docs = getComponentDocs('Core/DropdownMenu');
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const openMenu = async (canvasElement, name) => {
  const trigger = within(canvasElement).getByRole('button', { name });
  await userEvent.click(trigger);
  return { trigger, menu: within(await page(canvasElement).findByRole('menu')) };
};
// One article's action menu: icons and shortcuts, two toggles, an unavailable action, and a destructive one.
const article = { title: 'A practical guide to knowledge graphs', author: 'Ada Lovelace', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', meta: 'Draft · edited 2 hours ago' };
const actions = [
  { label: 'Edit', icon: 'Pencil', shortcut: '⌘E', status: 'Editing the article in this example.' },
  { label: 'Duplicate', icon: 'Copy', shortcut: '⌘D', status: 'Article duplicated in this example.' },
  { label: 'Copy link', icon: 'Link', shortcut: '⌘L', status: 'Link copied in this example.' }
];
const triggerLabel = 'Article actions';
const playgroundCode = playgroundSource('DropdownMenu', {
  attributes: [`trigger={<Button variant='ghost' tone='neutral' size='sm' aria-label='${triggerLabel}'><Icon name='EllipsisVertical' decorative /></Button>}`],
  imports: "import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, Icon } from '@gaudi/design-system';",
  children: [
    '  <DropdownMenuLabel>Manage article</DropdownMenuLabel>',
    "  <DropdownMenuItem onSelect={edit}><Icon name='Pencil' decorative size='sm' />Edit<DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>",
    "  <DropdownMenuItem onSelect={duplicate}><Icon name='Copy' decorative size='sm' />Duplicate</DropdownMenuItem>",
    '  <DropdownMenuSeparator />',
    '  <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>Pin to top</DropdownMenuCheckboxItem>',
    '  <DropdownMenuItem disabled>Publish</DropdownMenuItem>',
    '  <DropdownMenuSeparator />',
    "  <DropdownMenuItem destructive onSelect={archive}><Icon name='Archive' decorative size='sm' />Archive</DropdownMenuItem>"
  ].join('\n')
});

// Toggles keep the menu open so several can be changed in one visit.
const keepOpen = (event) => event.preventDefault();

// Open and non-modal so the menu stays in the docs flow; the stage reserves its height, and `key` reopens it when `align` changes.
function ActionsExample(args) {
  const [status, setStatus] = useState('');
  const [pinned, setPinned] = useState(true);
  const [inFeed, setInFeed] = useState(false);
  return (
    <div className='mx-auto grid min-h-[27.5rem] w-full max-w-md grid-cols-1 content-start gap-2'>
      <article className='flex items-center gap-3 rounded-lg border border-border p-3'>
        <Avatar src={article.avatar} name={article.author} size='sm' shape='circle' alt='' />
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-medium text-text'>{article.title}</p>
          <p className='truncate text-xs text-text-muted'>{pinned ? 'Pinned · ' : ''}{article.meta}</p>
        </div>
        <DropdownMenu
          key={args.align}
          defaultOpen
          modal={false}
          {...args}
          trigger={(
            <Button variant='ghost' tone='neutral' size='sm' aria-label={triggerLabel}>
              <Icon name='EllipsisVertical' decorative size='sm' />
            </Button>
          )}
        >
          <DropdownMenuLabel>Manage article</DropdownMenuLabel>
          {actions.map((action) => (
            <DropdownMenuItem key={action.label} onSelect={() => setStatus(action.status)}>
              <Icon name={action.icon} decorative size='sm' />
              {action.label}
              <DropdownMenuShortcut className='ps-6'>{action.shortcut}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned} onSelect={keepOpen}>Pin to top</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={inFeed} onCheckedChange={setInFeed} onSelect={keepOpen}>Show in feed</DropdownMenuCheckboxItem>
          <DropdownMenuItem disabled>
            <Icon name='Send' decorative size='sm' />
            Publish
            <DropdownMenuShortcut className='ps-6 tracking-normal'>Needs review</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => setStatus('Article archived in this example.')}>
            <Icon name='Archive' decorative size='sm' />
            Archive
          </DropdownMenuItem>
        </DropdownMenu>
      </article>
      <p role='status' className='text-sm text-text-muted'>{status}</p>
    </div>
  );
}

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
      source: playgroundCode
    }
  },
  render: (args) => <ActionsExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const body = page(canvasElement);
    const trigger = within(canvasElement).getByRole('button', { name: triggerLabel });
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
  }
};
