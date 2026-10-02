'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../../src/components/core/Resizable/parts/resizable.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { NativeSelect, NativeSelectOption } from '../../../../src/components/core/Select/parts/native-select.jsx';
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
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { BarChart } from '../../../../src/components/charts/BarChart/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const ticks = Array.from({ length: 24 }, (_, index) => ({ label: `${String(index).padStart(2, '0')}:00`, runs: [12, 9, 7, 6, 6, 8, 14, 22, 31, 36, 34, 33, 35, 38, 36, 34, 30, 27, 22, 19, 17, 15, 14, 13][index] }));
const robots = [
  { id: 'atlas-07', name: 'Courier 07', zone: 'Warehouse A', status: 'Running', tone: 'success-light', events: ['08:42 Picked order 1182', '08:44 Docked at bay 3', '08:47 Battery 64%'] },
  { id: 'atlas-12', name: 'Courier 12', zone: 'Warehouse B', status: 'Blocked', tone: 'destructive-light', events: ['08:39 Path blocked at aisle 9', '08:40 Waiting for clearance'] },
  { id: 'atlas-15', name: 'Courier 15', zone: 'Loading dock', status: 'Charging', tone: 'warning-light', events: ['08:30 Started charging', '08:45 Battery 41%'] }
];
const runStats = [['Runs today', '418'], ['Success rate', '98.6%'], ['Median run', '6m 12s'], ['Open alerts', '3']];
const logs = ['08:47:12 courier-07 battery=64', '08:44:03 courier-07 docked bay=3', '08:40:51 courier-12 waiting clearance aisle=9', '08:39:20 courier-12 path_blocked aisle=9', '08:30:02 courier-15 charge_start'];

function RegionToggles({ regions, setRegions }) {
  const { open, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();
  const toggle = (key) => setRegions((current) => ({ ...current, [key]: !current[key] }));
  return (
    <div className='flex items-center gap-1' role='group' aria-label='Show regions'>
      <Toggle size='sm' variant='outline' aria-label='Navigation' pressed={isMobile ? openMobile : open} onPressedChange={(next) => (isMobile ? setOpenMobile(next) : setOpen(next))}>
        <RegistryIcon lucide='PanelLeft' className='size-4' aria-hidden='true' />
      </Toggle>
      <Toggle size='sm' variant='outline' aria-label='Filters' pressed={regions.filters} onPressedChange={() => toggle('filters')}>
        <RegistryIcon lucide='ListFilter' className='size-4' aria-hidden='true' />
      </Toggle>
      <Toggle size='sm' variant='outline' aria-label='Workbench' pressed={regions.workbench} onPressedChange={() => toggle('workbench')}>
        <RegistryIcon lucide='Terminal' className='size-4' aria-hidden='true' />
      </Toggle>
      <Toggle size='sm' variant='outline' aria-label='Inspector' className='hidden xl:inline-flex' pressed={regions.inspector} onPressedChange={() => toggle('inspector')}>
        <RegistryIcon lucide='Columns2' className='size-4' aria-hidden='true' />
      </Toggle>
    </div>
  );
}

export function Pattern() {
  const [regions, setRegions] = useState({ filters: true, workbench: true, inspector: true });
  const [selected, setSelected] = useState('atlas-12');
  const robot = robots.find((entry) => entry.id === selected);

  const board = (
    <div className='h-full min-h-0 overflow-y-auto p-4'>
      <Tabs defaultValue='fleet'>
        <TabsList aria-label='Mission control'>
          <TabsTrigger value='fleet'>Fleet</TabsTrigger>
          <TabsTrigger value='runs'>Runs</TabsTrigger>
          <TabsTrigger value='alerts'>Alerts</TabsTrigger>
          <TabsTrigger value='zones'>Zones</TabsTrigger>
        </TabsList>
        <TabsContent value='fleet' className='mt-4 grid gap-4'>
          <dl className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
            {runStats.map(([label, value]) => (
              <div key={label} className='rounded-(--ds-radius-card) border p-3'>
                <dt className='text-text-muted text-xs'>{label}</dt>
                <dd className='text-lg font-semibold tabular-nums'>{value}</dd>
              </div>
            ))}
          </dl>
          <BarChart title='Runs per hour' ariaLabel='Robot runs per hour today' data={ticks} yKey='runs' height={150} />
          <ul className='divide-y rounded-(--ds-radius-card) border' aria-label='Robot events'>
            {robots.map((entry) => (
              <li key={entry.id}>
                <Collapsible defaultOpen={entry.id === 'atlas-12'} className='group/collapsible'>
                  <div className='flex items-center gap-2 px-3 py-2'>
                    <CollapsibleTrigger asChild>
                      <Button size='icon-xs' variant='ghost' tone='neutral' aria-label={`Events for ${entry.name}`}>
                        <RegistryIcon lucide='ChevronRight' className='size-4 transition-transform group-data-[state=open]/collapsible:rotate-90' aria-hidden='true' />
                      </Button>
                    </CollapsibleTrigger>
                    <button type='button' className='min-w-0 flex-1 text-start text-sm' aria-current={selected === entry.id ? 'true' : undefined} onClick={() => setSelected(entry.id)}>
                      <span className='font-medium'>{entry.name}</span> <span className='text-text-muted'>· {entry.zone}</span>
                    </button>
                    <Badge variant={entry.tone}>{entry.status}</Badge>
                  </div>
                  <CollapsibleContent>
                    <ol className='text-text-muted grid gap-1 px-11 pb-3 font-mono text-xs'>
                      {entry.events.map((event) => <li key={event}>{event}</li>)}
                    </ol>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value='runs' className='text-text-muted mt-4 text-sm'>418 runs today; 6 retried, 0 abandoned.</TabsContent>
        <TabsContent value='alerts' className='text-text-muted mt-4 text-sm'>Courier 12 has been blocked at aisle 9 for 8 minutes.</TabsContent>
        <TabsContent value='zones' className='text-text-muted mt-4 text-sm'>Warehouse A, Warehouse B and the loading dock are online.</TabsContent>
      </Tabs>
    </div>
  );

  const workbench = (
    <div className='bg-surface-muted flex h-full min-h-0 flex-col'>
      <Tabs defaultValue='logs' className='flex min-h-0 flex-1 flex-col'>
        <TabsList variant='line' aria-label='Workbench' className='px-2'>
          <TabsTrigger value='logs'>Logs</TabsTrigger>
          <TabsTrigger value='console'>Console</TabsTrigger>
        </TabsList>
        <TabsContent value='logs' className='min-h-0 flex-1 overflow-y-auto px-3 py-2'>
          <ol className='grid gap-1 font-mono text-xs'>{logs.map((line) => <li key={line}>{line}</li>)}</ol>
        </TabsContent>
        <TabsContent value='console' className='text-text-muted px-3 py-2 font-mono text-xs'>gaudi ops › ready</TabsContent>
      </Tabs>
    </div>
  );

  return (
    <SidebarProvider shortcut={false} className='bg-surface relative h-[46rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border' style={{ '--sidebar-width': '13rem' }}>
      <Sidebar collapsible='offcanvas' className='absolute h-full'>
        <SidebarHeader>
          <p className='flex items-center gap-2 px-2 pt-1 text-sm font-semibold'><RegistryIcon lucide='Bot' className='size-4' aria-hidden='true' />Gaudi Ops</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Mission control</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[['Overview', 'LayoutDashboard', null, true], ['Fleet', 'Truck', 14], ['Runs', 'Play', null], ['Alerts', 'TriangleAlert', 3], ['Maps', 'MapPin', null]].map(([label, icon, count, active]) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton isActive={active} aria-current={active ? 'page' : undefined}>
                      <RegistryIcon lucide={icon} aria-hidden='true' />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {count ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className='min-h-0 min-w-0'>
        <header className='flex h-14 shrink-0 items-center gap-2 border-b px-3'>
          <h1 className='text-sm font-semibold'>Overview</h1>
          <div className='ms-auto'><RegionToggles regions={regions} setRegions={setRegions} /></div>
        </header>
        {regions.filters ? (
          <div className='flex flex-wrap items-center gap-2 border-b px-3 py-2' role='search' aria-label='Filter robots'>
            <NativeSelect aria-label='Zone' className='w-40'>
              <NativeSelectOption>All zones</NativeSelectOption>
              <NativeSelectOption>Warehouse A</NativeSelectOption>
              <NativeSelectOption>Warehouse B</NativeSelectOption>
            </NativeSelect>
            <NativeSelect aria-label='Status' className='w-36'>
              <NativeSelectOption>Any status</NativeSelectOption>
              <NativeSelectOption>Running</NativeSelectOption>
              <NativeSelectOption>Blocked</NativeSelectOption>
            </NativeSelect>
          </div>
        ) : null}
        <div className='flex min-h-0 flex-1'>
          <div className='min-h-0 min-w-0 flex-1'>
            {regions.workbench ? (
              <ResizablePanelGroup orientation='vertical'>
                <ResizablePanel defaultSize='68%' minSize='35%'>{board}</ResizablePanel>
                <ResizableHandle withHandle aria-label='Resize workbench' />
                <ResizablePanel defaultSize='32%' minSize='15%'>{workbench}</ResizablePanel>
              </ResizablePanelGroup>
            ) : board}
          </div>
          {regions.inspector ? (
            <aside aria-label='Robot details' className='hidden w-64 shrink-0 overflow-y-auto border-s p-4 xl:block'>
              <p className='text-text-muted text-xs'>Selected robot</p>
              <h2 className='font-semibold'>{robot.name}</h2>
              <Badge variant={robot.tone} className='mt-2'>{robot.status}</Badge>
              <dl className='mt-4 grid gap-2 text-sm'>
                <div className='flex justify-between'><dt className='text-text-muted'>Zone</dt><dd>{robot.zone}</dd></div>
                <div className='flex justify-between'><dt className='text-text-muted'>Last event</dt><dd className='text-end'>{robot.events.at(-1).slice(6)}</dd></div>
              </dl>
              <Button size='sm' variant='outline' tone='neutral' className='mt-4 w-full'>Open run history</Button>
            </aside>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
