'use client';
import { useRef, useState } from 'react';
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  DropdownMenu,
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
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../../../src/components/core/Input/parts/input-group.jsx';
import { default as Kbd } from '../../../../src/components/core/Kbd/index.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { Tree, TreeItem, TreeItemLabel } from '../../../../src/components/core/Tree/parts/tree-extended.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { useHotkey } from '../../../../src/hooks/interaction/use-hotkey.js';

const operator = {
  name: 'Jordan Reyes',
  role: 'Fleet Network Admin',
  email: 'jordan@nimbusfleet.io',
  photo: '/avatars/men/86.jpg'
};
const badge = (label, variant, icon) => ({ label, variant, icon });
/*
 * Each workspace tab swaps the section tiles and the tree below them. Tree nodes carry an optional
 * `icon` (top level), a `count`, a status `badge`, an inline `action` and `children`.
 */
const workspaces = [
  {
    id: 'fleet',
    label: 'Fleet',
    tree: 'Robot Network',
    sections: [
      ['overview', 'Overview', 'LayoutDashboard'],
      ['live-map', 'Live Map', 'Map'],
      ['robots', 'Robots', 'Bot'],
      ['zones', 'Zones', 'MapPinned'],
      ['clusters', 'Clusters', 'Grid2x2'],
      ['regions', 'Regions', 'Globe'],
      ['data-sync', 'Data Sync', 'SquareDashedMousePointer'],
      ['endpoints', 'Endpoints', 'Monitor']
    ],
    expanded: ['service-pools', 'inspection'],
    current: 'inspection-scheduled',
    nodes: {
      root: {
        children: ['service-pools', 'stations-hubs', 'dispatch-queues', 'connectivity-tiers']
      },
      'service-pools': {
        name: 'Service Pools',
        icon: 'Combine',
        badge: badge('Stable', 'success-light', 'ShieldCheck'),
        children: ['delivery', 'inspection', 'maintenance', 'transfer', 'patrol', 'standby']
      },
      delivery: {
        name: 'Delivery',
        count: 42,
        action: { icon: 'Plus' },
        children: ['delivery-routes', 'delivery-drop-points']
      },
      'delivery-routes': { name: 'Routes' },
      'delivery-drop-points': { name: 'Drop Points' },
      inspection: {
        name: 'Inspection',
        count: 18,
        action: { label: 'Review' },
        children: ['inspection-overview', 'inspection-scheduled', 'inspection-findings', 'inspection-completed']
      },
      'inspection-overview': { name: 'Overview' },
      'inspection-scheduled': { name: 'Scheduled' },
      'inspection-findings': { name: 'Findings' },
      'inspection-completed': { name: 'Completed' },
      maintenance: {
        name: 'Maintenance',
        count: 11,
        badge: badge('2 offline', 'warning-light'),
        children: ['maintenance-queue', 'maintenance-history']
      },
      'maintenance-queue': { name: 'Queue' },
      'maintenance-history': { name: 'History' },
      transfer: {
        name: 'Transfer',
        count: 27,
        children: ['transfer-inbound', 'transfer-outbound']
      },
      'transfer-inbound': { name: 'Inbound' },
      'transfer-outbound': { name: 'Outbound' },
      patrol: {
        name: 'Patrol',
        count: 16,
        badge: badge('Live', 'success-light'),
        children: ['patrol-routes', 'patrol-incidents']
      },
      'patrol-routes': { name: 'Routes' },
      'patrol-incidents': { name: 'Incidents' },
      standby: {
        name: 'Standby',
        count: 37,
        badge: badge('All Ready', 'info-light'),
        children: ['standby-docked', 'standby-charging']
      },
      'standby-docked': { name: 'Docked' },
      'standby-charging': { name: 'Charging' },
      'stations-hubs': {
        name: 'Stations & Hubs',
        icon: 'LandPlot',
        action: { label: 'Add' },
        children: ['docks', 'depots']
      },
      docks: {
        name: 'Docks',
        count: 24,
        children: ['docks-online', 'docks-offline']
      },
      'docks-online': { name: 'Online' },
      'docks-offline': { name: 'Offline' },
      depots: {
        name: 'Depots',
        count: 6,
        children: ['depots-north', 'depots-south']
      },
      'depots-north': { name: 'North' },
      'depots-south': { name: 'South' },
      'dispatch-queues': {
        name: 'Dispatch Queues',
        icon: 'ListTodo',
        children: ['priority', 'backlog']
      },
      priority: {
        name: 'Priority',
        count: 9,
        children: ['priority-now', 'priority-next']
      },
      'priority-now': { name: 'Now' },
      'priority-next': { name: 'Next' },
      backlog: {
        name: 'Backlog',
        count: 51,
        children: ['backlog-week', 'backlog-later']
      },
      'backlog-week': { name: 'This Week' },
      'backlog-later': { name: 'Later' },
      'connectivity-tiers': {
        name: 'Connectivity Tiers',
        icon: 'Network',
        action: { label: 'Manage' },
        children: ['mesh', 'cellular']
      },
      mesh: { name: 'Mesh', children: ['mesh-primary', 'mesh-backup'] },
      'mesh-primary': { name: 'Primary' },
      'mesh-backup': { name: 'Backup' },
      cellular: { name: 'Cellular', children: ['cellular-5g', 'cellular-lte'] },
      'cellular-5g': { name: '5G' },
      'cellular-lte': { name: 'LTE' }
    }
  },
  {
    id: 'team',
    label: 'Team',
    tree: 'Crew Directory',
    sections: [
      ['roster', 'Roster', 'Users'],
      ['shifts', 'Shifts', 'CalendarDays'],
      ['skills', 'Skills', 'CircleCheck'],
      ['training', 'Training', 'BookOpen'],
      ['requests', 'Requests', 'Inbox'],
      ['on-call', 'On Call', 'Bell'],
      ['payroll', 'Payroll', 'CreditCard'],
      ['reviews', 'Reviews', 'Star']
    ],
    expanded: ['dispatch-crew', 'day-shift'],
    current: 'day-shift-operators',
    nodes: {
      root: {
        children: ['dispatch-crew', 'access-groups', 'certifications', 'time-off']
      },
      'dispatch-crew': {
        name: 'Dispatch Crew',
        icon: 'Users',
        badge: badge('Staffed', 'success-light', 'CircleCheck'),
        children: ['night-shift', 'day-shift', 'relief-crew', 'field-techs']
      },
      'night-shift': {
        name: 'Night Shift',
        count: 12,
        action: { icon: 'Plus' },
        children: ['night-shift-leads', 'night-shift-operators']
      },
      'night-shift-leads': { name: 'Leads' },
      'night-shift-operators': { name: 'Operators' },
      'day-shift': {
        name: 'Day Shift',
        count: 18,
        action: { label: 'Review' },
        children: ['day-shift-leads', 'day-shift-operators', 'day-shift-trainees']
      },
      'day-shift-leads': { name: 'Leads' },
      'day-shift-operators': { name: 'Operators' },
      'day-shift-trainees': { name: 'Trainees' },
      'relief-crew': {
        name: 'Relief Crew',
        count: 7,
        badge: badge('3 away', 'warning-light'),
        children: ['relief-on-call', 'relief-standby']
      },
      'relief-on-call': { name: 'On Call' },
      'relief-standby': { name: 'Standby' },
      'field-techs': {
        name: 'Field Techs',
        count: 21,
        badge: badge('Live', 'success-light'),
        children: ['field-north', 'field-south']
      },
      'field-north': { name: 'North' },
      'field-south': { name: 'South' },
      'access-groups': {
        name: 'Access Groups',
        icon: 'KeyRound',
        action: { label: 'Manage' },
        children: ['admins', 'operators-group']
      },
      admins: { name: 'Admins' },
      'operators-group': { name: 'Operators' },
      certifications: {
        name: 'Certifications',
        icon: 'BookOpen',
        children: ['safety', 'equipment']
      },
      safety: { name: 'Safety' },
      equipment: { name: 'Equipment' },
      'time-off': {
        name: 'Time Off',
        icon: 'Calendar',
        action: { label: 'Add' },
        children: ['time-off-requests', 'time-off-approved']
      },
      'time-off-requests': { name: 'Requests' },
      'time-off-approved': { name: 'Approved' }
    }
  },
  {
    id: 'events',
    label: 'Events',
    tree: 'Event Streams',
    sections: [
      ['timeline', 'Timeline', 'SquareActivity'],
      ['incidents', 'Incidents', 'TriangleAlert'],
      ['alerts', 'Alerts', 'Bell'],
      ['deploys', 'Deploys', 'Rocket'],
      ['windows', 'Windows', 'Clock'],
      ['reports', 'Reports', 'FileText'],
      ['trends', 'Trends', 'ChartLine'],
      ['webhooks', 'Webhooks', 'Workflow']
    ],
    expanded: ['live-feed', 'escalations'],
    current: 'escalations-acknowledged',
    nodes: {
      root: {
        children: ['live-feed', 'maintenance-windows', 'retention-rules']
      },
      'live-feed': {
        name: 'Live Feed',
        icon: 'SquareActivity',
        badge: badge('Streaming', 'success-light', 'Rocket'),
        children: ['open-incidents', 'escalations', 'sensor-faults', 'resolved']
      },
      'open-incidents': {
        name: 'Open Incidents',
        count: 9,
        action: { icon: 'Plus' },
        children: ['incidents-critical', 'incidents-minor']
      },
      'incidents-critical': { name: 'Critical' },
      'incidents-minor': { name: 'Minor' },
      escalations: {
        name: 'Escalations',
        count: 4,
        action: { label: 'Review' },
        children: ['escalations-paged', 'escalations-acknowledged', 'escalations-handed-off']
      },
      'escalations-paged': { name: 'Paged' },
      'escalations-acknowledged': { name: 'Acknowledged' },
      'escalations-handed-off': { name: 'Handed Off' },
      'sensor-faults': {
        name: 'Sensor Faults',
        count: 15,
        badge: badge('5 open', 'warning-light'),
        children: ['faults-lidar', 'faults-camera']
      },
      'faults-lidar': { name: 'Lidar' },
      'faults-camera': { name: 'Camera' },
      resolved: {
        name: 'Resolved',
        count: 36,
        badge: badge('Today', 'info-light'),
        children: ['resolved-today', 'resolved-week']
      },
      'resolved-today': { name: 'Today' },
      'resolved-week': { name: 'This Week' },
      'maintenance-windows': {
        name: 'Maintenance Windows',
        icon: 'Clock',
        action: { label: 'Add' },
        children: ['windows-upcoming', 'windows-past']
      },
      'windows-upcoming': { name: 'Upcoming' },
      'windows-past': { name: 'Past' },
      'retention-rules': {
        name: 'Retention Rules',
        icon: 'FileText',
        action: { label: 'Manage' },
        children: ['retention-logs', 'retention-video']
      },
      'retention-logs': { name: 'Logs' },
      'retention-video': { name: 'Video' }
    }
  }
].map((workspace) => ({
  ...workspace,
  sections: workspace.sections.map(([id, label, icon]) => ({
    id,
    label,
    icon
  }))
}));
const INDENT = 20;
const noop = (event) => event.preventDefault();
const stop = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

function Logo({ compact = false }) {
  return (
    <a
      href='#home'
      onClick={noop}
      aria-label={compact ? 'Nimbus Fleet home' : undefined}
      className='flex shrink-0 items-center gap-2 rounded-(--ds-radius-control) outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
    >
      <span aria-hidden='true' className='bg-surface grid size-6 place-items-center rounded-(--ds-radius-control) border border-ui-border'>
        <RegistryIcon lucide='Command' className='size-3.5' />
      </span>
      {compact ? null : <span className='text-xs font-semibold tracking-[0.2em]'>GAUDI</span>}
    </a>
  );
}

function RailToggle() {
  const { open, isMobile, openMobile, toggleSidebar } = useSidebar();
  const expanded = isMobile ? openMobile : open;
  const label = isMobile ? (openMobile ? 'Close navigation' : 'Open navigation') : open ? 'Collapse navigation' : 'Expand navigation';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label={label}
          aria-expanded={expanded}
          onClick={toggleSidebar}
          className='text-text-muted'
        >
          <RegistryIcon lucide={expanded ? 'PanelLeftClose' : 'PanelLeftOpen'} aria-hidden='true' />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right'>{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionTiles({ workspace, section, onSection }) {
  return (
    <nav aria-label='Sections'>
      <ul className='grid grid-cols-3 gap-2'>
        {workspace.sections.map((item) => {
          const current = item.id === section;
          return (
            <li key={item.id}>
              <button
                type='button'
                aria-current={current ? 'page' : undefined}
                onClick={() => onSection(item.id)}
                className={`flex h-15 w-full flex-col items-center justify-center gap-1.5 rounded-(--ds-radius-card) border px-1 text-[11px] outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-ui-ring ${
                  current
                    ? 'bg-surface border-ui-border text-text font-medium shadow-xs'
                    : 'bg-ui-secondary/70 text-text-muted hover:text-text border-transparent'
                }`}
              >
                <RegistryIcon lucide={item.icon} aria-hidden='true' className='size-4' />
                <span className='max-w-full truncate'>{item.label}</span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type='button'
            aria-label='Add section'
            className='bg-ui-secondary/70 text-text-muted hover:text-text grid h-15 w-full place-items-center rounded-(--ds-radius-card) border border-transparent outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
          >
            <RegistryIcon lucide='Plus' aria-hidden='true' className='size-4' />
          </button>
        </li>
      </ul>
    </nav>
  );
}

function RowAction({ item }) {
  const data = item.getItemData();
  if (!data.action) return null;
  if (data.action.icon) {
    return (
      <button
        type='button'
        tabIndex={-1}
        aria-label={`Add to ${data.name}`}
        onClick={stop}
        className='text-text-muted hover:text-text grid size-5 shrink-0 place-items-center rounded-(--ds-radius-control) outline-hidden'
      >
        <RegistryIcon lucide={data.action.icon} aria-hidden='true' className='size-3.5' />
      </button>
    );
  }
  return (
    <a
      href={`#${item.getId()}-${data.action.label.toLowerCase()}`}
      tabIndex={-1}
      aria-label={`${data.action.label} ${data.name}`}
      onClick={stop}
      className='text-text-muted hover:text-text shrink-0 text-xs outline-hidden'
    >
      {data.action.label}
    </a>
  );
}

/** The status-badged network tree: Gaudi Tree rows with counts, badges, inline actions and indent guides. */
function NetworkTree({ workspace }) {
  const tree = useTree({
    rootItemId: 'root',
    indent: INDENT,
    initialState: {
      expandedItems: workspace.expanded,
      selectedItems: [workspace.current],
      focusedItem: workspace.current
    },
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => Boolean(item.getItemData()?.children?.length),
    dataLoader: {
      getItem: (id) => workspace.nodes[id],
      getChildren: (id) => workspace.nodes[id]?.children ?? []
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  });
  return (
    <section aria-labelledby={`network-${workspace.id}`} className='grid gap-2'>
      <h2 id={`network-${workspace.id}`} className='text-text-muted text-xs'>
        {workspace.tree}
      </h2>
      <Tree tree={tree} indent={INDENT} aria-label={workspace.tree} className='relative'>
        {tree.getItems().map((item) => {
          const data = item.getItemData();
          const level = item.getItemMeta().level;
          const folder = item.isFolder();
          return (
            <TreeItem key={item.getId()} item={item} asChild>
              <div className='relative'>
                {/* Indent guides: one hairline per ancestor level. */}
                {Array.from({ length: level }, (_, depth) => (
                  <span
                    key={depth}
                    aria-hidden='true'
                    className='bg-ui-border absolute inset-y-0 w-px'
                    style={{ insetInlineStart: depth * INDENT + 9 }}
                  />
                ))}
                <TreeItemLabel
                  className={`gap-1.5 bg-transparent px-0.5 text-[13px] hover:bg-ui-sidebar-accent/60 ${
                    folder
                      ? `py-1.5 ${item.isExpanded() ? 'text-text' : 'text-text-muted'}`
                      : 'text-text-muted in-data-[selected=true]:bg-ui-sidebar-accent in-data-[selected=true]:text-text not-in-data-[folder=true]:ps-2 py-1 in-data-[selected=true]:font-medium'
                  }`}
                >
                  {!folder ? <span aria-hidden='true' className='bg-text-muted/60 size-1 shrink-0 rounded-full' /> : null}
                  {data.icon ? <RegistryIcon lucide={data.icon} aria-hidden='true' className='text-text-muted size-4' /> : null}
                  <span className={`truncate ${level === 0 && item.isExpanded() ? 'font-medium' : ''}`}>{data.name}</span>
                  {data.count !== undefined ? (
                    <Badge variant='outline' size='xs' className='text-[10px] tabular-nums'>
                      {data.count}
                    </Badge>
                  ) : null}
                  <span className='ms-auto flex shrink-0 items-center gap-1 ps-1'>
                    {data.badge ? (
                      <Badge variant={data.badge.variant} size='xs' className='gap-0.5 text-[10px]'>
                        {data.badge.icon ? <RegistryIcon lucide={data.badge.icon} aria-hidden='true' /> : null}
                        {data.badge.label}
                      </Badge>
                    ) : null}
                    <RowAction item={item} />
                  </span>
                </TreeItemLabel>
              </div>
            </TreeItem>
          );
        })}
      </Tree>
    </section>
  );
}

function OperatorMenu({ compact = false }) {
  const { isMobile } = useSidebar();
  const [theme, setTheme] = useState('system');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={compact ? 'ghost' : 'outline'}
          aria-label='Operator menu'
          className={compact ? 'size-8 p-0' : 'h-10 w-full justify-start gap-2 px-2'}
        >
          <Avatar className='size-6'>
            <AvatarImage src={operator.photo} alt='' />
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>
          {compact ? null : (
            <>
              <span className='grid min-w-0 flex-1 text-start leading-tight'>
                <span className='truncate text-xs font-medium'>{operator.name}</span>
                <span className='text-text-muted truncate text-[10px] font-normal'>{operator.role}</span>
              </span>
              <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
          <Avatar className='size-8'>
            <AvatarImage src={operator.photo} alt='' />
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>
          <span className='grid min-w-0 leading-tight'>
            <span className='truncate font-medium'>{operator.name}</span>
            <span className='text-text-muted truncate text-xs'>{operator.email}</span>
          </span>
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
  );
}

/** The folded rail: the expand button, the current workspace's sections as icons, and the operator. */
function CollapsedRail({ workspace, section, onSection }) {
  return (
    <div className='flex h-full flex-col items-center gap-4 py-4'>
      <RailToggle />
      <nav aria-label='Sections' className='flex flex-1 flex-col items-center gap-2'>
        {workspace.sections.map((item) => {
          const current = item.id === section;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label={item.label}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => onSection(item.id)}
                  className={current ? 'bg-surface border border-ui-border shadow-xs' : 'bg-ui-secondary/70 text-text-muted'}
                >
                  <RegistryIcon lucide={item.icon} aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right'>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      <OperatorMenu compact />
    </div>
  );
}

function NavigationBody({ tab, onTab, sectionFor, onSection }) {
  const { state, isMobile } = useSidebar();
  const workspace = workspaces.find((entry) => entry.id === tab);
  if (state === 'collapsed' && !isMobile) {
    return <CollapsedRail workspace={workspace} section={sectionFor(tab)} onSection={onSection} />;
  }
  return (
    <Tabs value={tab} onValueChange={onTab} className='flex min-h-0 flex-1 flex-col gap-0'>
      <SidebarHeader className='gap-4 px-4 pt-4 pb-0'>
        <div className='flex items-center justify-between'>
          <Logo />
          {isMobile ? null : <RailToggle />}
        </div>
        <TabsList
          variant='outline'
          aria-label='Workspaces'
          className='bg-surface-muted h-7 w-full gap-0 rounded-(--ds-radius-control) border border-ui-border p-0'
        >
          {workspaces.map((entry) => (
            <TabsTrigger
              key={entry.id}
              value={entry.id}
              className='h-6.5 flex-1 rounded-(--ds-radius-control) text-xs data-[state=active]:border-ui-border data-[state=active]:bg-surface data-[state=active]:shadow-xs'
            >
              {entry.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </SidebarHeader>
      <SidebarContent className='px-4 py-4'>
        <TabsContent value={tab} className='flex flex-col gap-6'>
          <SectionTiles workspace={workspace} section={sectionFor(tab)} onSection={onSection} />
          <NetworkTree key={workspace.id} workspace={workspace} />
        </TabsContent>
      </SidebarContent>
      <SidebarFooter className='px-4 pb-4'>
        <OperatorMenu />
      </SidebarFooter>
    </Tabs>
  );
}

function SearchHeader() {
  const { isMobile } = useSidebar();
  const frame = useAppShellFrame();
  const input = useRef(null);
  // ⌘F / Ctrl+F focuses the workspace search while focus is inside this app window.
  const shortcut = useHotkey('mod+f', () => input.current?.focus(), {
    target: frame?.container ?? null,
    enableInInputs: true
  });
  return (
    <AppShellHeader className='flex-wrap gap-x-2 gap-y-3 px-4 pt-4 pb-0'>
      {isMobile ? (
        <div className='flex w-full items-center gap-2'>
          <RailToggle />
          <Logo />
        </div>
      ) : null}
      <InputGroup className='h-8 min-w-0 flex-1'>
        <InputGroupAddon>
          <RegistryIcon lucide='Search' aria-hidden='true' />
        </InputGroupAddon>
        <InputGroupInput
          ref={input}
          type='search'
          aria-label='Search the workspace'
          aria-keyshortcuts={shortcut.ariaKeyShortcuts}
          placeholder='Search'
        />
        <InputGroupAddon align='inline-end'>
          <Kbd keys={shortcut.kbdKeys} size='sm' />
        </InputGroupAddon>
      </InputGroup>
    </AppShellHeader>
  );
}

export function Pattern() {
  const [tab, setTab] = useState('fleet');
  const [sections, setSections] = useState({
    fleet: 'overview',
    team: 'roster',
    events: 'timeline'
  });
  return (
    <AppShellFrame compactBelow={860}>
      {/* The sidebar header holds its own collapse button, so ⌘B stays with the other examples. */}
      <SidebarProvider shortcut={false}>
        <Sidebar
          collapsible='icon'
          mobileWidth='17rem'
          mobileTitle='Fleet Navigation'
          mobileDescription='Fleet console workspaces, sections and robot network.'
        >
          <NavigationBody
            tab={tab}
            onTab={setTab}
            sectionFor={(id) => sections[id]}
            onSection={(id) => setSections((state) => ({ ...state, [tab]: id }))}
          />
        </Sidebar>
        <AppShellPanel aria-label='Fleet console'>
          <SearchHeader />
          <AppShellBody className='pt-4'>
            <AppShellPlaceholderGrid preset='board' variant='solid' />
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
