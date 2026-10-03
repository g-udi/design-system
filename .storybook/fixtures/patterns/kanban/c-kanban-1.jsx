'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '../../../../src/components/core/KanbanBoard/parts/kanban-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// One board with its display options: the column frame (plain, framed, stacked)
// and the drag overlay (a dashed placeholder, or a live copy of the card or column).
const COLUMNS = {
  backlog: { title: 'Backlog', description: 'Scoped, not started', dot: 'bg-ui-muted-foreground' },
  inProgress: { title: 'In progress', description: 'Being built now', dot: 'bg-warning' },
  done: { title: 'Done', description: 'Shipped to production', dot: 'bg-success' }
};
const PRIORITY = { high: 'destructive-light', medium: 'primary-light', low: 'warning-light' };
const FRAMES = [
  ['plain', 'Plain'],
  ['framed', 'Framed'],
  ['stacked', 'Stacked']
];
const person = (name, portrait) => ({ assignee: name, assigneeAvatar: `/avatars/${portrait}.jpg` });
const INITIAL = {
  backlog: [
    { id: '1', title: 'Add authentication', priority: 'high', progress: 0, dueDate: 'Jan 10', ...person('Alex Johnson', 'men/32') },
    { id: '2', title: 'Create API endpoints', priority: 'medium', progress: 10, dueDate: 'Jan 15', ...person('Sarah Chen', 'women/44') },
    { id: '3', title: 'Write documentation', priority: 'low', progress: 0, dueDate: 'Jan 20', ...person('Michael Rodriguez', 'men/11') }
  ],
  inProgress: [
    { id: '4', title: 'Design system updates', priority: 'high', progress: 65, dueDate: 'Aug 25', ...person('Emma Wilson', 'women/68') },
    { id: '5', title: 'Implement dark mode', priority: 'medium', progress: 40, dueDate: 'Aug 28', ...person('David Kim', 'men/49') }
  ],
  done: [
    { id: '7', title: 'Set up project', priority: 'high', progress: 100, dueDate: 'Sep 25', ...person('Aron Thompson', 'men/75') },
    { id: '8', title: 'Initial commit', priority: 'low', progress: 100, dueDate: 'Sep 20', ...person('James Brown', 'men/54') }
  ]
};

function TaskCard({ task, isOverlay, ...props }) {
  const content = (
    <Frame variant='ghost' spacing='sm' className='p-0'>
      <FramePanel className='grid gap-2 p-3'>
        <div className='flex items-center justify-between gap-2'>
          <span className='line-clamp-1 text-sm font-medium'>{task.title}</span>
          <Badge variant={PRIORITY[task.priority]} size='sm' className='pointer-events-none shrink-0 capitalize'>
            {task.priority}
          </Badge>
        </div>
        <Progress value={task.progress} className='h-1' aria-label={`${task.title} progress`} />
        <div className='flex items-center justify-between gap-2 text-xs text-ui-muted-foreground'>
          <span className='flex min-w-0 items-center gap-1.5'>
            <Avatar className='size-5'>
              <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
              <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className='truncate'>{task.assignee}</span>
          </span>
          <time className='whitespace-nowrap tabular-nums'>{task.dueDate}</time>
        </div>
      </FramePanel>
    </Frame>
  );
  return (
    <KanbanItem value={task.id} {...props}>
      {isOverlay ? content : <KanbanItemHandle>{content}</KanbanItemHandle>}
    </KanbanItem>
  );
}

function TaskColumn({ value, tasks, frame, isOverlay, ...props }) {
  const column = COLUMNS[value];
  const header = (
    <div className='flex items-center gap-2'>
      <span className={cn('size-2 shrink-0 rounded-full', column.dot)} aria-hidden='true' />
      <FrameTitle>{column.title}</FrameTitle>
      <Badge variant='outline' size='sm'>{tasks.length}</Badge>
      <KanbanColumnHandle asChild>
        <Button aria-label={`Reorder ${column.title}`} size='icon-xs' variant='ghost' className='ms-auto'>
          <RegistryIcon lucide='GripVerticalIcon' />
        </Button>
      </KanbanColumnHandle>
    </div>
  );
  const cards = (
    <KanbanColumnContent value={value} className='flex flex-col gap-2 p-0.5'>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} isOverlay={isOverlay} />
      ))}
    </KanbanColumnContent>
  );
  return (
    <KanbanColumn value={value} {...props}>
      {frame === 'plain' ? (
        <div className='flex h-full flex-col gap-2'>
          <div className='px-1'>{header}</div>
          {cards}
        </div>
      ) : (
        <Frame stacked={frame === 'stacked'} spacing='sm' className='h-full'>
          <FrameHeader>
            {header}
            {frame === 'stacked' ? <FrameDescription>{column.description}</FrameDescription> : null}
          </FrameHeader>
          {cards}
        </Frame>
      )}
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  const [frame, setFrame] = useState('framed');
  const [liveOverlay, setLiveOverlay] = useState(true);
  return (
    <div className='grid w-full gap-3'>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
        <ToggleGroup
          aria-label='Column frame'
          type='single'
          variant='outline'
          size='sm'
          spacing={0}
          value={frame}
          onValueChange={(next) => setFrame(next || frame)}
        >
          {FRAMES.map(([value, label]) => (
            <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Label className='flex items-center gap-2 text-xs font-normal'>
          <Switch size='sm' checked={liveOverlay} onCheckedChange={setLiveOverlay} />
          Live drag overlay
        </Label>
      </div>
      <Kanban value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard className='grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-3'>
          {Object.entries(columns).map(([value, tasks]) => (
            <TaskColumn key={value} value={value} tasks={tasks} frame={frame} />
          ))}
        </KanbanBoard>
        {liveOverlay ? (
          <KanbanOverlay>
            {({ value, variant }) => {
              if (variant === 'column') {
                return <TaskColumn value={String(value)} tasks={columns[value] ?? []} frame={frame} isOverlay />;
              }
              const task = Object.values(columns).flat().find((item) => item.id === value);
              return task ? <TaskCard task={task} isOverlay /> : null;
            }}
          </KanbanOverlay>
        ) : (
          <KanbanOverlay className='rounded-md border-2 border-dashed bg-ui-muted/10' />
        )}
      </Kanban>
    </div>
  );
}
