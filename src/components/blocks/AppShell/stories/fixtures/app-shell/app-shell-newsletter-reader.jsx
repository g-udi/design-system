'use client';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { CardRoot } from '@gaudi/design-system/core/Card';
import { useState } from 'react';
import { getAvatarInitials, AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Item } from '@gaudi/design-system/core/Item';
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
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@gaudi/design-system/core/EmptyState';
import Switch from '@gaudi/design-system/core/Switch';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
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
  { id: 'dm-invite', label: 'Share with a reader', icon: 'Share2' }
];
const links = [
  { id: 'subscriptions', label: 'Subscriptions', icon: 'Podcast' },
  { id: 'settings', label: 'Reading settings', icon: 'SlidersHorizontal' },
  { id: 'notebook', label: 'Notebook', icon: 'Book' }
];
const categories = ['Essays', 'Digests', 'Research', 'Craft', 'Culture', 'Podcast notes'];
const shortcuts = [
  { id: 'highlights', label: 'Highlights', icon: 'PenTool' },
  { id: 'notebook', label: 'Notebook', icon: 'Book' },
  { id: 'stats', label: 'Reading stats', icon: 'ChartLine' },

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

function AccountMenu({ onNavigate }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate = value => {
    if (isMobile) setOpenMobile(false);
    onNavigate(value);
  };
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
            <DropdownMenuItem onSelect={() => navigate('subscriptions')}><RegistryIcon lucide='Podcast' aria-hidden='true' />Manage subscriptions</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('settings')}><RegistryIcon lucide='SlidersHorizontal' aria-hidden='true' />Reading settings</DropdownMenuItem>
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

function ComposeDialog({ open, onOpenChange, onSend, issue, recipient }) {
  const [to, setTo] = useState(recipient || '');
  const [subject, setSubject] = useState(issue?.subject || '');
  const [body, setBody] = useState(issue?.note || '');
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
          {issue?.highlight && <Button variant='outline' size='sm' onClick={() => setBody(text => [text, issue.highlight].filter(Boolean).join('\n\n'))}>Add highlight</Button>}
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

function MessageList({ mails, folderLabel, selected, onSelect, query, onQuery, filters, onFilters, onClear, onReadAll, hidden }) {
  return (
    <CardRoot as='section' variant='outline' padding='none'
      aria-label={`${folderLabel} messages`}
      className={`bg-ui-background min-h-0 min-w-0 flex-col gap-0 @[40rem]/mail:w-72 @[40rem]/mail:shrink-0 @4xl/mail:w-80 @6xl/mail:w-96 ${hidden ? 'hidden @[40rem]/mail:flex' : 'flex flex-1'}`}
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
        <Button variant='ghost' size='icon-sm' aria-label='Mark all as read' disabled={!mails.some(issue => issue.unread)} onClick={onReadAll} className='shrink-0'>
          <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
        </Button>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {mails.length ? (
          <ul className='grid grid-cols-1 gap-0.5 px-2 pb-2'>
            {mails.map((mail) => (
              <li key={mail.id}>
                <Item asChild size='sm' className='hover:bg-ui-accent aria-[current=true]:bg-ui-accent focus-visible:ring-ui-ring min-w-0 flex-nowrap items-start gap-3 rounded-(--ds-radius-control) px-2 py-2.5 text-start outline-hidden focus-visible:ring-2'>
                  <button
                    type='button'
                    aria-current={mail.id === selected ? 'true' : undefined}
                    onClick={() => onSelect(mail.id)}
                  >
                    <Avatar className='size-8 shrink-0 rounded-full'>
                      <AvatarImage src={mail.photo} alt='' className='rounded-full' />
                      <AvatarFallback className='rounded-full'>{getAvatarInitials(mail.from)}</AvatarFallback>
                    </Avatar>
                    <span className='grid min-w-0 flex-1 grid-cols-1 gap-0.5'>
                      <span className='flex items-center gap-2'>
                        <span className={`min-w-0 flex-1 truncate text-sm ${mail.unread ? 'font-semibold' : 'font-medium'}`}>{mail.from}</span>
                        {mail.unread ? (
                          <StatusDot label='Unread' className='size-2 bg-info' />
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
                </Item>
              </li>
            ))}
          </ul>
        ) : (
          <MailEmpty
            title='Nothing to read here'
            description={
              <>
                Try another search or{' '}
                <Button variant='link' size='sm' className='h-auto p-0' onClick={onClear}>
                  clear filters
                </Button>
              </>
            }
          />
        )}
      </div>
    </CardRoot>
  );
}

function ToolbarButton({ label, icon, pressed, tone, disabled, onClick, className }) {
  const Control = pressed === undefined ? Button : Toggle;
  const controlProps = pressed === undefined
    ? { variant: 'ghost', size: 'icon-sm', onClick, tone }
    : { size: 'sm', pressed, onPressedChange: onClick };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Control {...controlProps} aria-label={label} disabled={disabled} className={className}>
          <RegistryIcon lucide={icon} aria-hidden='true' className={pressed ? 'fill-current' : undefined} />
        </Control>
      </TooltipTrigger>
      <TooltipContent side='bottom'>{label}</TooltipContent>
    </Tooltip>
  );
}

function ReadingPane({ mail, hidden, position, onBack, onStep, onUpdate, onDelete, onCompose, onEdit, largeText, topics, onTopic }) {
  const none = !mail;
  return (
    <CardRoot as='section' variant='outline' padding='none'
      aria-label='Reading pane'
      className={`bg-ui-background @container/reading min-h-0 min-w-0 flex-1 flex-col gap-0 ${hidden ? 'hidden @[40rem]/mail:flex' : 'flex'}`}
    >
      <div className='flex flex-wrap items-center gap-0.5 p-2'>
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
          <Toggle variant='outline' size='sm' disabled={none} className='me-1' aria-label={mail?.saved ? 'Remove from notebook' : 'Save to notebook'} pressed={Boolean(mail?.saved)} onPressedChange={() => onUpdate({ saved: !mail.saved })}>
            <RegistryIcon lucide='Book' aria-hidden='true' />
            <span>{mail?.saved ? 'Saved' : 'Save'}<span className='hidden @sm/reading:inline'> to notebook</span></span>
          </Toggle>
          <ToolbarButton label='Add a note' icon='SquarePen' disabled={none} onClick={() => onEdit('note')} className='hidden @2xl/reading:inline-flex' />
          <ToolbarButton label='Read later' icon='Bookmark' pressed={Boolean(mail?.flagged)} disabled={none} onClick={() => onUpdate({ flagged: !mail.flagged })} className='hidden @lg/reading:inline-flex' />
          <ToolbarButton label='Star issue' icon='Star' pressed={Boolean(mail?.starred)} disabled={none} onClick={() => onUpdate({ starred: !mail.starred })} />
          <ToolbarButton label='Archive issue' icon='Archive' disabled={none} onClick={onDelete} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon-sm' aria-label='More options' disabled={none}>
                <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem onSelect={() => onEdit('note')}>Edit reading note</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onUpdate({ flagged: !mail.flagged })}>{mail?.flagged ? 'Remove from Read later' : 'Read later'}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>File under topic</DropdownMenuLabel>
              {topics.map(topic => <DropdownMenuCheckboxItem key={topic.id} checked={mail?.tags.includes(topic.label)} onCheckedChange={checked => onTopic(topic.label, checked)}>{topic.label}</DropdownMenuCheckboxItem>)}
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
                <AvatarFallback className='rounded-full'>{getAvatarInitials(mail.from)}</AvatarFallback>
              </Avatar>
              <div className='grid min-w-0 flex-1 text-sm leading-tight'>
                <span className='truncate font-medium'>{mail.from}</span>
                <span className='text-text-muted truncate text-xs'>
                  {mail.email}
                </span>
              </div>
              <span className='text-text-muted hidden shrink-0 text-xs @md/reading:inline'>{mail.date}</span>
            </div>
            <div className={largeText ? 'grid gap-3 text-lg leading-8' : 'grid gap-3 text-sm leading-6'}>
              {mail.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {mail.highlight && <blockquote className='border-ui-border border-s-2 ps-3 text-sm'>{mail.highlight}</blockquote>}
            {mail.note && <section><h3 className='text-sm font-semibold'>My note</h3><p className='mt-1 text-sm'>{mail.note}</p></section>}
            <div className='flex flex-wrap gap-2 border-t pt-4'>
              <Button variant='outline' size='sm' onClick={() => onEdit('highlight')}>
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
            <MailEmpty title='Pick something to read' description='Choose an issue to open it here' />
          </div>
        )}
      </div>
    </CardRoot>
  );
}

/** Reading tools on the far edge, as icon buttons with tooltips; wide frames only. */
function AppRail({ onNavigate }) {
  return (
    <nav aria-label='Reading tools' className='hidden shrink-0 flex-col items-center gap-2 py-1 @[60rem]/mail:flex'>
      {shortcuts.map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <Button variant='outline' size='icon-sm' aria-label={item.label} className='bg-ui-background' onClick={() => onNavigate(item.id)}>
              <RegistryIcon lucide={item.icon} aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>{item.label}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}

const readerEmails = { 'dm-leo': me.email, 'dm-ines': 'ines@example.com', 'dm-tomas': 'tomas@example.com' };

function ReaderTools({ view, mails, subscriptions, setSubscriptions, largeText, setLargeText, onOpen }) {
  const title = [...links, ...shortcuts].find(item => item.id === view)?.label;
  const saved = mails.filter(mail => view === 'highlights' ? mail.highlight : mail.saved || mail.note);
  return <CardRoot as='section' variant='outline' padding='none' className='bg-ui-background min-w-0 flex-1 overflow-auto gap-0 p-4'>
    <header className='mb-4 flex items-center gap-2'><SidebarTrigger /><h1 className='text-lg font-semibold'>{title}</h1></header>
    {view === 'settings' && <Switch id='reader-large-text' label='Larger issue text' className='max-w-sm' checked={largeText} onCheckedChange={setLargeText} />}
    {view === 'subscriptions' && <ul className='grid max-w-lg gap-2'>{mailSeed.map(issue => <li key={issue.id}>
      <Item variant='outline' className='flex flex-wrap items-center justify-between'><span className='text-sm'>{issue.from}</span><Toggle size='sm' variant='outline' pressed={subscriptions.includes(issue.from)}
        onPressedChange={() => setSubscriptions(list => list.includes(issue.from) ? list.filter(from => from !== issue.from) : [...list, issue.from])}>{subscriptions.includes(issue.from) ? 'Subscribed' : 'Subscribe'}</Toggle></Item>
    </li>)}</ul>}
    {view === 'stats' && <dl className='grid max-w-sm gap-2'>{[['Read issues', mails.filter(m => m.folder !== 'sent' && !m.unread).length], ['Saved to notebook', mails.filter(m => m.saved || m.note).length], ['Highlights', mails.filter(m => m.highlight).length]].map(([label, count]) => <Item key={label} variant='outline' className='justify-between'><dt>{label}</dt><dd className='font-semibold'>{count}</dd></Item>)}</dl>}
    {['notebook', 'highlights'].includes(view) && (saved.length ? <ul className='grid max-w-2xl gap-2'>{saved.map(issue => <li key={issue.id}>
      <Item asChild variant='outline'><button type='button' className='grid w-full gap-1 text-start' onClick={() => onOpen(issue)}>
        <span className='font-medium'>{issue.subject}</span><span className='text-text-muted text-sm'>{view === 'highlights' ? issue.highlight : issue.note || issue.preview}</span>
      </button></Item>
    </li>)}</ul> : <MailEmpty title={view === 'highlights' ? 'No highlights yet' : 'Your notebook is empty'} description='Open an issue to save a passage or a reading note.' />)}
  </CardRoot>;
}

function AnnotationDialog({ mode, mail, onSave, onClose }) {
  const title = mode === 'highlight' ? 'Highlight a passage' : 'Edit reading note';
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className='sm:max-w-md'>
    <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{mail.subject}</DialogDescription></DialogHeader>
    <form className='grid gap-3' onSubmit={event => { event.preventDefault(); onSave(String(new FormData(event.currentTarget).get('value')).trim()); }}>
      <Field><FieldLabel htmlFor='reader-annotation'>{mode === 'highlight' ? 'Passage' : 'Note'}</FieldLabel>
        {mode === 'highlight' ? <NativeSelect name='value' id='reader-annotation' defaultValue={mail.highlight || mail.body[0]}>{mail.body.map((text, index) => <NativeSelectOption key={index} value={text}>{text}</NativeSelectOption>)}</NativeSelect> :
          <Textarea name='value' id='reader-annotation' required defaultValue={mail.note || ''} />}
      </Field>
      <DialogFooter><Button type='button' variant='outline' onClick={onClose}>Cancel</Button><Button type='submit'>Save</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
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
  const [annotation, setAnnotation] = useState(null);
  const [subscriptions, setSubscriptions] = useState(mailSeed.map(issue => issue.from));
  const [largeText, setLargeText] = useState(false);
  const [sharedIssue, setSharedIssue] = useState(null);
  const [recipient, setRecipient] = useState('');
  const subscribed = mail => subscriptions.includes(mail.from);
  const includesIssue = (mail, id) => {
    if (id === 'inbox') return mail.folder === 'inbox' && subscribed(mail) && (mail.unread || mail.id === selected);
    if (id === 'all-issues') return mail.folder === 'inbox';
    if (id === 'later') return mail.flagged && mail.folder !== 'trash';
    if (readerEmails[id]) return mail.folder === 'sent' && (id === 'dm-leo' || mail.email === readerEmails[id]);
    if (id === 'trash' || id === 'sent') return mail.folder === id;
    return mail.folder !== 'trash' && mail.tags.includes(labels.find(item => item.id === id)?.label);
  };
  const withCount = item => ({ ...item, badge: { label: mails.filter(mail => includesIssue(mail, item.id)).length, variant: 'plain' } });
  const unread = mails.filter((mail) => mail.folder === 'inbox' && mail.unread && subscribed(mail)).length;
  const folderItems = folders.map((item) => (item.id === 'inbox' ? { ...item, badge: unread ? { label: unread, variant: 'plain' } : undefined } : withCount(item)));
  const folderLabel = [...folders, ...labels, ...people, ...links].find((item) => item.id === folder)?.label ?? 'Unread';
  const needle = query.trim().toLowerCase();
  const visible = mails.filter(
    (mail) =>
      includesIssue(mail, folder) &&
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
  const share = (issue = null, email = '') => { setSharedIssue(issue); setRecipient(email); setComposeOpen(true); };
  const goFolder = (id) => {
    if (id === 'dm-invite') { share(); return; }
    setQuery(''); setFilters([]);
    setFolder(id);
    setSelected(null);
  };
  return (
    <AppShellFrame>
      {/* Several shells share the docs page, so this one leaves ⌘B to another and collapses from the list header. */}
      <SidebarProvider shortcut={false}>
        <Sidebar collapsible='icon'>
          <SidebarHeader>
            <AccountMenu onNavigate={goFolder} />
            <NewMailButton onClick={() => share()} />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Reading'>
            <AppShellNav label='Library' items={folderItems} value={folder} onValueChange={goFolder} />
            <AppShellNav
              label='Topics'
              items={labels.map(withCount)}
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
          {['subscriptions', 'settings', 'notebook', 'highlights', 'stats'].includes(folder) ?
            <ReaderTools view={folder} mails={mails} subscriptions={subscriptions} setSubscriptions={setSubscriptions} largeText={largeText} setLargeText={setLargeText}
              onOpen={issue => { goFolder(issue.folder === 'inbox' && !issue.unread ? 'all-issues' : issue.folder); open(issue.id); }} /> :
            <><MessageList
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
            onReadAll={() => setMails(list => list.map(entry => visible.some(issue => issue.id === entry.id) ? { ...entry, unread: false } : entry))}
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
            onCompose={() => share(mail, readerEmails[folder] || '')}
            onEdit={setAnnotation} largeText={largeText} topics={labels.filter(topic => topic.id !== 'trash')}
            onTopic={(label, checked) => update({ tags: checked ? [...new Set([...mail.tags, label])] : mail.tags.filter(tag => tag !== label) })}
          />
            </>}
          <AppRail onNavigate={goFolder} />
        </AppShellPanel>
      </SidebarProvider>
      {annotation && mail && <AnnotationDialog mode={annotation} mail={mail} onClose={() => setAnnotation(null)} onSave={value => { update({ [annotation]: value }); setAnnotation(null); }} />}
      {composeOpen && <ComposeDialog issue={sharedIssue} recipient={recipient}
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
      />}
      <LabelDialog
        open={labelOpen}
        onOpenChange={setLabelOpen}
        onCreate={(name) => {
          setLabels(list => list.some(item => item.label.toLowerCase() === name.toLowerCase()) ? list : [...list, { id: crypto.randomUUID(), label: name, icon: 'Hash' }]);
          setLabelOpen(false);
        }}
      />
    </AppShellFrame>
  );
}
