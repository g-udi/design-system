'use client';
import { useMemo } from 'react';
import { Gantt } from '../../../../src/components/core/Gantt/parts/gantt-extended.jsx';
import { GanttNav } from '../../../../src/components/core/Gantt/parts/gantt-nav-extended.jsx';
import { GanttView } from '../../../../src/components/core/Gantt/parts/gantt-view-extended.jsx';
import { addDays, startOfDay, startOfWeek } from 'date-fns';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
function buildResources(anchor) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 });
  const day = (dayOffset) => addDays(week, dayOffset);
  return [
    {
      id: 'discovery',
      title: 'Discovery',
      children: [
        { id: 'kickoff', title: 'Kickoff workshop' },
        { id: 'requirements', title: 'Requirements' }
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation',
      baselineStart: day(-3),
      baselineEnd: day(6),
      children: [
        { id: 'integration', title: 'API integration' },
        { id: 'migration', title: 'Data migration' },
        { id: 'hardening', title: 'Security hardening' }
      ]
    },
    {
      id: 'launch',
      title: 'Launch',
      children: [{ id: 'handover', title: 'Handover' }]
    }
  ];
}
function leafTitles(resources) {
  return new Map(
    resources
      .flatMap((group) => group.children ?? [])
      .map((leaf) => [leaf.id, leaf.title])
  );
}
function buildBars(anchor, titles) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 });
  const day = (dayOffset) => addDays(week, dayOffset);
  const bar = (
    resourceId,
    startOffset,
    days,
    plannedOffset,
    plannedDays,
    color,
    progress,
    dependencies
  ) => ({
    id: `bar-${resourceId}`,
    title: titles.get(resourceId) ?? resourceId,
    start: day(startOffset),
    end: day(startOffset + days),
    baselineStart: day(plannedOffset),
    baselineEnd: day(plannedOffset + plannedDays),
    allDay: true,
    color,
    resourceId,
    progress,
    dependencies
  });
  return [
    // delivered exactly to plan
    bar('kickoff', -9, 2, -9, 2, 'var(--color-blue-500)', 100),
    // ran a day over its planned window
    bar('requirements', -7, 4, -7, 3, 'var(--color-sky-500)', 100, ['bar-kickoff']),
    // started a day late and carried the slip through
    bar('integration', -2, 5, -3, 5, 'var(--color-violet-500)', 60, ['bar-requirements']),
    // tracking a day ahead of plan
    bar('migration', 1, 3, 1, 4, 'var(--color-emerald-500)', 30, ['bar-requirements']),
    // waits on BOTH tracks, so two arrows land on its start; slipped on both ends
    bar('hardening', 4, 4, 3, 3, 'var(--color-teal-500)', 0, ['bar-integration', 'bar-migration']),
    // a zero-length milestone (diamond) that landed a day after its planned date
    bar('handover', 9, 0, 8, 0, 'var(--color-amber-500)', void 0, ['bar-hardening'])
  ];
}
export function Pattern() {
  const resources = useMemo(
    () => buildResources(/* @__PURE__ */ new Date()),
    []
  );
  const bars = useMemo(
    () => buildBars(/* @__PURE__ */ new Date(), leafTitles(resources)),
    [resources]
  );
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          {/* baselineBars and dependencyLines are on by default: an event
       carrying baselineStart and baselineEnd ghosts its planned window
       behind the bar (data-baseline-variance="early|late|on-time"), and
       one naming `dependencies` gets a finish-to-start arrow from each
       predecessor. Dragging re-times the actual dates and re-anchors the
       arrows while the plan holds still; the milestone diamond moves
       like any bar but has no resize edges. */}
          <Gantt
            defaultEvents={bars}
            resources={resources}
            defaultScale='month'
            scheduleMode='single'
            treePanel={{ width: 240 }}
            className='h-[480px] w-full'
          >
            <GanttNav />
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  );
}
