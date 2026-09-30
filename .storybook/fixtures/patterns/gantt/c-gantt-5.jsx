'use client';
import { useMemo, useRef, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Gantt } from '../../../../src/components/core/Gantt/parts/gantt-extended.jsx';
import {
  GanttNav,
  GanttToolbar
} from '../../../../src/components/core/Gantt/parts/gantt-nav-extended.jsx';
import { GanttView } from '../../../../src/components/core/Gantt/parts/gantt-view-extended.jsx';
import { addDays, startOfDay, startOfWeek } from 'date-fns';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const OWNER_AVATARS = {
  'Ada Lovelace': 'https://randomuser.me/api/portraits/women/44.jpg',
  'Grace Hopper': 'https://randomuser.me/api/portraits/women/68.jpg',
  'Alan Turing': 'https://randomuser.me/api/portraits/men/32.jpg',
  'Linus Torvalds': 'https://randomuser.me/api/portraits/men/54.jpg',
  'Katherine Johnson': 'https://randomuser.me/api/portraits/women/90.jpg',
  'Margaret Hamilton': 'https://randomuser.me/api/portraits/women/12.jpg'
};
function ownerInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
const STATUS_VARIANT = {
  Done: 'success-light',
  'In progress': 'warning-light',
  'Not started': 'secondary'
};
const INITIAL_RESOURCES = [
  {
    id: 'planning',
    title: 'Planning',
    children: [
      { id: 'requirements', title: 'Requirements' },
      { id: 'design-phase', title: 'Design' }
    ]
  },
  {
    id: 'build',
    title: 'Build',
    children: [
      { id: 'frontend', title: 'Frontend' },
      { id: 'backend', title: 'Backend' }
    ]
  },
  {
    id: 'launch',
    title: 'Launch',
    children: [
      { id: 'qa', title: 'QA & Testing' },
      { id: 'rollout', title: 'Rollout' }
    ]
  }
];
const INITIAL_META = {
  requirements: { owner: 'Ada Lovelace', status: 'Done' },
  'design-phase': { owner: 'Grace Hopper', status: 'Done' },
  frontend: { owner: 'Alan Turing', status: 'In progress' },
  backend: { owner: 'Linus Torvalds', status: 'In progress' },
  qa: { owner: 'Katherine Johnson', status: 'Not started' },
  rollout: { owner: 'Margaret Hamilton', status: 'Not started' }
};
function buildBars(anchor) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 });
  const day = (dayOffset) => addDays(week, dayOffset);
  const bar = (resourceId, title, startOffset, days, color, progress) => ({
    id: `bar-${resourceId}`,
    title,
    start: day(startOffset),
    end: day(startOffset + days),
    allDay: true,
    color,
    resourceId,
    progress
  });
  return [
    bar('requirements', 'Requirements', -10, 8, 'var(--color-blue-500)', 100),
    bar('design-phase', 'Design', -8, 8, 'var(--color-sky-500)', 100),
    bar('frontend', 'Frontend', -2, 10, 'var(--color-violet-500)', 60),
    bar('backend', 'Backend', 0, 10, 'var(--color-purple-500)', 45),
    bar('qa', 'QA & Testing', 8, 8, 'var(--color-amber-500)', 0),
    bar('rollout', 'Rollout', 14, 5, 'var(--color-emerald-500)', 0)
  ];
}
export function Pattern() {
  const bars = useMemo(() => buildBars(/* @__PURE__ */ new Date()), []);
  const apiRef = useRef(null);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [meta, setMeta] = useState(INITIAL_META);
  const addedRef = useRef(0);
  const columns = useMemo(
    () => [
      {
        id: 'owner',
        title: 'Owner',
        width: 130,
        align: 'start',
        render: ({ resource, isGroup }) => {
          if (isGroup) return null;
          const owner = meta[resource.id]?.owner;
          if (!owner) return null;
          return (
            <span className='flex min-w-0 items-center gap-2'>
              <Avatar className='size-5 shrink-0'>
                <AvatarImage src={OWNER_AVATARS[owner]} alt={owner} />
                <AvatarFallback className='text-xs'>
                  {ownerInitials(owner)}
                </AvatarFallback>
              </Avatar>
              <span className='truncate'>{owner}</span>
            </span>
          );
        }
      },
      {
        id: 'status',
        title: 'Status',
        width: 100,
        align: 'start',
        render: ({ resource, isGroup }) => {
          if (isGroup) return null;
          const status = meta[resource.id]?.status;
          return status ? (
            <Badge variant={STATUS_VARIANT[status] ?? 'secondary'} size='sm'>
              {status}
            </Badge>
          ) : null;
        }
      }
    ],
    [meta]
  );
  const addTask = () => {
    const api = apiRef.current;
    if (!api) return;
    const n = ++addedRef.current;
    const id = `task-${n}`;
    setResources((prev) =>
      prev.map((group) =>
        group.id === 'launch'
          ? {
              ...group,
              children: [
                ...(group.children ?? []),
                { id, title: `New task ${n}` }
              ]
            }
          : group
      )
    );
    setMeta((prev) => ({
      ...prev,
      [id]: { owner: 'Unassigned', status: 'Not started' }
    }));
    const week = startOfWeek(startOfDay(/* @__PURE__ */ new Date()), {
      weekStartsOn: 0
    });
    const start = addDays(week, (n % 6) - 2);
    api.addEvent({
      id: `bar-${id}`,
      title: `New task ${n}`,
      start,
      end: addDays(start, 5),
      allDay: true,
      color: 'var(--color-slate-400)',
      resourceId: id,
      progress: 0
    });
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={bars}
            resources={resources}
            defaultScale='month'
            apiRef={apiRef}
            defaultInteractions={{
              drag: false,
              resize: false,
              selectSlot: false
            }}
            columns={columns}
            treePanel={{ width: 400, nameColumnWidth: 150 }}
            className='h-[500px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-1 border-b-0' />
              <GanttToolbar>
                <Button variant='outline' size='sm' onClick={addTask}>
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  Add task
                </Button>
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  );
}
