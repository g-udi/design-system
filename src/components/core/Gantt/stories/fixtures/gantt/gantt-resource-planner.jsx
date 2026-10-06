'use client';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { addDays, format, isWeekend, startOfDay, startOfWeek } from 'date-fns';
import { Gantt } from '@gaudi/design-system/core/Gantt';
import { GanttNav, GanttToolbar } from '@gaudi/design-system/core/Gantt';
import { GanttView } from '@gaudi/design-system/core/Gantt';
import {
  DialogConfirmationRoot,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationTitle
} from '@gaudi/design-system/core/Dialog';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CardRoot as Card, CardContent } from '@gaudi/design-system/core/Card';
import { ContextMenuItem, ContextMenuSeparator } from '@gaudi/design-system/core/DropdownMenu';
import {
  DialogRoot as Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@gaudi/design-system/core/Dialog';
import { FieldRoot as Field, FieldErrorPrimitive as FieldError, FieldGroup, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { SelectRoot as Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const DAY_HOURS = 8;
const PEOPLE = {
  maya: { name: 'Mei Castellanos', role: 'Designer', photo: '/avatars/person-20.svg' },
  omar: { name: 'Kerem Haddadin', role: 'Engineer', photo: '/avatars/person-41.svg' },
  sara: { name: 'Sara Lind', role: 'Researcher', photo: '/avatars/person-24.svg' },
  theo: { name: 'Theo Brandt', role: 'Engineer', photo: '/avatars/person-47.svg' }
};
const ROOMS = { 'studio-a': 'Studio A', 'studio-b': 'Studio B' };
const RESOURCES = [
  { id: 'people', title: 'People', children: Object.entries(PEOPLE).map(([id, person]) => ({ id, title: person.name })) },
  { id: 'rooms', title: 'Rooms', children: Object.entries(ROOMS).map(([id, title]) => ({ id, title })) }
];
const PROJECTS = {
  'Reader app': 'var(--color-blue-500)',
  'Brand refresh': 'var(--color-violet-500)',
  'Usability study': 'var(--color-teal-500)',
  'Billing API': 'var(--color-amber-500)',
  Workshop: 'var(--color-rose-500)'
};
const resourceName = (id) => PEOPLE[id]?.name ?? ROOMS[id];

const monday = () => startOfWeek(startOfDay(new Date()), { weekStartsOn: 1 });
function buildBookings() {
  const week = monday();
  const booking = (id, resourceId, project, client, from, days, hoursPerDay) => ({
    id,
    resourceId,
    title: project,
    client,
    hoursPerDay,
    start: addDays(week, from),
    end: addDays(week, from + days),
    allDay: true,
    color: PROJECTS[project]
  });
  return [
    booking('b1', 'maya', 'Brand refresh', 'Northwind', 0, 3, 6),
    booking('b2', 'maya', 'Reader app', 'Internal', 3, 2, 4),
    booking('b3', 'omar', 'Billing API', 'Contoso', 0, 5, 8),
    booking('b4', 'sara', 'Usability study', 'Internal', 1, 3, 4),
    booking('b5', 'theo', 'Reader app', 'Internal', 0, 4, 4),
    booking('b6', 'theo', 'Billing API', 'Contoso', 2, 3, 4),
    booking('b7', 'studio-a', 'Workshop', 'Northwind', 1, 1, 8),
    booking('b8', 'studio-b', 'Usability study', 'Internal', 2, 2, 8)
  ];
}

/** Weekdays a booking covers; weekends carry no hours. */
const workdays = (start, end) => {
  const days = [];
  for (let day = startOfDay(start); day < end; day = addDays(day, 1)) if (!isWeekend(day)) days.push(day);
  return days;
};
/** The first weekday the booking would push past a full day, if any. */
function overbookedDay(events, booking) {
  for (const day of workdays(booking.start, booking.end)) {
    const next = addDays(day, 1);
    const load = events
      .filter((other) => other.id !== booking.id && other.resourceId === booking.resourceId && other.start < next && other.end > day)
      .reduce((sum, other) => sum + other.hoursPerDay, 0);
    if (load + booking.hoursPerDay > DAY_HOURS) return { day, load };
  }
  return null;
}
const weekLoad = (events, resourceId) => {
  const week = monday();
  const weekEnd = addDays(week, 5);
  return events
    .filter((event) => event.resourceId === resourceId)
    .reduce((sum, event) => sum + workdays(event.start < week ? week : event.start, event.end > weekEnd ? weekEnd : event.end).length * event.hoursPerDay, 0);
};

const EMPTY = { resourceId: 'sara', title: 'Reader app', client: '', from: '0', days: '2', hoursPerDay: '4' };

export function Pattern() {
  const formId = useId();
  const initial = useMemo(buildBookings, []);
  const apiRef = useRef(null);
  const [bookings, setBookings] = useState(initial);
  const [form, setForm] = useState(null);
  // Kept apart from the form so the dialog keeps its fields while it animates closed.
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notice, setNotice] = useState('Drag a booking to move it between people and rooms. A move that overbooks a day is refused.');
  const lastNotice = useRef('');
  const nextId = useRef(initial.length + 1);

  const canDropEvent = useCallback((update) => {
    const events = apiRef.current?.getEvents() ?? initial;
    const clash = overbookedDay(events, { ...update.event, resourceId: update.resourceId, start: update.start, end: update.end });
    const message = clash
      ? `${resourceName(update.resourceId)} is already booked ${clash.load}h on ${format(clash.day, 'EEE d')}; ${update.event.hoursPerDay}h more won't fit.`
      : `${update.event.title} fits ${resourceName(update.resourceId)}'s week.`;
    if (message !== lastNotice.current) {
      lastNotice.current = message;
      requestAnimationFrame(() => setNotice(message));
    }
    return !clash;
  }, [initial]);

  const columns = useMemo(
    () => [
      {
        id: 'capacity',
        title: 'This week',
        width: 132,
        render: ({ resource, isGroup }) => {
          if (isGroup) return null;
          const hours = weekLoad(bookings, resource.id);
          const share = Math.round((hours / (DAY_HOURS * 5)) * 100);
          return (
            <span className='flex w-full items-center gap-2'>
              <Progress value={share} aria-label={`${resource.title} booked ${share}% this week`} className='h-1.5 flex-1' />
              {share >= 100 ? (
                <Badge variant='warning-light' size='sm'>
                  Full
                </Badge>
              ) : (
                <span className='text-text-muted w-9 text-end tabular-nums'>{share}%</span>
              )}
            </span>
          );
        }
      }
    ],
    [bookings]
  );

  const edit = (event) => {
    setFormOpen(true);
    setForm({
      id: event.id,
      resourceId: event.resourceId,
      title: event.title,
      client: event.client,
      from: String(Math.round((startOfDay(event.start) - monday()) / 864e5)),
      days: String(Math.max(1, Math.round((event.end - event.start) / 864e5))),
      hoursPerDay: String(event.hoursPerDay)
    });
  };
  const draftOf = (values) => {
    const start = addDays(monday(), Number(values.from));
    return {
      id: values.id ?? `b${nextId.current}`,
      resourceId: values.resourceId,
      title: values.title,
      client: values.client || 'Internal',
      hoursPerDay: Number(values.hoursPerDay),
      start,
      end: addDays(start, Number(values.days)),
      allDay: true,
      color: PROJECTS[values.title]
    };
  };
  const draft = formOpen && form && draftOf(form);
  const clash = draft && overbookedDay(apiRef.current?.getEvents() ?? bookings, draft);

  const save = () => {
    const api = apiRef.current;
    if (!api || clash) return;
    if (form.id) {
      api.updateEvent(form.id, draft);
      setNotice(`Updated ${draft.title} for ${resourceName(draft.resourceId)}.`);
    } else {
      nextId.current += 1;
      api.addEvent(draft);
      setNotice(`Booked ${resourceName(draft.resourceId)} on ${draft.title}.`);
    }
    setFormOpen(false);
  };
  const duplicate = (event) => {
    const api = apiRef.current;
    const copy = { ...event, id: `b${nextId.current}`, start: addDays(event.start, 7), end: addDays(event.end, 7) };
    if (overbookedDay(api.getEvents(), copy)) {
      setNotice(`${resourceName(event.resourceId)} has no room for a copy of ${event.title} next week.`);
      return;
    }
    nextId.current += 1;
    api.addEvent(copy);
    setNotice(`Copied ${event.title} to next week.`);
  };
  const remove = () => {
    apiRef.current?.removeEvent(confirmDelete.id);
    setNotice(`Deleted ${confirmDelete.title} for ${resourceName(confirmDelete.resourceId)}.`);
    setConfirmDelete(null);
    setFormOpen(false);
  };

  return (
    <div className='w-full p-4'>
      <Card className='w-full gap-0 py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={initial}
            resources={RESOURCES}
            defaultScale='month'
            weekStartsOn={1}
            summaryBars={false}
            apiRef={apiRef}
            offDays={true}
            columns={columns}
            treePanel={{ width: 360, nameColumnWidth: 200 }}
            metrics={{ laneHeight: 2.25 }}
            canDropEvent={canDropEvent}
            enforceCanDrop
            onEventsChange={setBookings}
            onEventClick={(occurrence) => edit(occurrence.event)}
            renderResourceLabel={({ resource, isGroup }) => {
              if (isGroup) return void 0;
              const person = PEOPLE[resource.id];
              return (
                <span className='flex min-w-0 items-center gap-2'>
                  {person ? (
                    <Avatar className='size-6 shrink-0'>
                      <AvatarImage src={person.photo} alt='' />
                      <AvatarFallback>{person.name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className='bg-surface-muted grid size-6 shrink-0 place-items-center rounded-sm'>
                      <RegistryIcon lucide='BuildingIcon' className='size-3.5' aria-hidden='true' />
                    </span>
                  )}
                  <span className='flex min-w-0 flex-col leading-tight'>
                    <span className='truncate'>{resource.title}</span>
                    <span className='text-text-muted truncate'>{person?.role ?? 'Room · full days'}</span>
                  </span>
                </span>
              );
            }}
            renderEvent={({ occurrence }) => (
              <span className='flex min-w-0 flex-col leading-tight'>
                <span className='truncate font-medium'>{occurrence.event.title}</span>
                <span className='truncate opacity-80'>
                  {occurrence.event.hoursPerDay}h/day · {occurrence.event.client}
                </span>
              </span>
            )}
            renderEventMenu={({ occurrence }) => (
              <>
                <ContextMenuItem onSelect={() => edit(occurrence.event)}>
                  <RegistryIcon lucide='PencilIcon' aria-hidden='true' /> Edit booking
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => duplicate(occurrence.event)}>
                  <RegistryIcon lucide='CopyIcon' aria-hidden='true' /> Copy to next week
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant='destructive' onSelect={() => setConfirmDelete(occurrence.event)}>
                  <RegistryIcon lucide='Trash2Icon' aria-hidden='true' /> Delete
                </ContextMenuItem>
              </>
            )}
            className='h-[540px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-[1_1_16rem] border-b-0' />
              <GanttToolbar>
                <Button size='sm' onClick={() => {
                    setForm({ ...EMPTY });
                    setFormOpen(true);
                  }}>
                  <RegistryIcon lucide='PlusIcon' className='size-4' aria-hidden='true' />
                  New booking
                </Button>
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
          <p role='status' className='text-text-muted border-t px-3 py-2 text-xs'>
            {notice}
          </p>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{form?.id ? 'Edit booking' : 'New booking'}</DialogTitle>
            <DialogDescription>Each person and room holds {DAY_HOURS} bookable hours a day.</DialogDescription>
          </DialogHeader>
          {form && (
            <FieldGroup>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor={`capacity-resource-${formId}`}>Who or where</FieldLabel>
                  <Select value={form.resourceId} onValueChange={(resourceId) => setForm({ ...form, resourceId })}>
                    <SelectTrigger id={`capacity-resource-${formId}`} className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCES.map((group) => (
                        <SelectGroup key={group.id}>
                          <SelectLabel>{group.title}</SelectLabel>
                          {group.children.map((row) => (
                            <SelectItem key={row.id} value={row.id}>
                              {row.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`capacity-project-${formId}`}>Project</FieldLabel>
                  <Select value={form.title} onValueChange={(title) => setForm({ ...form, title })}>
                    <SelectTrigger id={`capacity-project-${formId}`} className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PROJECTS).map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor={`capacity-client-${formId}`}>Client</FieldLabel>
                <Input id={`capacity-client-${formId}`} placeholder='Internal' value={form.client} onChange={(event) => setForm({ ...form, client: event.target.value })} />
              </Field>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor={`capacity-start-${formId}`}>Starts</FieldLabel>
                  <Select value={form.from} onValueChange={(from) => setForm({ ...form, from })}>
                    <SelectTrigger id={`capacity-start-${formId}`} className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 7, 8, 9, 10, 11].map((offset) => (
                        <SelectItem key={offset} value={String(offset)}>
                          {format(addDays(monday(), offset), 'EEE d MMM')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`capacity-days-${formId}`}>Length</FieldLabel>
                  <Select value={form.days} onValueChange={(days) => setForm({ ...form, days })}>
                    <SelectTrigger id={`capacity-days-${formId}`} className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((days) => (
                        <SelectItem key={days} value={String(days)}>
                          {days === 1 ? '1 day' : `${days} days`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field data-invalid={clash ? true : void 0}>
                <FieldLabel id={`capacity-hours-${formId}`}>Hours a day</FieldLabel>
                <ToggleGroup
                  type='single'
                  variant='outline'
                  aria-labelledby={`capacity-hours-${formId}`}
                  value={form.hoursPerDay}
                  onValueChange={(hoursPerDay) => hoursPerDay && setForm({ ...form, hoursPerDay })}
                  className='w-full'
                >
                  {['2', '4', '6', '8'].map((hours) => (
                    <ToggleGroupItem key={hours} value={hours} className='flex-1'>
                      {hours}h
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                {clash && (
                  <FieldError>
                    {resourceName(form.resourceId)} already has {clash.load}h on {format(clash.day, 'EEE d MMM')}. Shorten the booking or pick another day.
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          )}
          <DialogFooter className='sm:justify-between'>
            {form?.id ? (
              <Button variant='ghost' tone='danger' onClick={() => setConfirmDelete(apiRef.current?.getEvents().find((event) => event.id === form.id))}>
                <RegistryIcon lucide='Trash2Icon' className='size-4' aria-hidden='true' />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className='flex gap-2'>
              <Button variant='outline' tone='neutral' onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!!clash}>
                {form?.id ? 'Save booking' : 'Book'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DialogConfirmationRoot open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogConfirmationContent>
          <DialogConfirmationHeader>
            <DialogConfirmationTitle>Delete this booking?</DialogConfirmationTitle>
            <DialogConfirmationDescription>
              {confirmDelete ? `${confirmDelete.title} for ${resourceName(confirmDelete.resourceId)} frees ${confirmDelete.hoursPerDay}h a day.` : ''}
            </DialogConfirmationDescription>
          </DialogConfirmationHeader>
          <DialogConfirmationFooter>
            <DialogConfirmationCancel>Keep it</DialogConfirmationCancel>
            <DialogConfirmationAction onClick={remove}>Delete booking</DialogConfirmationAction>
          </DialogConfirmationFooter>
        </DialogConfirmationContent>
      </DialogConfirmationRoot>
    </div>
  );
}
