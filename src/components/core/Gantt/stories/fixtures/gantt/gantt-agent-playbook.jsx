'use client';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { addMinutes, startOfHour } from 'date-fns';
import { Gantt } from '@gaudi/design-system/core/Gantt';
import { GanttNav, GanttToolbar } from '@gaudi/design-system/core/Gantt';
import { GanttView } from '@gaudi/design-system/core/Gantt';
import { checkDependencies, getCriticalPath } from '@gaudi/design-system/core/Gantt';
import { Badge } from '@gaudi/design-system/core/Pill';
import { CardRoot as Card, CardContent } from '@gaudi/design-system/core/Card';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const STATUS = {
  Succeeded: { color: 'var(--color-emerald-500)', badge: 'success-light' },
  Running: { color: 'var(--color-blue-500)', badge: 'info-light' },
  Failed: { color: 'var(--color-rose-500)', badge: 'destructive-light' },
  Queued: { color: 'var(--color-slate-400)', badge: 'secondary' }
};
const CRITICAL = 'var(--color-orange-500)';
const MUTED = 'var(--color-slate-300)';
const RESOURCES = [
  { id: 'intake', title: 'Intake', children: [{ id: 'parse', title: 'Parse request' }, { id: 'context', title: 'Load workspace context' }] },
  {
    id: 'research',
    title: 'Research',
    children: [
      { id: 'search', title: 'Search sources' },
      { id: 'fetch', title: 'Fetch sources' },
      { id: 'fetch-retry', title: 'Fetch sources · retry 1' }
    ]
  },
  { id: 'draft', title: 'Draft', children: [{ id: 'outline', title: 'Outline' }, { id: 'write', title: 'Write answer' }] },
  { id: 'review', title: 'Review', children: [{ id: 'facts', title: 'Fact check' }, { id: 'style', title: 'Style pass' }] },
  { id: 'deliver', title: 'Deliver', children: [{ id: 'publish', title: 'Post to thread' }] }
];
const AGENTS = {
  parse: 'Planner',
  context: 'Planner',
  search: 'Researcher',
  fetch: 'Researcher',
  'fetch-retry': 'Researcher',
  outline: 'Writer',
  write: 'Writer',
  facts: 'Reviewer',
  style: 'Reviewer',
  publish: 'Planner'
};

function buildSteps() {
  // Relative to the current hour, so the run is always in flight.
  const hour = startOfHour(new Date());
  const step = (id, status, from, minutes, dependencies, attempts = 1) => {
    const start = addMinutes(hour, from);
    return { id, resourceId: id, title: RESOURCES.flatMap((stage) => stage.children).find((row) => row.id === id).title, status, attempts, start, end: addMinutes(start, minutes), dependencies, color: STATUS[status].color };
  };
  return [
    step('parse', 'Succeeded', -150, 15),
    step('context', 'Succeeded', -135, 25, ['parse']),
    step('search', 'Succeeded', -110, 30, ['context']),
    step('fetch', 'Failed', -80, 20, ['search']),
    step('fetch-retry', 'Succeeded', -60, 35, ['fetch'], 2),
    step('outline', 'Succeeded', -25, 20, ['fetch-retry']),
    step('write', 'Running', -5, 60, ['outline']),
    step('facts', 'Queued', 55, 30, ['write']),
    step('style', 'Queued', 55, 15, ['write']),
    step('publish', 'Queued', 85, 0, ['facts', 'style'])
  ];
}

const routeOf = (events) => {
  const ids = getCriticalPath(events);
  const byId = new Map(events.map((event) => [event.id, event]));
  return { ids, minutes: ids.reduce((sum, id) => sum + (byId.get(id).end - byId.get(id).start) / 60000, 0) };
};
const duration = (minutes) => (minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`);

export function Pattern() {
  const formId = useId();
  const steps = useMemo(buildSteps, []);
  const apiRef = useRef(null);
  const [critical, setCritical] = useState(false);
  const [route, setRoute] = useState(() => routeOf(steps));
  const [notice, setNotice] = useState('Stages run in order: a step can only move to after the steps it waits on.');
  const lastNotice = useRef('');
  const byId = useMemo(() => new Map(steps.map((item) => [item.id, item])), [steps]);

  const paint = useCallback((events, on) => {
    const next = routeOf(events);
    setRoute(next);
    return events.map((event) => ({ ...event, color: on ? (next.ids.includes(event.id) ? CRITICAL : MUTED) : STATUS[event.status].color }));
  }, []);

  const toggleCritical = (on) => {
    setCritical(on);
    const api = apiRef.current;
    if (api) api.setEvents(paint(api.getEvents(), on));
  };

  const canDropEvent = useCallback((update) => {
    const result = checkDependencies(update, apiRef.current?.getEvents() ?? steps);
    const message = result.ok
      ? `${update.event.title} can run here.`
      : result.blockedBy.length
        ? `${update.event.title} waits on ${result.blockedBy.map((item) => item.title).join(' and ')}.`
        : `${result.blocking.map((item) => item.title).join(' and ')} need ${update.event.title} to finish first.`;
    if (message !== lastNotice.current) {
      lastNotice.current = message;
      requestAnimationFrame(() => setNotice(message));
    }
    return result.ok;
  }, [steps]);

  const onEventsChange = useCallback((events) => setRoute(routeOf(events)), []);

  const columns = useMemo(
    () => [
      {
        id: 'agent',
        title: 'Agent',
        width: 112,
        render: ({ resource, isGroup }) =>
          isGroup ? null : (
            <span className='flex min-w-0 items-center gap-1.5'>
              <RegistryIcon lucide='BotIcon' className='text-text-muted size-3.5 shrink-0' aria-hidden='true' />
              <span className='truncate'>{AGENTS[resource.id]}</span>
            </span>
          )
      },
      {
        id: 'status',
        title: 'Status',
        width: 136,
        render: ({ resource, isGroup }) => {
          const item = !isGroup && byId.get(resource.id);
          return item ? (
            <Badge variant={STATUS[item.status].badge} size='sm'>
              {item.attempts > 1 ? `${item.status} · try ${item.attempts}` : item.status}
            </Badge>
          ) : null;
        }
      }
    ],
    [byId]
  );

  return (
    <div className='w-full p-4'>
      <Card className='w-full gap-0 py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={steps}
            resources={RESOURCES}
            defaultScale='day'
            interval={30}
            apiRef={apiRef}
            scheduleMode='single'
            columns={columns}
            treePanel={{ width: 456, nameColumnWidth: 190 }}
            metrics={{ unitWidths: { day: 5 } }}
            canDropEvent={canDropEvent}
            enforceCanDrop
            onEventsChange={onEventsChange}
            className='h-[620px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-[1_1_16rem] border-b-0' />
              <GanttToolbar className='flex-wrap'>
                <ul aria-label='Step status' className='text-text-muted flex flex-wrap items-center gap-3 text-xs'>
                  {Object.entries(STATUS).map(([label, { color }]) => (
                    <li key={label} className='flex items-center gap-1.5'>
                      <span aria-hidden='true' className='size-2 rounded-full' style={{ background: color }} />
                      {label}
                    </li>
                  ))}
                </ul>
                <div className='flex items-center gap-2'>
                  <Switch id={`playbook-critical-path-${formId}`} checked={critical} onCheckedChange={toggleCritical} />
                  <Label htmlFor={`playbook-critical-path-${formId}`}>Critical path</Label>
                </div>
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
          <div className='grid gap-1 border-t px-3 py-2 text-xs'>
            <p className='flex flex-wrap items-center gap-x-1.5 gap-y-1'>
              <span className='font-medium'>Critical path · {duration(route.minutes)}:</span>
              {route.ids.map((id, index) => (
                <span key={id} className='flex items-center gap-1.5'>
                  {index > 0 && <RegistryIcon lucide='ChevronRightIcon' className='text-text-muted size-3' aria-hidden='true' />}
                  {byId.get(id)?.title}
                </span>
              ))}
            </p>
            <p role='status' className='text-text-muted'>
              {notice}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
