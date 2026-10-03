'use client';
import { useEffect, useRef, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { GithubDark } from '../../../../src/icons/brands/githubDark.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';

const portrait = (path) => `/avatars/${path}.jpg`;
const me = { name: 'Nick Bold', email: 'nick@gaudi.dev', photo: portrait('men/22') };
// One fixed day keeps server and client markup identical.
const TODAY = new Date(2026, 5, 10);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const busyDays = [6, 8, 11, 13, 15, 17, 20].map((day) => new Date(2026, 5, day));

const sections = [
  { id: 'mail', label: 'Mail', icon: 'Inbox', unread: true },
  { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
  { id: 'schedule', label: 'Schedule', icon: 'Clock' },
  { id: 'contacts', label: 'Contacts', icon: 'Users' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell', unread: true }
];
const folders = [
  { id: 'inbox', label: 'Inbox', icon: 'Inbox', badge: { label: 4, variant: 'secondary' } },
  { id: 'starred', label: 'Starred', icon: 'Star' },
  { id: 'sent', label: 'Sent', icon: 'Send' },
  { id: 'drafts', label: 'Drafts', icon: 'FileText', badge: { label: 2, variant: 'secondary' } },
  { id: 'archive', label: 'Archive', icon: 'Archive' },
  { id: 'spam', label: 'Spam', icon: 'ShieldAlert' },
  { id: 'trash', label: 'Trash', icon: 'Trash2' }
];
const mailLabels = [
  { id: 'label-design', label: 'Design', dot: 'neutral' },
  { id: 'label-work', label: 'Work', dot: 'violet' },
  { id: 'label-business', label: 'Business', dot: 'warning' },
  { id: 'label-finance', label: 'Finance', dot: 'success' }
];
const LABEL_TONES = { Design: 'secondary', Work: 'discovery-light', Business: 'warning-light', Finance: 'success-light', Security: 'destructive-light' };
const initialMessages = [
  { id: 'm1', folder: 'inbox', from: 'Sarah Chen', photo: portrait('women/44'), time: '10:42 AM', unread: true, starred: true, urgent: true, subject: 'Design review · component library v2.0', preview: 'Hey Nick, I’ve gone through the latest Figma handoff and left comments on the spacing tokens. The button hierarchy looks great but we should revisit the hover states…', label: 'Design', people: ['men/32', 'women/68', 'men/75'] },
  { id: 'm2', folder: 'inbox', from: 'Marcus Lee', photo: portrait('men/32'), time: '9:15 AM', unread: true, subject: 'Q4 sprint planning, your input needed', preview: 'Hey team, sharing the draft sprint board for Q4. We have three milestones: the public launch, the icon pack update, and onboarding…', label: 'Work', file: ['Q4-Sprint-Board.pdf', '1.2 MB'] },
  { id: 'm3', folder: 'inbox', from: 'Emma Wilson', photo: portrait('women/68'), time: 'Yesterday', unread: true, subject: 'Partnership proposal · Gaudi integration', preview: 'Hi Nick, reaching out because we’ve been using Gaudi across our product surfaces and would love to talk about a partnership…', label: 'Business', actions: ['Schedule Call', 'View Proposal'] },
  { id: 'm4', folder: 'inbox', from: 'GitHub', Logo: GithubDark, tile: 'bg-ui-foreground', time: 'Yesterday', unread: true, subject: '[gaudi/core] Security advisory on rollup affects your repository', preview: 'A security advisory on rollup affects at least one of your repositories. Review the dependency graph for details.', label: 'Security' },
  { id: 'm5', folder: 'inbox', from: 'Stripe', Logo: Stripe, time: 'Mon', subject: 'Payment received · $299 from Acme Corp', preview: 'A payment of $299.00 has been received from Acme Corp for invoice #1024.', label: 'Finance' },
  { id: 'm6', folder: 'inbox', from: 'Alex Martin', photo: portrait('men/75'), time: 'Mon', starred: true, subject: 'Invoice #1024 · November services', preview: 'Please find attached the invoice for November consulting services. Payment terms are net 30.', label: 'Finance', file: ['Invoice-1024.pdf', '243 KB'] },
  { id: 'm7', folder: 'sent', from: 'To: Sarah Chen', photo: portrait('women/44'), time: 'Sun', subject: 'Re: Token naming', preview: 'Agreed on the semantic names. I’ll update the docs tonight.' },
  { id: 'm8', folder: 'drafts', from: 'Draft', photo: me.photo, time: 'Sat', subject: 'Quarterly update', preview: 'Highlights: two releases shipped, the token pipeline is live…' },
  { id: 'm9', folder: 'archive', from: 'Priya Nair', photo: portrait('women/90'), time: 'Oct 2', subject: 'Offsite logistics', preview: 'Travel is booked for everyone; the agenda is in the shared drive.' }
];
const calendars = [
  { account: 'nick@company.io', items: [{ id: 'work', label: 'Work', tone: 'bg-info' }, { id: 'personal', label: 'Personal', tone: 'bg-success' }, { id: 'meetings', label: 'Meetings', tone: 'bg-discovery' }] },
  { account: 'nick@gmail.com', items: [{ id: 'family', label: 'Family', tone: 'bg-warning' }, { id: 'birthdays', label: 'Birthdays', tone: 'bg-attention' }] }
];
const upNext = [
  { id: 'standup', title: 'Weekly Team Standup', time: '9:00 AM to 9:30 AM', tone: 'bg-info', people: ['women/44', 'men/32', 'women/68'] },
  { id: 'review', title: 'Design Review · Component Library v3', time: '11:00 AM to 12:00 PM', tone: 'bg-discovery', people: ['women/65'] },
  { id: 'coffee', title: 'Coffee with Alex', time: '2:00 PM to 2:30 PM', tone: 'bg-warning', people: [] }
];
const agenda = [
  { day: 'Today', items: [
    { title: 'Morning Standup', time: '9:00 AM to 9:15 AM', where: 'Zoom · Room A', kind: 'Meeting', tone: 'bg-info', people: ['women/44', 'men/32', 'women/68'] },
    { title: 'Sprint Planning', time: '10:00 AM to 11:00 AM', where: 'Conf Room B', kind: 'Meeting', tone: 'bg-discovery', people: ['men/75', 'women/90'] },
    { title: 'Lunch with Sarah', time: '12:30 PM to 1:30 PM', where: 'The Coffee House, 3rd Ave', kind: 'Personal', tone: 'bg-warning', people: ['women/44'] }
  ] },
  { day: 'Tomorrow', items: [
    { title: 'Client Presentation', time: '9:30 AM to 10:30 AM', where: 'Google Meet', kind: 'Meeting', tone: 'bg-info', people: ['men/46', 'women/12'] },
    { title: 'Design Sync', time: '2:00 PM to 2:45 PM', where: 'Studio', kind: 'Meeting', tone: 'bg-discovery', people: ['women/65', 'men/22'] }
  ] }
];
const contacts = [
  { team: 'Design', people: [
    { name: 'Sarah Chen', role: 'Design Lead', photo: 'women/44', online: true },
    { name: 'Aisha Patel', role: 'UX Researcher', photo: 'women/65', online: true }
  ] },
  { team: 'Engineering', people: [
    { name: 'Luna Martinez', role: 'QA Engineer', photo: 'women/12', online: false },
    { name: 'Marcus Rivera', role: 'Frontend Engineer', photo: 'men/32', online: true },
    { name: 'James Park', role: 'Backend Engineer', photo: 'men/46', online: false },
    { name: 'Tom Bradley', role: 'DevOps Engineer', photo: 'men/75', online: true }
  ] },
  { team: 'Management', people: [
    { name: 'Emily Watson', role: 'Product Manager', photo: 'women/68', online: false },
    { name: 'David Kim', role: 'Engineering Manager', photo: 'men/52', online: false }
  ] }
];
const initialInvites = [
  { id: 'q2', from: 'Sarah Chen', photo: 'women/44', title: 'Sarah Chen invited you to Q2 Planning', when: 'Fri, Jun 12 · 10:00 to 11:00 AM', time: '5 min ago', unread: true },
  { id: 'sprint', from: 'Reminder', title: 'Sprint Planning starts in 15 minutes', when: 'Today · 10:00 to 11:00 AM', time: '15 min ago', unread: true, reminder: true },
  { id: 'moved', from: 'Marcus Rivera', photo: 'men/32', title: 'Marcus Rivera moved Design Sync', when: 'Tomorrow · 3:00 PM', time: '1 hour ago', unread: true, info: true },
  { id: 'accepted', from: 'Emily Watson', photo: 'women/68', title: 'Emily Watson accepted your invite to Team Lunch', time: '2 hours ago', info: true }
];

function Portraits({ people, size = 'size-5' }) {
  if (!people?.length) return null;
  return (
    <AvatarGroup className='-space-x-1.5'>
      {people.map((path) => (
        <Avatar key={path} className={size}>
          <AvatarImage src={portrait(path)} alt='' />
          <AvatarFallback>·</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

function PanelHeading({ title, count, children }) {
  return (
    <div className='border-ui-sidebar-border flex h-12 shrink-0 items-center gap-2 border-b px-3'>
      <h2 className='truncate text-sm font-semibold'>{title}</h2>
      {count ? <Badge variant='secondary' size='sm' className='rounded-full'>{count}</Badge> : null}
      <div className='ms-auto flex items-center gap-0.5'>{children}</div>
    </div>
  );
}

function IconAction({ label, icon, onClick, pressed, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={label} aria-pressed={pressed} onClick={onClick} className={className}>
          <RegistryIcon lucide={icon} aria-hidden='true' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionLabel({ children, count }) {
  return (
    <div className='text-text-muted flex items-center justify-between px-3 pt-3 pb-1 text-xs font-medium tracking-wide uppercase'>
      {children}
      {count ? <Badge variant='outline' size='sm'>{count}</Badge> : null}
    </div>
  );
}

/** Mini calendar, calendar accounts, the next events and quick actions: the Calendar panel and the mail context panel. */
function CalendarContext({ idPrefix, cellSize }) {
  const [selected, setSelected] = useState(TODAY);
  const [visible, setVisible] = useState(['work', 'personal', 'meetings', 'family']);
  const toggle = (id, on) => setVisible((list) => (on ? [...list, id] : list.filter((entry) => entry !== id)));
  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain'>
      <div className='border-ui-sidebar-border border-b p-2'>
        <Calendar
          mode='single'
          selected={selected}
          onSelect={(day) => day && setSelected(day)}
          defaultMonth={TODAY}
          modifiers={{ busy: busyDays }}
          modifiersClassNames={{
            busy: 'relative after:pointer-events-none after:absolute after:top-1 after:start-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-current after:opacity-60'
          }}
          className='mx-auto bg-transparent p-0'
          style={{ '--cell-size': cellSize }}
        />
      </div>
      <section aria-labelledby={`${idPrefix}-calendars`} className='border-ui-sidebar-border border-b pb-2'>
        <SectionLabel><span id={`${idPrefix}-calendars`}>My Calendars</span></SectionLabel>
        <div className='px-1.5'>
          {calendars.map((group, index) => (
            <Collapsible key={group.account} defaultOpen={index === 0}>
              <CollapsibleTrigger asChild>
                <Button variant='ghost' size='sm' className='group/account w-full justify-start gap-1.5 px-1.5 font-medium'>
                  <RegistryIcon lucide='ChevronRight' aria-hidden='true' className='ds-part-rtl-flip transition-transform group-data-[state=open]/account:rotate-90 motion-reduce:transition-none' />
                  <span className='truncate'>{group.account}</span>
                  <Badge variant='outline' size='sm' className='ms-auto'>{group.items.length}</Badge>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className='grid gap-0.5 py-0.5 ps-5'>
                  {group.items.map((item) => {
                    const id = `${idPrefix}-${item.id}`;
                    return (
                      <li key={item.id} className='flex h-8 items-center gap-2'>
                        <span aria-hidden='true' className={`size-2 shrink-0 rounded-full ${item.tone}`} />
                        <Checkbox id={id} checked={visible.includes(item.id)} onCheckedChange={(on) => toggle(item.id, on === true)} />
                        <label htmlFor={id} className='flex-1 truncate text-sm font-medium'>{item.label}</label>
                      </li>
                    );
                  })}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          ))}
          <Button variant='ghost' size='sm' className='text-text-muted w-full justify-start px-1.5'>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
            Add account
          </Button>
        </div>
      </section>
      <section aria-labelledby={`${idPrefix}-next`} className='border-ui-sidebar-border border-b pb-2'>
        <SectionLabel count={upNext.length}><span id={`${idPrefix}-next`}>Up Next</span></SectionLabel>
        <ul className='grid gap-0.5 px-1.5'>
          {upNext.map((event) => (
            <li key={event.id}>
              <button type='button' className='hover:bg-ui-sidebar-accent focus-visible:ring-ui-sidebar-ring flex w-full items-stretch gap-2.5 rounded-(--ds-radius-control) px-1.5 py-1.5 text-start outline-hidden focus-visible:ring-2'>
                <span aria-hidden='true' className={`w-1 shrink-0 rounded-full ${event.tone}`} />
                <span className='grid min-w-0 flex-1'>
                  <span className='truncate text-sm font-medium'>{event.title}</span>
                  <span className='text-text-muted text-xs'>{event.time}</span>
                </span>
                <Portraits people={event.people} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <div className='grid gap-1.5 p-3'>
        <Button size='sm'>
          <RegistryIcon lucide='Plus' aria-hidden='true' />
          New Event
        </Button>
        <Button size='sm' variant='outline'>
          <RegistryIcon lucide='Share2' aria-hidden='true' />
          Share Availability
        </Button>
      </div>
      <div className='border-ui-sidebar-border text-text-muted mt-auto flex items-center gap-2 border-t px-3 py-2.5 text-xs'>
        <RegistryIcon lucide='Globe' aria-hidden='true' className='size-4' />
        <span className='grid leading-tight'>
          <span className='text-[11px]'>Your timezone</span>
          GMT+1 · Europe/Paris
        </span>
      </div>
    </div>
  );
}

/** The dark navigation rail: one button per app section; the current one is marked. */
function SectionRail({ section, onSection }) {
  const { setOpen, isMobile } = useSidebar();
  return (
    <div className='dark bg-surface text-text border-ui-border flex w-12 shrink-0 flex-col items-center gap-1 border-e py-2'>
      <span aria-hidden='true' className='bg-ui-foreground text-ui-background mb-2 grid size-8 place-items-center rounded-(--ds-radius-control)'>
        <RegistryIcon lucide='Command' className='size-4' />
      </span>
      <nav aria-label='Apps' className='contents'>
        {sections.map((entry) => {
          const current = entry.id === section;
          const button = (
            <Button
              key={entry.id}
              variant='ghost'
              size='icon'
              aria-label={entry.label}
              aria-current={current ? 'page' : undefined}
              className={`relative ${current ? 'bg-ui-muted text-text' : 'text-text-muted'}`}
              onClick={() => {
                onSection(entry.id);
                // Choosing a section from the folded rail opens its panel.
                if (!isMobile) setOpen(true);
              }}
            >
              <RegistryIcon lucide={entry.icon} aria-hidden='true' />
              {entry.unread ? <span aria-hidden='true' className='bg-text absolute top-1.5 end-1.5 size-1.5 rounded-full' /> : null}
            </Button>
          );
          // The phone sheet shows the panel beside the rail, so names need no tooltip there.
          if (isMobile) return button;
          return (
            <Tooltip key={entry.id}>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side='right'>{entry.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      <div className='mt-auto'>
        <AccountMenu />
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={`Account: ${me.name}`}>
          <Avatar className='size-7'>
            <AvatarImage src={me.photo} alt='' />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='grid font-normal leading-tight'>
          <span className='font-medium'>{me.name}</span>
          <span className='text-text-muted text-xs'>{me.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='User' aria-hidden='true' />
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Settings' aria-hidden='true' />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='LogOut' aria-hidden='true' />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MailPanel({ folder, onFolder }) {
  return (
    <>
      <PanelHeading title='Mail'>
        <IconAction label='Compose' icon='SquarePen' />
      </PanelHeading>
      <SidebarContent role='navigation' aria-label='Mail folders' className='gap-0'>
        <AppShellNav label='Folders' items={folders} value={folder} onValueChange={onFolder} />
        <AppShellNav label='Labels' collapsible items={mailLabels} value={folder} onValueChange={onFolder} />
      </SidebarContent>
      <SidebarFooter className='border-ui-sidebar-border border-t'>
        <div className='grid gap-1.5 p-1 text-xs'>
          <div className='flex justify-between'>
            <span className='font-medium'>Storage</span>
            <span className='text-text-muted'>6.2 of 15 GB</span>
          </div>
          <Progress value={41} aria-label='Storage used' className='bg-ui-muted h-1.5 rounded-full' />
        </div>
      </SidebarFooter>
    </>
  );
}

function SchedulePanel() {
  return (
    <>
      <PanelHeading title='Schedule'>
        <IconAction label='Filter schedule' icon='Filter' />
      </PanelHeading>
      <div className='flex-1 overflow-y-auto overscroll-contain px-2 pb-3'>
        {agenda.map((group) => (
          <section key={group.day} aria-label={group.day}>
            <SectionLabel>{group.day}</SectionLabel>
            <ul className='grid gap-2'>
              {group.items.map((item) => (
                <li key={item.title} className='bg-ui-background border-ui-border grid gap-1.5 rounded-(--ds-radius-card) border p-2.5 text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <span aria-hidden='true' className={`size-1.5 shrink-0 rounded-full ${item.tone}`} />
                    <h3 className='truncate font-medium'>{item.title}</h3>
                    <Badge variant='outline' size='sm' className='ms-auto'>{item.kind}</Badge>
                  </div>
                  <span className='text-text-muted text-xs'>{item.time}</span>
                  <span className='text-text-muted flex items-center gap-1 text-xs'>
                    <RegistryIcon lucide='MapPin' aria-hidden='true' className='size-3.5' />
                    <span className='truncate'>{item.where}</span>
                  </span>
                  <span className='text-text-muted flex items-center gap-1.5 text-xs'>
                    <Portraits people={item.people} />
                    {item.people.length} {item.people.length === 1 ? 'attendee' : 'attendees'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function ContactsPanel() {
  const [query, setQuery] = useState('');
  const match = (person) => `${person.name} ${person.role}`.toLowerCase().includes(query.toLowerCase());
  const total = contacts.flatMap((group) => group.people);
  return (
    <>
      <PanelHeading title='Contacts'>
        <IconAction label='Add contact' icon='UserPlus' />
      </PanelHeading>
      <div className='p-2'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput aria-label='Search contacts' placeholder='Search contacts...' value={query} onChange={(event) => setQuery(event.target.value)} />
        </InputGroup>
      </div>
      <div className='flex-1 overflow-y-auto overscroll-contain px-1.5'>
        {contacts.map((group) => {
          const people = group.people.filter(match);
          if (!people.length) return null;
          return (
            <section key={group.team} aria-label={group.team}>
              <SectionLabel>{group.team}</SectionLabel>
              <ul>
                {people.map((person) => (
                  <li key={person.name} className='hover:bg-ui-sidebar-accent flex items-center gap-2.5 rounded-(--ds-radius-control) px-1.5 py-1.5'>
                    <span className='relative shrink-0'>
                      <Avatar className='size-8'>
                        <AvatarImage src={portrait(person.photo)} alt='' />
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                      <span
                        role='img'
                        aria-label={person.online ? 'online' : 'offline'}
                        className={`ring-ui-sidebar absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ${person.online ? 'bg-success' : 'bg-text-muted'}`}
                      />
                    </span>
                    <span className='grid min-w-0 flex-1 leading-tight'>
                      <span className='truncate text-sm font-medium'>{person.name}</span>
                      <span className='text-text-muted truncate text-xs'>{person.role}</span>
                    </span>
                    <IconAction label={`Message ${person.name}`} icon='MessageSquare' />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <div className='border-ui-sidebar-border text-text-muted flex items-center justify-between border-t px-3 py-2 text-xs'>
        <span>{total.length} contacts</span>
        <span className='flex items-center gap-1.5'>
          <span aria-hidden='true' className='bg-success size-1.5 rounded-full' />
          {total.filter((person) => person.online).length} online
        </span>
      </div>
    </>
  );
}

function NotificationsPanel() {
  const [items, setItems] = useState(initialInvites);
  const unread = items.filter((item) => item.unread).length;
  const respond = (id, answer) => setItems((list) => list.map((item) => (item.id === id ? { ...item, answer, unread: false } : item)));
  return (
    <>
      <PanelHeading title='Notifications' count={unread || null}>
        <IconAction label='Mark all as read' icon='CheckCheck' onClick={() => setItems((list) => list.map((item) => ({ ...item, unread: false })))} />
      </PanelHeading>
      <ul aria-label='Calendar notifications' className='flex-1 overflow-y-auto overscroll-contain'>
        {items.map((item) => (
          <li key={item.id} className='border-ui-sidebar-border relative flex gap-2.5 border-b px-3 py-3 text-sm'>
            {item.photo ? (
              <Avatar className='size-7'>
                <AvatarImage src={portrait(item.photo)} alt='' />
                <AvatarFallback>{item.from[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <span aria-hidden='true' className='text-warning grid size-7 shrink-0 place-items-center'>
                <RegistryIcon lucide='Bell' className='size-4' />
              </span>
            )}
            <div className='grid min-w-0 flex-1 gap-1.5'>
              <p className='pe-3 leading-snug font-medium'>
                {item.title}
                {item.unread ? <span className='sr-only'> (unread)</span> : null}
              </p>
              {item.when ? (
                <span className='border-ui-border text-text-muted flex w-fit items-center gap-1.5 rounded-(--ds-radius-control) border px-1.5 py-0.5 text-xs'>
                  <RegistryIcon lucide='Calendar' aria-hidden='true' className='size-3.5' />
                  {item.when}
                </span>
              ) : null}
              {!item.info && !item.reminder ? (
                item.answer ? (
                  <Badge variant={item.answer === 'Going' ? 'success-light' : 'secondary'} className='w-fit'>{item.answer}</Badge>
                ) : (
                  <div className='flex gap-1.5'>
                    <Button size='xs' onClick={() => respond(item.id, 'Going')}>Accept</Button>
                    <Button size='xs' variant='outline' onClick={() => respond(item.id, 'Declined')}>Decline</Button>
                  </div>
                )
              ) : null}
              <span className='text-text-muted text-xs'>{item.time}</span>
            </div>
            {item.unread ? <span aria-hidden='true' className='bg-ui-foreground absolute top-4 end-3 size-1.5 rounded-full' /> : null}
          </li>
        ))}
      </ul>
    </>
  );
}

function SectionPanel({ section, folder, onFolder }) {
  if (section === 'mail') return <MailPanel folder={folder} onFolder={onFolder} />;
  if (section === 'schedule') return <SchedulePanel />;
  if (section === 'contacts') return <ContactsPanel />;
  if (section === 'notifications') return <NotificationsPanel />;
  return (
    <>
      <PanelHeading title='Calendars'>
        <IconAction label='Add calendar' icon='Plus' />
      </PanelHeading>
      <CalendarContext idPrefix='app-shell-4-panel' cellSize='1.875rem' />
    </>
  );
}

function MessageRow({ message, selected, onSelect }) {
  const { Logo } = message;
  return (
    <li className={`border-ui-border relative border-b ${selected ? 'bg-ui-muted' : ''}`}>
      <button
        type='button'
        aria-current={selected ? 'true' : undefined}
        onClick={() => onSelect(message.id)}
        className='focus-visible:ring-ui-ring absolute inset-0 outline-hidden focus-visible:ring-2 focus-visible:ring-inset'
      >
        <span className='sr-only'>
          {message.from}: {message.subject}
          {message.unread ? ', unread' : ''}
        </span>
      </button>
      <div className='pointer-events-none flex gap-3 py-3 ps-6 pe-3'>
        {message.unread ? <span aria-hidden='true' className='bg-ui-foreground absolute top-5 start-2.5 size-1.5 rounded-full' /> : null}
        {Logo ? (
          <span aria-hidden='true' className={`grid size-8 shrink-0 place-items-center rounded-full ${message.tile || 'bg-ui-muted'}`}>
            <Logo className='size-5' />
          </span>
        ) : (
          <Avatar className='size-8'>
            <AvatarImage src={message.photo} alt='' />
            <AvatarFallback>{message.from[0]}</AvatarFallback>
          </Avatar>
        )}
        <div aria-hidden='true' className='grid min-w-0 flex-1 gap-0.5'>
          <div className='flex items-center gap-1.5'>
            <span className={`truncate text-sm ${message.unread ? 'font-semibold' : 'font-medium'}`}>{message.from}</span>
            {message.urgent ? <span className='text-ui-danger-ink text-xs font-bold'>!</span> : null}
            {message.starred ? <RegistryIcon lucide='Star' className='text-warning ms-auto size-3.5 shrink-0 fill-current' /> : null}
            {message.file ? <RegistryIcon lucide='Paperclip' className={`text-text-muted size-3.5 shrink-0 ${message.starred ? '' : 'ms-auto'}`} /> : null}
            <span className={`text-text-muted shrink-0 text-xs ${message.starred || message.file ? '' : 'ms-auto'}`}>{message.time}</span>
          </div>
          <span className='truncate text-sm'>{message.subject}</span>
          <span className='text-text-muted truncate text-xs'>{message.preview}</span>
          {message.label || message.people ? (
            <div className='mt-1 flex items-center gap-1.5'>
              <Portraits people={message.people} size='size-4' />
              {message.label ? <Badge variant={LABEL_TONES[message.label]} size='sm'>{message.label}</Badge> : null}
            </div>
          ) : null}
          {message.file ? (
            <span className='border-ui-border mt-1 flex w-fit items-center gap-1.5 rounded-(--ds-radius-control) border px-1.5 py-0.5 text-xs'>
              <RegistryIcon lucide='Paperclip' className='size-3' />
              <span className='max-w-32 truncate font-medium'>{message.file[0]}</span>
              <span className='text-text-muted'>({message.file[1]})</span>
            </span>
          ) : null}
        </div>
      </div>
      {message.actions ? (
        <div className='relative flex gap-1.5 ps-17 pe-3 pb-3'>
          <Button size='xs'>{message.actions[0]}</Button>
          <Button size='xs' variant='outline'>{message.actions[1]}</Button>
        </div>
      ) : null}
    </li>
  );
}

function MailView({ messages, setMessages, folder, contextOpen, onContext }) {
  const { isMobile } = useSidebar();
  const [tab, setTab] = useState('all');
  const [selectedId, setSelectedId] = useState('m1');
  const [reading, setReading] = useState(false);
  const inFolder = messages.filter((message) => (folder === 'starred' ? message.starred : message.folder === folder));
  const list = inFolder.filter((message) => (tab === 'unread' ? message.unread : tab === 'starred' ? message.starred : tab === 'files' ? message.file : true));
  const selected = messages.find((message) => message.id === selectedId) ?? inFolder[0];
  const index = list.findIndex((message) => message.id === selected?.id);
  const folderLabel = [...folders, ...mailLabels].find((entry) => entry.id === folder)?.label ?? 'Inbox';
  const unread = inFolder.filter((message) => message.unread).length;
  const select = (id) => {
    setSelectedId(id);
    setReading(true);
    setMessages((all) => all.map((message) => (message.id === id ? { ...message, unread: false } : message)));
  };
  const update = (patch) => setMessages((all) => all.map((message) => (message.id === selected.id ? { ...message, ...patch } : message)));
  const remove = () => {
    const next = list[index + 1] ?? list[index - 1];
    setMessages((all) => all.map((message) => (message.id === selected.id ? { ...message, folder: 'trash' } : message)));
    if (next) setSelectedId(next.id);
    else setReading(false);
  };
  return (
    <div className='flex min-h-0 flex-1'>
      <section
        aria-label={`${folderLabel} messages`}
        className={`border-ui-border min-w-0 flex-col @2xl:flex @2xl:w-80 @2xl:shrink-0 @2xl:border-e @5xl:w-88 ${reading ? 'hidden' : 'flex flex-1'}`}
      >
        <div className='flex h-12 shrink-0 items-center gap-2 px-3'>
          {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
          <h2 className='text-sm font-semibold'>{folderLabel}</h2>
          {unread ? <Badge variant='outline' size='sm' className='rounded-full'>{unread}</Badge> : null}
          <div className='ms-auto flex items-center gap-0.5'>
            <IconAction label='Refresh inbox' icon='RefreshCw' />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon-sm' aria-label='Sort and filter'>
                  <RegistryIcon lucide='Filter' aria-hidden='true' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup defaultValue='newest'>
                  <DropdownMenuRadioItem value='newest'>Date (newest first)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='oldest'>Date (oldest first)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='sender'>Sender</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setMessages((all) => all.map((message) => ({ ...message, unread: false })))}>
                  <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
                  Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <IconAction label='Compose new email' icon='SquarePen' />
          </div>
        </div>
        <div className='px-3 pb-2'>
          <InputGroup>
            <InputGroupAddon>
              <RegistryIcon lucide='Search' aria-hidden='true' />
            </InputGroupAddon>
            <InputGroupInput aria-label='Search mail' placeholder='Search mail...' />
          </InputGroup>
        </div>
        <Tabs value={tab} onValueChange={setTab} className='min-h-0 flex-1 gap-0'>
          <TabsList variant='underline' aria-label='Message filter' className='border-ui-border border-b px-3'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='unread'>Unread</TabsTrigger>
            <TabsTrigger value='starred'>Starred</TabsTrigger>
            <TabsTrigger value='files'>Files</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
            {list.length ? (
              <ul>
                {list.map((message) => (
                  <MessageRow key={message.id} message={message} selected={message.id === selected?.id} onSelect={select} />
                ))}
              </ul>
            ) : (
              <p className='text-text-muted p-6 text-center text-sm'>No messages here.</p>
            )}
          </TabsContent>
        </Tabs>
      </section>
      <section aria-label='Message' className={`min-w-0 flex-1 flex-col @2xl:flex ${reading ? 'flex' : 'hidden'}`}>
        <AppShellHeader bordered className='gap-1 px-2'>
          {isMobile ? <SidebarTrigger /> : null}
          <IconAction label='Back to messages' icon='ArrowLeft' onClick={() => setReading(false)} className='@2xl:hidden' />
          <span className='hidden @lg:contents'>
            <IconAction label='Previous message' icon='ChevronLeft' onClick={() => list[index - 1] && select(list[index - 1].id)} />
            <IconAction label='Next message' icon='ChevronRight' onClick={() => list[index + 1] && select(list[index + 1].id)} />
          </span>
          <h2 className='min-w-0 flex-1 truncate ps-1 text-sm font-semibold'>{selected?.subject ?? 'No message selected'}</h2>
          {selected ? (
            <div role='toolbar' aria-label='Message actions' className='flex shrink-0 items-center gap-0.5'>
              <Button variant='soft' size='sm' className='hidden @3xl:inline-flex'>
                <RegistryIcon lucide='CornerUpLeft' aria-hidden='true' />
                Reply all
              </Button>
              <IconAction
                label={selected.starred ? 'Unstar message' : 'Star message'}
                icon='Star'
                pressed={Boolean(selected.starred)}
                onClick={() => update({ starred: !selected.starred })}
                className={selected.starred ? 'text-warning [&_svg]:fill-current' : ''}
              />
              <span className='hidden @lg:contents'>
                <IconAction label='Bookmark message' icon='Bookmark' />
              </span>
              <IconAction label='Delete message' icon='Trash2' onClick={remove} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon-sm' aria-label='More options'>
                    <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-52'>
                  <DropdownMenuItem onSelect={() => update({ unread: true })}>
                    Mark as unread
                    <DropdownMenuShortcut>U</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Mute thread</DropdownMenuItem>
                  <DropdownMenuItem>
                    Snooze
                    <DropdownMenuShortcut>S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => update({ folder: 'archive' })}>Move to Archive</DropdownMenuItem>
                  <DropdownMenuItem>Add label</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant='destructive' onSelect={() => update({ folder: 'spam' })}>Report spam</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
          <span aria-hidden='true' className='bg-ui-border mx-1 h-4 w-px' />
          <IconAction
            label={contextOpen ? 'Hide calendar panel' : 'Show calendar panel'}
            icon='PanelRightOpen'
            pressed={contextOpen}
            onClick={() => onContext(!contextOpen)}
          />
        </AppShellHeader>
        <AppShellBody className='@container min-h-0 flex-1 overflow-y-auto pt-4'>
          <AppShellPlaceholderGrid preset='dashboard' />
        </AppShellBody>
      </section>
    </div>
  );
}

function CalendarView({ section }) {
  const { isMobile } = useSidebar();
  const [month, setMonth] = useState(TODAY.getMonth());
  const [view, setView] = useState('week');
  const title = { calendar: 'Calendar', schedule: 'Schedule', contacts: 'Contacts', notifications: 'Notifications' }[section];
  return (
    <>
      <AppShellHeader bordered>
        {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
        <h2 className='truncate text-base font-semibold'>
          <span className='sr-only'>{title}: </span>
          {MONTHS[month]} 2026
        </h2>
        <span aria-hidden='true' className='hidden -space-x-1 @md:flex'>
          {['bg-info', 'bg-success', 'bg-discovery', 'bg-warning'].map((tone) => (
            <span key={tone} className={`ring-ui-background size-2.5 rounded-full ring-2 ${tone}`} />
          ))}
        </span>
        <div className='ms-auto flex items-center gap-1'>
          <IconAction label='Previous month' icon='ChevronLeft' onClick={() => setMonth((value) => Math.max(0, value - 1))} />
          <IconAction label='Next month' icon='ChevronRight' onClick={() => setMonth((value) => Math.min(11, value + 1))} />
          <Button variant='outline' size='sm' className='hidden @md:inline-flex' onClick={() => setMonth(TODAY.getMonth())}>Today</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' aria-label={`View: ${view}`} className='capitalize'>
                {view}
                <RegistryIcon lucide='ChevronDown' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuRadioGroup value={view} onValueChange={setView}>
                <DropdownMenuRadioItem value='day'>Day</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='week'>Week</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='month'>Month</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size='sm' className='hidden @xl:inline-flex'>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
            New Event
          </Button>
        </div>
      </AppShellHeader>
      <AppShellBody className='pt-4'>
        <AppShellPlaceholderGrid preset='dashboard' />
      </AppShellBody>
    </>
  );
}

function MailCalendarShell() {
  const frame = useAppShellFrame();
  const [section, setSection] = useState('mail');
  const [folder, setFolder] = useState('inbox');
  const [messages, setMessages] = useState(initialMessages);
  const [contextOpen, setContextOpen] = useState(false);
  // The calendar panel starts open once the window is wide enough to keep the message readable.
  const decided = useRef(false);
  useEffect(() => {
    if (decided.current || !frame?.width) return;
    decided.current = true;
    setContextOpen(frame.width >= 1200);
  }, [frame?.width]);
  return (
    <SidebarProvider shortcut={false} style={{ '--sidebar-width': '18rem' }}>
      <Sidebar collapsible='icon'>
        <div className='flex h-full min-h-0'>
          <SectionRail section={section} onSection={setSection} />
          <div className='flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden'>
            <SidebarHeader className='sr-only'>
              <h2>{sections.find((entry) => entry.id === section).label}</h2>
            </SidebarHeader>
            <SectionPanel section={section} folder={folder} onFolder={setFolder} />
          </div>
        </div>
        <SidebarRail handle />
      </Sidebar>
      <AppShellPanel inset={false}>
        <div className='flex min-h-0 flex-1'>
          <div className='flex min-w-0 flex-1 flex-col'>
            {section === 'mail' ? (
              <MailView messages={messages} setMessages={setMessages} folder={folder} contextOpen={contextOpen} onContext={setContextOpen} />
            ) : (
              <CalendarView section={section} />
            )}
          </div>
          {section === 'mail' ? (
            <aside
              aria-label='Calendar'
              inert={!contextOpen}
              data-state={contextOpen ? 'open' : 'closed'}
              className={`bg-ui-background border-ui-border absolute inset-y-0 end-0 z-10 flex max-w-[calc(100%-2rem)] overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none @5xl:static @5xl:max-w-none ${
                contextOpen ? 'w-70 border-s shadow-lg @5xl:shadow-none' : 'w-0'
              }`}
            >
              <div className='flex w-70 shrink-0 flex-col'>
                <div className='border-ui-border flex h-12 shrink-0 items-center border-b ps-3 pe-2'>
                  <h2 className='text-sm font-semibold'>Calendar</h2>
                  <IconAction label='Close calendar panel' icon='X' onClick={() => setContextOpen(false)} className='ms-auto' />
                </div>
                <CalendarContext idPrefix='app-shell-4-context' cellSize='2.25rem' />
              </div>
            </aside>
          ) : null}
        </div>
      </AppShellPanel>
    </SidebarProvider>
  );
}

export function Pattern() {
  return (
    <AppShellFrame surface='default'>
      <MailCalendarShell />
    </AppShellFrame>
  );
}
