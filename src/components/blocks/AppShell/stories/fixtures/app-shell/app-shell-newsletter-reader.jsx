'use client';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
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
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@gaudi/design-system/core/EmptyState';
import { Field, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gaudi/design-system/core/Input';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellFrame, AppShellPanel } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { EmailInput } from '@gaudi/design-system/core/Input';

const me = { name: 'Leo Okafor', email: 'leo@gaudi.dev', photo: '/avatars/person-41.svg' };
const folders = [
  { id: 'inbox', label: 'Unread', icon: 'BookOpen' },
  { id: 'later', label: 'Read later', icon: 'Bookmark', badge: { label: 18, variant: 'plain' } },
  { id: 'sent', label: 'Shared', icon: 'Share2', badge: { label: 6, variant: 'plain' } }
];
const labelSeed = [
  { id: 'design', label: 'Design', icon: 'PenTool', badge: { label: 9, variant: 'plain' } },
  { id: 'science', label: 'Science', icon: 'FlaskConical', badge: { label: 14, variant: 'plain' } },
  { id: 'history', label: 'History', icon: 'Library', badge: { label: 5, variant: 'plain' } },
  { id: 'trash', label: 'Archive', icon: 'Archive', badge: { label: 212, variant: 'plain' } }
];
const people = [
  { id: 'dm-leo', label: 'Leo Okafor', suffix: '(You)', avatar: me.photo, presence: 'success' },
  { id: 'dm-ines', label: 'Inès Moreau', avatar: '/avatars/person-17.svg' },
  { id: 'dm-tomas', label: 'Tomás Rivera', avatar: '/avatars/person-47.svg' },
  { id: 'dm-invite', label: 'Invite a reader', icon: 'UserPlus' }
];
const links = [
  { id: 'subscriptions', label: 'Subscriptions', icon: 'Podcast' },
  { id: 'settings', label: 'Reading settings', icon: 'SlidersHorizontal' },
  { id: 'feedback', label: 'Feedback', icon: 'MessageSquare' }
];
const categories = ['Essays', 'Digests', 'Research', 'Craft', 'Culture', 'Podcast notes'];
const shortcuts = [
  { id: 'highlights', label: 'Highlights', icon: 'PenTool' },
  { id: 'notebook', label: 'Notebook', icon: 'Book' },
  { id: 'stats', label: 'Reading stats', icon: 'ChartLine' },
  { id: 'listen', label: 'Listen', icon: 'Headphones' },
  { id: 'focus', label: 'Focus mode', icon: 'Eye' }
];
const mailSeed = [
  {
    id: 'marginalia',
    folder: 'inbox',
    from: 'The Margins',
    email: 'issues@themargins.example',
    photo: '/avatars/person-24.svg',
    time: '7:02 AM',
    date: 'Today, 7:02 AM',
    subject: 'Why we write in the margins',
    preview: 'Issue 84: five centuries of readers arguing with their books, and what notes apps forgot.',
    body: [
      'Issue 84 of The Margins.',
      'Medieval readers wrote in the margins to argue, to translate and to remember. The habit survived the printing press, the paperback and the e-reader, but it rarely survives a notes app.',
      'This week: three ways to keep a conversation with what you read, and why a note is most useful beside the sentence that prompted it.',
      'Until next week, Hana'
    ],
    category: 'Essays',
    tags: ['Reading', '6 min'],
    unread: true
  },
  {
    id: 'weekly-digest',
    folder: 'inbox',
    from: 'Gaudi Digest',
    email: 'digest@gaudi.dev',
    photo: '/static/favicons/android-chrome-192x192.png',
    time: '6:30 AM',
    date: 'Today, 6:30 AM',
    subject: 'Your week: 12 saves, 31 highlights',
    preview: 'Most highlighted: “The Extended Mind”. Two saved articles are still unread.',
    body: ['You saved 12 items and made 31 highlights this week.', 'Most highlighted: The Extended Mind, chapter 3.', 'Two saved articles are still waiting in Read later.'],
    category: 'Digests',
    tags: ['Weekly'],
    unread: true
  },
  {
    id: 'memory-palace',
    folder: 'inbox',
    from: 'Field Notes on Memory',
    email: 'hello@fieldnotes.example',
    photo: '/avatars/person-44.svg',
    time: 'Yesterday',
    date: 'Yesterday, 5:15 PM',
    subject: 'Spaced repetition, ten years on',
    preview: 'A look back at the studies, what replicated, and the one interval that matters most.',
    body: [
      'Ten years after the first wave of flashcard apps, the research has settled on a few durable findings.',
      'Short first intervals matter more than long late ones, and retrieval beats rereading almost every time.',
      'Sources are linked at the end of the issue.'
    ],
    category: 'Research',
    tags: ['Science', '9 min'],
    unread: true
  },
  {
    id: 'type-specimen',
    folder: 'inbox',
    from: 'Letterform Weekly',
    email: 'letters@letterform.example',
    photo: '/avatars/person-07.svg',
    time: 'Mon',
    date: 'Monday, 8:00 AM',
    subject: 'A specimen for long reading',
    preview: 'Measure, leading and the quiet typefaces that keep you on the page.',
    body: ['Measure, leading and contrast decide whether a long read feels effortless.', 'This issue compares four text faces at the same size on screen.'],
    category: 'Craft',
    tags: ['Design']
  },
  {
    id: 'library-history',
    folder: 'inbox',
    from: 'Stacks & Shelves',
    email: 'editor@stacks.example',
    photo: '/avatars/person-16.svg',
    time: 'Sun',
    date: 'Sunday, 9:12 AM',
    subject: 'The card catalogue, a love letter',
    preview: 'How a drawer of index cards became the first search engine many of us used.',
    body: [
      'Before search boxes there were drawers of cards, each one a small promise that a book could be found.',
      'This week we visit three libraries that still keep theirs.'
    ],
    category: 'Culture',
    tags: ['History']
  },
  {
    id: 'podcast-notes',
    folder: 'inbox',
    from: 'Slow Reading Club',
    email: 'club@slowreading.example',
    photo: '/avatars/person-38.svg',
    time: 'Sat',
    date: 'Saturday, 10:00 AM',
    subject: 'Episode notes: reading Montaigne slowly',
    preview: 'Show notes, quotes and the reading list from this month’s episode.',
    body: ['Show notes, quotes and the reading list from this month’s episode on Montaigne’s essays.'],
    category: 'Podcast notes',
    tags: []
  }
];

function AccountMenu() {
  const { isMobile } = useSidebar();
  const [theme, setTheme] = useState('system');
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' aria-label={`Account: ${me.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <Avatar className='size-8 rounded-full'>
                <AvatarImage src={me.photo} alt='' className='rounded-full' />
                <AvatarFallback className='rounded-full'>LO</AvatarFallback>
              </Avatar>
              <span className='grid min-w-0 leading-tight'>
                <span className='truncate font-semibold'>{me.name}</span>
                <span className='text-text-muted truncate text-xs'>{me.email}</span>
              </span>
              <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align='start' sideOffset={8} className='w-60'>
            <DropdownMenuLabel className='grid font-normal leading-tight'>
              <span className='font-medium'>{me.name}</span>
              <span className='text-text-muted text-xs'>{me.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='Podcast' aria-hidden='true' />
              Manage subscriptions
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Download' aria-hidden='true' />
              Import OPML
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RegistryIcon lucide='Palette' aria-hidden='true' />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='system'>System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='LogOut' aria-hidden='true' />
              Sign Out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NewMailButton({ onClick }) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const rail = state === 'collapsed' && !isMobile;
  return (
    <Button
      tone='neutral'
      aria-label='Share a read'
      className={rail ? 'size-8 self-center p-0' : 'w-full'}
      onClick={() => {
        // The compose dialog replaces the phone sheet.
        if (isMobile) setOpenMobile(false);
        onClick();
      }}
    >
      <RegistryIcon lucide='Share2' aria-hidden='true' />
      {rail ? null : 'Share a read'}
    </Button>
  );
}

function ComposeDialog({ open, onOpenChange, onSend }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const reset = () => {
    setTo('');
    setSubject('');
    setBody('');
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Share a read</DialogTitle>
          <DialogDescription>Send an issue to a friend with a short note.</DialogDescription>
        </DialogHeader>
        <form
          id='app-shell-8-compose'
          className='grid gap-3'
          onSubmit={(event) => {
            event.preventDefault();
            onSend({ to, subject: subject || '(No subject)', body });
            reset();
          }}
        >
          <Field>
            <FieldLabel htmlFor='app-shell-8-to'>To</FieldLabel>
            <EmailInput id='app-shell-8-to'  required placeholder='friend@example.com' value={to} onChange={(event) => setTo(event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor='app-shell-8-subject'>Title</FieldLabel>
            <FieldInput id='app-shell-8-subject' placeholder='Why we write in the margins' value={subject} onChange={(event) => setSubject(event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor='app-shell-8-message'>Note</FieldLabel>
            <Textarea id='app-shell-8-message' rows={3} placeholder='Thought of you when I read this…' value={body} onChange={(event) => setBody(event.target.value)} />
          </Field>
        </form>
        <DialogFooter className='flex-row items-center sm:justify-between'>
          <Button variant='outline' size='sm'>
            <RegistryIcon lucide='PenTool' aria-hidden='true' />
            Add highlights
          </Button>
          <div className='ms-auto flex gap-2'>
            <DialogClose asChild>
              <Button variant='ghost' size='sm'>Discard</Button>
            </DialogClose>
            <Button tone='neutral' size='sm' type='submit' form='app-shell-8-compose'>
              <RegistryIcon lucide='Send' aria-hidden='true' />
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LabelDialog({ open, onOpenChange, onCreate }) {
  const [name, setName] = useState('');
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setName('');
        onOpenChange(next);
      }}
    >
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>New topic</DialogTitle>
          <DialogDescription>File related issues under a topic.</DialogDescription>
        </DialogHeader>
        <form
          id='app-shell-8-label'
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            onCreate(name.trim());
            setName('');
          }}
        >
          <Field>
            <FieldLabel htmlFor='app-shell-8-label-name'>Name</FieldLabel>
            <FieldInput id='app-shell-8-label-name' required placeholder='Philosophy' value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' size='sm'>Cancel</Button>
          </DialogClose>
          <Button tone='neutral' size='sm' type='submit' form='app-shell-8-label'>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MailEmpty({ title, description, children }) {
  return (
    <Empty className='py-10'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <RegistryIcon lucide='BookOpen' aria-hidden='true' />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent className='flex-row flex-wrap justify-center gap-2'>{children}</EmptyContent> : null}
    </Empty>
  );
}

function MessageList({ mails, folderLabel, selected, onSelect, query, onQuery, filters, onFilters, onClear, hidden }) {
  return (
    <section
      aria-label={`${folderLabel} messages`}
      className={`bg-ui-background min-h-0 min-w-0 flex-col rounded-(--ds-radius-card) border @[40rem]/mail:w-72 @[40rem]/mail:shrink-0 @4xl/mail:w-80 @6xl/mail:w-96 ${hidden ? 'hidden @[40rem]/mail:flex' : 'flex flex-1'}`}
    >
      <div className='flex items-center gap-1 p-2'>
        <SidebarTrigger />
        <InputGroup className='h-8 min-w-0 flex-1'>
          <InputGroupAddon>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput aria-label='Search issues' placeholder='Search issues…' value={query} onChange={(event) => onQuery(event.target.value)} />
        </InputGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='text-text-muted shrink-0 gap-1 px-2' aria-label={filters.length ? `Kinds, ${filters.length} selected` : 'Kinds'}>
              <span className='hidden @md:inline'>Kinds</span>
              <RegistryIcon lucide='ListFilter' aria-hidden='true' className='@md:hidden' />
              {filters.length ? <Badge variant='secondary' size='xs'>{filters.length}</Badge> : null}
              <RegistryIcon lucide='ChevronDown' aria-hidden='true' className='hidden @md:inline' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>Filter by kind</DropdownMenuLabel>
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={filters.includes(category)}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={(checked) => onFilters(checked ? [...filters, category] : filters.filter((entry) => entry !== category))}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant='ghost' size='icon-sm' aria-label='Mark all as read' className='shrink-0'>
          <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
        </Button>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {mails.length ? (
          <ul className='grid gap-0.5 px-2 pb-2'>
            {mails.map((mail) => (
              <li key={mail.id}>
                <button
                  type='button'
                  aria-current={mail.id === selected ? 'true' : undefined}
                  className='hover:bg-ui-accent aria-[current=true]:bg-ui-accent focus-visible:ring-ui-ring flex w-full min-w-0 gap-3 rounded-(--ds-radius-control) px-2 py-2.5 text-start outline-hidden focus-visible:ring-2'
                  onClick={() => onSelect(mail.id)}
                >
                  <Avatar className='size-8 shrink-0 rounded-full'>
                    <AvatarImage src={mail.photo} alt='' className='rounded-full' />
                    <AvatarFallback className='rounded-full'>{mail.from.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className='grid min-w-0 flex-1 gap-0.5'>
                    <span className='flex items-center gap-2'>
                      <span className={`min-w-0 flex-1 truncate text-sm ${mail.unread ? 'font-semibold' : 'font-medium'}`}>{mail.from}</span>
                      {mail.unread ? (
                        <span className='bg-info size-2 shrink-0 rounded-full'>
                          <span className='sr-only'>Unread</span>
                        </span>
                      ) : null}
                      <span className='text-text-muted shrink-0 text-xs'>{mail.time}</span>
                    </span>
                    <span className='truncate text-sm'>{mail.subject}</span>
                    <span className='text-text-muted line-clamp-2 text-xs'>{mail.preview}</span>
                    {mail.tags.length ? (
                      <span className='flex flex-wrap gap-1 pt-1'>
                        {mail.tags.map((tag) => (
                          <Badge key={tag} variant='outline' size='xs' className='font-normal'>{tag}</Badge>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <MailEmpty
            title='Nothing to read here'
            description={
              <>
                Try another search or{' '}
                <button type='button' className='text-text underline underline-offset-4' onClick={onClear}>
                  clear filters
                </button>
              </>
            }
          />
        )}
      </div>
    </section>
  );
}

function ToolbarButton({ label, icon, pressed, tone, disabled, onClick, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon-sm'
          tone={tone}
          aria-label={label}
          aria-pressed={pressed}
          disabled={disabled}
          className={className}
          onClick={onClick}
        >
          <RegistryIcon lucide={icon} aria-hidden='true' className={pressed ? 'fill-current' : undefined} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='bottom'>{label}</TooltipContent>
    </Tooltip>
  );
}

function ReadingPane({ mail, hidden, position, onBack, onStep, onUpdate, onDelete, onCompose }) {
  const none = !mail;
  return (
    <section
      aria-label='Reading pane'
      className={`bg-ui-background @container/reading min-h-0 min-w-0 flex-1 flex-col rounded-(--ds-radius-card) border ${hidden ? 'hidden @[40rem]/mail:flex' : 'flex'}`}
    >
      <div className='flex items-center gap-0.5 p-2'>
        <Button variant='ghost' size='icon-sm' aria-label='Back to messages' className='@[40rem]/mail:hidden' onClick={onBack}>
          <RegistryIcon lucide='ArrowLeft' aria-hidden='true' />
        </Button>
        <ToolbarButton label='Previous message' icon='ChevronLeft' disabled={none || position.index <= 0} onClick={() => onStep(-1)} className='hidden @md/reading:inline-flex' />
        <ToolbarButton label='Next message' icon='ChevronRight' disabled={none || position.index >= position.count - 1} onClick={() => onStep(1)} className='hidden @md/reading:inline-flex' />
        {mail?.tags.find((tag) => tag.endsWith('min')) ? <Badge variant='secondary' size='sm' className='ms-1 hidden font-medium @lg/reading:inline-flex'>{mail.tags.find((tag) => tag.endsWith('min'))} read</Badge> : null}
        <ToolbarButton
          label={mail?.unread ? 'Mark as read' : 'Mark as unread'}
          icon={mail?.unread ? 'Eye' : 'EyeOff'}
          disabled={none}
          onClick={() => onUpdate({ unread: !mail.unread })}
        />
        <div className='ms-auto flex items-center gap-0.5'>
          <Button variant='outline' size='xs' disabled={none} className='me-1'>
            <RegistryIcon lucide='Book' aria-hidden='true' />
            Save to notebook
          </Button>
          <ToolbarButton label='Add a note' icon='SquarePen' disabled={none} className='hidden @2xl/reading:inline-flex' />
          <ToolbarButton label='Read later' icon='Bookmark' pressed={Boolean(mail?.flagged)} disabled={none} onClick={() => onUpdate({ flagged: !mail.flagged })} className='hidden @lg/reading:inline-flex' />
          <ToolbarButton label='Star issue' icon='Star' pressed={Boolean(mail?.starred)} disabled={none} onClick={() => onUpdate({ starred: !mail.starred })} />
          <ToolbarButton label='Copy link' icon='Link' disabled={none} className='hidden @2xl/reading:inline-flex' />
          <ToolbarButton label='Archive issue' icon='Archive' disabled={none} onClick={onDelete} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon-sm' aria-label='More options' disabled={none}>
                <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>
                <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
                Open original
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Headphones' aria-hidden='true' />
                Listen
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Download' aria-hidden='true' />
                Save as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive'>
                <RegistryIcon lucide='BellOff' aria-hidden='true' />
                Unsubscribe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {mail ? (
          <article aria-labelledby={`app-shell-8-subject-${mail.id}`} className='mx-auto grid max-w-2xl gap-5 px-5 py-4'>
            <h2 id={`app-shell-8-subject-${mail.id}`} className='text-lg font-semibold text-balance'>{mail.subject}</h2>
            <div className='flex min-w-0 items-center gap-3'>
              <Avatar className='size-9 shrink-0 rounded-full'>
                <AvatarImage src={mail.photo} alt='' className='rounded-full' />
                <AvatarFallback className='rounded-full'>{mail.from.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className='grid min-w-0 flex-1 text-sm leading-tight'>
                <span className='truncate font-medium'>{mail.from}</span>
                <span className='text-text-muted truncate text-xs'>
                  {mail.email}
                </span>
              </div>
              <span className='text-text-muted hidden shrink-0 text-xs @md/reading:inline'>{mail.date}</span>
            </div>
            <div className='grid gap-3 text-sm leading-6'>
              {mail.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className='flex flex-wrap gap-2 border-t pt-4'>
              <Button variant='outline' size='sm'>
                <RegistryIcon lucide='PenTool' aria-hidden='true' />
                Highlight
              </Button>
              <Button variant='outline' size='sm' onClick={onCompose}>
                <RegistryIcon lucide='Share2' aria-hidden='true' />
                Share
              </Button>
            </div>
          </article>
        ) : (
          <div className='flex h-full items-center justify-center'>
            <MailEmpty title='Pick something to read' description='Choose an issue to open it here'>
              <Button variant='outline' size='xs'>
                <RegistryIcon lucide='Sparkles' aria-hidden='true' />
                Summarise unread
              </Button>
              <Button variant='outline' size='xs'>
                <RegistryIcon lucide='Podcast' aria-hidden='true' />
                Add a feed
              </Button>
            </MailEmpty>
          </div>
        )}
      </div>
    </section>
  );
}

/** Reading tools on the far edge, as icon buttons with tooltips; wide frames only. */
function AppRail() {
  return (
    <nav aria-label='Reading tools' className='hidden shrink-0 flex-col items-center gap-2 py-1 @[60rem]/mail:flex'>
      {shortcuts.map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <Button variant='outline' size='icon-sm' aria-label={item.label} className='bg-ui-background'>
              <RegistryIcon lucide={item.icon} aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>{item.label}</TooltipContent>
        </Tooltip>
      ))}
      <span aria-hidden='true' className='bg-ui-border my-0.5 h-px w-5' />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon-sm' aria-label='Add a tool' className='bg-ui-background'>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='left'>Add a tool</TooltipContent>
      </Tooltip>
    </nav>
  );
}

export function Pattern() {
  const [folder, setFolder] = useState('inbox');
  const [mails, setMails] = useState(mailSeed);
  const [labels, setLabels] = useState(labelSeed);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [labelOpen, setLabelOpen] = useState(false);
  const unread = mails.filter((mail) => mail.folder === 'inbox' && mail.unread).length;
  const folderItems = folders.map((item) => (item.id === 'inbox' ? { ...item, badge: unread ? { label: unread, variant: 'plain' } : undefined } : item));
  const folderLabel = [...folders, ...labels, ...people, ...links].find((item) => item.id === folder)?.label ?? 'Unread';
  const needle = query.trim().toLowerCase();
  const visible = mails.filter(
    (mail) =>
      mail.folder === folder &&
      (!filters.length || filters.includes(mail.category)) &&
      (!needle || `${mail.from} ${mail.subject} ${mail.preview}`.toLowerCase().includes(needle))
  );
  const mail = visible.find((entry) => entry.id === selected) ?? null;
  const index = visible.findIndex((entry) => entry.id === selected);
  const update = (patch) => setMails((list) => list.map((entry) => (entry.id === selected ? { ...entry, ...patch } : entry)));
  const open = (id) => {
    setSelected(id);
    setMails((list) => list.map((entry) => (entry.id === id ? { ...entry, unread: false } : entry)));
  };
  const goFolder = (id) => {
    setFolder(id);
    setSelected(null);
  };
  return (
    <AppShellFrame>
      {/* Several shells share the docs page, so this one leaves ⌘B to another and collapses from the list header. */}
      <SidebarProvider shortcut={false}>
        <Sidebar collapsible='icon'>
          <SidebarHeader>
            <AccountMenu />
            <NewMailButton onClick={() => setComposeOpen(true)} />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Reading'>
            <AppShellNav label='Library' items={folderItems} value={folder} onValueChange={goFolder} />
            <AppShellNav
              label='Topics'
              items={labels}
              value={folder}
              onValueChange={goFolder}
              action={
                <SidebarGroupAction aria-label='New topic' onClick={() => setLabelOpen(true)}>
                  <RegistryIcon lucide='Plus' aria-hidden='true' />
                </SidebarGroupAction>
              }
            />
            <AppShellNav label='Reading circle' items={people} value={folder} onValueChange={goFolder} />
            <AppShellNav className='mt-auto' size='sm' items={links} value={folder} onValueChange={goFolder} />
          </SidebarContent>
          <SidebarFooter className='p-0' />
        </Sidebar>
        <AppShellPanel inset={false} className='@container/mail flex-row gap-2 overflow-hidden border-s-0 bg-transparent p-2 in-data-[compact=true]:p-1'>
          <MessageList
            mails={visible}
            folderLabel={folderLabel}
            selected={mail?.id}
            onSelect={open}
            query={query}
            onQuery={setQuery}
            filters={filters}
            onFilters={setFilters}
            onClear={() => {
              setQuery('');
              setFilters([]);
            }}
            hidden={Boolean(mail)}
          />
          <ReadingPane
            mail={mail}
            hidden={!mail}
            position={{ index, count: visible.length }}
            onBack={() => setSelected(null)}
            onStep={(step) => open(visible[index + step].id)}
            onUpdate={update}
            onDelete={() => {
              setMails((list) => list.map((entry) => (entry.id === selected ? { ...entry, folder: 'trash' } : entry)));
              setSelected(null);
            }}
            onCompose={() => setComposeOpen(true)}
          />
          <AppRail />
        </AppShellPanel>
      </SidebarProvider>
      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        onSend={({ to, subject, body }) => {
          setMails((list) => [
            {
              id: `sent-${list.length}`,
              folder: 'sent',
              from: me.name,
              email: to,
              photo: me.photo,
              time: 'Now',
              date: 'Just now',
              subject,
              preview: body || 'No note',
              body: body ? [body] : ['No note'],
              category: 'Essays',
              tags: []
            },
            ...list
          ]);
          setComposeOpen(false);
        }}
      />
      <LabelDialog
        open={labelOpen}
        onOpenChange={setLabelOpen}
        onCreate={(name) => {
          setLabels((list) => [...list, { id: `topic-${name.toLowerCase().replace(/\W+/g, '-')}`, label: name, icon: 'Hash' }]);
          setLabelOpen(false);
        }}
      />
    </AppShellFrame>
  );
}
