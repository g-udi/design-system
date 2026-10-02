'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const workspaces = ['Gaudi Editorial', 'Gaudi Labs', 'Reader Club'];
const pages = [
  { id: 'home', label: 'Home', icon: 'House', description: 'What changed across your workspace today.' },
  { id: 'drafts', label: 'Drafts', icon: 'SquarePen', count: 7, description: 'Seven drafts, two of them due this week.' },
  { id: 'published', label: 'Published', icon: 'BookOpen', description: 'Everything live on the site, newest first.' },
  { id: 'newsletter', label: 'Newsletter', icon: 'Send', count: 2, description: 'The Friday issue and one scheduled send.' },
  { id: 'readers', label: 'Readers', icon: 'Users', description: 'Subscribers, members and recent replies.' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', description: 'Reads, completion and sources for the last 30 days.' }
];
const recent = [
  { title: 'Small tools, long lifetimes', when: 'Edited 12 minutes ago' },
  { title: 'Friday issue #142', when: 'Edited 1 hour ago' },
  { title: 'Archive migration notes', when: 'Edited yesterday' }
];

// Unpinned, the rail shows icons and opens over the content while the pointer or focus is inside it; pinned, it stays open.
function PinnableSidebar({ pinned, onPinnedChange, peek, onPeekChange: setPeek, active, onSelect, favorites, onToggleFavorite }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const hover = isMobile || pinned
    ? {}
    : {
        onMouseEnter: () => setPeek(true),
        onMouseLeave: () => setPeek(false),
        onFocus: () => setPeek(true),
        onBlur: (event) => !event.currentTarget.contains(event.relatedTarget) && setPeek(false)
      };
  const select = (id) => {
    onSelect(id);
    if (isMobile) setOpenMobile(false);
  };
  const favouritePages = pages.filter((page) => favorites.includes(page.id));
  const item = (page, group) => (
    <SidebarMenuItem key={`${group}-${page.id}`}>
      <SidebarMenuButton tooltip={page.label} isActive={active === page.id} aria-current={active === page.id ? 'page' : undefined} onClick={() => select(page.id)}>
        <RegistryIcon lucide={page.icon} aria-hidden='true' />
        <span>{page.label}</span>
      </SidebarMenuButton>
      {page.count && group === 'pages' ? <SidebarMenuBadge className='me-6'>{page.count}</SidebarMenuBadge> : null}
      <SidebarMenuAction
        showOnHover={!favorites.includes(page.id)}
        aria-pressed={favorites.includes(page.id)}
        aria-label={`${favorites.includes(page.id) ? 'Remove' : 'Add'} ${page.label} ${favorites.includes(page.id) ? 'from' : 'to'} favorites`}
        onClick={() => onToggleFavorite(page.id)}
      >
        <RegistryIcon lucide='Star' className={favorites.includes(page.id) ? 'text-warning fill-current' : undefined} aria-hidden='true' />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
  return (
    <Sidebar
      collapsible='icon'
      className={`absolute h-full ${!pinned && peek ? 'shadow-lg' : ''}`}
      {...hover}
    >
      <SidebarContent>
        {favouritePages.length ? (
          <SidebarGroup>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu aria-label='Favorites'>{favouritePages.map((page) => item(page, 'favorites'))}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu aria-label='Pages'>{pages.map((page) => item(page, 'pages'))}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {isMobile ? null : (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={pinned ? 'Unpin sidebar' : 'Pin sidebar'} aria-pressed={pinned} onClick={() => onPinnedChange(!pinned)}>
                <RegistryIcon lucide={pinned ? 'PinOff' : 'Pin'} aria-hidden='true' />
                <span>{pinned ? 'Unpin sidebar' : 'Pin sidebar'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

export function Pattern() {
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [pinned, setPinned] = useState(true);
  const [peek, setPeek] = useState(false);
  const [active, setActive] = useState('drafts');
  const [favorites, setFavorites] = useState(['drafts', 'newsletter']);
  const page = pages.find((entry) => entry.id === active);
  const toggleFavorite = (id) => setFavorites((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));

  return (
    <SidebarProvider shortcut={false} open={pinned || peek} onOpenChange={setPinned} className='bg-surface relative h-[44rem] min-h-0 w-full flex-col overflow-hidden rounded-(--ds-radius-card) border'>
      {/* The top bar is scoped to the dark theme so its tokens invert without hand-rolled colours. */}
      <header className='dark bg-surface text-text z-20 flex h-14 shrink-0 items-center gap-2 border-b px-3'>
        <SidebarTrigger className='md:hidden' label='Open navigation' />
        <span className='flex items-center gap-2 font-semibold'>
          <RegistryIcon lucide='Layers' className='text-accent size-5' aria-hidden='true' />
          <span className='hidden sm:inline'>Gaudi</span>
        </span>
        <span aria-hidden='true' className='text-text-muted hidden sm:inline'>/</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='sm' variant='ghost' tone='neutral' aria-label={`Workspace: ${workspace}`} className='min-w-0'>
              <span className='max-w-32 truncate sm:max-w-48'>{workspace}</span>
              <RegistryIcon lucide='ChevronsUpDown' className='size-3.5' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={workspace} onValueChange={setWorkspace}>
              {workspaces.map((name) => <DropdownMenuRadioItem key={name} value={name}>{name}</DropdownMenuRadioItem>)}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem><RegistryIcon lucide='Plus' className='size-4' aria-hidden='true' />New workspace</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input type='search' aria-label='Search the workspace' placeholder='Search' className='ms-auto hidden w-56 md:block' />
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-label='Help' className='ms-auto md:ms-0'>
          <RegistryIcon lucide='CircleHelp' className='size-4' aria-hidden='true' />
        </Button>
        <Avatar className='size-8'>
          <AvatarImage src='https://randomuser.me/api/portraits/women/65.jpg' alt='Maya Lopez' />
          <AvatarFallback>ML</AvatarFallback>
        </Avatar>
      </header>
      {/* Unpinned, the gap stays at icon width so the peeking rail overlays the content instead of pushing it. */}
      <div className={`relative flex min-h-0 flex-1 ${pinned ? '' : '[&_[data-slot=sidebar-gap]]:w-(--sidebar-width-icon)!'}`}>
        <PinnableSidebar pinned={pinned} onPinnedChange={(value) => { setPinned(value); setPeek(false); }} peek={peek} onPeekChange={setPeek} active={active} onSelect={setActive} favorites={favorites} onToggleFavorite={toggleFavorite} />
        <SidebarInset className='min-h-0 min-w-0'>
          <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
            <div className='mx-auto grid max-w-3xl gap-6'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-text-muted text-xs'>{workspace}</p>
                  <h1 className='text-xl font-semibold'>{page.label}</h1>
                  <p className='text-text-muted mt-1 text-sm'>{page.description}</p>
                </div>
                <Button
                  size='sm'
                  variant='outline'
                  tone='neutral'
                  aria-pressed={favorites.includes(page.id)}
                  onClick={() => toggleFavorite(page.id)}
                >
                  <RegistryIcon lucide='Star' className={favorites.includes(page.id) ? 'text-warning size-4 fill-current' : 'size-4'} aria-hidden='true' />
                  {favorites.includes(page.id) ? 'Favorited' : 'Favorite'}
                </Button>
              </div>
              <section aria-labelledby='app-shell-13-recent' className='grid gap-2'>
                <h2 id='app-shell-13-recent' className='text-sm font-medium'>Recently edited</h2>
                <ul className='divide-y rounded-(--ds-radius-card) border'>
                  {recent.map((entry) => (
                    <li key={entry.title} className='flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm'>
                      <span className='min-w-0 truncate font-medium'>{entry.title}</span>
                      <span className='text-text-muted text-xs'>{entry.when}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
