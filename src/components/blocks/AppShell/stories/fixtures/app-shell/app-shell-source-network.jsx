'use client';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useRef, useState } from 'react';
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gaudi/design-system/core/Input';
import { default as Kbd } from '@gaudi/design-system/core/Kbd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system/core/Tree';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';

const curator = {
  name: 'Lena Fischer',
  role: 'Library curator',
  email: 'lena@gaudi.page',
  photo: '/avatars/person-21.svg'
};
const badge = (label, variant, icon) => ({ label, variant, icon });
/*
 * Each workspace tab swaps the section tiles and the tree below them. Tree nodes carry an optional
 * `icon` (top level), a `count`, a status `badge`, an inline `action` and `children`.
 */
const workspaces = [
  {
    id: 'sources',
    label: 'Sources',
    tree: 'Source Network',
    sections: [
      ['overview', 'Overview', 'LayoutDashboard'],
      ['feeds', 'Feeds', 'Globe'],
      ['newsletters', 'Newsletters', 'Inbox'],
      ['papers', 'Papers', 'FileSearch'],
      ['podcasts', 'Podcasts', 'Podcast'],
      ['archives', 'Archives', 'Archive'],
      ['imports', 'Imports', 'Download'],
      ['webhooks', 'Webhooks', 'Webhook']
    ],
    expanded: ['subscriptions', 'journals'],
    current: 'journals-unread',
    nodes: {
      root: {
        children: ['subscriptions', 'archives-libraries', 'reading-queues', 'feed-formats']
      },
      subscriptions: {
        name: 'Subscriptions',
        icon: 'Globe',
        badge: badge('Healthy', 'success-light', 'ShieldCheck'),
        children: ['blogs', 'journals', 'newsletters', 'podcasts', 'talks', 'snoozed']
      },
      blogs: {
        name: 'Blogs',
        count: 42,
        action: { icon: 'Plus' },
        children: ['blogs-design', 'blogs-cities']
      },
      'blogs-design': { name: 'Design' },
      'blogs-cities': { name: 'Cities' },
      journals: {
        name: 'Journals',
        count: 18,
        action: { label: 'Review' },
        children: ['journals-overview', 'journals-unread', 'journals-flagged', 'journals-read']
      },
      'journals-overview': { name: 'Overview' },
      'journals-unread': { name: 'Unread' },
      'journals-flagged': { name: 'Flagged' },
      'journals-read': { name: 'Read' },
      newsletters: {
        name: 'Newsletters',
        count: 11,
        badge: badge('2 failing', 'warning-light'),
        children: ['newsletters-inbox', 'newsletters-digest']
      },
      'newsletters-inbox': { name: 'Inbox' },
      'newsletters-digest': { name: 'Digest' },
      podcasts: {
        name: 'Podcasts',
        count: 27,
        children: ['podcasts-transcribed', 'podcasts-pending']
      },
      'podcasts-transcribed': { name: 'Transcribed' },
      'podcasts-pending': { name: 'Pending' },
      talks: {
        name: 'Talks',
        count: 16,
        badge: badge('Live', 'success-light'),
        children: ['talks-lectures', 'talks-panels']
      },
      'talks-lectures': { name: 'Lectures' },
      'talks-panels': { name: 'Panels' },
      snoozed: {
        name: 'Snoozed',
        count: 37,
        badge: badge('Until Monday', 'info-light'),
        children: ['snoozed-muted', 'snoozed-seasonal']
      },
      'snoozed-muted': { name: 'Muted' },
      'snoozed-seasonal': { name: 'Seasonal' },
      'archives-libraries': {
        name: 'Archives & Libraries',
        icon: 'Library',
        action: { label: 'Add' },
        children: ['public-archives', 'exports']
      },
      'public-archives': {
        name: 'Public Archives',
        count: 24,
        children: ['public-archives-online', 'public-archives-offline']
      },
      'public-archives-online': { name: 'Online' },
      'public-archives-offline': { name: 'Offline' },
      exports: {
        name: 'Exports',
        count: 6,
        children: ['exports-bookmarks', 'exports-highlights']
      },
      'exports-bookmarks': { name: 'Bookmarks' },
      'exports-highlights': { name: 'Highlights' },
      'reading-queues': {
        name: 'Reading Queues',
        icon: 'ListTodo',
        children: ['read-next', 'someday']
      },
      'read-next': {
        name: 'Read Next',
        count: 9,
        children: ['read-next-today', 'read-next-week']
      },
      'read-next-today': { name: 'Today' },
      'read-next-week': { name: 'This Week' },
      someday: {
        name: 'Someday',
        count: 51,
        children: ['someday-month', 'someday-later']
      },
      'someday-month': { name: 'This Month' },
      'someday-later': { name: 'Later' },
      'feed-formats': {
        name: 'Feed Formats',
        icon: 'Network',
        action: { label: 'Manage' },
        children: ['syndication', 'email-imports']
      },
      syndication: { name: 'Syndication', children: ['syndication-rss', 'syndication-atom'] },
      'syndication-rss': { name: 'RSS' },
      'syndication-atom': { name: 'Atom' },
      'email-imports': { name: 'Email Imports', children: ['email-forwarding', 'email-digests'] },
      'email-forwarding': { name: 'Forwarding' },
      'email-digests': { name: 'Digests' }
    }
  },
  {
    id: 'readers',
    label: 'Readers',
    tree: 'Reading Groups',
    sections: [
      ['members', 'Members', 'Users'],
      ['sessions', 'Sessions', 'CalendarDays'],
      ['badges', 'Badges', 'CircleCheck'],
      ['guides', 'Guides', 'BookOpen'],
      ['requests', 'Requests', 'Inbox'],
      ['mentions', 'Mentions', 'Bell'],
      ['plans', 'Plans', 'CreditCard'],
      ['reviews', 'Reviews', 'Star']
    ],
    expanded: ['reading-circles', 'thesis-group'],
    current: 'thesis-group-readers',
    nodes: {
      root: {
        children: ['reading-circles', 'sharing', 'guides-tree', 'pauses']
      },
      'reading-circles': {
        name: 'Reading Circles',
        icon: 'Users',
        badge: badge('Active', 'success-light', 'CircleCheck'),
        children: ['evening-circle', 'thesis-group', 'field-notes', 'translators']
      },
      'evening-circle': {
        name: 'Evening Circle',
        count: 12,
        action: { icon: 'Plus' },
        children: ['evening-circle-hosts', 'evening-circle-readers']
      },
      'evening-circle-hosts': { name: 'Hosts' },
      'evening-circle-readers': { name: 'Readers' },
      'thesis-group': {
        name: 'Thesis Group',
        count: 18,
        action: { label: 'Review' },
        children: ['thesis-group-hosts', 'thesis-group-readers', 'thesis-group-guests']
      },
      'thesis-group-hosts': { name: 'Hosts' },
      'thesis-group-readers': { name: 'Readers' },
      'thesis-group-guests': { name: 'Guests' },
      'field-notes': {
        name: 'Field Notes Club',
        count: 7,
        badge: badge('3 away', 'warning-light'),
        children: ['field-notes-break', 'field-notes-lurkers']
      },
      'field-notes-break': { name: 'On Break' },
      'field-notes-lurkers': { name: 'Lurkers' },
      translators: {
        name: 'Translators',
        count: 21,
        badge: badge('Live', 'success-light'),
        children: ['translators-french', 'translators-arabic']
      },
      'translators-french': { name: 'French' },
      'translators-arabic': { name: 'Arabic' },
      sharing: {
        name: 'Sharing',
        icon: 'KeyRound',
        action: { label: 'Manage' },
        children: ['sharing-editors', 'sharing-readers']
      },
      'sharing-editors': { name: 'Editors' },
      'sharing-readers': { name: 'Readers' },
      'guides-tree': {
        name: 'Guides',
        icon: 'BookOpen',
        children: ['guides-citations', 'guides-notes']
      },
      'guides-citations': { name: 'Citation Style' },
      'guides-notes': { name: 'Note Taking' },
      pauses: {
        name: 'Pauses',
        icon: 'Calendar',
        action: { label: 'Add' },
        children: ['pauses-requests', 'pauses-approved']
      },
      'pauses-requests': { name: 'Requests' },
      'pauses-approved': { name: 'Approved' }
    }
  },
  {
    id: 'activity',
    label: 'Activity',
    tree: 'Capture Streams',
    sections: [
      ['timeline', 'Timeline', 'SquareActivity'],
      ['errors', 'Errors', 'TriangleAlert'],
      ['alerts', 'Alerts', 'Bell'],
      ['releases', 'Releases', 'Rocket'],
      ['schedules', 'Schedules', 'Clock'],
      ['reports', 'Reports', 'FileText'],
      ['trends', 'Trends', 'ChartLine'],
      ['hooks', 'Hooks', 'Workflow']
    ],
    expanded: ['live-captures', 'duplicates'],
    current: 'duplicates-pending',
    nodes: {
      root: {
        children: ['live-captures', 'sync-windows', 'retention-rules']
      },
      'live-captures': {
        name: 'Live Captures',
        icon: 'SquareActivity',
        badge: badge('Streaming', 'success-light', 'Rocket'),
        children: ['failed-fetches', 'duplicates', 'parse-errors', 'resolved']
      },
      'failed-fetches': {
        name: 'Failed Fetches',
        count: 9,
        action: { icon: 'Plus' },
        children: ['failed-timeouts', 'failed-paywalls']
      },
      'failed-timeouts': { name: 'Timeouts' },
      'failed-paywalls': { name: 'Paywalls' },
      duplicates: {
        name: 'Duplicates',
        count: 4,
        action: { label: 'Review' },
        children: ['duplicates-merged', 'duplicates-pending', 'duplicates-ignored']
      },
      'duplicates-merged': { name: 'Merged' },
      'duplicates-pending': { name: 'Pending' },
      'duplicates-ignored': { name: 'Ignored' },
      'parse-errors': {
        name: 'Parse Errors',
        count: 15,
        badge: badge('5 open', 'warning-light'),
        children: ['parse-pdf', 'parse-html']
      },
      'parse-pdf': { name: 'PDF' },
      'parse-html': { name: 'HTML' },
      resolved: {
        name: 'Resolved',
        count: 36,
        badge: badge('Today', 'info-light'),
        children: ['resolved-today', 'resolved-week']
      },
      'resolved-today': { name: 'Today' },
      'resolved-week': { name: 'This Week' },
      'sync-windows': {
        name: 'Sync Windows',
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
        children: ['retention-logs', 'retention-snapshots']
      },
      'retention-logs': { name: 'Logs' },
      'retention-snapshots': { name: 'Snapshots' }
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
      aria-label={compact ? 'Gaudi Sources home' : undefined}
      className='flex shrink-0 items-center gap-2 rounded-(--ds-radius-control)'
    >
      {compact ? <GaudiLogo aria-hidden='true' className='size-5' /> : <GaudiBrand className='text-sm' />}
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
              <Button
                variant={current ? 'outline' : 'ghost'}
                aria-current={current ? 'page' : undefined}
                onClick={() => onSection(item.id)}
                className={`flex h-15 w-full flex-col items-center justify-center gap-1.5 rounded-(--ds-radius-card) border px-1 text-[11px] ${
                  current
                    ? 'bg-surface border-ui-border text-text font-medium shadow-xs'
                    : 'bg-ui-secondary/70 text-text-muted hover:text-text border-transparent'
                }`}
              >
                <RegistryIcon lucide={item.icon} aria-hidden='true' className='size-4' />
                <span className='max-w-full truncate'>{item.label}</span>
              </Button>
            </li>
          );
        })}
        <li>
          <Button
            variant='ghost'
            aria-label='Add section'
            className='bg-ui-secondary/70 text-text-muted hover:text-text grid h-15 w-full place-items-center rounded-(--ds-radius-card) border border-transparent'
          >
            <RegistryIcon lucide='Plus' aria-hidden='true' className='size-4' />
          </Button>
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
      <Button
        variant='ghost'
        size='icon-xs'
        tabIndex={-1}
        aria-label={`Add to ${data.name}`}
        onClick={stop}
        className='text-text-muted hover:text-text grid size-5 shrink-0 place-items-center rounded-(--ds-radius-control)'
      >
        <RegistryIcon lucide={data.action.icon} aria-hidden='true' className='size-3.5' />
      </Button>
    );
  }
  return (
    <a
      href={`#${item.getId()}-${data.action.label.toLowerCase()}`}
      tabIndex={-1}
      aria-label={`${data.action.label} ${data.name}`}
      onClick={stop}
      className='text-text-muted hover:text-text shrink-0 text-xs'
    >
      {data.action.label}
    </a>
  );
}

/** The status-badged source tree: Gaudi Tree rows with counts, badges, inline actions and indent guides. */
function SourceTree({ workspace }) {
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
    <section aria-labelledby={`sources-${workspace.id}`} className='grid gap-2'>
      <h2 id={`sources-${workspace.id}`} className='text-text-muted text-xs'>
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

function AccountMenu({ compact = false }) {
  const { isMobile } = useSidebar();
  const [theme, setTheme] = useState('system');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={compact ? 'ghost' : 'outline'}
          aria-label='Account menu'
          className={compact ? 'size-8 p-0' : 'h-10 w-full justify-start gap-2 px-2'}
        >
          <Avatar className='size-6'>
            <AvatarImage src={curator.photo} alt='' />
            <AvatarFallback>LF</AvatarFallback>
          </Avatar>
          {compact ? null : (
            <>
              <span className='grid min-w-0 flex-1 text-start leading-tight'>
                <span className='truncate text-xs font-medium'>{curator.name}</span>
                <span className='text-text-muted truncate text-[10px] font-normal'>{curator.role}</span>
              </span>
              <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
          <Avatar className='size-8'>
            <AvatarImage src={curator.photo} alt='' />
            <AvatarFallback>LF</AvatarFallback>
          </Avatar>
          <span className='grid min-w-0 leading-tight'>
            <span className='truncate font-medium'>{curator.name}</span>
            <span className='text-text-muted truncate text-xs'>{curator.email}</span>
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

/** The folded rail: the expand button and the current workspace's sections as icons. */
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
          <SourceTree key={workspace.id} workspace={workspace} />
        </TabsContent>
      </SidebarContent>
      <SidebarFooter className='px-4 pb-4'>
        <SyncStatus />
      </SidebarFooter>
    </Tabs>
  );
}

function SyncStatus() {
  return (
    <div role='status' className='bg-surface-muted/60 flex items-center gap-2 rounded-(--ds-radius-card) border border-ui-border px-3 py-2 text-xs'>
      <span aria-hidden='true' className='bg-success size-2 shrink-0 rounded-full' />
      <span className='min-w-0 flex-1 truncate'>All sources synced</span>
      <span className='text-text-muted shrink-0 tabular-nums'>2 min ago</span>
    </div>
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
          placeholder='Search the library'
        />
        <InputGroupAddon align='inline-end'>
          <Kbd keys={shortcut.kbdKeys} size='sm' />
        </InputGroupAddon>
      </InputGroup>
      {/* The account sits beside the search; the sidebar foot reports sync health instead. */}
      <AccountMenu compact />
    </AppShellHeader>
  );
}

export function Pattern() {
  const [tab, setTab] = useState('sources');
  const [sections, setSections] = useState({
    sources: 'overview',
    readers: 'members',
    activity: 'timeline'
  });
  return (
    <AppShellFrame compactBelow={860}>
      {/* The sidebar header holds its own collapse button, so ⌘B stays with the other examples. */}
      <SidebarProvider shortcut={false}>
        <Sidebar
          collapsible='icon'
          mobileWidth='17rem'
          mobileTitle='Source Navigation'
          mobileDescription='Source workspaces, sections and the source network.'
        >
          <NavigationBody
            tab={tab}
            onTab={setTab}
            sectionFor={(id) => sections[id]}
            onSection={(id) => setSections((state) => ({ ...state, [tab]: id }))}
          />
        </Sidebar>
        <AppShellPanel aria-label='Source console'>
          <SearchHeader />
          <AppShellBody className='pt-4'>
            <div aria-hidden='true' className='grid gap-4 p-4 sm:grid-cols-3'><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-64 sm:col-span-3' /></div>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
