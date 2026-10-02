'use client';
import { useState } from 'react';
import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Sortable, SortableItem, SortableItemHandle } from '../../../../src/components/core/Sortable/parts/sortable-extended.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { Tree, TreeItem, TreeItemLabel } from '../../../../src/components/core/Tree/parts/tree-extended.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const scopeTabs = [
  { id: 'security', label: 'Security', icon: 'ShieldCheck' },
  { id: 'assets', label: 'Assets', icon: 'Server' },
  { id: 'events', label: 'Events', icon: 'Activity' }
];
const initialScopes = {
  security: [
    { id: 'policies', label: 'Policies', icon: 'Lock', routes: ['Access rules', 'Password policy', 'SSO'] },
    { id: 'findings', label: 'Findings', icon: 'TriangleAlert', routes: ['Open', 'Accepted risk', 'Resolved'] },
    { id: 'keys', label: 'Keys and secrets', icon: 'Key', routes: ['API keys', 'Rotation'] }
  ],
  assets: [
    { id: 'services', label: 'Services', icon: 'Server', routes: ['Reader web', 'Newsletter API'] },
    { id: 'robots', label: 'Robot network', icon: 'Bot', routes: ['Warehouse A', 'Warehouse B'] }
  ],
  events: [
    { id: 'audit', label: 'Audit log', icon: 'ClipboardList', routes: ['Sign-ins', 'Changes'] },
    { id: 'alerts', label: 'Alerts', icon: 'Bell', routes: ['Live', 'Muted'] }
  ]
};
const tiles = [
  ['Overview', 'LayoutDashboard'], ['Findings', 'TriangleAlert'], ['Policies', 'Lock'],
  ['Assets', 'Server'], ['Network', 'Waypoints'], ['Keys', 'Key'],
  ['Audit', 'ClipboardList'], ['Alerts', 'Bell'], ['Settings', 'Settings']
];
const network = {
  root: { name: 'Gaudi fleet', children: ['hub-a', 'hub-b'] },
  'hub-a': { name: 'Hub A · Warehouse', status: 'Healthy', children: ['r-07', 'r-12'] },
  'r-07': { name: 'Courier 07', status: 'Healthy' },
  'r-12': { name: 'Courier 12', status: 'Blocked' },
  'hub-b': { name: 'Hub B · Loading dock', status: 'Degraded', children: ['r-15', 'r-21'] },
  'r-15': { name: 'Courier 15', status: 'Charging' },
  'r-21': { name: 'Courier 21', status: 'Offline' }
};
const statusTone = { Healthy: 'success-light', Blocked: 'destructive-light', Degraded: 'warning-light', Charging: 'info-light', Offline: 'secondary' };

function SectionTiles() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-label='All sections'><RegistryIcon lucide='LayoutGrid' className='size-4' aria-hidden='true' /></Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-64 p-2'>
        <ul className='grid grid-cols-3 gap-1' aria-label='All sections'>
          {tiles.map(([label, icon]) => (
            <li key={label}>
              <a href={`#${label.toLowerCase()}`} className='hover:bg-surface-muted grid justify-items-center gap-1 rounded-(--ds-radius-control) border p-2.5 text-xs'>
                <RegistryIcon lucide={icon} className='text-accent size-5' aria-hidden='true' />{label}
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function NetworkTree() {
  const tree = useTree({
    initialState: { expandedItems: ['hub-a', 'hub-b'] },
    indent: 20,
    rootItemId: 'root',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: { getItem: (id) => network[id], getChildren: (id) => network[id].children ?? [] },
    features: [syncDataLoaderFeature, hotkeysCoreFeature]
  });
  return (
    <Tree indent={20} tree={tree} aria-label='Robot network'>
      {tree.getItems().map((item) => {
        const status = item.getItemData().status;
        return (
          <TreeItem key={item.getId()} item={item} asChild>
            <div>
              <TreeItemLabel className='not-in-data-[folder=true]:ps-5'>
                <span className='flex min-w-0 flex-1 items-center gap-2'>
                  <span className='truncate'>{item.getItemName()}</span>
                  {status ? <Badge variant={statusTone[status]} className='ms-auto'>{status}</Badge> : null}
                </span>
              </TreeItemLabel>
            </div>
          </TreeItem>
        );
      })}
    </Tree>
  );
}

export function Pattern() {
  const [scope, setScope] = useState('security');
  const [scopes, setScopes] = useState(initialScopes);
  const [route, setRoute] = useState('Open');
  const [query, setQuery] = useState('');
  const list = scopes[scope]
    .map((entry) => ({ ...entry, routes: entry.routes.filter((name) => name.toLowerCase().includes(query.toLowerCase())) }))
    .filter((entry) => !query || entry.routes.length || entry.label.toLowerCase().includes(query.toLowerCase()));
  const reorder = (next) => setScopes((current) => ({ ...current, [scope]: next.map((entry) => current[scope].find((original) => original.id === entry.id)) }));

  return (
    <SidebarProvider shortcut={false} className='bg-surface relative h-[44rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border'>
      <Sidebar collapsible='icon' className='absolute h-full'>
        <SidebarHeader>
          <ToggleGroup type='single' size='sm' variant='outline' spacing={0} value={scope} onValueChange={(next) => next && setScope(next)} aria-label='Scope' className='w-full group-data-[collapsible=icon]:flex-col'>
            {scopeTabs.map((entry) => (
              <ToggleGroupItem key={entry.id} value={entry.id} aria-label={entry.label} className='flex-1'>
                <RegistryIcon lucide={entry.icon} className='size-4' aria-hidden='true' />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <SidebarInput type='search' aria-label='Search routes' placeholder='Search routes' value={query} onChange={(event) => setQuery(event.target.value)} className='group-data-[collapsible=icon]:hidden' />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <Sortable value={list} onValueChange={reorder} getItemValue={(entry) => entry.id} strategy='vertical'>
                <SidebarMenu aria-label={`${scopeTabs.find((entry) => entry.id === scope).label} routes`}>
                  {list.map((entry) => (
                    <SortableItem key={entry.id} value={entry.id} asChild>
                      <SidebarMenuItem>
                        <Collapsible defaultOpen className='group/collapsible'>
                          <div className='flex items-center'>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={entry.label}>
                                <RegistryIcon lucide={entry.icon} aria-hidden='true' />
                                <span>{entry.label}</span>
                                <RegistryIcon lucide='ChevronRight' className='ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90' aria-hidden='true' />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <SortableItemHandle aria-label={`Reorder ${entry.label}`} className='text-text-muted hover:text-text px-1 group-data-[collapsible=icon]:hidden'>
                              <RegistryIcon lucide='GripVertical' className='size-4' aria-hidden='true' />
                            </SortableItemHandle>
                          </div>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {entry.routes.map((name) => (
                                <SidebarMenuSubItem key={name}>
                                  <SidebarMenuSubButton href={`#${name}`} isActive={route === name} aria-current={route === name ? 'page' : undefined} onClick={(event) => { event.preventDefault(); setRoute(name); }}>
                                    <span>{name}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    </SortableItem>
                  ))}
                </SidebarMenu>
              </Sortable>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className='min-h-0 min-w-0'>
        <Tabs defaultValue='findings' className='flex min-h-0 flex-1 flex-col gap-0'>
          <header className='flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2'>
            <SidebarTrigger />
            <h1 className='text-sm font-semibold'>{route}</h1>
            <TabsList aria-label='Workspace' className='ms-auto'>
              <TabsTrigger value='findings'>Findings</TabsTrigger>
              <TabsTrigger value='network'>Network</TabsTrigger>
            </TabsList>
            <SectionTiles />
          </header>
          <TabsContent value='findings' className='min-h-0 flex-1 overflow-y-auto p-4'>
            <ul className='divide-y rounded-(--ds-radius-card) border'>
              {[['Public bucket allows listing', 'High', 'destructive-light'], ['Unused admin key older than 90 days', 'Medium', 'warning-light'], ['SSO not enforced for 2 members', 'Low', 'info-light']].map(([title, level, tone]) => (
                <li key={title} className='flex items-center gap-3 px-4 py-3 text-sm'>
                  <RegistryIcon lucide='ShieldCheck' className='text-text-muted size-4' aria-hidden='true' />
                  <span className='min-w-0 flex-1'>{title}</span>
                  <Badge variant={tone}>{level}</Badge>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value='network' className='min-h-0 flex-1 overflow-y-auto p-4'>
            <div className='max-w-md'><NetworkTree /></div>
          </TabsContent>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  );
}
