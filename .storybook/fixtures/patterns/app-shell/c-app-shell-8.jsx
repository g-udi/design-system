'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { Field, FieldInput, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../../../src/components/core/Input/parts/input-group.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
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
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AppShellFrame, AppShellPanel } from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const me = { name: 'Nina Park', email: 'nina@gaudi.dev', photo: '/avatars/women/44.jpg' };
const folders = [
  { id: 'inbox', label: 'Inbox', icon: 'Inbox' },
  { id: 'draft', label: 'Draft', icon: 'FileText', badge: { label: 45, variant: 'plain' } },
  { id: 'sent', label: 'Sent', icon: 'Send', badge: { label: 9, variant: 'plain' } }
];
const labelSeed = [
  { id: 'archive', label: 'Archive', icon: 'Archive', badge: { label: 12, variant: 'plain' } },
  { id: 'snoozed', label: 'Snoozed', icon: 'Clock', badge: { label: 4, variant: 'plain' } },
  { id: 'spam', label: 'Spam', icon: 'TriangleAlert', badge: { label: 3, variant: 'plain' } },
  { id: 'trash', label: 'Trash', icon: 'Trash2', badge: { label: 34, variant: 'plain' } }
];
const people = [
  { id: 'dm-nina', label: 'Nina Park', suffix: '(You)', avatar: me.photo, presence: 'success' },
  { id: 'dm-sarah', label: 'Sarah Chen', avatar: '/avatars/women/68.jpg' },
  { id: 'dm-marcus', label: 'Marcus Lee', avatar: '/avatars/men/46.jpg' },
  { id: 'dm-invite', label: 'Add Teammates', icon: 'Plus' }
];
const links = [
  { id: 'support', label: 'Support', icon: 'Headphones' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'feedback', label: 'Feedback', icon: 'MessageSquare' }
];
const categories = ['Primary', 'Social', 'Promotions', 'Updates', 'Forums', 'Shopping', 'Travel', 'Finance', 'Newsletters'];
const shortcuts = [
  { id: 'profile', label: 'Profile', icon: 'UserRound' },
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
  { id: 'account', label: 'Account', icon: 'Settings' },
  { id: 'network', label: 'Network', icon: 'Users' },
  { id: 'authentication', label: 'Authentication', icon: 'ShieldCheck' }
];
const mailSeed = [
  {
    id: 'roadmap',
    folder: 'inbox',
    from: 'Sarah Chen',
    email: 'sarah@northwind.io',
    photo: '/avatars/women/68.jpg',
    time: '9:41 AM',
    date: 'Today, 9:41 AM',
    subject: 'Q4 roadmap review',
    preview: 'Sharing the draft roadmap before Thursday. The billing work moved up a sprint.',
    body: [
      'Hi Nina,',
      'Sharing the draft roadmap before Thursday. The billing work moved up a sprint, so onboarding now lands in the second half of the quarter.',
      'Could you check the dependencies on the design side and flag anything that looks tight? I would like to send the final version to the leads on Friday.',
      'Thanks, Sarah'
    ],
    category: 'Primary',
    tags: ['Work'],
    unread: true
  },
  {
    id: 'invoice',
    folder: 'inbox',
    from: 'Stripe',
    email: 'receipts@stripe.com',
    photo: '/avatars/men/75.jpg',
    time: '8:12 AM',
    date: 'Today, 8:12 AM',
    subject: 'Your receipt from Gaudi Labs #2041',
    preview: 'Amount paid $1,240.00. Payment method Visa ending in 4242.',
    body: ['Amount paid: $1,240.00', 'Payment method: Visa ending in 4242', 'If you have any questions, reply to this email or contact our support team.'],
    category: 'Finance',
    tags: ['Billing'],
    unread: true
  },
  {
    id: 'standup',
    folder: 'inbox',
    from: 'Marcus Lee',
    email: 'marcus@gaudi.dev',
    photo: '/avatars/men/46.jpg',
    time: 'Yesterday',
    date: 'Yesterday, 4:05 PM',
    subject: 'Standup notes and the release checklist',
    preview: 'Notes from today, plus the checklist for Monday. Two items still need an owner.',
    body: [
      'Notes from today are in the doc, plus the checklist for Monday.',
      'Two items still need an owner: the changelog and the status page update. Can you take one of them?',
      'Marcus'
    ],
    category: 'Updates',
    tags: ['Work', 'Release'],
    unread: true
  },
  {
    id: 'lisbon',
    folder: 'inbox',
    from: 'TAP Air Portugal',
    email: 'booking@flytap.com',
    photo: '/avatars/women/12.jpg',
    time: 'Mon',
    date: 'Monday, 7:30 AM',
    subject: 'Your trip to Lisbon is confirmed',
    preview: 'Booking reference K7Q2PL. Check in opens 36 hours before departure.',
    body: ['Booking reference: K7Q2PL', 'Departure: Friday 18 October, 07:15', 'Check in opens 36 hours before departure. Have a good trip.'],
    category: 'Travel',
    tags: ['Personal']
  },
  {
    id: 'design-review',
    folder: 'inbox',
    from: 'Priya Natarajan',
    email: 'priya@gaudi.dev',
    photo: '/avatars/women/26.jpg',
    time: 'Sun',
    date: 'Sunday, 6:48 PM',
    subject: 'Design review: inbox density',
    preview: 'I tried the compact rows with real data. Previews read better on two lines.',
    body: [
      'I tried the compact rows with real data. Previews read better on two lines, and the labels can move under the subject.',
      'Prototype link is in the thread. Happy to walk through it tomorrow.'
    ],
    category: 'Primary',
    tags: ['Design']
  },
  {
    id: 'newsletter',
    folder: 'inbox',
    from: 'Frontend Weekly',
    email: 'hello@frontendweekly.dev',
    photo: '/avatars/men/22.jpg',
    time: 'Sat',
    date: 'Saturday, 10:00 AM',
    subject: 'Container queries in production',
    preview: 'This week: container queries at scale, view transitions and a CSS reset that lasts.',
    body: ['This week: container queries at scale, view transitions, and a CSS reset that lasts.'],
    category: 'Newsletters',
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
              <Avatar className='size-8 rounded-full group-data-[collapsible=icon]:-ms-1'>
                <AvatarImage src={me.photo} alt='' className='rounded-full' />
                <AvatarFallback className='rounded-full'>NP</AvatarFallback>
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
              <RegistryIcon lucide='User' aria-hidden='true' />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Settings' aria-hidden='true' />
              Settings
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
      aria-label='New mail'
      className={rail ? 'size-8 self-center p-0' : 'w-full'}
      onClick={() => {
        // The compose dialog replaces the phone sheet.
        if (isMobile) setOpenMobile(false);
        onClick();
      }}
    >
      <RegistryIcon lucide='SquarePen' aria-hidden='true' />
      {rail ? null : 'New Mail'}
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
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Write and send a new email.</DialogDescription>
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
            <FieldInput id='app-shell-8-to' type='email' required placeholder='name@company.com' value={to} onChange={(event) => setTo(event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor='app-shell-8-subject'>Subject</FieldLabel>
            <FieldInput id='app-shell-8-subject' placeholder='Project update' value={subject} onChange={(event) => setSubject(event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor='app-shell-8-message'>Message</FieldLabel>
            <Textarea id='app-shell-8-message' rows={3} placeholder='Write your message...' value={body} onChange={(event) => setBody(event.target.value)} />
          </Field>
        </form>
        <DialogFooter className='flex-row items-center sm:justify-between'>
          <Button variant='outline' size='sm'>
            <RegistryIcon lucide='Paperclip' aria-hidden='true' />
            Attach
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
          <DialogTitle>Create Label</DialogTitle>
          <DialogDescription>Group related mail under a label.</DialogDescription>
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
            <FieldInput id='app-shell-8-label-name' required placeholder='Clients' value={name} onChange={(event) => setName(event.target.value)} />
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
          <RegistryIcon lucide='Inbox' aria-hidden='true' />
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
          <InputGroupInput aria-label='Search mail' placeholder='Search...' value={query} onChange={(event) => onQuery(event.target.value)} />
        </InputGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='text-text-muted shrink-0 gap-1 px-2' aria-label={filters.length ? `Categories, ${filters.length} selected` : 'Categories'}>
              <span className='hidden @md:inline'>Categories</span>
              <RegistryIcon lucide='ListFilter' aria-hidden='true' className='@md:hidden' />
              {filters.length ? <Badge variant='secondary' size='xs'>{filters.length}</Badge> : null}
              <RegistryIcon lucide='ChevronDown' aria-hidden='true' className='hidden @md:inline' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
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
        <Button variant='ghost' size='icon-sm' aria-label='Refresh' className='shrink-0'>
          <RegistryIcon lucide='RefreshCw' aria-hidden='true' />
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
            title="It's empty here"
            description={
              <>
                Search for another email or{' '}
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
        <Badge variant='secondary' size='sm' className='ms-1 hidden font-medium @lg/reading:inline-flex'>Normal</Badge>
        <ToolbarButton
          label={mail?.unread ? 'Mark as read' : 'Mark as unread'}
          icon={mail?.unread ? 'Eye' : 'EyeOff'}
          disabled={none}
          onClick={() => onUpdate({ unread: !mail.unread })}
        />
        <div className='ms-auto flex items-center gap-0.5'>
          <Button variant='outline' size='xs' disabled={none} className='me-1'>
            <RegistryIcon lucide='Reply' aria-hidden='true' />
            Reply All
          </Button>
          <ToolbarButton label='Notes' icon='FileText' disabled={none} className='hidden @2xl/reading:inline-flex' />
          <ToolbarButton label='Flag message' icon='Flag' pressed={Boolean(mail?.flagged)} disabled={none} onClick={() => onUpdate({ flagged: !mail.flagged })} className='hidden @lg/reading:inline-flex' />
          <ToolbarButton label='Star message' icon='Star' pressed={Boolean(mail?.starred)} disabled={none} onClick={() => onUpdate({ starred: !mail.starred })} />
          <ToolbarButton label='Copy' icon='Copy' disabled={none} className='hidden @2xl/reading:inline-flex' />
          <ToolbarButton label='Delete message' icon='Trash2' tone='danger' disabled={none} onClick={onDelete} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon-sm' aria-label='More options' disabled={none}>
                <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>
                <RegistryIcon lucide='Reply' aria-hidden='true' />
                Forward
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Clock' aria-hidden='true' />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='TriangleAlert' aria-hidden='true' />
                Mark as spam
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <RegistryIcon lucide='Download' aria-hidden='true' />
                Download
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
                  {mail.email} · to me
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
                <RegistryIcon lucide='Reply' aria-hidden='true' />
                Reply
              </Button>
              <Button variant='outline' size='sm' onClick={onCompose}>
                <RegistryIcon lucide='Send' aria-hidden='true' />
                Forward
              </Button>
            </div>
          </article>
        ) : (
          <div className='flex h-full items-center justify-center'>
            <MailEmpty title="It's empty here" description='Choose an email to view details'>
              <Button variant='outline' size='xs'>
                <RegistryIcon lucide='Sparkles' aria-hidden='true' />
                Ask AI
              </Button>
              <Button variant='outline' size='xs' onClick={onCompose}>
                <RegistryIcon lucide='Mail' aria-hidden='true' />
                Send Email
              </Button>
              <Button variant='outline' size='xs' onClick={onCompose}>
                <RegistryIcon lucide='Plus' aria-hidden='true' />
                New Email
              </Button>
            </MailEmpty>
          </div>
        )}
      </div>
    </section>
  );
}

/** App shortcuts on the far edge, as icon buttons with tooltips; wide frames only. */
function AppRail() {
  return (
    <nav aria-label='Apps' className='hidden shrink-0 flex-col items-center gap-2 py-1 @[60rem]/mail:flex'>
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
          <Button variant='outline' size='icon-sm' aria-label='Add shortcut' className='bg-ui-background'>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='left'>Add shortcut</TooltipContent>
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
  const folderLabel = [...folders, ...labels, ...people, ...links].find((item) => item.id === folder)?.label ?? 'Inbox';
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
          <SidebarContent role='navigation' aria-label='Mailboxes'>
            <AppShellNav label='Mail' items={folderItems} value={folder} onValueChange={goFolder} />
            <AppShellNav
              label='Labels'
              items={labels}
              value={folder}
              onValueChange={goFolder}
              action={
                <SidebarGroupAction aria-label='Create label' onClick={() => setLabelOpen(true)}>
                  <RegistryIcon lucide='Plus' aria-hidden='true' />
                </SidebarGroupAction>
              }
            />
            <AppShellNav label='Direct Messages' items={people} value={folder} onValueChange={goFolder} />
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
              preview: body || 'No message',
              body: body ? [body] : ['No message'],
              category: 'Primary',
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
          setLabels((list) => [...list, { id: `label-${name.toLowerCase().replace(/\W+/g, '-')}`, label: name, icon: 'Tag' }]);
          setLabelOpen(false);
        }}
      />
    </AppShellFrame>
  );
}
