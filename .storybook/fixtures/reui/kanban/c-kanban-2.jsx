// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardHeader
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const COLUMN_TITLES = {
  backlog: 'Backlog',
  inProgress: 'In Progress',
  review: 'Review',
  done: 'Done'
};
function TaskCard({ task, asHandle, isOverlay, ...props }) {
  const cardContent = (
    <Card>
      <CardContent className='flex flex-col gap-2.5'>
        <div className='flex items-center justify-between gap-2'>
          <span className='line-clamp-1 text-sm font-medium'>{task.title}</span>
          <Badge
            variant={
              task.priority === 'high'
                ? 'destructive-outline'
                : task.priority === 'medium'
                  ? 'primary-outline'
                  : 'warning-outline'
            }
            className='pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs capitalize'
          >
            {task.priority}
          </Badge>
        </div>
        <div className='text-ui-muted-foreground flex items-center justify-between text-xs'>
          {task.assignee && (
            <div className='flex items-center gap-1'>
              <Avatar className='size-4'>
                <AvatarImage src={task.assigneeAvatar} />
                <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className='line-clamp-1'>{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <time className='text-xs whitespace-nowrap tabular-nums'>
              {task.dueDate}
            </time>
          )}
        </div>
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
          <KanbanColumnContent
            value={value}
            className='flex flex-col gap-2.5 p-0.5'
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} asHandle={!isOverlay} />
            ))}
          </KanbanColumnContent>
        </CardContent>
      </Card>
    </KanbanColumn>
  );
}
export function Pattern() {
  const [columns, setColumns] = useState({
    backlog: [
      {
        id: '1',
        title: 'Add authentication',
        priority: 'high',
        assignee: 'Alex Johnson',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/men/32.jpg',
        dueDate: 'Jan 10, 2025'
      },
      {
        id: '2',
        title: 'Create API endpoints',
        priority: 'medium',
        assignee: 'Sarah Chen',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/women/44.jpg',
        dueDate: 'Jan 15, 2025'
      },
      {
        id: '3',
        title: 'Write documentation',
        priority: 'low',
        assignee: 'Michael Rodriguez',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/men/11.jpg',
        dueDate: 'Jan 20, 2025'
      }
    ],
    inProgress: [
      {
        id: '4',
        title: 'Design system updates',
        priority: 'high',
        assignee: 'Emma Wilson',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/women/68.jpg',
        dueDate: 'Aug 25, 2025'
      },
      {
        id: '5',
        title: 'Implement dark mode',
        priority: 'medium',
        assignee: 'David Kim',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/men/49.jpg',
        dueDate: 'Aug 25, 2025'
      }
    ],
    done: [
      {
        id: '7',
        title: 'Setup project',
        priority: 'high',
        assignee: 'Aron Thompson',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/men/75.jpg',
        dueDate: 'Sep 25, 2025'
      },
      {
        id: '8',
        title: 'Initial commit',
        priority: 'low',
        assignee: 'James Brown',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/men/54.jpg',
        dueDate: 'Sep 20, 2025'
      }
    ]
  });
  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className='grid auto-rows-fr grid-cols-3'>
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        {({ value, variant }) => {
          if (variant === 'column') {
            const tasks = columns[value] ?? [];
            return <TaskColumn value={String(value)} tasks={tasks} isOverlay />;
          }
          const task = Object.values(columns)
            .flat()
            .find((task2) => task2.id === value);
          if (!task) return null;
          return <TaskCard task={task} isOverlay />;
        }}
      </KanbanOverlay>
    </Kanban>
  );
}
