'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { addDays, startOfDay, startOfWeek } from 'date-fns';
import { Gantt } from '../../../../src/components/core/Gantt/parts/gantt-extended.jsx';
import { GanttNav, GanttToolbar } from '../../../../src/components/core/Gantt/parts/gantt-nav-extended.jsx';
import { GanttView } from '../../../../src/components/core/Gantt/parts/gantt-view-extended.jsx';
import { checkDependencies } from '../../../../src/components/core/Gantt/parts/gantt-lib-extended.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Card, CardContent } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import { Field, FieldGroup, FieldLabel } from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const PEOPLE = {
  'Maya Chen': 'https://randomuser.me/api/portraits/women/44.jpg',
  'Omar Haddad': 'https://randomuser.me/api/portraits/men/32.jpg',
  'Sara Lind': 'https://randomuser.me/api/portraits/women/68.jpg',
  'Theo Brandt': 'https://randomuser.me/api/portraits/men/54.jpg'
};
const STATUSES = { 'Not started': 'secondary', 'In progress': 'info-light', Blocked: 'destructive-light', Done: 'success-light' };
const RESOURCES = [
  { id: 'discovery', title: 'Discovery', children: [{ id: 'interviews', title: 'Reader interviews' }, { id: 'brief', title: 'Product brief' }] },
  { id: 'build', title: 'Build', children: [{ id: 'editor', title: 'Editor' }, { id: 'sync', title: 'Offline sync' }, { id: 'search', title: 'Search' }] },
  { id: 'launch', title: 'Launch', children: [{ id: 'beta', title: 'Private beta' }, { id: 'release', title: 'Public release' }] }
];
const INITIAL_META = {
  interviews: { owner: 'Sara Lind', status: 'Done' },
  brief: { owner: 'Maya Chen', status: 'Done' },
  editor: { owner: 'Omar Haddad', status: 'In progress' },
  sync: { owner: 'Theo Brandt', status: 'In progress' },
  search: { owner: 'Maya Chen', status: 'Not started' },
  beta: { owner: 'Sara Lind', status: 'Not started' },
  release: { owner: 'Omar Haddad', status: 'Not started' }
};

function buildTasks() {
  const week = startOfWeek(startOfDay(new Date()), { weekStartsOn: 1 });
  const day = (n) => addDays(week, n);
  const task = (id, title, from, days, color, progress, dependencies) => ({
    id,
    title,
    resourceId: id,
    start: day(from),
    end: day(from + days),
    allDay: true,
    color,
    progress,
    dependencies
  });
  return [
    task('interviews', 'Reader interviews', -14, 5, 'var(--color-teal-500)', 100),
    task('brief', 'Product brief', -9, 4, 'var(--color-teal-500)', 100, ['interviews']),
    task('editor', 'Editor', -5, 10, 'var(--color-blue-500)', 55, ['brief']),
    task('sync', 'Offline sync', -3, 12, 'var(--color-indigo-500)', 30, ['brief']),
    task('search', 'Search', 5, 6, 'var(--color-violet-500)', 0, ['editor']),
    task('beta', 'Private beta', 11, 5, 'var(--color-amber-500)', 0, ['search', 'sync']),
    task('release', 'Public release', 16, 0, 'var(--color-rose-500)', void 0, ['beta'])
  ];
}

const initials = (name) => name.split(' ').map((part) => part[0]).join('');

/** Owns the status line so drag feedback never re-renders the chart. */
function useStatusLine() {
  const setRef = useRef(() => {});
  const Line = useMemo(
    () =>
      function StatusLine() {
        const [message, setMessage] = useState('Drag or resize a bar. Moves that break a dependency are refused.');
        setRef.current = setMessage;
        return (
          <p role='status' className='text-text-muted border-t px-3 py-2 text-xs'>
            {message}
          </p>
        );
      },
    []
  );
  return [Line, useCallback((message) => setRef.current(message), [])];
}

export function Pattern() {
  const tasks = useMemo(buildTasks, []);
  const apiRef = useRef(null);
  const [meta, setMeta] = useState(INITIAL_META);
  const [editing, setEditing] = useState(null);
  // Kept apart from the draft so the dialog keeps its fields while it animates closed.
  const [editorOpen, setEditorOpen] = useState(false);
  const [StatusLine, announce] = useStatusLine();
  const lastMessage = useRef('');

  const canDropEvent = useCallback(
    (update) => {
      const events = apiRef.current?.getEvents() ?? tasks;
      const result = checkDependencies(update, events);
      const message = result.ok
        ? `${update.event.title} fits its dependencies.`
        : result.blockedBy.length
          ? `${update.event.title} can't start before ${result.blockedBy.map((task) => task.title).join(' and ')} finishes.`
          : `${update.event.title} would overrun ${result.blocking.map((task) => task.title).join(' and ')}.`;
      if (message !== lastMessage.current) {
        lastMessage.current = message;
        requestAnimationFrame(() => announce(message));
      }
      return result.ok;
    },
    [announce, tasks]
  );

  const columns = useMemo(
    () => [
      {
        id: 'owner',
        title: 'Owner',
        width: 128,
        render: ({ resource, isGroup }) => {
          const owner = !isGroup && meta[resource.id]?.owner;
          if (!owner) return null;
          return (
            <span className='flex min-w-0 items-center gap-2'>
              <Avatar className='size-5 shrink-0'>
                <AvatarImage src={PEOPLE[owner]} alt='' />
                <AvatarFallback className='text-xs'>{initials(owner)}</AvatarFallback>
              </Avatar>
              <span className='truncate'>{owner}</span>
            </span>
          );
        }
      },
      {
        id: 'status',
        title: 'Status',
        width: 104,
        render: ({ resource, isGroup }) => {
          const status = !isGroup && meta[resource.id]?.status;
          return status ? (
            <Badge variant={STATUSES[status]} size='sm'>
              {status}
            </Badge>
          ) : null;
        }
      }
    ],
    [meta]
  );

  const openEditor = (occurrence) => {
    const event = occurrence.event;
    setEditorOpen(true);
    setEditing({ id: event.id, title: event.title, progress: event.progress ?? 0, milestone: +event.start === +event.end, ...meta[event.resourceId] });
  };
  const save = () => {
    apiRef.current?.updateEvent(editing.id, { title: editing.title, progress: editing.milestone ? void 0 : editing.progress });
    setMeta((current) => ({ ...current, [editing.id]: { owner: editing.owner, status: editing.status } }));
    announce(`Saved ${editing.title}.`);
    setEditorOpen(false);
  };

  return (
    <div className='w-full p-4'>
      <Card className='w-full gap-0 py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={tasks}
            resources={RESOURCES}
            defaultScale='month'
            apiRef={apiRef}
            scheduleMode='single'
            columns={columns}
            treePanel={{ width: 420, nameColumnWidth: 170, minWidth: 220, maxWidth: 560 }}
            canDropEvent={canDropEvent}
            enforceCanDrop
            onEventClick={openEditor}
            className='h-[500px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-1 border-b-0' />
              <GanttToolbar>
                <Badge variant='secondary' size='sm'>
                  <RegistryIcon lucide='GitBranchIcon' className='size-3' aria-hidden='true' />
                  Dependencies enforced
                </Badge>
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
          <StatusLine />
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Changes apply to the bar and the task row.</DialogDescription>
          </DialogHeader>
          {editing && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='planner-task-title'>Title</FieldLabel>
                <Input id='planner-task-title' value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} />
              </Field>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor='planner-task-owner'>Owner</FieldLabel>
                  <Select value={editing.owner} onValueChange={(owner) => setEditing({ ...editing, owner })}>
                    <SelectTrigger id='planner-task-owner' className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PEOPLE).map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor='planner-task-status'>Status</FieldLabel>
                  <Select value={editing.status} onValueChange={(status) => setEditing({ ...editing, status })}>
                    <SelectTrigger id='planner-task-status' className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(STATUSES).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {!editing.milestone && (
                <Field>
                  <div className='flex items-center justify-between'>
                    <FieldLabel id='planner-task-progress'>Progress</FieldLabel>
                    <span className='text-text-muted text-xs tabular-nums'>{editing.progress}%</span>
                  </div>
                  <Slider
                    aria-labelledby='planner-task-progress'
                    value={[editing.progress]}
                    max={100}
                    step={5}
                    onValueChange={([progress]) => setEditing({ ...editing, progress })}
                  />
                </Field>
              )}
            </FieldGroup>
          )}
          <DialogFooter>
            <Button variant='outline' tone='neutral' onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
