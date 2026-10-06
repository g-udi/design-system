import { useState } from 'react';
import { Sortable, SortableItem, SortableItemHandle, SortableOverlay } from '@gaudi/design-system/core/Sortable';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { Badge } from '@gaudi/design-system/core/Pill';
import Avatar from '@gaudi/design-system/core/Avatar';

const tasks = [
  { id: 'research', title: 'Research topic', icon: 'SearchIcon', priority: 'High', owner: 'Amira Haddad', due: 'Oct 2' },
  { id: 'outline', title: 'Outline sections', icon: 'ListIcon', priority: 'Medium', owner: 'Teo Abernathy', due: 'Oct 3' },
  { id: 'draft', title: 'Write the draft', icon: 'PencilIcon', priority: 'High', owner: 'Amira Haddad', due: 'Oct 7' },
  { id: 'review', title: 'Peer review', icon: 'MessageSquareIcon', priority: 'Low', owner: 'Lina Sato', due: 'Oct 9' },
  { id: 'edit', title: 'Copy edit', icon: 'CheckCheckIcon', priority: 'Medium', owner: 'Teo Abernathy', due: 'Oct 10' },
  { id: 'publish', title: 'Publish', icon: 'RocketIcon', priority: 'Pinned', owner: 'Lina Sato', due: 'Oct 12', pinned: true }
];

const portraits = {
  'Amira Haddad': '/avatars/person-24.svg',
  'Teo Abernathy': '/avatars/person-41.svg',
  'Lina Sato': '/avatars/person-23.svg'
};

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
      <Avatar name={task.owner} src={portraits[task.owner]} size='xs' />
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
    onValueChange?.(next);
  };
  return (
    <Sortable value={value} onValueChange={update} getItemValue={(id) => id} strategy={strategy} className={layouts[strategy]} {...args}>
      {value.map((id) => (
        <SortableItem key={id} value={id} disabled={byId[id].pinned} style={{ borderTopWidth: 2 }} className={`${items[strategy]} data-disabled:bg-ui-muted`}>
          <TaskCard task={byId[id]} strategy={strategy} />
        </SortableItem>
      ))}
      <SortableOverlay>
        {({ value: id }) => (
          <div aria-hidden='true' className={`${items[strategy]} shadow-lg ring-2 ring-ui-primary`}>
            <TaskCard task={byId[id]} strategy={strategy} />
          </div>
        )}
      </SortableOverlay>
    </Sortable>
  );
}

export const exampleDefaults = { strategy: 'vertical' };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <SortableExample key={args.strategy} {...args} />;
}

export { byId, ids };
