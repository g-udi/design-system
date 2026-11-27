'use client';
import { IconTile } from '@gaudi/design-system/core/Icon';
import { Field, FieldInput, FieldLabel, Label } from '@gaudi/design-system/core/Field';
import { createContext, useContext, useState } from 'react';
import { DialogRoot as Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@gaudi/design-system/core/Dialog';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@gaudi/design-system/core/EmptyState';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import Textarea from '@gaudi/design-system/core/Textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import { AvatarRoot as Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Item } from '@gaudi/design-system/core/Item';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gaudi/design-system/core/Input';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const portrait = (path) => `/avatars/${path}.svg`;
const me = { name: 'Noor Haddad', email: 'noor@gaudi.dev', photo: portrait('person-19') };
// One fixed day keeps server and client markup identical.
const TODAY = new Date(2026, 5, 10);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DigestContext = createContext(null);
const dateKey = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');

const sections = [
  { id: 'mail', label: 'Digests', icon: 'NewspaperIcon', unread: true },
  { id: 'calendar', label: 'Reading plan', icon: 'CalendarRange' },
  { id: 'contacts', label: 'Authors', icon: 'BookUser' },
  { id: 'notifications', label: 'Activity', icon: 'Bell', unread: true }
];
const folders = [
  { id: 'inbox', label: 'Latest issues', icon: 'Inbox', badge: { label: 5, variant: 'secondary' } },
  { id: 'starred', label: 'Saved', icon: 'Bookmark' },
  { id: 'drafts', label: 'My notes', icon: 'Pencil', badge: { label: 1, variant: 'secondary' } },
  { id: 'sent', label: 'Shared with me', icon: 'Share2' },
  { id: 'archive', label: 'Finished', icon: 'BookmarkCheck' },
  { id: 'spam', label: 'Muted', icon: 'BellOff' },
  { id: 'trash', label: 'Trash', icon: 'Trash2' }
];
const mailLabels = [
  { id: 'label-essays', label: 'Essays', dot: 'neutral' },
  { id: 'label-research', label: 'Research', dot: 'violet' },
  { id: 'label-science', label: 'Science', dot: 'success' },
  { id: 'label-culture', label: 'Culture', dot: 'warning' }
];
const LABEL_TONES = { Essays: 'secondary', Research: 'discovery-light', Science: 'success-light', Culture: 'warning-light', Papers: 'info-light' };
const initialMessages = [
  { id: 'm1', folder: 'inbox', from: 'The Marginalia Letter', photo: portrait('person-20'), time: '7:05 AM', unread: true, starred: true, minutes: 14, subject: 'Why readers kept writing in the margins', preview: 'This week: a short history of annotation, from glossed manuscripts to shared highlights, and what it tells us about reading as a conversation…', label: 'Essays', people: ['person-41', 'person-24'] },
  { id: 'm2', folder: 'inbox', from: 'Slow Science Weekly', photo: portrait('person-41'), time: '6:30 AM', unread: true, minutes: 9, subject: 'Replication, one decade on', preview: 'Three labs re-ran the classic memory studies. The headline results held up better than expected, but the effect sizes shrank…', label: 'Science', file: ['replication-notes.pdf', '820 KB'] },
  { id: 'm3', folder: 'inbox', from: 'Field Notes on Cities', photo: portrait('person-24'), time: 'Yesterday', unread: true, minutes: 11, subject: 'The library as a third place', preview: 'Reading rooms are filling up again. We visited five branches to see how quiet space, events and late hours change who comes in…', label: 'Culture', actions: ['Save to library', 'Plan a session'] },
  { id: 'm4', folder: 'inbox', from: 'Paper digest', icon: 'GraduationCap', tile: 'bg-ui-foreground text-ui-background', time: 'Yesterday', unread: true, minutes: 6, subject: 'Five new papers on retrieval and memory', preview: 'Picked from this week’s preprints: spaced repetition at scale, forgetting curves in note apps, and a survey of personal knowledge graphs.', label: 'Papers' },
  { id: 'm5', folder: 'inbox', from: 'Highlights recap', icon: 'Sparkles', time: 'Mon', minutes: 3, subject: 'Your week in 42 highlights', preview: 'You read 6 articles and 2 chapters. Most highlighted: “Attention is the beginning of devotion.”', label: 'Research' },
  { id: 'm6', folder: 'inbox', from: 'Ink & Archive', photo: portrait('person-50'), time: 'Mon', starred: true, minutes: 18, subject: 'Letters from a lost press', preview: 'An archive of a small 1920s publisher surfaced last spring. Here is what the correspondence reveals about editing by post…', label: 'Essays', file: ['press-letters.epub', '2.4 MB'] },
  { id: 'm7', folder: 'sent', from: 'From: Lina Sato', photo: portrait('person-20'), time: 'Sun', minutes: 7, subject: 'Shared: notes on deep work', preview: 'Lina shared her annotated copy with the study group.' },
  { id: 'm8', folder: 'drafts', from: 'My note', photo: me.photo, time: 'Sat', minutes: 2, subject: 'Themes for the October reading list', preview: 'Memory, cities, craft. Maybe pair the press letters with the marginalia issue…' },
  { id: 'm9', folder: 'archive', from: 'Commonplace', photo: portrait('person-25'), time: 'Oct 2', minutes: 12, subject: 'Keeping a commonplace book', preview: 'Why the oldest note-taking habit still beats most apps.' }
];
const calendars = [
  { account: 'My library', items: [{ id: 'work', label: 'Deep reading', tone: 'bg-info' }, { id: 'personal', label: 'Papers', tone: 'bg-success' }, { id: 'meetings', label: 'Review notes', tone: 'bg-discovery' }] },
  { account: 'Study group', items: [{ id: 'family', label: 'Seminars', tone: 'bg-warning' }, { id: 'birthdays', label: 'Author talks', tone: 'bg-attention' }] }
];
const upNext = [
  { id: 'morning', plan: 'work', day: '2026-06-10', title: 'Morning pages · marginalia issue', time: '7:30 AM to 8:00 AM', tone: 'bg-info', people: [] },
  { id: 'papers', plan: 'personal', day: '2026-06-10', title: 'Paper hour · retrieval and memory', time: '12:30 PM to 1:30 PM', tone: 'bg-success', people: ['person-41'] },
  { id: 'seminar', plan: 'family', day: '2026-06-12', title: 'Study group · Invisible Cities ch. 3', time: '6:00 PM to 7:00 PM', tone: 'bg-warning', people: ['person-20', 'person-24', 'person-50'] }
];
const contacts = [
  { team: 'Essayists', people: [
    { name: 'Lina Sato', role: 'The Marginalia Letter', photo: 'person-20', online: true },
    { name: 'Hana Mori', role: 'Field Notes on Cities', photo: 'person-23', online: true }
  ] },
  { team: 'Researchers', people: [
    { name: 'Elif Demir', role: 'Slow Science Weekly', photo: 'person-07', online: false },
    { name: 'Tomas Reyes', role: 'Paper digest editor', photo: 'person-41', online: true },
    { name: 'Owen Price', role: 'Memory and learning', photo: 'person-44', online: false }
  ] },
  { team: 'Archivists', people: [
    { name: 'Clara Vos', role: 'Ink & Archive', photo: 'person-24', online: false },
    { name: 'Ravi Menon', role: 'Commonplace', photo: 'person-46', online: true }
  ] }
];
const initialInvites = [
  { id: 'seminar', from: 'Lina Sato', photo: 'person-20', title: 'Lina Sato invited you to a close reading of Invisible Cities', when: 'Fri, Jun 12 · 6:00 to 7:00 PM', time: '5 min ago', unread: true },
  { id: 'session', from: 'Reminder', title: 'Paper hour starts in 15 minutes', when: 'Today · 12:30 to 1:30 PM', time: '15 min ago', unread: true, reminder: true },
  { id: 'highlight', from: 'Tomas Reyes', photo: 'person-41', title: 'Tomas Reyes replied to your highlight in “Replication, one decade on”', time: '1 hour ago', unread: true, info: true },
  { id: 'shared', from: 'Clara Vos', photo: 'person-24', title: 'Clara Vos added 3 sources to the Press Letters collection', time: '2 hours ago', info: true }
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

function IconAction({ label, icon, onClick, pressed, disabled, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={label} aria-pressed={pressed} disabled={disabled} onClick={onClick} className={className}>
          <RegistryIcon lucide={icon} aria-hidden='true' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionLabel({ children, count }) {
  return (
    <div className='text-text-muted flex items-center justify-between px-3 pt-3 pb-1 text-xs font-medium '>
      {children}
      {count ? <Badge variant='outline' size='sm'>{count}</Badge> : null}
    </div>
  );
}

/** Mini calendar, reading plans, the next sessions and quick actions: the Reading plan panel and the digest context panel. */
function CalendarContext({ idPrefix, cellSize }) {
  const { selected, setSelected, plans, sessions, visible, setVisible, openDialog } = useContext(DigestContext);
  const listed = sessions.filter(event => visible.includes(event.plan) && event.day >= dateKey(selected)).sort((a, b) => a.day.localeCompare(b.day));
  const toggle = (id, on) => setVisible((list) => (on ? [...list, id] : list.filter((entry) => entry !== id)));
  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain'>
      <div className='border-ui-sidebar-border border-b p-2'>
        <Calendar
          mode='single'
          selected={selected}
          onSelect={(day) => day && setSelected(day)}
          month={new Date(selected.getFullYear(), selected.getMonth(), 1)}
          onMonthChange={setSelected}
          modifiers={{ busy: sessions.filter(event => visible.includes(event.plan)).map(event => new Date(event.day + 'T12:00:00')) }}
          modifiersClassNames={{
            busy: 'relative after:pointer-events-none after:absolute after:top-1 after:start-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-current after:opacity-60'
          }}
          className='mx-auto bg-transparent p-0'
          style={{ '--cell-size': cellSize }}
        />
      </div>
      <section aria-labelledby={`${idPrefix}-calendars`} className='border-ui-sidebar-border border-b pb-2'>
        <SectionLabel><span id={`${idPrefix}-calendars`}>Reading plans</span></SectionLabel>
        <div className='px-1.5'>
          {plans.map((group, index) => (
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
                        <StatusDot className={item.tone} />
                        <Checkbox id={id} checked={visible.includes(item.id)} onCheckedChange={(on) => toggle(item.id, on === true)} />
                        <Label htmlFor={id} className='flex-1 truncate text-sm font-medium'>{item.label}</Label>
                      </li>
                    );
                  })}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          ))}
          <Button variant='ghost' size='sm' className='text-text-muted w-full justify-start px-1.5' onClick={() => openDialog('plan')}>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
            Add plan
          </Button>
        </div>
      </section>
      <section aria-labelledby={`${idPrefix}-next`} className='border-ui-sidebar-border border-b pb-2'>
        <SectionLabel count={listed.length}><span id={`${idPrefix}-next`}>Next sessions</span></SectionLabel>
        <ul className='grid gap-0.5 px-1.5'>
          {listed.map((event) => (
            <li key={event.id}>
              <Item asChild size='sm' className='hover:bg-ui-sidebar-accent focus-visible:ring-ui-sidebar-ring flex-nowrap items-stretch gap-2.5 rounded-(--ds-radius-control) px-1.5 py-1.5 text-start outline-hidden focus-visible:ring-2'>
                <button type='button' onClick={() => openDialog('sessionDetail', event)}>
                  <span aria-hidden='true' className={`w-1 shrink-0 rounded-full ${event.tone}`} />
                  <span className='grid min-w-0 flex-1'>
                    <span className='truncate text-sm font-medium'>{event.title}</span>
                    <span className='text-text-muted text-xs'>{event.day} · {event.time}</span>
                  </span>
                  <Portraits people={event.people} />
                </button>
              </Item>
            </li>
          ))}
        </ul>
      </section>
      <div className='grid gap-1.5 p-3'>
        <Button size='sm' onClick={() => openDialog('session')}>
          <RegistryIcon lucide='Plus' aria-hidden='true' />
          Plan a session
        </Button>
        <Button asChild size='sm' variant='outline'><a download='reading-plan.txt' href={'data:text/plain;charset=utf-8,' + encodeURIComponent(listed.map(e => [e.day, e.time, e.title].join(' · ')).join('\n'))}>
          <RegistryIcon lucide='Download' aria-hidden='true' />
          Download reading plan
        </a></Button>
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
      <SidebarHeader className='items-center gap-2 p-0'>
        <IconTile size='sm' variant='solid' aria-hidden='true' className='bg-ui-foreground text-ui-background'><RegistryIcon lucide='BookOpen' className='size-4' /></IconTile>
        <SidebarTrigger />
      </SidebarHeader>
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
              {entry.unread ? <StatusDot className='bg-text absolute top-1.5 end-1.5' /> : null}
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
            <AvatarFallback>NH</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='grid font-normal leading-tight'>
          <span className='font-medium'>{me.name}</span>
          <span className='text-text-muted text-xs'>{me.email}</span>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MailPanel({ folder, onFolder }) {
  const { messages } = useContext(DigestContext);
  const items = folders.map(item => ({ ...item, badge: ['inbox', 'drafts'].includes(item.id)
    ? { label: messages.filter(message => message.folder === item.id && (item.id === 'drafts' || message.unread)).length, variant: 'secondary' }
    : undefined }));
  return (
    <>
      <PanelHeading title='Digests'>
      </PanelHeading>
      <div className='border-ui-sidebar-border grid gap-1.5 border-b px-3 py-2.5 text-xs'>
        <div className='flex justify-between'>
          <span className='font-medium'>Weekly reading goal</span>
          <span className='text-text-muted'>3 h 10 of 5 h</span>
        </div>
        <Progress value={63} aria-label='Weekly reading goal' className='bg-ui-muted h-1.5 rounded-full' />
      </div>
      <SidebarContent role='navigation' aria-label='Digest folders' className='gap-0'>
        <AppShellNav label='Library' items={items} value={folder} onValueChange={onFolder} />
        <AppShellNav label='Topics' collapsible items={mailLabels} value={folder} onValueChange={onFolder} />
      </SidebarContent>
      <SidebarFooter className='border-ui-sidebar-border text-text-muted border-t text-xs'>
        <span className='flex items-center gap-1.5 p-1'>
          <RegistryIcon lucide='Flame' aria-hidden='true' className='text-warning size-3.5' />
          12-day reading streak
        </span>
      </SidebarFooter>
    </>
  );
}

function ContactsPanel() {
  const { messages, openIssue } = useContext(DigestContext);
  const [query, setQuery] = useState('');
  const match = (person) => `${person.name} ${person.role}`.toLowerCase().includes(query.toLowerCase());
  const total = contacts.flatMap((group) => group.people);
  return (
    <>
      <PanelHeading title='Authors'>
      </PanelHeading>
      <div className='p-2'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput aria-label='Search authors' placeholder='Search authors...' value={query} onChange={(event) => setQuery(event.target.value)} />
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
                {people.map((person) => {
                  const latest = messages.find(message => !['trash', 'spam'].includes(message.folder) && person.role.includes(message.from));
                  return (
                  <li key={person.name} className='hover:bg-ui-sidebar-accent flex items-center gap-2.5 rounded-(--ds-radius-control) px-1.5 py-1.5'>
                    <span className='relative shrink-0'>
                      <Avatar className='size-8'>
                        <AvatarImage src={portrait(person.photo)} alt='' />
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                      <StatusDot
                        label={person.online ? 'published today' : 'no new issue'}
                        className={`ring-ui-sidebar absolute -end-0.5 -bottom-0.5 size-2.5 ring-2 ${person.online ? 'bg-success' : 'bg-text-muted'}`}
                      />
                    </span>
                    <span className='grid min-w-0 flex-1 leading-tight'>
                      <span className='truncate text-sm font-medium'>{person.name}</span>
                      <span className='text-text-muted truncate text-xs'>{person.role}</span>
                    </span>
                    {latest && <IconAction label={`Open ${person.name}’s latest issue`} icon='BookOpen' onClick={() => openIssue(latest)} />}
                  </li>
                ); })}
              </ul>
            </section>
          );
        })}
      </div>
      <div className='border-ui-sidebar-border text-text-muted flex items-center justify-between border-t px-3 py-2 text-xs'>
        <span>{total.length} authors you follow</span>
        <span className='flex items-center gap-1.5'>
          <StatusDot className='bg-success' />
          {total.filter((person) => person.online).length} published today
        </span>
      </div>
    </>
  );
}

function NotificationsPanel() {
  const { items, setItems } = useContext(DigestContext);
  const unread = items.filter((item) => item.unread).length;
  const respond = (id, answer) => setItems((list) => list.map((item) => (item.id === id ? { ...item, answer, unread: false } : item)));
  return (
    <>
      <PanelHeading title='Activity' count={unread || null}>
        <IconAction label='Mark all as read' icon='CheckCheck' onClick={() => setItems((list) => list.map((item) => ({ ...item, unread: false })))} />
      </PanelHeading>
      <ul aria-label='Reading activity' className='flex-1 overflow-y-auto overscroll-contain'>
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
                <Badge variant='outline' size='lg' className='text-text-muted gap-1.5 font-normal'>
                  <RegistryIcon lucide='Calendar' aria-hidden='true' className='size-3.5' />
                  {item.when}
                </Badge>
              ) : null}
              {!item.info && !item.reminder ? (
                item.answer ? (
                  <Badge variant={item.answer === 'Going' ? 'success-light' : 'secondary'} className='w-fit'>{item.answer}</Badge>
                ) : (
                  <div className='flex gap-1.5'>
                    <Button size='xs' onClick={() => respond(item.id, 'Going')}>Join</Button>
                    <Button size='xs' variant='outline' onClick={() => respond(item.id, 'Declined')}>Not this time</Button>
                  </div>
                )
              ) : null}
              <span className='text-text-muted text-xs'>{item.time}</span>
            </div>
            {item.unread ? <StatusDot className='bg-ui-foreground absolute top-4 end-3' /> : null}
          </li>
        ))}
      </ul>
    </>
  );
}

function SectionPanel({ section, folder, onFolder }) {
  const { openDialog } = useContext(DigestContext);
  if (section === 'mail') return <MailPanel folder={folder} onFolder={onFolder} />;
  if (section === 'contacts') return <ContactsPanel />;
  if (section === 'notifications') return <NotificationsPanel />;
  return (
    <>
      <PanelHeading title='Reading plan'>
        <IconAction label='Add reading plan' icon='Plus' onClick={() => openDialog('plan')} />
      </PanelHeading>
      <CalendarContext idPrefix='digest-inbox-panel' cellSize='1.875rem' />
    </>
  );
}

function MessageRow({ message, selected, onSelect, onSave, onPlan }) {
  return (
    <li className={`border-ui-border relative border-b ${selected ? 'bg-ui-muted' : ''}`}>
      <Button
        variant='ghost'
        aria-current={selected ? 'true' : undefined}
        onClick={() => onSelect(message.id)}
        className='absolute inset-0 h-full w-full rounded-none p-0 focus-visible:ring-inset'
      >
        <span className='sr-only'>
          {message.from}: {message.subject}
          {message.unread ? ', unread' : ''}
        </span>
      </Button>
      <div className='pointer-events-none flex gap-3 py-3 ps-6 pe-3'>
        {message.unread ? <StatusDot className='bg-ui-foreground absolute top-5 start-2.5' /> : null}
        {message.icon ? (
          <IconTile size='sm' variant='solid' aria-hidden='true' className={message.tile || 'bg-ui-muted'}><RegistryIcon lucide={message.icon} className='size-4' /></IconTile>
        ) : (
          <Avatar className='size-8'>
            <AvatarImage src={message.photo} alt='' />
            <AvatarFallback>{message.from[0]}</AvatarFallback>
          </Avatar>
        )}
        <div aria-hidden='true' className='grid min-w-0 flex-1 gap-0.5'>
          <div className='flex items-center gap-1.5'>
            <span className={`truncate text-sm ${message.unread ? 'font-semibold' : 'font-medium'}`}>{message.from}</span>
            {message.starred ? <RegistryIcon lucide='Bookmark' className='text-info ms-auto size-3.5 shrink-0 fill-current' /> : null}
            {message.file ? <RegistryIcon lucide='Paperclip' className={`text-text-muted size-3.5 shrink-0 ${message.starred ? '' : 'ms-auto'}`} /> : null}
            <span className={`text-text-muted shrink-0 text-xs ${message.starred || message.file ? '' : 'ms-auto'}`}>{message.time}</span>
          </div>
          <span className='truncate text-sm'>{message.subject}</span>
          <span className='text-text-muted truncate text-xs'>{message.preview}</span>
          {message.label || message.people || message.minutes ? (
            <div className='mt-1 flex items-center gap-1.5'>
              <Portraits people={message.people} size='size-4' />
              {message.label ? <Badge variant={LABEL_TONES[message.label]} size='sm'>{message.label}</Badge> : null}
              {message.minutes ? <span className='text-text-muted text-xs'>{message.minutes} min read</span> : null}
            </div>
          ) : null}
          {message.file ? (
            <Badge variant='outline' size='lg' className='mt-1 gap-1.5 font-normal'>
              <RegistryIcon lucide='Paperclip' className='size-3' />
              <span className='max-w-32 truncate font-medium'>{message.file[0]}</span>
              <span className='text-text-muted'>({message.file[1]})</span>
            </Badge>
          ) : null}
        </div>
      </div>
      {message.actions ? (
        <div className='relative flex gap-1.5 ps-17 pe-3 pb-3'>
          <Button size='xs' aria-pressed={Boolean(message.starred)} onClick={onSave}>{message.starred ? 'Saved to library' : message.actions[0]}</Button>
          <Button size='xs' variant='outline' onClick={onPlan}>{message.actions[1]}</Button>
        </div>
      ) : null}
    </li>
  );
}

function MailView({ messages, setMessages, folder, contextOpen, onContext }) {
  const { isMobile } = useSidebar();
  const [tab, setTab] = useState('all');
  const { selectedId, setSelectedId, reading, setReading, openDialog } = useContext(DigestContext);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const inFolder = messages.filter((message) => (folder === 'starred' ? message.starred && !['trash', 'spam'].includes(message.folder)
    : folder.startsWith('label-') ? message.folder === 'inbox' && 'label-' + message.label?.toLowerCase() === folder : message.folder === folder));
  const matches = inFolder.filter(message => [message.subject, message.from, message.preview].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  const list = matches.filter((message) => (tab === 'unread' ? message.unread : tab === 'starred' ? message.starred : tab === 'files' ? message.file : true));
  if (sort === 'oldest') list.reverse();
  if (sort === 'sender') list.sort((a, b) => a.from.localeCompare(b.from));
  if (sort === 'length') list.sort((a, b) => a.minutes - b.minutes);
  const selected = inFolder.find((message) => message.id === selectedId) ?? list[0];
  const index = list.findIndex((message) => message.id === selected?.id);
  const folderLabel = [...folders, ...mailLabels].find((entry) => entry.id === folder)?.label ?? 'Latest issues';
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
        aria-label={`${folderLabel} issues`}
        className={`border-ui-border min-w-0 flex-col @2xl:flex @2xl:w-80 @2xl:shrink-0 @2xl:border-e @5xl:w-88 ${reading ? 'hidden' : 'flex flex-1'}`}
      >
        <div className='flex h-12 shrink-0 items-center gap-2 px-3'>
          {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
          <h2 className='text-sm font-semibold'>{folderLabel}</h2>
          {unread ? <Badge variant='outline' size='sm' className='rounded-full'>{unread}</Badge> : null}
          <div className='ms-auto flex items-center gap-0.5'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon-sm' aria-label='Sort and filter'>
                  <RegistryIcon lucide='Filter' aria-hidden='true' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value='newest'>Date (newest first)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='oldest'>Date (oldest first)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='sender'>Publication</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='length'>Reading time</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setMessages((all) => all.map((message) => ({ ...message, unread: false })))}>
                  <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
                  Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <IconAction label='New note' icon='SquarePen' onClick={() => openDialog('note')} />
          </div>
        </div>
        <div className='px-3 pb-2'>
          <InputGroup>
            <InputGroupAddon>
              <RegistryIcon lucide='Search' aria-hidden='true' />
            </InputGroupAddon>
            <InputGroupInput aria-label='Search digests' value={search} onChange={event => setSearch(event.target.value)} placeholder='Search issues, authors, highlights...' />
          </InputGroup>
        </div>
        <Tabs value={tab} onValueChange={setTab} className='min-h-0 flex-1 gap-0'>
          <TabsList variant='underline' aria-label='Issue filter' className='border-ui-border border-b px-3'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='unread'>Unread</TabsTrigger>
            <TabsTrigger value='starred'>Saved</TabsTrigger>
            <TabsTrigger value='files'>Attachments</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
            {list.length ? (
              <ul>
                {list.map((message) => (
                  <MessageRow key={message.id} message={message} selected={message.id === selected?.id} onSelect={select}
                    onSave={() => setMessages(all => all.map(entry => entry.id === message.id ? { ...entry, starred: !entry.starred } : entry))}
                    onPlan={() => openDialog('session', message)} />
                ))}
              </ul>
            ) : (
              <p className='text-text-muted p-6 text-center text-sm'>Nothing to read here.</p>
            )}
          </TabsContent>
        </Tabs>
      </section>
      <section aria-label='Issue' className={`min-w-0 flex-1 flex-col @2xl:flex ${reading ? 'flex' : 'hidden'}`}>
        <AppShellHeader bordered className='gap-1 px-2'>
          {isMobile ? <SidebarTrigger /> : null}
          <IconAction label='Back to issues' icon='ArrowLeft' onClick={() => setReading(false)} className='@2xl:hidden' />
          <span className='hidden @lg:contents'>
            <IconAction label='Previous issue' icon='ChevronLeft' disabled={index < 1} onClick={() => list[index - 1] && select(list[index - 1].id)} />
            <IconAction label='Next issue' icon='ChevronRight' disabled={index < 0 || index >= list.length - 1} onClick={() => list[index + 1] && select(list[index + 1].id)} />
          </span>
          <span className='min-w-0 flex-1 truncate ps-1 text-sm font-semibold'>{selected?.from ?? 'Issue'}</span>
          {selected ? (
            <div role='toolbar' aria-label='Issue actions' className='flex shrink-0 items-center gap-0.5'>
              <Button variant='soft' size='sm' className='hidden @3xl:inline-flex' onClick={() => openDialog('highlight', selected)}>
                <RegistryIcon lucide='Quote' aria-hidden='true' />
                Highlights
              </Button>
              <IconAction
                label={selected.starred ? 'Remove from saved' : 'Save issue'}
                icon='Bookmark'
                pressed={Boolean(selected.starred)}
                onClick={() => update({ starred: !selected.starred })}
                className={selected.starred ? 'text-info [&_svg]:fill-current' : ''}
              />
              <span className='hidden @lg:contents'>
                <IconAction label='Add to reading plan' icon='CalendarClock' onClick={() => openDialog('session', selected)} />
              </span>
              <IconAction label='Delete issue' icon='Trash2' onClick={remove} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon-sm' aria-label='More options'>
                    <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-52'>
                  <DropdownMenuItem onSelect={() => update({ unread: true })}>
                    Mark as unread
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openDialog('session', selected)}>Plan a reading session</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openDialog('highlight', selected)}>Edit highlight</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => update({ folder: 'archive' })}>Mark as finished</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant='destructive' onSelect={() => update({ folder: 'spam' })}>Mute issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
          <span aria-hidden='true' className='bg-ui-border mx-1 h-4 w-px' />
          <IconAction
            label={contextOpen ? 'Hide reading plan' : 'Show reading plan'}
            icon='PanelRightOpen'
            pressed={contextOpen}
            onClick={() => onContext(!contextOpen)}
          />
        </AppShellHeader>
        <AppShellBody className='@container min-h-0 flex-1 overflow-y-auto pt-4'>
          {selected ? (
            <article className='mx-auto grid w-full max-w-2xl gap-4 px-4 pb-6 @md:px-8'>
              <p className='text-text-muted text-sm'>{selected.from} · {selected.time}</p>
              <h3 className='font-display text-2xl font-semibold text-balance'>{selected.subject}</h3>
              <p className='text-base leading-relaxed'>{selected.preview.replace(/…$/, '.')}</p>
              {selected.label && <Badge className='w-fit' variant={LABEL_TONES[selected.label]}>{selected.label}</Badge>}
              {selected.highlight && <blockquote className='border-ui-border border-s-2 ps-4 text-sm'>{selected.highlight}</blockquote>}
              <Button className='w-fit' variant='outline' size='sm' onClick={() => openDialog('highlight', selected)}>{selected.highlight ? 'Edit saved highlight' : 'Save a highlight'}</Button>
            </article>
          ) : <Empty><EmptyHeader><EmptyTitle>No issue selected</EmptyTitle><EmptyDescription>Open an issue from the list to read it.</EmptyDescription></EmptyHeader></Empty>}
        </AppShellBody>
      </section>
    </div>
  );
}

function CalendarView({ section }) {
  const { isMobile } = useSidebar();
  const { selected, setSelected, sessions, visible, openDialog } = useContext(DigestContext);
  const month = selected.getMonth();
  const year = selected.getFullYear();
  const inMonth = sessions.filter(event => event.day.startsWith(dateKey(selected).slice(0, 7)) && visible.includes(event.plan)).sort((a, b) => a.day.localeCompare(b.day));
  if (section !== 'calendar') return <>
    <AppShellHeader bordered>{isMobile && <SidebarTrigger />}<h1 className='font-semibold'>{section === 'contacts' ? 'Author directory' : 'Reading activity'}</h1></AppShellHeader>
    <AppShellBody>{section === 'contacts' ? <ContactsPanel /> : <NotificationsPanel />}</AppShellBody>
  </>;
  return <>
    <AppShellHeader bordered>
      {isMobile && <SidebarTrigger />}
      <h2 className='min-w-0 flex-1 truncate font-semibold'><span className='sr-only'>Reading plan: </span>{MONTHS[month]} {year}</h2>
      <IconAction label='Previous month' icon='ChevronLeft' onClick={() => setSelected(new Date(year, month - 1, 1))} />
      <IconAction label='Next month' icon='ChevronRight' onClick={() => setSelected(new Date(year, month + 1, 1))} />
      <Button size='sm' variant='outline' onClick={() => setSelected(TODAY)}>Today</Button>
    </AppShellHeader>
    <AppShellBody className='min-h-0 overflow-y-auto'>
      <section className='mx-auto grid w-full max-w-2xl gap-4 p-4 @md:p-6'>
        <div className='flex flex-wrap items-center justify-between gap-2'><h3 className='text-xl font-semibold'>Scheduled reading</h3><Button size='sm' onClick={() => openDialog('session')}>Plan a session</Button></div>
        {inMonth.length ? <ul className='grid gap-2'>{inMonth.map(event => <li key={event.id}>
          <Item asChild variant='outline'><button type='button' className='w-full text-start' onClick={() => openDialog('sessionDetail', event)}>
            <span className='grid gap-1'><span className='text-text-muted text-xs'>{event.day} · {event.time}</span><span className='text-sm font-medium'>{event.title}</span></span>
          </button></Item>
        </li>)}</ul> : <Empty><EmptyHeader><EmptyTitle>No sessions this month</EmptyTitle><EmptyDescription>Choose a date to plan your next read.</EmptyDescription></EmptyHeader></Empty>}
      </section>
    </AppShellBody>
  </>;
}

const dialogs = {
  plan: ['Add reading plan', 'Give related sessions a name.'],
  session: ['Plan a reading session', 'Choose a date for this reading.'],
  sessionDetail: ['Reading session', 'Your scheduled reading.'],
  note: ['New note', 'Save a note in My notes.'],
  highlight: ['Save a highlight', 'Keep a passage with its issue.']
};

function DigestDialog({ dialog, close, save, selected, plans }) {
  if (!dialog) return null;
  const { type, entry } = dialog;
  const [title, description] = dialogs[type];
  return <Dialog open onOpenChange={open => { if (!open) close(); }}>
    <DialogContent className='sm:max-w-md'>
      <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
      {type === 'sessionDetail' ? <div className='grid gap-2'><strong>{entry.title}</strong><p>{entry.day} · {entry.time}</p></div> :
        <form className='grid gap-3' onSubmit={event => { event.preventDefault(); save(new FormData(event.currentTarget)); }}>
          <Field><FieldLabel htmlFor='digest-title'>{type === 'highlight' ? 'Passage' : 'Title'}</FieldLabel>
            {type === 'highlight' ? <Textarea id='digest-title' name='title' required defaultValue={entry?.highlight || ''} /> :
              <FieldInput id='digest-title' name='title' required defaultValue={entry?.subject || ''} />}
          </Field>
          {type === 'session' && <>
            <Field><FieldLabel htmlFor='digest-date'>Date</FieldLabel><FieldInput id='digest-date' name='day' type='date' required defaultValue={dateKey(selected)} /></Field>
            <Field><FieldLabel htmlFor='digest-time'>Start time</FieldLabel><FieldInput id='digest-time' name='time' type='time' defaultValue='09:00' required /></Field>
            <Field><FieldLabel htmlFor='digest-plan'>Reading plan</FieldLabel><NativeSelect name='plan' id='digest-plan'>{plans.flatMap(group => group.items).map(plan => <NativeSelectOption key={plan.id} value={plan.id}>{plan.label}</NativeSelectOption>)}</NativeSelect></Field>
          </>}
          {type === 'note' && <Field><FieldLabel htmlFor='digest-note'>Note</FieldLabel><Textarea id='digest-note' name='note' required /></Field>}
          <DialogFooter><Button variant='outline' onClick={close} type='button'>Cancel</Button><Button type='submit'>Save</Button></DialogFooter>
        </form>}
    </DialogContent>
  </Dialog>;
}

function DigestInboxShell() {
  const frame = useAppShellFrame();
  const [section, setSection] = useState('mail');
  const [folder, setFolder] = useState('inbox');
  const [messages, setMessages] = useState(initialMessages);
  const [contextOverride, setContextOpen] = useState(null);
  const [selected, setSelected] = useState(TODAY);
  const [sessions, setSessions] = useState(upNext);
  const [plans, setPlans] = useState(calendars);
  const [visible, setVisible] = useState(['work', 'personal', 'meetings', 'family']);
  const [items, setItems] = useState(initialInvites);
  const [selectedId, setSelectedId] = useState('m1');
  const [reading, setReading] = useState(false);
  const [dialog, setDialog] = useState(null);
  const openDialog = (type, entry) => setDialog({ type, entry });
  const openIssue = issue => {
    setSection('mail');
    setFolder(issue.folder);
    setSelectedId(issue.id);
    setReading(true);
    setMessages(list => list.map(item => item.id === issue.id ? { ...item, unread: false } : item));
  };
  const save = data => {
    const title = String(data.get('title')).trim();
    if (!title) return;
    const id = crypto.randomUUID();
    if (dialog.type === 'session') {
      const plan = String(data.get('plan'));
      const day = String(data.get('day'));
      setSessions(list => [...list, { id, plan, day, title, time: String(data.get('time')), tone: plans.flatMap(group => group.items).find(item => item.id === plan).tone, people: [] }]);
      setVisible(list => list.includes(plan) ? list : [...list, plan]);
      setSelected(new Date(day + 'T12:00:00'));
    } else if (dialog.type === 'plan') {
      setPlans(list => list.map((group, i) => i ? group : { ...group, items: [...group.items, { id, label: title, tone: 'bg-info' }] }));
      setVisible(list => [...list, id]);
    } else if (dialog.type === 'note') {
      setMessages(list => [{ id, folder: 'drafts', from: me.name, photo: me.photo, time: 'Now', minutes: 1, subject: title, preview: String(data.get('note')) }, ...list]);
      setFolder('drafts'); setSelectedId(id); setReading(true);
    } else {
      setMessages(list => list.map(item => item.id === dialog.entry.id ? { ...item, highlight: title } : item));
    }
    setDialog(null);
  };
  // Follow the available space until the reader explicitly opens or closes the plan.
  const contextOpen = contextOverride ?? (frame?.width >= 1344);
  return (
    <DigestContext.Provider value={{ selected, setSelected, sessions, plans, visible, setVisible, messages, items, setItems, openDialog, openIssue, selectedId, setSelectedId, reading, setReading }}>
    <SidebarProvider shortcut={false} style={{ '--sidebar-width': '18rem' }}>
      <Sidebar collapsible='icon'>
        <div className='flex h-full min-h-0'>
          <SectionRail section={section} onSection={setSection} />
          <div className='flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden'>
            <SidebarHeader className='sr-only'>
              <h2>{sections.find((entry) => entry.id === section).label}</h2>
            </SidebarHeader>
            <SectionPanel section={section} folder={folder} onFolder={value => { setFolder(value); setSelectedId(null); setReading(false); }} />
          </div>
        </div>
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
              aria-label='Reading plan'
              inert={!contextOpen}
              data-state={contextOpen ? 'open' : 'closed'}
              className={`bg-ui-background border-ui-border absolute inset-y-0 end-0 z-10 flex max-w-[calc(100%-2rem)] overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none @5xl:static @5xl:max-w-none ${
                contextOpen ? 'w-70 border-s shadow-lg @5xl:shadow-none' : 'w-0'
              }`}
            >
              <div className='flex w-full min-w-0 flex-col'>
                <div className='border-ui-border flex h-12 shrink-0 items-center border-b ps-3 pe-2'>
                  <h2 className='text-sm font-semibold'>Reading plan</h2>
                  <IconAction label='Close reading plan' icon='X' onClick={() => setContextOpen(false)} className='ms-auto' />
                </div>
                <CalendarContext idPrefix='digest-inbox-context' cellSize='clamp(1.75rem, 5cqw, 2.25rem)' />
              </div>
            </aside>
          ) : null}
        </div>
      </AppShellPanel>
    </SidebarProvider>
    <DigestDialog dialog={dialog} close={() => setDialog(null)} save={save} selected={selected} plans={plans} />
    </DigestContext.Provider>
  );
}

export function Pattern() {
  return (
    <AppShellFrame surface='default'>
      <DigestInboxShell />
    </AppShellFrame>
  );
}
