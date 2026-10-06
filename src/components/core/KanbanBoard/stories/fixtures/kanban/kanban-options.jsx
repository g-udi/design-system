'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Kanban,
  KanbanBoardPrimitive as KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '@gaudi/design-system/core/KanbanBoard';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '@gaudi/design-system/core/Card';
import { Label } from '@gaudi/design-system/core/Field';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
import { cn } from '@gaudi/design-system/utilities/cn';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

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
const person = (name, portrait) => ({ assignee: name, assigneeAvatar: `/avatars/${portrait}.svg` });
const INITIAL = {
  backlog: [
    { id: 0, title: 'Plan the autumn series', priority: 'high', progress: 0, dueDate: 'Jan 10', ...person('Anouk Varga', 'person-41') },
    { id: '2', title: 'Interview two illustrators', priority: 'medium', progress: 10, dueDate: 'Jan 15', ...person('Sabine Okafor', 'person-20') },
    { id: '3', title: 'Edit the typography essay', priority: 'low', progress: 0, dueDate: 'Jan 20', ...person('Rafe Okonkwo', 'person-31') }
  ],
  inProgress: [
    { id: '4', title: 'Refresh the cover templates', priority: 'high', progress: 65, dueDate: 'Aug 25', ...person('Ilse Valtonen', 'person-24') },
    { id: '5', title: 'Dark theme for the reader', priority: 'medium', progress: 40, dueDate: 'Aug 28', ...person('Ottilie Nakamura', 'person-45') }
  ],
  done: [
    { id: '7', title: 'Set up the publication', priority: 'high', progress: 100, dueDate: 'Sep 25', ...person('Aurelio Brandt', 'person-50') },
    { id: '8', title: 'Publish the welcome post', priority: 'low', progress: 100, dueDate: 'Sep 20', ...person('Felix Arrowsmith', 'person-47') }
  ]
};

function TaskCard({ task, isOverlay, ...props }) {
  const content = (
    <Frame variant='ghost' spacing='sm' className='p-0'>
      <FramePanel className='grid gap-2 p-3'>
        <div className='flex items-center justify-between gap-2'>
          <span className='line-clamp-1 text-sm font-medium'>{task.title}</span>
          <Badge variant={PRIORITY[task.priority]} size='sm' className='pointer-events-none shrink-0'>
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
