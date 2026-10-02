'use client';
import { useState } from 'react';
import { default as AppShell } from '../../../../src/components/blocks/AppShell/index.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../../../src/components/core/Commander/parts/command.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const sectionsNav = ['Overview', 'Content', 'Audience', 'Revenue', 'Settings'];
const views = [
  { id: 'all', label: 'All', count: 128 },
  { id: 'drafts', label: 'Drafts', count: 6 },
  { id: 'review', label: 'In review', count: 2 },
  { id: 'scheduled', label: 'Scheduled', count: 3 },
  { id: 'published', label: 'Published', count: 109 },
  { id: 'series', label: 'Series', count: 4 },
  { id: 'pages', label: 'Pages', count: 7 },
  { id: 'archived', label: 'Archived', count: 21 }
];
const routes = ['Overview', 'Content · Drafts', 'Content · Published', 'Audience · Subscribers', 'Revenue · Memberships', 'Settings · Domains'];
const notifications = [
  { id: 1, who: 'Priya Natarajan', avatar: 'women/44', text: 'commented on “Notes on local-first software”', when: '5m' },
  { id: 2, who: 'Tom Becker', avatar: 'men/32', text: 'scheduled “Small tools, long lifetimes” for Friday', when: '1h' },
  { id: 3, who: 'Ana Ruiz', avatar: 'women/68', text: 'joined as a contributor', when: 'Yesterday' }
];
const rows = [
  ['Notes on local-first software', 'In review', 'warning-light', 'Priya Natarajan'],
  ['Small tools, long lifetimes', 'Scheduled', 'info-light', 'Tom Becker'],
  ['Designing for real data', 'Draft', 'secondary', 'Maya Lopez']
];

export function Pattern() {
  const [section, setSection] = useState('Content');
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className='h-[44rem] w-full overflow-hidden rounded-(--ds-radius-card) border'>
      <AppShell
        layout='topbar'
        className='h-full min-h-0 [&_.ds-app-workspace]:min-h-0 [&_.ds-app-body]:min-h-0 [&_.ds-app-body]:overflow-y-auto'
        brand={<span className='flex items-center gap-2'><RegistryIcon lucide='PenTool' className='text-accent size-5' aria-hidden='true' />Gaudi</span>}
        navigationLabel='Sections'
        navigation={
          <ul className='flex gap-1'>
            {sectionsNav.map((label) => (
              <li key={label}>
                <a href={`#${label.toLowerCase()}`} aria-current={section === label ? 'page' : undefined} onClick={(event) => { event.preventDefault(); setSection(label); }} className='hover:bg-surface-muted aria-[current=page]:bg-accent-subtle aria-[current=page]:text-accent block rounded-(--ds-radius-pill) px-3 py-1.5 text-sm whitespace-nowrap'>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        }
        header={
          <div className='ms-auto flex items-center gap-1'>
            <Button size='sm' variant='outline' tone='neutral' className='text-text-muted' aria-label='Search routes' onClick={() => setSearchOpen(true)}>
              <RegistryIcon lucide='Search' className='size-4' aria-hidden='true' />
              <span className='hidden sm:inline'>Go to…</span>
              <Kbd className='hidden sm:inline-flex' aria-hidden='true'>/</Kbd>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size='icon-sm' variant='ghost' tone='neutral' aria-label={`Notifications, ${notifications.length} new`}>
                  <RegistryIcon lucide='Bell' className='size-4' aria-hidden='true' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' inset size='sm'>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>What changed while you were away.</SheetDescription>
                </SheetHeader>
                <ul className='divide-y px-4'>
                  {notifications.map((item) => (
                    <li key={item.id} className='flex gap-3 py-3 text-sm'>
                      <Avatar className='size-8'><AvatarImage src={`https://randomuser.me/api/portraits/${item.avatar}.jpg`} alt='' /><AvatarFallback>{item.who[0]}</AvatarFallback></Avatar>
                      <p className='min-w-0'><span className='font-medium'>{item.who}</span> <span className='text-text-muted'>{item.text}</span><span className='text-text-muted block text-xs'>{item.when}</span></p>
                    </li>
                  ))}
                </ul>
              </SheetContent>
            </Sheet>
            <Avatar className='size-8'><AvatarImage src='https://randomuser.me/api/portraits/women/65.jpg' alt='Maya Lopez' /><AvatarFallback>ML</AvatarFallback></Avatar>
          </div>
        }
      >
        <Tabs defaultValue='all' className='gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h1 className='flex items-center gap-2 text-xl font-semibold'>
              {section}
              <Badge variant='secondary'>{views[0].count}</Badge>
            </h1>
            <Button size='sm'><RegistryIcon lucide='Plus' className='size-4' aria-hidden='true' />New post</Button>
          </div>
          {/* Eight views stay on one segmented track that scrolls sideways on its own. */}
          <div className='-mx-1 overflow-x-auto px-1 pb-1'>
            <TabsList variant='outline' aria-label='Views' className='w-max'>
              {views.map((view) => (
                <TabsTrigger key={view.id} value={view.id} className='gap-1.5 whitespace-nowrap'>
                  {view.label}
                  <span className='text-text-muted text-xs tabular-nums'>{view.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {views.map((view) => (
            <TabsContent key={view.id} value={view.id}>
              <ul className='divide-y rounded-(--ds-radius-card) border' aria-label={`${view.label} posts`}>
                {rows.map(([title, state, tone, author]) => (
                  <li key={title} className='flex flex-wrap items-center gap-3 px-4 py-3 text-sm'>
                    <span className='min-w-0 flex-1 truncate font-medium'>{title}</span>
                    <span className='text-text-muted hidden sm:inline'>{author}</span>
                    <Badge variant={tone}>{state}</Badge>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </AppShell>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title='Go to a page' description='Search every route in Gaudi'>
        <CommandInput placeholder='Type a page name…' />
        <CommandList>
          <CommandEmpty>No page matches.</CommandEmpty>
          <CommandGroup heading='Routes'>
            {routes.map((route) => (
              <CommandItem key={route} onSelect={() => { setSection(route.split(' · ')[0]); setSearchOpen(false); }}>{route}</CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
