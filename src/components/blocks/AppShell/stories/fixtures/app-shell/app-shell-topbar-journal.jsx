'use client';
import { Separator } from '@gaudi/design-system/core/Separator';
import { GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';
import { useMemo, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import { AvatarRoot as Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@gaudi/design-system/core/Commander';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@gaudi/design-system/core/Sheet';
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
import { AppShellBody, AppShellFrame, AppShellPanel, useAppShellFrame } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNotifications } from '@gaudi/design-system/blocks/AppShell';
import { StatusDot } from '@gaudi/design-system/core/Pill';
import { CardRoot, CardContent } from '@gaudi/design-system/core/Card';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@gaudi/design-system/core/Item';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import { Label } from '@gaudi/design-system/core/Field';
import Input from '@gaudi/design-system/core/Input';
import Textarea from '@gaudi/design-system/core/Textarea';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const sections = [
  { id: 'today', label: 'Today', icon: 'Sun' },
  { id: 'entries', label: 'Entries', icon: 'BookText' },
  { id: 'prompts', label: 'Prompts', icon: 'Lightbulb' },
  { id: 'reviews', label: 'Reviews', icon: 'History' },
  { id: 'archive', label: 'Archive', icon: 'Archive' }
];
const groups = [
  {
    label: 'Write',
    items: [
      ["Today's Page", 'PenSquare'],
      ['All Entries', 'BookText'],
      ['Drafts', 'FileText'],
      ['Themes', 'Layers'],
      ['Templates', 'ClipboardList']
    ]
  },
  {
    label: 'Reflect',
    items: [
      ['Weekly Review', 'History'],
      ['Prompt Library', 'Lightbulb'],
      ['Mood Log', 'Activity'],
      ['Quotes', 'Quote']
    ]
  },
  {
    label: 'Journal Settings',
    items: [
      ['Reminders', 'Bell'],
      ['Tags & Labels', 'Tag'],
      ['Privacy', 'ShieldCheck'],
      ['Sync & Backup', 'RefreshCw'],
      ['Writing Preferences', 'SlidersHorizontal']
    ]
  }
].map((group) => ({
  ...group,
  items: group.items.map(([label, icon]) => ({ id: label.toLowerCase().replace(/[^a-z]+/g, '-'), label, icon }))
}));
const routes = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })));
const account = {
  name: 'Sami Okafor',
  role: 'Daily journal',
  email: 'sami@gaudi.page',
  photo: '/avatars/person-41.svg'
};
const statuses = [
  { id: 'none', label: 'No Status', dot: 'border border-text-muted' },
  { id: 'online', label: 'Online', dot: 'bg-success' },
  { id: 'away', label: 'Away', dot: 'bg-warning' },
  { id: 'offline', label: 'Offline', dot: 'bg-ui-destructive' }
];
const notifications = [
  {
    id: 'comment',
    unread: true,
    avatar: '/avatars/person-07.svg',
    title: 'Isaura Stenberg commented on “Walking to work”',
    body: 'The paragraph about the river fog deserves its own entry.',
    time: '2 min ago'
  },
  {
    id: 'sync',
    unread: true,
    icon: 'CircleAlert',
    tone: 'warning',
    title: 'Backup paused',
    badge: 'Check',
    body: 'The last three entries have not reached your backup folder yet.',
    actions: [
      { label: 'Retry backup', primary: true, done: 'Backing up' },
      { label: 'Dismiss', dismiss: true }
    ],
    time: '15 min ago'
  },
  {
    id: 'share',
    unread: true,
    icon: 'CircleCheck',
    tone: 'warning',
    title: 'Share request',
    body: 'Leo Grant asked to read your October travel entries.',
    actions: [
      { label: 'Approve', primary: true, done: 'Approved' },
      { label: 'Review', done: 'In review' }
    ],
    time: '1 hour ago',
    meta: { label: 'Entries', value: '6', tone: 'warning' }
  },
  {
    id: 'streak',
    unread: true,
    icon: 'Star',
    tone: 'success',
    title: '21-day writing streak',
    body: 'You have written every day for three weeks.',
    progress: { value: 21, max: 30, label: 'Days toward a 30-day streak' },
    time: '3 hours ago',
    meta: { label: 'Goal', value: '30 days', tone: 'success' }
  },
  {
    id: 'review',
    icon: 'Calendar',
    tone: 'discovery',
    title: 'Weekly review is ready',
    body: 'Seven entries, two recurring themes and one open question.',
    schedule: { date: 'Sunday', time: '7:00 PM' },
    time: '6 hours ago'
  },
  {
    id: 'export',
    avatar: '/avatars/person-46.svg',
    title: 'Ottilie Nakamura sent you the writing group anthology',
    attachment: { name: 'Autumn anthology.pdf', size: '3.2 MB' },
    time: '8 hours ago'
  }
];
const sectionPage = { today: 'today-s-page', entries: 'all-entries', prompts: 'prompt-library', reviews: 'weekly-review', archive: 'archive' };
const journalPrompts = [
  ['What did you notice on the way home?', 'Look for something you usually pass without seeing.'],
  ['Which conversation stayed with you?', 'Record one sentence and what it changed.'],
  ['What would you like to remember?', 'Describe the moment in enough detail to find it again.']
];
const initialEntries = [
  { id: 'river', title: 'Walking to work', date: 'October 8', body: 'Fog softened the river this morning. I took the long way past the footbridge and watched the first cyclists cross.', theme: 'City walks' },
  { id: 'maps', title: 'A map in the margins', date: 'October 6', body: 'At the library I found a street name pencilled in the margin of an old guide. It led me back to the market where we first met.', theme: 'Reading notes' }
];
const referencePages = {
  themes: [['City walks', 'Observations gathered on foot.'], ['Reading notes', 'Passages and questions from the library.']],
  templates: [['Field note', 'Place, observation, question.'], ['Reading note', 'Text, passage, response.']],
  'mood-log': [['October 8 · Curious', 'A different route broke the usual routine.'], ['October 6 · Reflective', 'An afternoon with old city maps.']],
  quotes: [['From the notebook', 'It is easier to notice an ordinary street when I walk it in the other direction.']],
  'tags-labels': [['City walks', 'Walking routes and places.'], ['Reading notes', 'Books, maps and marginalia.']],
  privacy: [['Personal journal', 'Entries you write in this example stay in this browser session.']],
  'sync-backup': [['Local session', 'Export a copy of the entries below to keep a record.']]
};

function JournalPane({ page, entries, draft, setDraft, onWrite, onSave, onArchive, options, setOptions }) {
  const route = routes.find(item => item.id === page);
  const title = route?.label ?? 'Archive';
  const writing = page === 'today-s-page';
  const list = entries.filter(entry => page === 'archive' ? entry.archived : !entry.archived);
  const prompts = page === 'prompt-library' ? journalPrompts : referencePages[page];
  const wordCount = draft.body.trim().split(/\s+/).filter(Boolean).length;
  return (
    <section className='mx-auto grid w-full max-w-2xl content-start gap-5'>
      <header className='grid gap-1'>
        <p className='text-xs text-text-muted'>{account.name} · Personal journal</p>
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      </header>
      {writing ? <form className='grid gap-3' onSubmit={event => { event.preventDefault(); if (draft.title.trim() && draft.body.trim()) onSave(); }}>
        <Label htmlFor='journal-title'>Entry title</Label><Input id='journal-title' value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} required />
        <Label htmlFor='journal-body'>Journal entry</Label><Textarea id='journal-body' className='min-h-32' placeholder='Write a few lines…' value={draft.body} onChange={event => setDraft({ ...draft, body: event.target.value })} required />
        <div className='flex items-center justify-between gap-3'>
          {options.wordCount ? <span className='text-xs text-text-muted'>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span> : null}
          <Button size='sm' type='submit' disabled={!draft.title.trim() || !draft.body.trim()}>Save entry</Button>
        </div>
      </form> : null}
      {['all-entries','archive'].includes(page) ? (list.length ? <ItemGroup aria-label={title}>{list.map(entry => (
        <Item key={entry.id} size='sm' className='px-0'>
          <ItemContent className='min-w-0'><ItemTitle>{entry.title}</ItemTitle><ItemDescription>{entry.body}</ItemDescription><p className='text-xs text-text-muted'>{entry.date} · {entry.theme}</p></ItemContent>
          <ItemActions><Button size='xs' variant='outline' onClick={() => onWrite(entry)}>Edit</Button><Button size='xs' variant='ghost' onClick={() => onArchive(entry.id)}>{entry.archived ? 'Restore' : 'Archive'}</Button></ItemActions>
        </Item>))}</ItemGroup> : <EmptyState compact title='No archived entries' description='Archive a saved entry to find it here.' />) : null}
      {page === 'drafts' ? <Item size='sm' variant='outline'><ItemContent><ItemTitle>{draft.title || 'Untitled entry'}</ItemTitle><ItemDescription>{draft.body || 'Your next draft is ready to write.'}</ItemDescription></ItemContent><Button size='sm' variant='outline' onClick={() => onWrite(draft)}>Continue writing</Button></Item> : null}
      {page === 'weekly-review' ? <div className='grid gap-4'><p className='text-sm'>{entries.length} saved entries this week. Revisit a passage before writing your review.</p>
        <ItemGroup>{entries.slice(0,3).map(entry => <Item key={entry.id} size='sm'><ItemContent><ItemTitle>{entry.title}</ItemTitle><ItemDescription>{entry.body}</ItemDescription></ItemContent></Item>)}</ItemGroup>
        <Button size='sm' className='justify-self-start' onClick={() => onWrite({ title: 'Weekly review', body: 'This week I noticed ', theme: 'Review' })}>Write a review</Button>
      </div> : null}
      {prompts ? <ItemGroup aria-label={title}>{prompts.map(([label, body]) => <Item key={label} size='sm' className='px-0'><ItemContent><ItemTitle>{label}</ItemTitle><ItemDescription>{body}</ItemDescription></ItemContent>
        {['templates','prompt-library'].includes(page) ? <Button size='xs' variant='outline' onClick={() => onWrite({ title: label, body: '', theme: page === 'templates' ? label : 'Prompt' })}>{page === 'templates' ? 'Use template' : 'Write from prompt'}</Button> : null}
      </Item>)}</ItemGroup> : null}
      {page === 'sync-backup' ? <Button asChild size='sm' variant='outline' className='justify-self-start'><a href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(entries, null, 2))}`} download='journal-entries.json'>Export entries</a></Button> : null}
      {page === 'reminders' || page === 'writing-preferences' ? <Item size='sm' variant='outline'>
        <ItemContent><ItemTitle>{page === 'reminders' ? 'Evening reminder' : 'Editor word count'}</ItemTitle><ItemDescription>{page === 'reminders' ? 'Keep an evening writing reminder in this journal.' : 'Show a word count below your draft.'}</ItemDescription></ItemContent>
        <Button size='sm' variant='outline' aria-pressed={page === 'reminders' ? options.reminder : options.wordCount} onClick={() => { const key = page === 'reminders' ? 'reminder' : 'wordCount'; setOptions({ ...options, [key]: !options[key] }); }}>{(page === 'reminders' ? options.reminder : options.wordCount) ? 'On' : 'Off'}</Button>
      </Item> : null}
    </section>
  );
}
// The current route is a raised row: the muted fill with a hairline.
const raised = 'data-active:ring-1 data-active:ring-ui-sidebar-border';

function ToolButton({ label, children, ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={label} className='text-text-muted data-[state=open]:bg-surface-muted' {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side='bottom'>{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionPills({ section, onSection }) {
  return (
    <nav aria-label='Journal sections' className='min-w-0'>
      <ul className='flex items-center gap-1'>
        {sections.map((item) => {
          const current = item.id === section;
          return (
            <li key={item.id}>
              <Button
                variant='ghost'
                size='sm'
                aria-current={current ? 'page' : undefined}
                onClick={() => onSection(item.id)}
                className={current ? 'bg-surface-muted border border-ui-border text-text' : 'text-text-muted border border-transparent'}
              >
                <RegistryIcon lucide={item.icon} aria-hidden='true' />
                {item.label}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Below the wide layout the pills fold into a bottom sheet behind one button. */
function SectionsSheet({ section, onSection }) {
  const frame = useAppShellFrame();
  const [open, setOpen] = useState(false);
  const current = sections.find((item) => item.id === section);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={`Journal sections: ${current.label}`}>
          <RegistryIcon lucide='Menu' aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='bottom'
        container={frame?.container ?? undefined}
        showCloseButton={false}
        className='gap-0 rounded-t-(--ds-radius-card) p-2'
      >
        <SheetHeader className='sr-only'>
          <SheetTitle>Journal Sections</SheetTitle>
          <SheetDescription>Jump to a journal section.</SheetDescription>
        </SheetHeader>
        <span aria-hidden='true' className='bg-ui-border mx-auto mb-2 h-1 w-24 rounded-(--ds-radius-pill)' />
        <nav aria-label='Journal sections'>
          <ul className='grid gap-0.5'>
            {sections.map((item) => (
              <li key={item.id}>
                <Button
                  variant='ghost'
                  aria-current={item.id === section ? 'page' : undefined}
                  className={`w-full justify-start ${item.id === section ? 'bg-surface-muted' : 'text-text-muted'}`}
                  onClick={() => {
                    onSection(item.id);
                    setOpen(false);
                  }}
                >
                  <RegistryIcon lucide={item.icon} aria-hidden='true' />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function SettingsMenu({ options, onOptions, onPage }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><ToolButton label='Open settings'><RegistryIcon lucide='Settings' aria-hidden='true' /></ToolButton></DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Editor settings</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onPage('templates')}>Entry templates</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onPage('reminders')}>Reminder settings</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={options.wordCount} onCheckedChange={checked => onOptions({ ...options, wordCount: checked })}>Show word count</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountHeader() {
  return (
    <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
      <Avatar className='size-8'>
        <AvatarImage src={account.photo} alt='' />
        <AvatarFallback>SO</AvatarFallback>
      </Avatar>
      <span className='grid min-w-0 leading-tight'>
        <span className='truncate font-medium'>{account.name}</span>
        <span className='text-text-muted truncate text-xs'>{account.email}</span>
      </span>
    </DropdownMenuLabel>
  );
}

function StatusMenu({ onPage }) {
  const [status, setStatus] = useState('none');
  const current = statuses.find((entry) => entry.id === status);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={`Account and status for ${account.name}: ${current.label}`} className='p-0'>
          <Avatar className='size-6'>
            <AvatarImage src={account.photo} alt='' />
            <AvatarFallback>SO</AvatarFallback>
            {status === 'none' ? null : <AvatarBadge className={`${current.dot} ring-ui-background`} />}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <AccountHeader />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          {statuses.map((entry) => (
            <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
              <StatusDot className={`size-2 ${entry.id === 'none' ? 'bg-transparent' : ''} ${entry.dot}`} />
              {entry.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onPage('reminders')}>Writing schedule</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onPage('writing-preferences')}>Writing preferences</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NewEntryMenu({ onPage, onWrite }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-1 data-[state=open]:bg-surface-muted'>
          <span>New</span>
          <span className='hidden @xl:inline'>Entry</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel>Start From</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onWrite({ title: '', body: '', theme: 'Journal' })}>
          <RegistryIcon lucide='PenSquare' aria-hidden='true' />
          Blank Page
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onPage('prompt-library')}>
          <RegistryIcon lucide='Lightbulb' aria-hidden='true' />
          Today's Prompt
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onPage('templates')}>
          <RegistryIcon lucide='ClipboardList' aria-hidden='true' />
          A Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopBar({ section, onSection, onPage, onWrite, options, onOptions }) {
  const { isMobile } = useSidebar();
  return (
    <header className='@container flex h-13 shrink-0 items-center gap-2 border-b border-ui-border px-4 @lg:px-6'>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <span className='@4xl:hidden'>
        <SectionsSheet section={section} onSection={onSection} />
      </span>
      <Link
        variant='bare'
        href='#home'
        aria-label='Gaudi Journal home'
        onClick={event => { event.preventDefault(); onPage('today-s-page'); }}
        className='bg-surface hidden size-6 @xs:grid shrink-0 place-items-center rounded-(--ds-radius-control) border border-ui-border outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
      >
        <GaudiLogo aria-hidden='true' className='size-5' />
      </Link>
      <Separator orientation='vertical' className='hidden h-3.5 @4xl:block data-vertical:self-center' />
      <div className='hidden min-w-0 @4xl:block'>
        <SectionPills section={section} onSection={onSection} />
      </div>
      <div role='toolbar' aria-label='Workspace actions' className='ms-auto flex shrink-0 items-center gap-1'>
        <span className='me-1.5'>
          <NewEntryMenu onPage={onPage} onWrite={onWrite} />
        </span>
        <AppShellNotifications inset defaultItems={notifications} triggerClassName='text-text-muted' />
        <SettingsMenu options={options} onOptions={onOptions} onPage={onPage} />
        <StatusMenu onPage={onPage} />
      </div>
    </header>
  );
}

function SearchButton({ onClick }) {
  return (
    <Button variant='outline' size='sm' onClick={onClick} aria-label='Search journal pages' className='text-text-muted w-full justify-start'>
      <RegistryIcon lucide='Search' aria-hidden='true' />
      <span aria-hidden='true'>Search…</span>
    </Button>
  );
}

function JournalSearch({ onSelect }) {
  const [open, setOpen] = useState(false);
  const { setOpenMobile } = useSidebar();
  return (
    <>
      <SearchButton onClick={() => setOpen(true)} />
      <RouteSearch
        open={open}
        onOpenChange={setOpen}
        onSelect={(id) => {
          onSelect(id);
          setOpen(false);
          setOpenMobile(false);
        }}
      />
    </>
  );
}

function WordGoalCard({ words }) {
  const goal = 750;
  return (
    <CardRoot variant='muted' padding='none'><CardContent className='p-3'>
      <p className='text-xs font-medium'>Today's words</p>
      <p className='text-text-muted text-[11px]'>{words} of {goal}</p>
      <Progress value={words} max={goal} aria-label="Today's word goal" className='bg-ui-muted mt-2 h-1.5 rounded-full' />
    </CardContent></CardRoot>
  );
}

function RouteSearch({ open, onOpenChange, onSelect }) {
  const [term, setTerm] = useState('');
  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    return groups
      .map((group) => ({ ...group, items: group.items.filter((item) => item.label.toLowerCase().includes(query)) }))
      .filter((group) => group.items.length);
  }, [term]);
  const count = results.reduce((sum, group) => sum + group.items.length, 0);
  return (
    <CommandDialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setTerm('');
      }}
      title='Search Journal'
      description='Find a journal page by name.'
      showCloseButton
      footer={null}
    >
      <Command shouldFilter={false}>
        <CommandInput placeholder='Search journal pages...' value={term} onValueChange={setTerm} />
        <p role='status' className='sr-only'>
          {count} {count === 1 ? 'result' : 'results'}
        </p>
        <CommandList>
          <CommandEmpty>No pages match.</CommandEmpty>
          {results.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map((item) => (
                <CommandItem key={item.id} value={item.id} onSelect={() => onSelect(item.id)}>
                  <RegistryIcon lucide={item.icon} aria-hidden='true' />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function Pattern() {
  const [page, setPage] = useState('today-s-page');
  const [entries, setEntries] = useState(initialEntries);
  const [draft, setDraft] = useState({ title: 'Morning at the library', body: 'The reading room was still quiet when I arrived. On the desk, someone had left a folded map of the river.', theme: 'City walks' });
  const [options, setOptions] = useState({ wordCount: true, reminder: true });
  const section = Object.keys(sectionPage).find(key => sectionPage[key] === page) ?? (page === 'templates' ? 'prompts' : 'entries');
  const write = entry => { setDraft(entry); setPage('today-s-page'); };
  const save = () => {
    const item = { ...draft, id: draft.id ?? crypto.randomUUID(), date: draft.date ?? 'Today', theme: draft.theme ?? 'Journal' };
    setEntries(list => [item, ...list.filter(entry => entry.id !== item.id)]);
    setDraft(item); setPage('all-entries');
  };
  const words = 640 + entries.filter(entry => entry.date === 'Today').reduce((total, entry) => total + entry.body.trim().split(/\s+/).filter(Boolean).length, 0);
  const current = routes.find((item) => item.id === page);
  return (
    <AppShellFrame surface='default'>
      <SidebarProvider shortcut={false} className='flex-col' style={{ '--sidebar-width': '13rem' }}>
        <TopBar section={section} onSection={id => setPage(sectionPage[id])} onPage={setPage} onWrite={write} options={options} onOptions={setOptions} />
        <div className='relative flex min-h-0 flex-1'>
          <Sidebar mobileTitle='Journal Navigation' mobileDescription='Journal pages and settings.'>
            <SidebarHeader className='px-2 pt-3 pb-0'>
              <JournalSearch onSelect={setPage} />
            </SidebarHeader>
            <SidebarContent role='navigation' aria-label='Journal pages' className='gap-2 px-2 py-2'>
              {groups.map((group) => (
                <AppShellNav
                  key={group.label}
                  label={group.label}
                  items={group.items}
                  value={page}
                  onValueChange={setPage}
                  itemClassName={raised}
                />
              ))}
            </SidebarContent>
            <SidebarFooter className='p-3'>
              <WordGoalCard words={words} />
            </SidebarFooter>
          </Sidebar>
          <AppShellPanel inset={false} aria-label={current?.label}>
            <AppShellBody className='px-4 py-4 @lg:px-6 @lg:py-6'>
              <JournalPane page={page} entries={entries} draft={draft} setDraft={setDraft} onWrite={write} onSave={save} options={options} setOptions={setOptions}
                onArchive={id => setEntries(list => list.map(entry => entry.id === id ? { ...entry, archived: !entry.archived } : entry))} />
            </AppShellBody>
          </AppShellPanel>
        </div>
      </SidebarProvider>
    </AppShellFrame>
  );
}
