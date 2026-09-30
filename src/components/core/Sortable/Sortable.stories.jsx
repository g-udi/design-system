import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Avatar from '../Avatar';
import { Badge } from '../Pill/index.js';
import { Sortable, SortableItem, SortableItemHandle } from './index.js';

const docs = getComponentDocs('Core/Sortable');
// A publishing checklist: tasks with owners, due dates, and priorities; the launch step is pinned last.
const tasks = [
  { id: 'research', title: 'Research topic', icon: 'SearchIcon', priority: 'High', owner: 'Amira Haddad', due: 'Oct 2' },
  { id: 'outline', title: 'Outline sections', icon: 'ListIcon', priority: 'Medium', owner: 'Jonas Weber', due: 'Oct 3' },
  { id: 'draft', title: 'Write the draft', icon: 'PencilIcon', priority: 'High', owner: 'Amira Haddad', due: 'Oct 7' },
  { id: 'review', title: 'Peer review', icon: 'MessageSquareIcon', priority: 'Low', owner: 'Lina Sato', due: 'Oct 9' },
  { id: 'edit', title: 'Copy edit', icon: 'CheckCheckIcon', priority: 'Medium', owner: 'Jonas Weber', due: 'Oct 10' },
  { id: 'publish', title: 'Publish', icon: 'RocketIcon', priority: 'Pinned', owner: 'Lina Sato', due: 'Oct 12', pinned: true }
];
const byId = Object.fromEntries(tasks.map((task) => [task.id, task]));
const ids = tasks.map((task) => task.id);
const priorities = { High: 'destructive-light', Medium: 'warning-light', Low: 'info-light', Pinned: 'invert-light' };
const layouts = {
  vertical: 'grid gap-2',
  horizontal: 'flex gap-2 overflow-x-auto pb-1',
  grid: 'grid grid-cols-2 gap-2 sm:grid-cols-3'
};
const items = {
  vertical: 'flex items-center gap-3 rounded-lg border border-ui-border bg-ui-background px-3 py-2 text-sm',
  horizontal: 'grid w-40 shrink-0 gap-2 rounded-lg border border-ui-border bg-ui-background p-3 text-sm',
  grid: 'grid gap-2 rounded-lg border border-ui-border bg-ui-background p-3 text-sm'
};
const moveKeys = { vertical: '{ArrowDown}', horizontal: '{ArrowRight}', grid: '{ArrowRight}' };
const backKeys = { vertical: '{ArrowUp}', horizontal: '{ArrowLeft}', grid: '{ArrowLeft}' };
const order = (canvasElement) =>
  [...canvasElement.querySelectorAll('[data-slot="sortable-item"]')].map((item) => item.dataset.value);
// Wait for the drop animation to restore every item before the accessibility scan.
const settled = (canvasElement) =>
  waitFor(() => {
    for (const item of canvasElement.querySelectorAll('[data-slot="sortable-item"]')) {
      expect(getComputedStyle(item).opacity).toBe('1');
    }
  });
const handleFor = (canvasElement, id) => within(canvasElement).getByRole('button', { name: `Reorder ${byId[id].title}` });

function TaskCard({ task, strategy }) {
  const handle = (
    <SortableItemHandle aria-label={`Reorder ${task.title}`} className='text-ui-muted-foreground'>
      <RegistryIcon lucide={task.pinned ? 'LockIcon' : 'GripVerticalIcon'} aria-hidden='true' className='size-4' />
    </SortableItemHandle>
  );
  const badge = <Badge variant={priorities[task.priority]} size='sm'>{task.priority}</Badge>;
  const title = (
    <span className='flex min-w-0 items-center gap-2 font-medium'>
      <RegistryIcon lucide={task.icon} aria-hidden='true' className='size-4 shrink-0 text-ui-muted-foreground' />
      <span className='truncate'>{task.title}</span>
    </span>
  );
  const meta = (
    <span className='flex items-center gap-1.5 text-xs text-ui-muted-foreground'>
      <Avatar name={task.owner} size='xs' />
      {task.due}
    </span>
  );
  if (strategy === 'vertical') {
    return (
      <>
        {handle}
        <span className='grid min-w-0 flex-1 gap-0.5'>{title}</span>
        {badge}
        {meta}
      </>
    );
  }
  return (
    <>
      <span className='flex items-center justify-between'>{handle}{badge}</span>
      {title}
      {meta}
    </>
  );
}

function SortableExample({ onValueChange, strategy, ...args }) {
  const [value, setValue] = useState(ids);
  const update = (next) => {
    setValue(next);
    onValueChange(next);
  };
  return (
    <Sortable value={value} onValueChange={update} getItemValue={(id) => id} strategy={strategy} className={layouts[strategy]} {...args}>
      {value.map((id) => (
        <SortableItem
          key={id}
          value={id}
          disabled={byId[id].pinned}
          // The built-in disabled opacity fails contrast, so the lock icon and badge carry the state.
          className={`${items[strategy]} data-disabled:bg-ui-muted data-disabled:opacity-100`}
        >
          <TaskCard task={byId[id]} strategy={strategy} />
        </SortableItem>
      ))}
    </Sortable>
  );
}

export default {
  title: 'Core/Sortable',
  id: 'core-sortable',
  component: Sortable,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { strategy: ['vertical', 'horizontal', 'grid'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { strategy: 'vertical', onValueChange: fn(), onValueCommit: fn() },
  parameters: {
    docs: {
      description: { story: 'A publishing checklist with owners, due dates, and priorities. `strategy` switches between a list, a horizontal lane of cards, and a grid. The pinned launch step is `disabled`, so its handle stays out of the drag interaction.' },
      source: playgroundSource('Sortable', {
        imports: "import { useState } from 'react';\nimport { Sortable, SortableItem, SortableItemHandle } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        before: 'const [items, setItems] = useState(tasks);\n\n',
        attributes: ['value={items}', 'onValueChange={setItems}', 'getItemValue={(task) => task.id}'],
        children: [
          '  {items.map((task) => (',
          '    <SortableItem key={task.id} value={task.id} disabled={task.pinned}>',
          '      <SortableItemHandle aria-label={`Reorder ${task.title}`}>',
          "        <RegistryIcon lucide='GripVerticalIcon' />",
          '      </SortableItemHandle>',
          '      {task.title}',
          '    </SortableItem>',
          '  ))}'
        ].join('\n')
      })
    }
  },
  render: (args) => <SortableExample key={args.strategy} {...args} />,
  play: async ({ args, canvasElement }) => {
    const pinned = handleFor(canvasElement, 'publish');
    await expect(pinned).toHaveAttribute('aria-disabled', 'true');
    pinned.focus();
    await userEvent.keyboard(` ${backKeys[args.strategy]} `);
    await expect(args.onValueChange).not.toHaveBeenCalled();
    handleFor(canvasElement, ids[0]).focus();
    await userEvent.keyboard(` ${moveKeys[args.strategy]} `);
    const moved = [ids[1], ids[0], ...ids.slice(2)];
    await waitFor(() => expect(order(canvasElement)).toEqual(moved));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(moved);
    await expect(args.onValueCommit).toHaveBeenCalledOnce();
    await settled(canvasElement);
    handleFor(canvasElement, ids[0]).blur();
  }
};
