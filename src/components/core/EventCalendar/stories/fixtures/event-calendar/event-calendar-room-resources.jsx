'use client';
import { useMemo, useRef } from 'react';
import { EventCalendar } from '@gaudi/design-system/core/EventCalendar';
import { EventCalendarContent } from '@gaudi/design-system/core/EventCalendar';
import {
  EventCalendarNav,
  EventCalendarToolbar
} from '@gaudi/design-system/core/EventCalendar';
import { addMinutes, setHours, startOfDay } from 'date-fns';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const ROOMS = [
  { id: 'r101', title: '101 \xB7 King', color: 'var(--color-blue-500)' },
  { id: 'r102', title: '102 \xB7 Queen', color: 'var(--color-emerald-500)' },
  { id: 'r204', title: '204 \xB7 Twin', color: 'var(--color-violet-500)' },
  { id: 'r301', title: 'Suite 301', color: 'var(--color-amber-500)' }
];
const STATUS = {
  occupied: { label: 'Occupied', color: 'var(--color-emerald-500)' },
  checkout: { label: 'Check-out', color: 'var(--color-rose-500)' },
  housekeeping: { label: 'Housekeeping', color: 'var(--color-cyan-500)' },
  checkin: { label: 'Check-in', color: 'var(--color-blue-500)' }
};
function buildBookings(anchor) {
  const base = startOfDay(anchor);
  const at = (hour) => addMinutes(base, Math.round(hour * 60));
  const booking = (id, title, startHour, endHour, resourceId, status) => ({
    id,
    title,
    start: at(startHour),
    end: at(endHour),
    resourceId,
    color: STATUS[status].color,
    data: { status }
  });
  return [
    // 101 - morning stay, turnover, afternoon check-in
    booking('stay-reed', 'Occupied \xB7 Reed', 8, 10, 'r101', 'occupied'),
    booking(
      'checkout-reed',
      'Check-out \xB7 Reed',
      10,
      10.5,
      'r101',
      'checkout'
    ),
    booking('clean-101', 'Housekeeping', 10.5, 12, 'r101', 'housekeeping'),
    booking(
      'checkin-alvarez',
      'Check-in \xB7 Alvarez',
      14,
      15,
      'r101',
      'checkin'
    ),
    // 102 - long stay with a late-afternoon turnover
    booking('stay-chen', 'Occupied \xB7 Chen', 8, 16, 'r102', 'occupied'),
    booking(
      'checkout-chen',
      'Check-out \xB7 Chen',
      16,
      16.5,
      'r102',
      'checkout'
    ),
    booking('clean-102', 'Housekeeping', 16.5, 18, 'r102', 'housekeeping'),
    // 204 - midday turnover into an evening stay
    booking(
      'checkout-novak',
      'Check-out \xB7 Novak',
      11,
      11.5,
      'r204',
      'checkout'
    ),
    booking('clean-204', 'Deep clean', 11.5, 13, 'r204', 'housekeeping'),
    booking('checkin-ford', 'Check-in \xB7 Ford', 15, 16, 'r204', 'checkin'),
    booking('stay-ford', 'Occupied \xB7 Ford', 16, 20, 'r204', 'occupied'),
    // Suite 301 - early prep, mid-morning check-in, VIP stay
    booking('clean-301', 'Housekeeping', 8, 9.5, 'r301', 'housekeeping'),
    booking('checkin-osei', 'Check-in \xB7 Osei', 10, 11, 'r301', 'checkin'),
    booking('stay-osei', 'Occupied \xB7 Osei', 11, 20, 'r301', 'occupied')
  ];
}
export function Pattern() {
  const events = useMemo(() => buildBookings(new Date()), []);
  const apiRef = useRef(null);
  const bookingCount = useRef(0);
  const addBooking = () => {
    const api = apiRef.current;
    if (!api) return;
    const start = setHours(startOfDay(new Date()), 12);
    const end = addMinutes(start, 60);
    api.addEvent({
      id: `booking-${bookingCount.current++}`,
      title: 'New booking',
      start,
      end,
      resourceId: 'r101',
      color: STATUS.checkin.color,
      data: { status: 'checkin' }
    });
    api.goTo(start);
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <EventCalendar
            defaultEvents={events}
            defaultView='resource'
            resources={ROOMS}
            dayStartHour={8}
            dayEndHour={20}
            interval={60}
            interactions={{ drag: true, resize: true, selectSlot: false }}
            apiRef={apiRef}
            className='h-[600px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 pe-2'>
              {/* resource is the only view here, so the switcher is hidden */}
              <EventCalendarNav
                className='min-w-0 flex-[1_1_16rem]'
                showViewSwitcher={false}
              />
              <EventCalendarToolbar>
                <Button size='sm' onClick={addBooking}>
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  New booking
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
          {/* Status legend - swatch colors are runtime var(--color-*) tokens, so
       they ride inline styles rather than synthesized utility classes. */}
          <div className='text-ui-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-4 py-3 text-xs'>
            {Object.values(STATUS).map((status) => (
              <span key={status.label} className='flex items-center gap-1.5'>
                <span
                  aria-hidden
                  className='size-2 rounded-full'
                  style={{ backgroundColor: status.color }}
                />
                {status.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
