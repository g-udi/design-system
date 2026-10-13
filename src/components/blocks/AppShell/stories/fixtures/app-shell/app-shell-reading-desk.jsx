'use client';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from '@gaudi/design-system/core/Commander';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import Button from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import { default as Kbd } from '@gaudi/design-system/core/Kbd';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';

const shelves = [
  { id: 'personal', name: 'Personal Shelf', initial: 'P', tone: 'bg-ui-foreground text-ui-background' },
  { id: 'book-club', name: 'Book Club', initial: 'B', tone: 'bg-success text-success-foreground' },
  { id: 'lab', name: 'Lab Reading Group', initial: 'L', tone: 'bg-info text-info-foreground' }
];
const reading = [
  { id: 'today', label: 'Today', icon: 'Compass' },
  {
    id: 'queue',
    label: 'Queue',
    icon: 'Bookmark',
    defaultOpen: true,
    defaultValue: 'articles',
    items: [
      { id: 'articles', label: 'Articles' },
      { id: 'papers', label: 'Papers' },
      { id: 'long-reads', label: 'Long Reads' }
    ]
  },
  {
    id: 'highlights',
    label: 'Highlights',
    icon: 'Quote',
    items: [
      { id: 'by-book', label: 'By Book' },
      { id: 'by-topic', label: 'By Topic' },
      { id: 'flashcards', label: 'Flashcards' }
    ]
  },
  { id: 'digest', label: 'Digest', icon: 'Inbox', indicator: 'success', status: 'new issue' },
  { id: 'summaries', label: 'Summaries', icon: 'Sparkles' },
  { id: 'archive', label: 'Archive', icon: 'Archive' }
];
const links = [
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'share', label: 'Share a Shelf', icon: 'UserPlus' },
  { id: 'guide', label: 'Reading Guide', icon: 'BookOpen' }
];
const pages = [...reading, ...links].flatMap((item) =>
  item.items ? item.items.map((child) => ({ ...child, section: item.label })) : [item]
);
const user = { handle: '@leila', initial: 'L', photo: '/avatars/person-14.svg' };
// Raised rows on the floating card: the current page sits on the plain surface with a hairline.
const raised =
  'data-active:bg-ui-background data-active:shadow-xs data-active:ring-1 data-active:ring-ui-sidebar-border';

function ShelfTile({ shelf, className = 'size-5' }) {
  return (
    <span aria-hidden='true' className={`grid shrink-0 place-items-center rounded-(--ds-radius-control) text-[0.625rem] font-semibold ${shelf.tone} ${className}`}>
      {shelf.initial}
    </span>
  );
}

function Brand() {
  return (
    <div className='flex items-center gap-2 group-data-[collapsible=icon]:flex-col'>
      <Link
        variant='bare'
        href='#today'
        aria-label='Gaudi Reader'
        className='flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) px-1 py-1 text-sm font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ui-sidebar-ring group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-0'
        onClick={(event) => event.preventDefault()}
      >
        <GaudiLogo aria-hidden='true' className='hidden size-7 group-data-[collapsible=icon]:block' />
        <span className='flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:hidden'><GaudiBrand className='text-sm' /><span className='truncate'>Reader</span></span>
      </Link>
      <SidebarTrigger />
    </div>
  );
}

function SearchButton({ onOpen, shortcut }) {
  return (
    <Button
      variant='outline'
      size='sm'
      className='ms-auto text-text-muted'
      onClick={onOpen}
      aria-label='Search'
      aria-keyshortcuts={shortcut.ariaKeyShortcuts}
    >
      <RegistryIcon lucide='Search' aria-hidden='true' />
      <span className='hidden sm:inline'>Search the shelf</span>
      <span aria-hidden='true' className='hidden sm:inline'>
        <Kbd keys={shortcut.kbdKeys} size='sm' />
      </span>
    </Button>
  );
}

function ShelfSwitcher({ shelf, onChange }) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton aria-label={`Shelf: ${shelf.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <ShelfTile shelf={shelf} />
              <span className='truncate font-medium'>{shelf.name}</span>
              <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-56'>
            <DropdownMenuRadioGroup
              value={shelf.id}
              onValueChange={(id) => onChange(shelves.find((entry) => entry.id === id))}
            >
              {shelves.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
                  <ShelfTile shelf={entry} />
                  {entry.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='Plus' aria-hidden='true' />
              New Shelf
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Settings' aria-hidden='true' />
              Reading Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='LogOut' aria-hidden='true' />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function PageHeader({ shelf, page, search }) {
  const { isMobile } = useSidebar();
  return (
    <AppShellHeader>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <Breadcrumb className='min-w-0'>
        <BreadcrumbList className='flex-nowrap'>
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbLink href='#shelf' className='flex items-center gap-1.5' onClick={(event) => event.preventDefault()}>
              <ShelfTile shelf={shelf} />
              {/* Narrow frames keep the marks and speak the names. */}
              <span className={isMobile ? 'sr-only' : 'truncate'}>{shelf.name}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbLink href='#profile' className='flex items-center gap-1.5' onClick={(event) => event.preventDefault()}>
              <Avatar className='size-5'>
                <AvatarImage src={user.photo} alt='' />
                <AvatarFallback>{user.initial}</AvatarFallback>
              </Avatar>
              <span className={isMobile ? 'sr-only' : 'truncate'}>{user.handle}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbPage className='truncate'>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {search}
    </AppShellHeader>
  );
}

export function Pattern() {
  const [page, setPage] = useState('today');
  const [shelf, setShelf] = useState(shelves[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  // ⌘K on macOS, Ctrl+K elsewhere, from anywhere on the page.
  const shortcut = useHotkey('mod+k', () => setSearchOpen((open) => !open), { enableInInputs: true });
  const go = (id) => {
    setPage(id);
    setSearchOpen(false);
  };
  const current = pages.find((entry) => entry.id === page);
  return (
    <AppShellFrame surface='default'>
      <SidebarProvider>
        <Sidebar variant='floating' collapsible='icon'>
          <SidebarHeader>
            <Brand />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Reader'>
            <AppShellNav label='Reading' items={reading} value={page} onValueChange={setPage} itemClassName={raised} />
            <AppShellNav className='mt-auto' size='sm' items={links} value={page} onValueChange={setPage} itemClassName={raised} />
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator className='mx-0' />
            <ShelfSwitcher shelf={shelf} onChange={setShelf} />
          </SidebarFooter>
        </Sidebar>
        <AppShellPanel inset={false}>
          <PageHeader
            shelf={shelf}
            page={current?.label ?? 'Today'}
            search={<SearchButton onOpen={() => setSearchOpen(true)} shortcut={shortcut} />}
          />
          <AppShellBody>
            {/* A centred reading column: title, byline and paragraphs. */}
            <div aria-hidden='true' className='mx-auto grid w-full max-w-xl gap-3 p-6'><Skeleton className='h-8 w-3/4' /><Skeleton className='h-4 w-1/3' /><Skeleton className='mt-3 h-40' /><Skeleton className='h-4' /><Skeleton className='h-4' /><Skeleton className='h-4 w-5/6' /></div>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title='Search' description='Search your shelf and reading pages.'>
        <Command>
          <CommandInput placeholder='Search pages and actions...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Pages'>
              {pages.map((entry) => (
                <CommandItem key={entry.id} value={`${entry.section ?? ''} ${entry.label}`} onSelect={() => go(entry.id)}>
                  <RegistryIcon lucide={entry.icon || 'CornerDownRight'} aria-hidden='true' />
                  {entry.section ? <span className='text-text-muted'>{entry.section} /</span> : null}
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading='Actions'>
              <CommandItem onSelect={() => go('share')}>
                <RegistryIcon lucide='UserPlus' aria-hidden='true' />
                Share this shelf
              </CommandItem>
              <CommandItem onSelect={() => go('settings')}>
                <RegistryIcon lucide='Settings' aria-hidden='true' />
                Open settings
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </AppShellFrame>
  );
}
