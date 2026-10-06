'use client';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { addMinutes, format, startOfHour } from 'date-fns';
import { Gantt } from '@gaudi/design-system/core/Gantt';
import { GanttNav, GanttToolbar } from '@gaudi/design-system/core/Gantt';
import { GanttView } from '@gaudi/design-system/core/Gantt';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CardRoot as Card, CardContent } from '@gaudi/design-system/core/Card';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import { FieldRoot as Field, FieldErrorPrimitive as FieldError, FieldGroup, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@gaudi/design-system/core/Sheet';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const SHIFT_MINUTES = 8 * 60;
const TECHNICIANS = {
  leo: { name: 'Leo Park', skills: ['HVAC', 'Electrical'], photo: '/avatars/person-43.svg' },
  ana: { name: 'Ana Ruiz', skills: ['Plumbing'], photo: '/avatars/person-23.svg' },
  ben: { name: 'Ben Okoro', skills: ['HVAC'], photo: '/avatars/person-50.svg' },
  ivy: { name: 'Ivy Shah', skills: ['Electrical', 'Plumbing'], photo: '/avatars/person-07.svg' }
};
const RESOURCES = [
  { id: 'unassigned', title: 'Unassigned' },
  { id: 'north', title: 'North crew', children: [{ id: 'leo', title: 'Leo Park' }, { id: 'ana', title: 'Ana Ruiz' }] },
  { id: 'south', title: 'South crew', children: [{ id: 'ben', title: 'Ben Okoro' }, { id: 'ivy', title: 'Ivy Shah' }] }
];
const STATUS = {
  Scheduled: { color: 'var(--color-indigo-500)', badge: 'secondary' },
  'En route': { color: 'var(--color-amber-500)', badge: 'warning-light' },
  'On site': { color: 'var(--color-blue-500)', badge: 'info-light' },
  Done: { color: 'var(--color-emerald-500)', badge: 'success-light' },
  Unassigned: { color: 'var(--color-rose-500)', badge: 'destructive-light' }
};

function buildJobs() {
  // Times are relative to the current hour so the now marker always sits among live jobs.
  const hour = startOfHour(new Date());
  const job = (id, resourceId, title, customer, address, skill, status, from, minutes) => {
    const start = addMinutes(hour, from * 60);
    return { id, resourceId, title, customer, address, skill, status, start, end: addMinutes(start, minutes), color: STATUS[status].color };
  };
  return [
    job('j1', 'leo', 'Heat pump service', 'Harbour Bakery', '12 Quay Street', 'HVAC', 'Done', -4, 90),
    job('j2', 'leo', 'Panel upgrade', 'Northside Clinic', '4 Elm Road', 'Electrical', 'On site', -1.5, 150),
    job('j3', 'ana', 'Leak repair', 'Ruth Adler', '88 Mill Lane', 'Plumbing', 'Done', -3.5, 60),
    job('j4', 'ana', 'Water heater install', 'Cedar Flats', '2 Cedar Court', 'Plumbing', 'En route', 0.5, 180),
    job('j5', 'ben', 'AC not cooling', 'Bright Dental', '19 Station Road', 'HVAC', 'On site', -1, 120),
    job('j6', 'ben', 'Annual inspection', 'Pine School', '7 Grove Hill', 'HVAC', 'Scheduled', 2, 90),
    job('j7', 'ivy', 'Socket rewiring', 'Tom Becker', '31 Rose Avenue', 'Electrical', 'Scheduled', 1, 90),
    job('j8', 'ivy', 'Drain unblock', 'Fern Café', '5 Market Square', 'Plumbing', 'Scheduled', 3, 60),
    job('j9', 'unassigned', 'Thermostat fault', 'Saskia Ortelius', '63 Park View', 'HVAC', 'Unassigned', 1.5, 60),
    job('j10', 'unassigned', 'Outdoor lighting', 'Old Mill Pub', '1 Canal Walk', 'Electrical', 'Unassigned', 4, 120)
  ];
}

const minutesOf = (job) => (job.end - job.start) / 60000;
const timeWindow = (job) => `${format(job.start, 'HH:mm')}–${format(job.end, 'HH:mm')}`;

export function Pattern() {
  const formId = useId();
  const initialJobs = useMemo(buildJobs, []);
  const apiRef = useRef(null);
  const [jobs, setJobs] = useState(initialJobs);
  const [openId, setOpenId] = useState(null);
  // Kept apart from the job so the sheet keeps its content while it slides closed.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [notice, setNotice] = useState('Drag a job onto a technician with the right skill. Booked slots refuse overlaps.');
  const lastNotice = useRef('');

  const canDropEvent = useCallback((update) => {
    const target = TECHNICIANS[update.resourceId];
    const ok = update.resourceId === 'unassigned' || (target && target.skills.includes(update.event.skill));
    const message = ok
      ? `${update.event.title}: ${format(update.start, 'HH:mm')} with ${target?.name ?? 'nobody yet'}.`
      : `${target?.name ?? 'That row'} isn't qualified for ${update.event.skill} work.`;
    if (message !== lastNotice.current) {
      lastNotice.current = message;
      requestAnimationFrame(() => setNotice(message));
    }
    return ok;
  }, []);

  const onEventsChange = useCallback((next) => {
    setJobs(
      next.map((job) => {
        const status = job.resourceId === 'unassigned' ? 'Unassigned' : job.status === 'Unassigned' ? 'Scheduled' : job.status;
        return status === job.status ? job : { ...job, status, color: STATUS[status].color };
      })
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'skills',
        title: 'Skills',
        width: 168,
        render: ({ resource, isGroup }) =>
          !isGroup && TECHNICIANS[resource.id] ? (
            <span className='flex min-w-0 gap-1 overflow-hidden'>
              {TECHNICIANS[resource.id].skills.map((skill) => (
                <Badge key={skill} variant='outline' size='sm'>
                  {skill}
                </Badge>
              ))}
            </span>
          ) : null
      },
      {
        id: 'load',
        title: 'Load',
        width: 96,
        render: ({ resource, isGroup }) => {
          if (isGroup || !TECHNICIANS[resource.id]) return null;
          const booked = jobs.filter((job) => job.resourceId === resource.id).reduce((sum, job) => sum + minutesOf(job), 0);
          const share = Math.round((booked / SHIFT_MINUTES) * 100);
          return (
            <span className='flex w-full items-center gap-2'>
              <Progress value={Math.min(share, 100)} aria-label={`${resource.title} booked ${share}% of the shift`} className='h-1.5 flex-1' />
              <span className='text-text-muted w-8 text-end tabular-nums'>{share}%</span>
            </span>
          );
        }
      }
    ],
    [jobs]
  );

  const open = (occurrence) => {
    const job = jobs.find((item) => item.id === occurrence.event.id) ?? occurrence.event;
    setOpenId(job.id);
    setSheetOpen(true);
    setDraft({ resourceId: job.resourceId, status: job.status, checklist: job.checklist ?? { parts: false, photos: false, signature: false } });
  };
  const job = jobs.find((item) => item.id === openId);
  const qualified = job ? Object.entries(TECHNICIANS).filter(([, tech]) => tech.skills.includes(job.skill)) : [];
  // The sheet applies the same overlap rule as dragging: one job at a time per technician.
  const busyWith =
    job && draft && draft.resourceId !== 'unassigned'
      ? jobs.find((other) => other.id !== job.id && other.resourceId === draft.resourceId && other.start < job.end && other.end > job.start)
      : null;
  const save = () => {
    if (busyWith) return;
    const status = draft.resourceId === 'unassigned' ? 'Unassigned' : draft.status === 'Unassigned' ? 'Scheduled' : draft.status;
    apiRef.current?.updateEvent(job.id, { resourceId: draft.resourceId, status, color: STATUS[status].color, checklist: draft.checklist });
    setNotice(`${job.title} saved: ${status.toLowerCase()}${TECHNICIANS[draft.resourceId] ? ` with ${TECHNICIANS[draft.resourceId].name}` : ''}.`);
    setSheetOpen(false);
  };
  const waiting = jobs.filter((item) => item.resourceId === 'unassigned').length;

  return (
    <div className='w-full p-4'>
      <Card className='w-full gap-0 py-0'>
        <CardContent className='p-0'>
          <Gantt
            defaultEvents={initialJobs}
            resources={RESOURCES}
            defaultScale='day'
            interval={60}
            apiRef={apiRef}
            scheduleMode='single'
            columns={columns}
            treePanel={{ width: 436, nameColumnWidth: 160 }}
            summaryBars={false}
            metrics={{ laneHeight: 2.25 }}
            canDropEvent={canDropEvent}
            enforceCanDrop
            onEventsChange={onEventsChange}
            onEventClick={open}
            renderResourceLabel={({ resource, isGroup }) => {
              const tech = !isGroup && TECHNICIANS[resource.id];
              if (!tech) return void 0;
              return (
                <span className='flex min-w-0 items-center gap-2'>
                  <Avatar className='size-6 shrink-0'>
                    <AvatarImage src={tech.photo} alt='' />
                    <AvatarFallback>{tech.name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className='truncate'>{tech.name}</span>
                </span>
              );
            }}
            renderEvent={({ occurrence }) => (
              <span className='flex min-w-0 flex-col leading-tight'>
                <span className='truncate font-medium'>{occurrence.event.title}</span>
                <span className='truncate opacity-80'>
                  {occurrence.event.customer} · {timeWindow(occurrence)}
                </span>
              </span>
            )}
            className='h-[540px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 border-b pe-3'>
              <GanttNav className='min-w-0 flex-[1_1_16rem] border-b-0' />
              <GanttToolbar className='flex-wrap'>
                <ul aria-label='Job status' className='text-text-muted flex flex-wrap items-center gap-3 text-xs'>
                  {Object.entries(STATUS).map(([label, { color }]) => (
                    <li key={label} className='flex items-center gap-1.5'>
                      <span aria-hidden='true' className='size-2 rounded-full' style={{ background: color }} />
                      {label}
                    </li>
                  ))}
                </ul>
                <Badge variant={waiting ? 'destructive-light' : 'success-light'} size='sm'>
                  {waiting ? `${waiting} to assign` : 'All assigned'}
                </Badge>
              </GanttToolbar>
            </div>
            <GanttView />
          </Gantt>
          <p role='status' className='text-text-muted border-t px-3 py-2 text-xs'>
            {notice}
          </p>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className='w-full sm:max-w-sm'>
          {job && draft && (
            <>
              <SheetHeader>
                <SheetTitle>{job.title}</SheetTitle>
                <SheetDescription>
                  {job.customer} · {timeWindow(job)}
                </SheetDescription>
              </SheetHeader>
              <div className='grid gap-4 overflow-y-auto px-4'>
                <dl className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm'>
                  <dt className='text-text-muted flex items-center gap-1.5'>
                    <RegistryIcon lucide='MapPinIcon' className='size-3.5' aria-hidden='true' /> Address
                  </dt>
                  <dd>{job.address}</dd>
                  <dt className='text-text-muted flex items-center gap-1.5'>
                    <RegistryIcon lucide='WrenchIcon' className='size-3.5' aria-hidden='true' /> Skill
                  </dt>
                  <dd>{job.skill}</dd>
                  <dt className='text-text-muted flex items-center gap-1.5'>
                    <RegistryIcon lucide='ClockIcon' className='size-3.5' aria-hidden='true' /> Duration
                  </dt>
                  <dd>{minutesOf(job)} min</dd>
                </dl>
                <FieldGroup>
                  <Field data-invalid={busyWith ? true : void 0}>
                    <FieldLabel htmlFor={`dispatch-technician-${formId}`}>Technician</FieldLabel>
                    <Select value={draft.resourceId} onValueChange={(resourceId) => setDraft({ ...draft, resourceId })}>
                      <SelectTrigger id={`dispatch-technician-${formId}`} aria-invalid={!!busyWith} aria-describedby={busyWith ? `dispatch-conflict-${formId}` : undefined} className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='unassigned'>Unassigned</SelectItem>
                        {qualified.map(([id, tech]) => (
                          <SelectItem key={id} value={id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {busyWith && (
                      <FieldError id={`dispatch-conflict-${formId}`}>
                        {TECHNICIANS[draft.resourceId].name} is on {busyWith.title} from {timeWindow(busyWith)}.
                      </FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`dispatch-status-${formId}`}>Status</FieldLabel>
                    <Select value={draft.status} onValueChange={(status) => setDraft({ ...draft, status })} disabled={draft.resourceId === 'unassigned'}>
                      <SelectTrigger id={`dispatch-status-${formId}`} className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Scheduled', 'En route', 'On site', 'Done'].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <fieldset className='grid gap-2'>
                    <legend className='mb-1 text-sm font-medium'>Close-out checklist</legend>
                    {[
                      ['parts', 'Parts logged'],
                      ['photos', 'Before and after photos'],
                      ['signature', 'Customer signature']
                    ].map(([key, label]) => (
                      <label key={key} className='flex items-center gap-2 text-sm'>
                        <Checkbox
                          checked={draft.checklist[key]}
                          onCheckedChange={(checked) => setDraft({ ...draft, checklist: { ...draft.checklist, [key]: checked === true } })}
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>
                </FieldGroup>
              </div>
              <SheetFooter>
                <Button onClick={save} disabled={!!busyWith}>
                  Save job
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
