// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '../../../../src/components/blocks/KanbanBoard/parts/kanban-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
function TaskCard({ task, asHandle, ...props }) {
  const content = (
    <Frame variant='ghost' spacing='xs' className='p-0'>
      <FramePanel className='space-y-3 p-3'>
        <p className='text-sm font-medium'>{task.title}</p>
        <Progress value={task.progress} className='h-1' />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <Avatar className='size-5'>
              <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
              <AvatarFallback className='text-[9px]'>
                {task.assignee.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className='text-ui-muted-foreground text-xs'>
              {task.assignee}
            </span>
          </div>
          <span className='text-ui-muted-foreground text-xs'>
            {task.progress}%
          </span>
        </div>
      </FramePanel>
    </Frame>
  );
  return (
    <KanbanItem value={task.id} {...props}>
      {asHandle ? <KanbanItemHandle>{content}</KanbanItemHandle> : content}
    </KanbanItem>
  );
}
export function Pattern() {
  const [columns, setColumns] = useState({
    planning: [
      {
        id: '1',
        title: 'Research competitors',
        assignee: 'Alex J.',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/men/32.jpg',
        progress: 20
      }
    ],
    active: [
      {
        id: '2',
        title: 'Build dashboard',
        assignee: 'Sarah C.',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/women/44.jpg',
        progress: 65
      },
      {
        id: '3',
        title: 'API integration',
        assignee: 'David K.',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/men/49.jpg',
        progress: 40
      }
    ],
    completed: [
      {
        id: '4',
        title: 'Setup repository',
        assignee: 'Emma W.',
        assigneeAvatar:
          'https://randomuser.me/api/portraits/women/68.jpg',
        progress: 100
      }
    ]
  });
  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className='grid auto-rows-fr grid-cols-1 sm:grid-cols-3'>
        {Object.entries(columns).map(([columnId, tasks]) => (
          <KanbanColumn key={columnId} value={columnId}>
            <Frame stacked spacing='sm' className='h-full'>
              <FrameHeader>
                <div className='flex items-center justify-between'>
                  <FrameTitle className='capitalize'>{columnId}</FrameTitle>
                  <Badge variant='outline' size='sm'>
                    {tasks.length}
                  </Badge>
                </div>
                <FrameDescription>
                  {columnId === 'planning' && 'Tasks being scoped'}
                  {columnId === 'active' && 'Currently in development'}
                  {columnId === 'completed' && 'Finished and deployed'}
                </FrameDescription>
              </FrameHeader>
              <KanbanColumnContent
                value={columnId}
                className='flex flex-col gap-2 p-0.5'
              >
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} asHandle />
                ))}
              </KanbanColumnContent>
            </Frame>
          </KanbanColumn>
        ))}
      </KanbanBoard>
      <KanbanOverlay className='bg-ui-muted/10 rounded-md border-2 border-dashed' />
    </Kanban>
  );
}
