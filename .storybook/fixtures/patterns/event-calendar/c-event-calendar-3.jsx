'use client';
import { useMemo, useRef, useState } from 'react';
import { EventCalendar } from '../../../../src/components/core/EventCalendar/parts/event-calendar-extended.jsx';
import { EventCalendarContent } from '../../../../src/components/core/EventCalendar/parts/event-calendar-content-extended.jsx';
import {
  EventCalendarNav,
  EventCalendarToolbar
} from '../../../../src/components/core/EventCalendar/parts/event-calendar-nav-extended.jsx';
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  setHours,
  startOfDay,
  startOfWeek
} from 'date-fns';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const COLORS = [
  { value: 'var(--color-blue-500)', label: 'Blue' },
  { value: 'var(--color-violet-500)', label: 'Violet' },
  { value: 'var(--color-emerald-500)', label: 'Emerald' },
  { value: 'var(--color-amber-500)', label: 'Amber' },
  { value: 'var(--color-rose-500)', label: 'Rose' }
];
const START_HOURS = Array.from({ length: 13 }, (_, i) => i + 7);
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
      start: at(3, 9),
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
  const events = useMemo(() => buildEvents(/* @__PURE__ */ new Date()), []);
  const apiRef = useRef(null);
  const counter = useRef(0);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const seedCreate = (date) => {
    setDraft({
      id: null,
      title: '',
      date: startOfDay(date),
      startHour: 9,
      duration: 60,
      allDay: false,
      color: COLORS[0].value
    });
    setOpen(true);
  };
  const openCreate = (slot) => seedCreate(slot.date);
  const openEdit = (occurrence) => {
    const event = occurrence.event;
    setDraft({
      id: event.id,
      title: event.title,
      date: startOfDay(event.start),
      startHour: event.start.getHours(),
      duration: Math.max(30, differenceInMinutes(event.end, event.start)),
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
      : setHours(draft.date, draft.startHour);
    const end = draft.allDay
      ? addDays(draft.date, 1)
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
              openEdit(occurrence);
            }}
            interactions={{ drag: true, resize: true, selectSlot: false }}
            className='h-[640px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 pe-2'>
              <EventCalendarNav className='min-w-0 flex-1' />
              <EventCalendarToolbar>
                <Button
                  size='sm'
                  onClick={() => seedCreate(/* @__PURE__ */ new Date())}
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
          <DialogContent className='sm:max-w-sm'>
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

              <Field>
                <FieldLabel>Color</FieldLabel>
                <div className='flex gap-2'>
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type='button'
                      aria-label={color.label}
                      aria-pressed={draft.color === color.value}
                      onClick={() => setDraft({ ...draft, color: color.value })}
                      style={{ backgroundColor: color.value }}
                      className={cn(
                        'ring-offset-background size-6 rounded-full transition',
                        draft.color === color.value &&
                          'ring-ui-ring ring-2 ring-offset-2'
                      )}
                    />
                  ))}
                </div>
              </Field>

              {!draft.allDay && (
                <div className='grid grid-cols-2 gap-3'>
                  <Field>
                    <FieldLabel htmlFor='ec-crud-start'>Start</FieldLabel>
                    <Select
                      value={String(draft.startHour)}
                      onValueChange={(value) =>
                        setDraft({ ...draft, startHour: Number(value) })
                      }
                    >
                      <SelectTrigger
                        aria-label='Choose an option'
                        id='ec-crud-start'
                        size='sm'
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {START_HOURS.map((hour) => (
                          <SelectItem key={hour} value={String(hour)}>
                            {`${String(hour).padStart(2, '0')}:00`}
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
                        aria-label='Choose an option'
                        id='ec-crud-duration'
                        size='sm'
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATIONS.map((option) => (
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
