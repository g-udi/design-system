'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { NativeSelect, NativeSelectOption } from '../../../../src/components/core/Select/parts/native-select.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const sections = [
  { id: 'write', label: 'Write', icon: 'PenTool', groups: [['Drafts', ['All drafts', 'Assigned to me', 'In review']], ['Series', ['The slow web', 'Field guides']]] },
  { id: 'audience', label: 'Audience', icon: 'Users', groups: [['Readers', ['Subscribers', 'Members', 'Segments']], ['Growth', ['Referrals', 'Campaigns']]] },
  { id: 'money', label: 'Revenue', icon: 'Wallet', groups: [['Plans', ['Memberships', 'Sponsorships']], ['Payouts', ['History', 'Tax forms']]] },
  { id: 'settings', label: 'Settings', icon: 'Settings', groups: [['Publication', ['Profile', 'Domains', 'Team']]] }
];
const board = [
  ['Ideas', ['Interview: the archive team', 'Explainer: RSS in 2026']],
  ['Writing', ['Small tools, long lifetimes']],
  ['Review', ['Notes on local-first software', 'Field guide: reading lists']]
];

export function Pattern() {
  const [section, setSection] = useState('write');
  const [page, setPage] = useState('All drafts');
  const [panelOpen, setPanelOpen] = useState(true);
  const current = sections.find((entry) => entry.id === section);
  const choose = (id) => {
    setSection(id);
    setPage(sections.find((entry) => entry.id === id).groups[0][1][0]);
  };

  return (
    <TooltipProvider delayDuration={0}>
    <div className='bg-surface-muted h-[44rem] w-full overflow-hidden rounded-(--ds-radius-card) border p-2 sm:p-3'>
      <div className='bg-surface flex h-full min-h-0 flex-col overflow-hidden rounded-(--ds-radius-card) border shadow-xs md:flex-row'>
        <nav aria-label='Sections' className='flex shrink-0 gap-1 overflow-x-auto border-b p-2 md:w-14 md:flex-col md:items-center md:overflow-visible md:border-e md:border-b-0'>
          {sections.map((entry) => (
            <Tooltip key={entry.id}>
              <TooltipTrigger asChild>
                <Button size='sm' variant={section === entry.id ? 'soft' : 'ghost'} tone='neutral' aria-label={entry.label} aria-current={section === entry.id ? 'page' : undefined} onClick={() => choose(entry.id)} className='shrink-0 md:size-9 md:p-0'>
                  <RegistryIcon lucide={entry.icon} className='size-4' aria-hidden='true' />
                  <span className='md:sr-only'>{entry.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' className='hidden md:block'>{entry.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        {panelOpen ? (
          <nav aria-label={`${current.label} pages`} className='hidden w-52 shrink-0 overflow-y-auto border-e p-2 md:block'>
            {current.groups.map(([group, pages]) => (
              <div key={group} className='mb-3'>
                <p className='text-text-muted px-2 py-1 text-xs font-medium'>{group}</p>
                <ul className='grid gap-0.5'>
                  {pages.map((label) => (
                    <li key={label}>
                      <button type='button' aria-current={page === label ? 'page' : undefined} onClick={() => setPage(label)} className='hover:bg-surface-muted aria-[current=page]:bg-accent-subtle aria-[current=page]:text-accent w-full rounded-(--ds-radius-control) px-2 py-1.5 text-start text-sm'>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        ) : null}
        <main aria-labelledby='two-level-title' className='flex min-h-0 min-w-0 flex-1 flex-col'>
          <Tabs defaultValue='board' className='flex min-h-0 flex-1 flex-col gap-0'>
            <div className='flex flex-wrap items-center gap-2 border-b px-3 py-2'>
              <Button size='icon-sm' variant='ghost' tone='neutral' className='hidden md:inline-flex' aria-label={panelOpen ? 'Hide section pages' : 'Show section pages'} aria-expanded={panelOpen} onClick={() => setPanelOpen((open) => !open)}>
                <RegistryIcon lucide='PanelLeft' className='size-4' aria-hidden='true' />
              </Button>
              <h1 id='two-level-title' className='text-sm font-semibold max-md:sr-only'>{page}</h1>
              {/* On phones the section pages become one select, since there is no room for a second panel. */}
              <NativeSelect aria-label={`${current.label} page`} value={page} onChange={(event) => setPage(event.target.value)} className='w-44 md:hidden'>
                {current.groups.flatMap(([, pages]) => pages).map((label) => <NativeSelectOption key={label} value={label}>{label}</NativeSelectOption>)}
              </NativeSelect>
              <TabsList aria-label='Workspace views' className='ms-auto'>
                <TabsTrigger value='board'>Board</TabsTrigger>
                <TabsTrigger value='list'>List</TabsTrigger>
                <TabsTrigger value='docs'>Docs</TabsTrigger>
              </TabsList>
              <Avatar className='size-7'><AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='Tom Becker' /><AvatarFallback>TB</AvatarFallback></Avatar>
            </div>
            <TabsContent value='board' className='min-h-0 flex-1 overflow-auto p-4'>
              <ol className='grid min-w-[36rem] grid-cols-3 gap-3' aria-label='Board'>
                {board.map(([column, cards]) => (
                  <li key={column} className='bg-surface-muted rounded-(--ds-radius-card) p-2'>
                    <p className='flex items-center justify-between px-1 pb-2 text-xs font-medium'>{column}<Badge variant='secondary'>{cards.length}</Badge></p>
                    <ul className='grid gap-2'>
                      {cards.map((card) => <li key={card} className='bg-surface rounded-(--ds-radius-card) border p-3 text-sm'>{card}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value='list' className='min-h-0 flex-1 overflow-auto p-4'>
              <ul className='divide-y rounded-(--ds-radius-card) border'>
                {board.flatMap(([column, cards]) => cards.map((card) => (
                  <li key={card} className='flex justify-between gap-3 px-4 py-2.5 text-sm'><span>{card}</span><span className='text-text-muted'>{column}</span></li>
                )))}
              </ul>
            </TabsContent>
            <TabsContent value='docs' className='text-text-muted min-h-0 flex-1 p-4 text-sm'>House style guide, briefs and templates for {current.label.toLowerCase()}.</TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}
