'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../../src/components/core/Resizable/parts/resizable.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { useMediaQuery } from '../../../../src/hooks/use-media-query.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const appRail = [
  { id: 'mail', label: 'Mail', icon: 'Mail' },
  { id: 'calendar', label: 'Calendar', icon: 'CalendarDays' },
  { id: 'contacts', label: 'Contacts', icon: 'Users' },
  { id: 'files', label: 'Files', icon: 'Folder' }
];
const folders = [
  { id: 'inbox', label: 'Inbox', icon: 'Inbox', count: 3 },
  { id: 'starred', label: 'Starred', icon: 'Star' },
  { id: 'sent', label: 'Sent', icon: 'Send' },
  { id: 'archive', label: 'Archive', icon: 'Archive' },
  { id: 'trash', label: 'Trash', icon: 'Trash2' }
];
const labels = [{ id: 'readers', label: 'Readers', tone: 'bg-info' }, { id: 'sponsors', label: 'Sponsors', tone: 'bg-success' }, { id: 'press', label: 'Press', tone: 'bg-warning' }];
const initialMessages = [
  { id: 'm1', from: 'Priya Natarajan', avatar: 'women/44', subject: 'Notes on the September issue', preview: 'I read the draft on the train. Two small things before it goes out…', when: '09:42', unread: true, starred: false, label: 'Readers', body: ['I read the draft on the train this morning, and it is in great shape.', 'Two small things before it goes out: the second chart needs a source line, and the intro could lose a sentence. Happy to pair on it after lunch.'] },
  { id: 'm2', from: 'Daniel Okafor', avatar: 'men/52', subject: 'Sponsorship for Q4', preview: 'We would love to sponsor three issues in October and November…', when: '08:15', unread: true, starred: true, label: 'Sponsors', body: ['We would love to sponsor three issues in October and November.', 'Could you send over your media kit and the rates for a featured slot?'] },
  { id: 'm3', from: 'Ana Ruiz', avatar: 'women/68', subject: 'Interview request', preview: 'I am writing a piece on independent publishers and would…', when: 'Yesterday', unread: true, starred: false, label: 'Press', body: ['I am writing a piece on independent publishers and would love twenty minutes with you next week.'] },
  { id: 'm4', from: 'Tom Becker', avatar: 'men/32', subject: 'Re: archive migration', preview: 'Batch two finished overnight. One image path needs fixing.', when: 'Mon', unread: false, starred: false, label: 'Readers', body: ['Batch two finished overnight. One image path needs fixing, otherwise everything matches.'] }
];

export function Pattern() {
  const [app, setApp] = useState('mail');
  const [folder, setFolder] = useState('inbox');
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState('m1');
  const [query, setQuery] = useState('');
  const wide = useMediaQuery('(min-width: 1024px)', true);
  const selected = messages.find((message) => message.id === selectedId);
  const visible = messages.filter((message) => `${message.from} ${message.subject}`.toLowerCase().includes(query.toLowerCase()));

  const open = (id) => {
    setSelectedId(id);
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, unread: false } : message)));
  };
  const toggleStar = () => setMessages((current) => current.map((message) => (message.id === selectedId ? { ...message, starred: !message.starred } : message)));
  const remove = () => {
    setMessages((current) => current.filter((message) => message.id !== selectedId));
    setSelectedId(null);
  };

  const list = (
    <div className='flex h-full min-h-0 flex-col'>
      <div className='border-b p-3'>
        <Input type='search' aria-label='Search mail' placeholder='Search mail' value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <ul className='min-h-0 flex-1 divide-y overflow-y-auto' aria-label='Messages'>
        {visible.map((message) => (
          <li key={message.id}>
            <button type='button' aria-current={message.id === selectedId ? 'true' : undefined} onClick={() => open(message.id)} className='hover:bg-surface-muted aria-[current=true]:bg-accent-subtle grid w-full gap-0.5 px-4 py-3 text-start text-sm'>
              <span className='flex items-center gap-2'>
                {message.unread ? <span className='bg-accent size-2 shrink-0 rounded-full'><span className='sr-only'>Unread</span></span> : null}
                <span className={message.unread ? 'truncate font-semibold' : 'truncate font-medium'}>{message.from}</span>
                <span className='text-text-muted ms-auto shrink-0 text-xs'>{message.when}</span>
              </span>
              <span className='truncate'>{message.subject}</span>
              <span className='text-text-muted truncate text-xs'>{message.preview}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const reading = selected ? (
    <article className='flex h-full min-h-0 flex-col' aria-labelledby='mail-subject'>
      <div className='flex items-center gap-1 border-b px-3 py-2'>
        <Button size='icon-sm' variant='ghost' tone='neutral' className='lg:hidden' aria-label='Back to messages' onClick={() => setSelectedId(null)}>
          <RegistryIcon lucide='ChevronLeft' className='size-4' aria-hidden='true' />
        </Button>
        <Button size='sm' variant='ghost' tone='neutral'><RegistryIcon lucide='Reply' className='size-4' aria-hidden='true' />Reply</Button>
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-pressed={selected.starred} aria-label={selected.starred ? 'Unstar' : 'Star'} onClick={toggleStar}>
          <RegistryIcon lucide='Star' className={selected.starred ? 'text-warning size-4 fill-current' : 'size-4'} aria-hidden='true' />
        </Button>
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-label='Archive'><RegistryIcon lucide='Archive' className='size-4' aria-hidden='true' /></Button>
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-label='Delete' onClick={remove}><RegistryIcon lucide='Trash2' className='size-4' aria-hidden='true' /></Button>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
        <div className='flex items-start gap-3'>
          <Avatar className='size-9'><AvatarImage src={`https://randomuser.me/api/portraits/${selected.avatar}.jpg`} alt='' /><AvatarFallback>{selected.from[0]}</AvatarFallback></Avatar>
          <div className='min-w-0 flex-1'>
            <h2 id='mail-subject' className='font-semibold'>{selected.subject}</h2>
            <p className='text-text-muted text-sm'>{selected.from} · {selected.when}</p>
          </div>
          <Badge variant='secondary'>{selected.label}</Badge>
        </div>
        <Separator className='my-4' />
        <div className='grid max-w-prose gap-3 text-sm leading-relaxed'>{selected.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </div>
    </article>
  ) : (
    <p className='text-text-muted grid h-full place-items-center p-6 text-sm'>Select a message to read it.</p>
  );

  return (
    <SidebarProvider shortcut={false} className='bg-surface relative h-[44rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border' style={{ '--sidebar-width': '14rem' }}>
      <nav aria-label='Gaudi apps' className='bg-surface-muted hidden w-12 shrink-0 flex-col items-center gap-1 border-e py-3 md:flex'>
        {appRail.map((entry) => (
          <Tooltip key={entry.id}>
            <TooltipTrigger asChild>
              <Button size='icon-sm' variant={app === entry.id ? 'soft' : 'ghost'} tone='neutral' aria-label={entry.label} aria-current={app === entry.id ? 'page' : undefined} onClick={() => setApp(entry.id)}>
                <RegistryIcon lucide={entry.icon} className='size-4' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='right'>{entry.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <Sidebar collapsible='offcanvas' className='absolute h-full md:left-12!'>
        <SidebarHeader>
          <Button size='sm' className='w-full'><RegistryIcon lucide='SquarePen' className='size-4' aria-hidden='true' />Compose</Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu aria-label='Folders'>
                {folders.map((entry) => (
                  <SidebarMenuItem key={entry.id}>
                    <SidebarMenuButton isActive={folder === entry.id} aria-current={folder === entry.id ? 'page' : undefined} onClick={() => setFolder(entry.id)}>
                      <RegistryIcon lucide={entry.icon} aria-hidden='true' />
                      <span>{entry.label}</span>
                    </SidebarMenuButton>
                    {entry.id === 'inbox' ? <SidebarMenuBadge>{messages.filter((message) => message.unread).length}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Labels</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {labels.map((entry) => (
                  <SidebarMenuItem key={entry.id}>
                    <SidebarMenuButton>
                      <span aria-hidden='true' className={`size-2 rounded-full ${entry.tone}`} />
                      <span>{entry.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className='min-h-0 min-w-0'>
        <header className='flex h-12 shrink-0 items-center gap-2 border-b px-3'>
          <SidebarTrigger />
          <h1 className='text-sm font-medium'>{folders.find((entry) => entry.id === folder)?.label}</h1>
        </header>
        <div className='min-h-0 flex-1'>
          {wide ? (
            <ResizablePanelGroup orientation='horizontal'>
              <ResizablePanel defaultSize='40%' minSize='28%'>{list}</ResizablePanel>
              <ResizableHandle withHandle aria-label='Resize message list' />
              <ResizablePanel defaultSize='60%' minSize='35%'>{reading}</ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            // Below lg one pane shows at a time: the list, or the open message with a back button.
            selectedId ? reading : list
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
