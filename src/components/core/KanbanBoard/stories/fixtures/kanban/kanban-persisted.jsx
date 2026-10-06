'use client';
import { useEffect, useId, useRef, useState } from 'react';
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
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { Label } from '@gaudi/design-system/core/Field';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardHeader
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const COLUMN_TITLES = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done'
};
function TaskCard({ task, asHandle, isOverlay, ...props }) {
  const cardContent = (
    <Card>
      <CardContent className='flex items-center justify-between gap-2'>
        <span className='line-clamp-1 text-sm font-medium'>{task.title}</span>
        <Badge
          variant={
            task.priority === 'high'
              ? 'destructive-light'
              : task.priority === 'medium'
                ? 'primary-light'
                : 'warning-light'
          }
          className='pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs'
        >
          {task.priority}
        </Badge>
      </CardContent>
    </Card>
  );
  return (
    <KanbanItem value={task.id} {...props}>
      {asHandle && !isOverlay ? (
        <KanbanItemHandle>{cardContent}</KanbanItemHandle>
      ) : (
        cardContent
      )}
    </KanbanItem>
  );
}
function TaskColumn({ value, tasks, isOverlay, disabled, ...props }) {
  return (
    <KanbanColumn value={value} disabled={disabled} {...props}>
      <Card className='mb-2.5'>
        <CardHeader className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <span className='text-sm font-semibold'>
              {COLUMN_TITLES[value]}
            </span>
            <Badge variant='outline'>{tasks.length}</Badge>
          </div>
          <KanbanColumnHandle asChild>
            <Button aria-label={`Reorder ${COLUMN_TITLES[value]}`} size='icon-xs' variant='ghost'>
              <RegistryIcon lucide='GripVerticalIcon' />
            </Button>
          </KanbanColumnHandle>
        </CardHeader>
        <CardContent>
          <KanbanColumnContent value={value} className='flex flex-col gap-2.5'>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                disabled={disabled}
                asHandle={!isOverlay}
                isOverlay={isOverlay}
              />
            ))}
          </KanbanColumnContent>
        </CardContent>
      </Card>
    </KanbanColumn>
  );
}
export function Pattern() {
  const toasterId = useId();
  const timer = useRef();
  const [saving, setSaving] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [status, setStatus] = useState('Move a card or column to simulate saving.');
  useEffect(() => () => {
    clearTimeout(timer.current);
    toast.dismiss(toasterId);
  }, [toasterId]);
  const [columns, setColumns] = useState({
    todo: [
      { id: '1', title: 'Plan the autumn series', priority: 'high' },
      { id: '2', title: 'Interview two illustrators', priority: 'medium' },
      { id: '3', title: 'Edit the typography essay', priority: 'low' }
    ],
    inProgress: [
      { id: '4', title: 'Refresh the cover templates', priority: 'high' },
      { id: '5', title: 'Dark theme for the reader', priority: 'medium' }
    ],
    done: [{ id: '6', title: 'Set up the publication', priority: 'low' }]
  });
  const handleValueCommit = (_next, meta) => {
    const previous = meta.previousValue;
    const label =
      meta.kind === 'column'
        ? `Reordered "${COLUMN_TITLES[meta.activeContainer] ?? meta.activeContainer}"`
        : `Moved to "${COLUMN_TITLES[meta.overContainer] ?? meta.overContainer}"`;
    setSaving(true);
    setStatus('Saving board…');
    toast.loading('Saving board…', { id: toasterId, toasterId });
    timer.current = setTimeout(() => {
      setSaving(false);
      if (failNext) {
        setColumns(previous);
        setFailNext(false);
        setStatus('Could not save. Board restored. Try the move again.');
        toast.error('Could not save. Board restored.', { id: toasterId, toasterId });
      } else {
        setStatus(label);
        toast.success(label, { id: toasterId, toasterId });
      }
    }, 700);
  };
  return (
    <div className='grid gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p role='status' className='text-sm text-text-muted'>{status}</p>
        <Label className='flex items-center gap-2'>
          <Switch checked={failNext} onCheckedChange={setFailNext} disabled={saving} />
          Fail next save (local demo)
        </Label>
      </div>
      <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
      onValueCommit={handleValueCommit}
    >
      <KanbanBoard className='grid auto-rows-fr grid-cols-1 md:grid-cols-3'>
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} disabled={saving} />
        ))}
      </KanbanBoard>
      <KanbanOverlay className='bg-ui-muted/10 rounded-md border-2 border-dashed' />
      </Kanban>
      <ToastProvider id={toasterId} />
    </div>
  );
}
