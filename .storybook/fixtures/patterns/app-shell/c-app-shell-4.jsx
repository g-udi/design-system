'use client';
import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { EVENT_CALENDAR_COLORS, EventCalendar, EventCalendarContent } from '../../../../src/components/core/EventCalendar/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarProvider, useSidebar } from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const at = (day, hour, minutes = 0) => new Date(2026, 9, day, hour, minutes);
const color = Object.fromEntries(EVENT_CALENDAR_COLORS.map(({ name, value }) => [name.toLowerCase(), value]));
const events = [
  ...[5, 6, 7, 8, 9].map((day) => ({ id: `standup-${day}`, title: 'Editorial standup', start: at(day, 9), end: at(day, 9, 20), color: color.blue })),
  { id: 'interview', title: 'Reader interview · Ana Ruiz', start: at(5, 11), end: at(5, 12), color: color.emerald },
  { id: 'review', title: 'Draft review', start: at(6, 14), end: at(6, 15, 30), color: color.violet },
  { id: 'sponsor', title: 'Sponsor call · Fabrikam', start: at(7, 10), end: at(7, 10, 45), color: color.amber },
  { id: 'focus', title: 'Writing block', start: at(7, 13), end: at(7, 16), color: color.teal },
  { id: 'issue', title: 'Friday issue goes out', start: at(9, 8), end: at(9, 8, 30), color: color.rose },
  { id: 'retro', title: 'Issue retro', start: at(9, 15), end: at(9, 16), color: color.indigo }
];
const contacts = [
  { name: 'Priya Natarajan', role: 'Editor', avatar: 'women/44' },
  { name: 'Tom Becker', role: 'Designer', avatar: 'men/32' },
  { name: 'Ana Ruiz', role: 'Contributor', avatar: 'women/68' }
];
const panels = [
  { id: 'calendar', label: 'Calendar', icon: 'CalendarDays' },
  { id: 'schedule', label: 'Schedule', icon: 'Clock' },
  { id: 'contacts', label: 'Contacts', icon: 'Users' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' }
];

// The rail picks a panel; choosing the open panel again slides the context panel away.
function Rail({ panel, onPanel }) {
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar();
  return (
    <nav aria-label='Calendar sections' className='hidden w-12 shrink-0 flex-col items-center gap-1 bg-neutral-900 py-3 text-neutral-100 md:flex dark:border-e dark:border-(--ds-color-border) dark:bg-black/40'>
      {panels.map((entry) => (
        <Tooltip key={entry.id}>
          <TooltipTrigger asChild>
            <button
              type='button'
              aria-label={entry.label}
              aria-pressed={panel === entry.id && open}
              onClick={() => {
                if (isMobile) return setOpenMobile(true);
                if (panel === entry.id) return setOpen(!open);
                onPanel(entry.id);
                setOpen(true);
              }}
              className='grid size-9 hover:bg-white/10 aria-pressed:bg-white/20 place-items-center rounded-(--ds-radius-control)'
            >
              <RegistryIcon lucide={entry.icon} className='size-4' aria-hidden='true' />
            </button>
          </TooltipTrigger>
          <TooltipContent side='right'>{entry.label}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}

function MobileMenu() {
  const { setOpenMobile } = useSidebar();
  return (
    <Button size='icon-sm' variant='ghost' tone='neutral' className='md:hidden' aria-label='Open calendar panel' onClick={() => setOpenMobile(true)}>
      <RegistryIcon lucide='PanelLeft' className='size-4' aria-hidden='true' />
    </Button>
  );
}

export function Pattern() {
  const [panel, setPanel] = useState('calendar');
  const [view, setView] = useState('week');
  const [date, setDate] = useState(at(7, 9));
  const upNext = events.filter((event) => isSameDay(event.start, date)).sort((a, b) => a.start - b.start);

  const panelContent = {
    calendar: (
      <>
        <SidebarGroup>
          <Calendar mode='single' selected={date} onSelect={(next) => next && setDate(next)} defaultMonth={date} className='mx-auto [--cell-size:--spacing(7)]' />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Up next · {format(date, 'EEE d MMM')}</SidebarGroupLabel>
          <SidebarGroupContent>
            {upNext.length ? (
              <ol className='grid gap-1.5 px-2'>
                {upNext.map((event) => (
                  <li key={event.id} className='flex gap-2 text-sm'>
                    <span aria-hidden='true' className='mt-1 w-1 shrink-0 self-stretch rounded-full' style={{ background: event.color }} />
                    <span className='min-w-0'>
                      <span className='block truncate font-medium'>{event.title}</span>
                      <span className='text-text-muted text-xs'>{format(event.start, 'HH:mm')}–{format(event.end, 'HH:mm')}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className='text-text-muted px-2 text-sm'>Nothing scheduled.</p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </>
    ),
    schedule: (
      <SidebarGroup>
        <SidebarGroupLabel>Booking links</SidebarGroupLabel>
        <ul className='grid gap-2 px-2 text-sm'>
          {[['Reader interview', '30 min', 'Mon, Wed'], ['Sponsor intro', '20 min', 'Tue, Thu'], ['Office hours', '15 min', 'Fri']].map(([name, length, days]) => (
            <li key={name} className='rounded-(--ds-radius-control) border p-2.5'>
              <p className='font-medium'>{name}</p>
              <p className='text-text-muted text-xs'>{length} · {days}</p>
            </li>
          ))}
        </ul>
      </SidebarGroup>
    ),
    contacts: (
      <SidebarGroup>
        <SidebarGroupLabel>People</SidebarGroupLabel>
        <ul className='grid gap-1 px-2'>
          {contacts.map((person) => (
            <li key={person.name} className='flex items-center gap-2.5 py-1 text-sm'>
              <Avatar className='size-7'><AvatarImage src={`https://randomuser.me/api/portraits/${person.avatar}.jpg`} alt='' /><AvatarFallback>{person.name[0]}</AvatarFallback></Avatar>
              <span className='min-w-0'><span className='block truncate font-medium'>{person.name}</span><span className='text-text-muted text-xs'>{person.role}</span></span>
            </li>
          ))}
        </ul>
      </SidebarGroup>
    ),
    notifications: (
      <SidebarGroup>
        <SidebarGroupLabel>Notifications</SidebarGroupLabel>
        <ul className='grid gap-2 px-2 text-sm'>
          <li><span className='font-medium'>Ana Ruiz</span> <span className='text-text-muted'>accepted the reader interview</span></li>
          <li><span className='font-medium'>Fabrikam</span> <span className='text-text-muted'>moved the sponsor call to 10:00</span></li>
        </ul>
      </SidebarGroup>
    )
  };

  return (
    <SidebarProvider shortcut={false} className='bg-surface relative h-[44rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border' style={{ '--sidebar-width': '17rem' }}>
      <Rail panel={panel} onPanel={setPanel} />
      <Sidebar collapsible='offcanvas' className='absolute h-full md:left-12!'>
        <SidebarHeader>
          <p className='px-2 pt-1 text-sm font-semibold'>{panels.find((entry) => entry.id === panel).label}</p>
        </SidebarHeader>
        <SidebarContent>{panelContent[panel]}</SidebarContent>
      </Sidebar>
      <SidebarInset className='min-h-0 min-w-0'>
        <header className='flex h-14 shrink-0 flex-wrap items-center gap-2 border-b px-3'>
          <MobileMenu />
          <h1 className='text-sm font-semibold'>{format(date, 'MMMM yyyy')}</h1>
          <div className='ms-auto flex items-center gap-1'>
            <Button size='sm' variant='outline' tone='neutral' onClick={() => setDate(at(7, 9))}>Today</Button>
            <ToggleGroup type='single' size='sm' variant='outline' spacing={0} value={view} onValueChange={(next) => next && setView(next)} aria-label='Calendar view'>
              <ToggleGroupItem value='day'>Day</ToggleGroupItem>
              <ToggleGroupItem value='week'>Week</ToggleGroupItem>
              <ToggleGroupItem value='month'>Month</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </header>
        <div className='min-h-0 flex-1 overflow-auto p-2'>
          <EventCalendar defaultEvents={events} view={view} onViewChange={setView} date={date} onDateChange={setDate} className='h-full min-h-[30rem] w-full'>
            <EventCalendarContent />
          </EventCalendar>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
