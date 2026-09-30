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
} from '../../../../src/components/blocks/KanbanBoard/parts/kanban-extended.jsx';
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const COLUMN_TITLES = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done'
};
function persistBoard(_meta) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.25) {
        reject(new Error('Network error'));
      } else {
        resolve();
      }
    }, 700);
  });
}
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
          className='pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs capitalize'
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
function TaskColumn({ value, tasks, isOverlay, ...props }) {
  return (
    <KanbanColumn value={value} {...props}>
      <Card className='mb-2.5'>
        <CardHeader className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <span className='text-sm font-semibold'>
              {COLUMN_TITLES[value]}
            </span>
            <Badge variant='outline'>{tasks.length}</Badge>
          </div>
          <KanbanColumnHandle asChild>
            <Button aria-label='Reorder' size='icon-xs' variant='ghost'>
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
  const [columns, setColumns] = useState({
    todo: [
      { id: '1', title: 'Add authentication', priority: 'high' },
      { id: '2', title: 'Create API endpoints', priority: 'medium' },
      { id: '3', title: 'Write documentation', priority: 'low' }
    ],
    inProgress: [
      { id: '4', title: 'Design system updates', priority: 'high' },
      { id: '5', title: 'Implement dark mode', priority: 'medium' }
    ],
    done: [{ id: '6', title: 'Setup project', priority: 'low' }]
  });
  const handleValueCommit = (_next, meta) => {
    const previous = meta.previousValue;
    const label =
      meta.kind === 'column'
        ? `Reordered "${COLUMN_TITLES[meta.activeContainer] ?? meta.activeContainer}"`
        : `Moved to "${COLUMN_TITLES[meta.overContainer] ?? meta.overContainer}"`;
    toast.promise(persistBoard(meta), {
      loading: 'Saving board...',
      success: () => label,
      error: () => {
        setColumns(previous);
        return 'Could not save. Board restored.';
      }
    });
  };
  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
      onValueCommit={handleValueCommit}
    >
      <KanbanBoard className='grid auto-rows-fr grid-cols-3'>
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}
      </KanbanBoard>
      <KanbanOverlay className='bg-ui-muted/10 rounded-md border-2 border-dashed' />
    </Kanban>
  );
}
