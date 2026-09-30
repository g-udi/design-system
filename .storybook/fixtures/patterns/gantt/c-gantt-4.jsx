'use client';
import { useMemo, useRef } from 'react';
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
const RESOURCES = [
  {
    id: 'product-squad',
    title: 'Product Squad',
    children: [
      { id: 'ada', title: 'Ada Lovelace' },
      { id: 'alan', title: 'Alan Turing' }
    ]
  },
  {
    id: 'design-squad',
    title: 'Design Squad',
    children: [
      { id: 'grace', title: 'Grace Hopper' },
      { id: 'linus', title: 'Linus Torvalds' }
    ]
  }
];
const resourceMeta = {
  ada: {
    initials: 'AL',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  alan: {
    initials: 'AT',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  grace: {
    initials: 'GH',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  linus: {
    initials: 'LT',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg'
  }
};
const PEOPLE = ['ada', 'alan', 'grace', 'linus'];
const TASK_POOL = [
  { title: 'Bug triage', color: 'var(--color-amber-500)' },
  { title: 'Code review', color: 'var(--color-rose-500)' },
  { title: 'Spec draft', color: 'var(--color-teal-500)' },
  { title: 'Pairing', color: 'var(--color-indigo-500)' }
];
function buildBars(anchor) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 });
  const day = (dayOffset) => addDays(week, dayOffset);
  const bar = (resourceId, title, startOffset, days, color) => ({
    id: `bar-${resourceId}`,
    title,
    start: day(startOffset),
    end: day(startOffset + days),
    allDay: true,
    color,
    resourceId
  });
  return [
    bar('ada', 'Checkout API', -1, 3, 'var(--color-blue-500)'),
    bar('alan', 'Search Indexing', 0, 3, 'var(--color-sky-500)'),
    bar('grace', 'Dashboard Redesign', 1, 3, 'var(--color-violet-500)'),
    bar('linus', 'Infra Migration', -2, 3, 'var(--color-purple-500)')
  ];
}
export function Pattern() {
  const bars = useMemo(() => buildBars(new Date()), []);
  const apiRef = useRef(null);
  const addedRef = useRef(0);
  const addAssignment = () => {
    const api = apiRef.current;
    if (!api) return;
    const n = addedRef.current++;
    const person = PEOPLE[n % PEOPLE.length];
    const task = TASK_POOL[n % TASK_POOL.length];
    const week = startOfWeek(startOfDay(new Date()), {
      weekStartsOn: 0
    });
    const start = addDays(week, (n % 5) + 1);
    api.addEvent({
      id: `bar-extra-${n}`,
      title: task.title,
      start,
      end: addDays(start, 2),
      allDay: true,
      color: task.color,
      resourceId: person
    });
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={bars}
            resources={RESOURCES}
            defaultScale='week'
            apiRef={apiRef}
            offDays={true}
            treePanel={{ width: 220 }}
            renderResourceLabel={({ resource, isGroup }) => {
              if (isGroup) return void 0;
              const person = resourceMeta[resource.id];
              return (
                <span className='flex min-w-0 items-center gap-2'>
                  <Avatar className='size-5'>
                    <AvatarImage src={person?.avatar} alt={resource.title} />
                    <AvatarFallback className='text-xs'>
                      {person?.initials ?? resource.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className='truncate'>{resource.title}</span>
                </span>
              );
            }}
            className='h-[440px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-1 border-b-0' />
              <GanttToolbar>
                <Button variant='outline' size='sm' onClick={addAssignment}>
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  Add assignment
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
