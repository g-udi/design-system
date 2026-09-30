'use client';
import { useMemo, useRef, useState } from 'react';
import { Gantt } from '../../../../src/components/core/Gantt/parts/gantt-extended.jsx';
import {
  GanttNav,
  GanttToolbar
} from '../../../../src/components/core/Gantt/parts/gantt-nav-extended.jsx';
import { GanttView } from '../../../../src/components/core/Gantt/parts/gantt-view-extended.jsx';
import { addDays, startOfDay, startOfWeek } from 'date-fns';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const RESOURCES = [
  {
    id: 'platform',
    title: 'Platform',
    children: [
      { id: 'auth-revamp', title: 'Auth Revamp' },
      { id: 'api-v2', title: 'API v2' }
    ]
  },
  {
    id: 'growth',
    title: 'Growth',
    children: [
      { id: 'onboarding', title: 'Onboarding Flow' },
      { id: 'referrals', title: 'Referral Program' }
    ]
  },
  {
    id: 'design-system',
    title: 'Design System',
    children: [
      { id: 'tokens', title: 'Design Tokens' },
      { id: 'components', title: 'Component Library' }
    ]
  },
  {
    id: 'backlog',
    title: 'Backlog',
    children: [
      { id: 'search', title: 'Search Revamp' },
      { id: 'billing', title: 'Billing v2' },
      { id: 'mobile', title: 'Mobile App' }
    ]
  }
];
const BACKLOG = [
  { id: 'search', title: 'Search Revamp', color: 'var(--color-rose-500)' },
  { id: 'billing', title: 'Billing v2', color: 'var(--color-amber-500)' },
  { id: 'mobile', title: 'Mobile App', color: 'var(--color-cyan-500)' }
];
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
    bar('auth-revamp', 'Auth Revamp', -30, 60, 'var(--color-blue-500)', 100),
    bar('api-v2', 'API v2', 20, 90, 'var(--color-sky-500)', 30),
    bar(
      'onboarding',
      'Onboarding Flow',
      -20,
      60,
      'var(--color-emerald-500)',
      80
    ),
    bar('referrals', 'Referral Program', 50, 90, 'var(--color-teal-500)', 0),
    bar('tokens', 'Design Tokens', -60, 70, 'var(--color-violet-500)', 100),
    bar(
      'components',
      'Component Library',
      0,
      120,
      'var(--color-purple-500)',
      45
    )
  ];
}
export function Pattern() {
  const bars = useMemo(() => buildBars(/* @__PURE__ */ new Date()), []);
  const apiRef = useRef(null);
  const [scheduled, setScheduled] = useState(0);
  const addInitiative = () => {
    const api = apiRef.current;
    if (!api) return;
    const scheduledIds = new Set(api.getEvents().map((event) => event.id));
    const index = BACKLOG.findIndex(
      (item2) => !scheduledIds.has(`bar-${item2.id}`)
    );
    if (index === -1) return;
    const item = BACKLOG[index];
    const week = startOfWeek(startOfDay(/* @__PURE__ */ new Date()), {
      weekStartsOn: 0
    });
    const start = addDays(week, 12 + index * 20);
    api.addEvent({
      id: `bar-${item.id}`,
      title: item.title,
      start,
      end: addDays(start, 24),
      allDay: true,
      color: item.color,
      resourceId: item.id
    });
    setScheduled((count) => count + 1);
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={bars}
            resources={RESOURCES}
            defaultScale='quarter'
            apiRef={apiRef}
            treePanel={{ width: 200 }}
            className='h-[480px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-1 border-b-0' />
              <GanttToolbar>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={addInitiative}
                  disabled={scheduled >= BACKLOG.length}
                >
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  Add to roadmap
                </Button>
              </GanttToolbar>
            </div>
            {/* Parent workstream rows carry no bars - summaryBars rolls up the
       child initiatives into one envelope on the group row. */}
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  );
}
