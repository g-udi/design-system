'use client';
import { useMemo, useRef } from 'react';
import { EventCalendar } from '@gaudi/design-system/core/EventCalendar';
import { EventCalendarContent } from '@gaudi/design-system/core/EventCalendar';
import {
  EventCalendarNav,
  EventCalendarToolbar
} from '@gaudi/design-system/core/EventCalendar';
import { addMinutes, setHours, startOfDay } from 'date-fns';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const SERVICE = {
  consultation: { label: 'Consultation', color: 'var(--color-violet-500)' },
  followup: { label: 'Follow-up', color: 'var(--color-sky-500)' },
  assessment: { label: 'Assessment', color: 'var(--color-amber-500)' },
  therapy: { label: 'Therapy', color: 'var(--color-rose-500)' }
};
const NEW_COLOR = 'var(--color-emerald-500)';
function buildAppointments(anchor) {
  const base = startOfDay(anchor);
  const at = (hour, minute = 0) => addMinutes(setHours(base, hour), minute);
  const appt = (
    id,
    client,
    initials,
    avatar,
    service,
    startHour,
    startMinute,
    minutes
  ) => {
    const start = at(startHour, startMinute);
    return {
      id,
      title: client,
      start,
      end: addMinutes(start, minutes),
      color: SERVICE[service].color,
      data: { client, initials, avatar, service }
    };
  };
  return [
    appt(
      'a1',
      'Delphine Okoro',
      'DO',
      '/avatars/person-20.svg',
      'consultation',
      9,
      0,
      45
    ),
    appt(
      'a2',
      'Marek Rosales',
      'MR',
      '/avatars/person-41.svg',
      'followup',
      11,
      0,
      45
    ),
    appt(
      'a3',
      'Priyanka Nairn',
      'PN',
      '/avatars/person-24.svg',
      'assessment',
      14,
      0,
      60
    ),
    appt(
      'a4',
      'Lorcan Fischbach',
      'LF',
      '/avatars/person-50.svg',
      'therapy',
      16,
      0,
      45
    )
  ];
}
function renderChip({ occurrence, segment }) {
  const data = occurrence.event.data;
  if (!data) return void 0;
  const service = data.service ? SERVICE[data.service] : null;
  const minutes = (segment.endMin ?? 0) - (segment.startMin ?? 0);
  return (
    <span className='flex h-full w-full min-w-0 flex-col justify-start gap-0.5'>
      <span className='flex min-w-0 items-center gap-1.5'>
        <Avatar className='size-5 shrink-0'>
          {data.avatar && <AvatarImage src={data.avatar} alt={data.client} />}
          <AvatarFallback className='bg-(--ec-event-color)/25 text-xs font-semibold text-ui-foreground'>
            {data.initials}
          </AvatarFallback>
        </Avatar>
        <span className='truncate font-medium'>{data.client}</span>
      </span>
      {service && minutes >= 45 && (
        <span className='truncate ps-[1.625rem] text-xs font-medium text-ui-foreground'>
          {service.label}
        </span>
      )}
    </span>
  );
}
export function Pattern() {
  const events = useMemo(
    () => buildAppointments(new Date()),
    []
  );
  const apiRef = useRef(null);
  const counter = useRef(0);
  const bookSlot = (slot) => {
    const api = apiRef.current;
    if (!api) return;
    api.addEvent({
      id: `appt-${counter.current++}`,
      title: 'New appointment',
      start: slot.start,
      end: slot.end,
      color: NEW_COLOR,
      data: { client: 'New appointment', initials: '+' }
    });
  };
  const canBook = (slot) => {
    const api = apiRef.current;
    if (!api) return true;
    return (
      api.findOverlapping({ start: slot.start, end: slot.end }).length === 0
    );
  };
  const addAppointment = () => {
    const api = apiRef.current;
    if (!api) return;
    const base = startOfDay(new Date());
    for (let minutes = 9 * 60; minutes + 45 <= 18 * 60; minutes += 30) {
      const start = addMinutes(base, minutes);
      const end = addMinutes(start, 45);
      if (api.findOverlapping({ start, end }).length === 0) {
        api.addEvent({
          id: `appt-${counter.current++}`,
          title: 'New appointment',
          start,
          end,
          color: NEW_COLOR,
          data: { client: 'New appointment', initials: '+' }
        });
        api.goTo(start);
        return;
      }
    }
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <EventCalendar
            defaultEvents={events}
            defaultView='day'
            dayStartHour={9}
            dayEndHour={18}
            interval={30}
            snapDuration={15}
            apiRef={apiRef}
            renderEvent={renderChip}
            onSelectSlot={bookSlot}
            canSelectSlot={canBook}
            interactions={{ drag: true, resize: true, selectSlot: true }}
            className='h-[600px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 pe-2'>
              {/* the switcher is on: booking lives in the day view, but the week
       and month give the same appointments a wider context */}
              <EventCalendarNav className='w-full min-w-0 sm:w-auto sm:flex-1' />
              <EventCalendarToolbar>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => apiRef.current?.setView('agenda')}
                >
                  <RegistryIcon
                    lucide='ListIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  Agenda
                </Button>
                <Button size='sm' onClick={addAppointment}>
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  New appointment
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
          <p className='text-ui-muted-foreground border-t px-4 py-3 text-xs'>
            Drag across an open time to book an appointment. Slots that overlap
            an existing booking are blocked.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
