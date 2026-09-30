'use client';
import { useMemo, useState } from 'react';
import { Gantt } from '../../../../src/components/core/Gantt/parts/gantt-extended.jsx';
import { GanttNav } from '../../../../src/components/core/Gantt/parts/gantt-nav-extended.jsx';
import { GanttView } from '../../../../src/components/core/Gantt/parts/gantt-view-extended.jsx';
import { addDays, startOfDay, startOfWeek } from 'date-fns';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
const INITIAL_RESOURCES = [
  {
    id: 'planning',
    title: 'Planning',
    children: [
      { id: 'brief', title: 'Project brief' },
      { id: 'scope', title: 'Scope review' }
    ]
  },
  {
    id: 'design',
    title: 'Design',
    children: [
      { id: 'wireframes', title: 'Wireframes' },
      { id: 'visual-design', title: 'Visual design' }
    ]
  },
  {
    id: 'build',
    title: 'Build',
    children: [
      { id: 'frontend', title: 'Frontend' },
      { id: 'backend', title: 'Backend' },
      { id: 'qa', title: 'QA pass' }
    ]
  }
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
    bar('brief', 'Project brief', -9, 3, 'var(--color-blue-500)', 100),
    bar('scope', 'Scope review', -6, 2, 'var(--color-sky-500)', 100),
    bar('wireframes', 'Wireframes', -4, 4, 'var(--color-violet-500)', 80),
    bar('visual-design', 'Visual design', 0, 5, 'var(--color-purple-500)', 35),
    bar('frontend', 'Frontend', 3, 7, 'var(--color-emerald-500)', 10),
    bar('backend', 'Backend', 5, 6, 'var(--color-teal-500)'),
    bar('qa', 'QA pass', 12, 4, 'var(--color-amber-500)')
  ];
}
export function Pattern() {
  const bars = useMemo(() => buildBars(/* @__PURE__ */ new Date()), []);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={bars}
            resources={resources}
            defaultScale='month'
            treePanel={{ width: 240 }}
            onResourceReorder={(proposal) => setResources(proposal.resources)}
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
