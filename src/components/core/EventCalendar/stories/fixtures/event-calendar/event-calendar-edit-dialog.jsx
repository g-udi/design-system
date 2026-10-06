'use client';
import { useMemo, useRef, useState } from 'react';
import { EventCalendar } from '@gaudi/design-system/core/EventCalendar';
import { EventCalendarContent } from '@gaudi/design-system/core/EventCalendar';
import {
  EventCalendarNav,
  EventCalendarToolbar
} from '@gaudi/design-system/core/EventCalendar';
import {
  addDays,
  addMinutes,
  differenceInCalendarDays,
  differenceInMinutes,
  format,
  setHours,
  startOfDay,
  startOfWeek
} from 'date-fns';
import RadioGroup from '@gaudi/design-system/core/RadioGroup';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import {
  DialogRoot as Dialog,
  DialogClosePrimitive as DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@gaudi/design-system/core/Dialog';
import {
  FieldRoot as Field,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const COLORS = [
  { value: 'var(--color-blue-500)', label: 'Blue' },
  { value: 'var(--color-violet-500)', label: 'Violet' },
  { value: 'var(--color-emerald-500)', label: 'Emerald' },
  { value: 'var(--color-amber-500)', label: 'Amber' },
  { value: 'var(--color-rose-500)', label: 'Rose' }
];
const START_TIMES = Array.from({ length: 49 }, (_, i) => 7 * 60 + i * 15);
const timeLabel = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
const DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' }
];
function buildEvents(anchor) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 0 });
  const at = (dayOffset, hour) => setHours(addDays(week, dayOffset), hour);
  return [
    {
      id: 'kickoff',
      title: 'Project kickoff',
      start: at(1, 10),
      end: at(1, 11),
      color: COLORS[0].value
    },
    {
      id: '1on1',
      title: '1:1 with Mia',
      start: at(2, 14),
      end: at(2, 15),
      color: COLORS[1].value
    },
    {
      id: 'review',
      title: 'Design review',
      start: at(4, 11),
      end: at(4, 12),
      color: COLORS[2].value
    },
    {
      id: 'standup',
      title: 'Team standup',
      start: addMinutes(at(3, 9), 15),
      end: addMinutes(at(3, 9), 30),
      color: COLORS[3].value
    },
    {
      id: 'interview',
      title: 'Candidate interview',
      start: at(5, 13),
      end: at(5, 14),
      color: COLORS[4].value
    },
    {
      id: 'retro',
      title: 'Sprint retro',
      start: at(5, 16),
      end: at(5, 17),
      color: COLORS[1].value
    }
  ];
}
export function Pattern() {
  const events = useMemo(() => buildEvents(new Date()), []);
  const apiRef = useRef(null);
  const counter = useRef(0);
  const openerRef = useRef(null);
  const addButtonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const seedCreate = (date, opener) => {
    openerRef.current = opener;
    setDraft({
      id: null,
      title: '',
      date: startOfDay(date),
      startMinutes: 9 * 60,
      dayCount: 1,
      duration: 60,
      allDay: false,
      color: COLORS[0].value
    });
    setOpen(true);
  };
  const openCreate = (slot, event) => seedCreate(slot.date, event.currentTarget);
  const openEdit = (occurrence) => {
    const event = occurrence.event;
    setDraft({
      id: event.id,
      title: event.title,
      date: startOfDay(event.start),
      startMinutes: event.start.getHours() * 60 + event.start.getMinutes(),
      duration: differenceInMinutes(event.end, event.start),
      dayCount: Math.max(1, differenceInCalendarDays(event.end, event.start)),
      allDay: event.allDay ?? false,
      color: event.color ?? COLORS[0].value
    });
    setOpen(true);
  };
  const save = () => {
    const api = apiRef.current;
    if (!api || !draft || !draft.title.trim()) return;
    const start = draft.allDay
      ? draft.date
      : addMinutes(draft.date, draft.startMinutes);
    const end = draft.allDay
      ? addDays(draft.date, draft.dayCount)
      : addMinutes(start, draft.duration);
    const patch = {
      title: draft.title.trim(),
      start,
      end,
      allDay: draft.allDay,
      color: draft.color
    };
    if (draft.id === null) {
      api.addEvent({ id: `evt-${counter.current++}`, ...patch });
    } else {
      api.updateEvent(draft.id, patch);
    }
    setOpen(false);
  };
  const remove = () => {
    const api = apiRef.current;
    if (!api || !draft?.id) return;
    api.removeEvent(draft.id);
    setOpen(false);
  };
  const isEdit = draft?.id != null;
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <EventCalendar
            defaultEvents={events}
            defaultView='month'
            apiRef={apiRef}
            onSlotClick={openCreate}
            onEventClick={(occurrence, e) => {
              e.preventDefault();
              openerRef.current = e.currentTarget;
              openEdit(occurrence);
            }}
            interactions={{ drag: true, resize: true, selectSlot: false }}
            className='h-[640px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 pe-2'>
              <EventCalendarNav className='min-w-0 flex-[1_1_16rem]' />
              <EventCalendarToolbar>
                <Button
                  ref={addButtonRef}
                  size='sm'
                  onClick={(event) => seedCreate(new Date(), event.currentTarget)}
                >
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  Add event
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        {draft && (
          <DialogContent
            className='sm:max-w-sm'
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              const target = openerRef.current?.isConnected ? openerRef.current : addButtonRef.current;
              target?.focus();
            }}
          >
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit event' : 'New event'}</DialogTitle>
              <DialogDescription>
                {format(draft.date, 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='ec-crud-title'>Title</FieldLabel>
                <Input
                  id='ec-crud-title'
                  placeholder='Add a title'
                  value={draft.title}
                  autoFocus
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                />
              </Field>

              <RadioGroup
                  label='Color'
                  value={draft.color}
                  onValueChange={(color) => { if (color) setDraft({ ...draft, color }); }}
                  options={COLORS.map((color) => ({
                    value: color.value,
                    label: <><span aria-hidden='true' className='size-2 rounded-full' style={{ backgroundColor: color.value }} />{color.label}</>
                  }))}
              />

              {!draft.allDay && (
                <div className='grid grid-cols-2 gap-3'>
                  <Field>
                    <FieldLabel htmlFor='ec-crud-start'>Start</FieldLabel>
                    <Select
                      value={String(draft.startMinutes)}
                      onValueChange={(value) =>
                        setDraft({ ...draft, startMinutes: Number(value) })
                      }
                    >
                      <SelectTrigger
                        id='ec-crud-start'
                        size='sm'
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set([...START_TIMES, draft.startMinutes])].sort((a, b) => a - b).map((minutes) => (
                          <SelectItem key={minutes} value={String(minutes)}>
                            {timeLabel(minutes)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='ec-crud-duration'>Duration</FieldLabel>
                    <Select
                      value={String(draft.duration)}
                      onValueChange={(value) =>
                        setDraft({ ...draft, duration: Number(value) })
                      }
                    >
                      <SelectTrigger
                        id='ec-crud-duration'
                        size='sm'
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(DURATIONS.some((option) => option.value === draft.duration) ? DURATIONS : [...DURATIONS, { value: draft.duration, label: `${draft.duration} min` }].sort((a, b) => a.value - b.value)).map((option) => (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}

              <Field orientation='horizontal'>
                <FieldLabel htmlFor='ec-crud-allday' className='font-normal'>
                  All day
                </FieldLabel>
                <Switch
                  id='ec-crud-allday'
                  checked={draft.allDay}
                  onCheckedChange={(allDay) => setDraft({ ...draft, allDay })}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className='sm:justify-between'>
              {isEdit ? (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-ui-destructive hover:text-ui-destructive'
                  onClick={remove}
                >
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className='flex gap-2'>
                <DialogClose asChild>
                  <Button variant='outline' size='sm'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button size='sm' onClick={save} disabled={!draft.title.trim()}>
                  {isEdit ? 'Save changes' : 'Create event'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
