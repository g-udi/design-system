// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useMemo, useRef } from 'react';
import { EventCalendar } from '../../../../src/components/core/EventCalendar/parts/event-calendar-extended.jsx';
import { EventCalendarContent } from '../../../../src/components/core/EventCalendar/parts/event-calendar-content-extended.jsx';
import {
  EventCalendarNav,
  EventCalendarToolbar
} from '../../../../src/components/core/EventCalendar/parts/event-calendar-nav-extended.jsx';
import { addDays, startOfDay, startOfWeek } from 'date-fns';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const CATEGORY = {
  design: {
    label: 'Design',
    color: 'var(--color-violet-500)',
    icon: (
      <RegistryIcon
        lucide='PaletteIcon'
        className='size-3.5'
        aria-hidden='true'
      />
    )
  },
  engineering: {
    label: 'Engineering',
    color: 'var(--color-sky-500)',
    icon: (
      <RegistryIcon lucide='CodeIcon' className='size-3.5' aria-hidden='true' />
    )
  },
  marketing: {
    label: 'Marketing',
    color: 'var(--color-orange-500)',
    icon: (
      <RegistryIcon
        lucide='MegaphoneIcon'
        className='size-3.5'
        aria-hidden='true'
      />
    )
  },
  product: {
    label: 'Product',
    color: 'var(--color-teal-500)',
    icon: (
      <RegistryIcon
        lucide='CompassIcon'
        className='size-3.5'
        aria-hidden='true'
      />
    )
  }
};
function buildEvents(anchor) {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 1 });
  const day = (offset) => addDays(week, offset);
  const span = (id, title, startOffset, endOffset, category) => ({
    id,
    title,
    // all-day, end-exclusive: [startOffset, endOffset) covers whole days
    start: day(startOffset),
    end: day(endOffset),
    allDay: true,
    color: CATEGORY[category].color,
    data: { category }
  });
  return [
    span('onboarding', 'Onboarding revamp', -2, 1, 'product'),
    span('design-sprint', 'Design sprint', 1, 4, 'design'),
    span('api-migration', 'API migration', 2, 6, 'engineering'),
    span('user-research', 'User research', 3, 5, 'product'),
    span('brand-refresh', 'Brand refresh', 8, 10, 'design'),
    span('launch', 'Launch campaign', 9, 13, 'marketing'),
    span('roadmap', 'Roadmap review', 15, 16, 'engineering')
  ];
}
function renderChip({ occurrence }) {
  const category = occurrence.event.data?.category;
  if (!category) return void 0;
  return (
    <span className='flex w-full min-w-0 items-center gap-1.5'>
      <span className='flex shrink-0 text-(--ec-event-color)'>
        {CATEGORY[category].icon}
      </span>
      <span className='truncate font-medium'>{occurrence.event.title}</span>
    </span>
  );
}
function renderTooltip({ occurrence }) {
  const category = occurrence.event.data?.category;
  if (!category) return void 0;
  return (
    <div className='space-y-0.5'>
      <p className='font-medium'>{occurrence.event.title}</p>
      <p className='text-ui-muted-foreground text-xs'>
        {CATEGORY[category].label}
      </p>
    </div>
  );
}
export function Pattern() {
  const events = useMemo(() => buildEvents(/* @__PURE__ */ new Date()), []);
  const apiRef = useRef(null);
  const counter = useRef(0);
  const addProject = () => {
    const api = apiRef.current;
    if (!api) return;
    const start = startOfDay(/* @__PURE__ */ new Date());
    api.addEvent({
      id: `project-${counter.current++}`,
      title: 'New project',
      start,
      end: addDays(start, 3),
      allDay: true,
      color: CATEGORY.design.color,
      data: { category: 'design' }
    });
    api.goTo(start);
  };
  const addMilestone = () => {
    const api = apiRef.current;
    if (!api) return;
    const start = startOfDay(/* @__PURE__ */ new Date());
    api.addEvent({
      id: `milestone-${counter.current++}`,
      title: 'Milestone',
      start,
      end: addDays(start, 1),
      allDay: true,
      color: CATEGORY.product.color,
      data: { category: 'product' }
    });
    api.goTo(start);
  };
  return (
    <div className='w-full p-4'>
      <Card className='w-full py-0'>
        <CardContent className='p-0'>
          <EventCalendar
            defaultEvents={events}
            defaultView='month'
            weekStartsOn={1}
            apiRef={apiRef}
            renderEvent={renderChip}
            renderEventTooltip={renderTooltip}
            eventTooltip={{ side: 'top' }}
            interactions={{ drag: true, resize: true, selectSlot: false }}
            className='h-[640px] w-full'
          >
            <div className='flex flex-wrap items-center gap-2 pe-2'>
              <EventCalendarNav
                className='min-w-0 flex-1'
                showViewSwitcher={false}
              />
              <EventCalendarToolbar>
                <Button variant='outline' size='sm' onClick={addMilestone}>
                  <RegistryIcon
                    lucide='FlagIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  Milestone
                </Button>
                <Button size='sm' onClick={addProject}>
                  <RegistryIcon
                    lucide='PlusIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                  New project
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>
          {/* Track legend - runtime var(--color-*) swatches ride inline styles
       rather than synthesized utility classes. */}
          <div className='text-ui-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-4 py-3 text-xs'>
            {Object.keys(CATEGORY).map((key) => (
              <span key={key} className='flex items-center gap-1.5'>
                <span
                  aria-hidden
                  className='size-2 rounded-full'
                  style={{ backgroundColor: CATEGORY[key].color }}
                />
                {CATEGORY[key].label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
