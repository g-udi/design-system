'use client';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@gaudi/design-system/core/Accordion';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  SidebarTrigger
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellFrame, AppShellHeader } from '@gaudi/design-system/blocks/AppShell';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const SECTIONS = [
  {
    id: 'start',
    label: 'Getting started',
    items: [
      { id: 'install', label: 'Installation' },
      { id: 'structure', label: 'Project structure' },
      { id: 'theming', label: 'Theming' }
    ]
  },
  {
    id: 'components',
    label: 'Components',
    items: [
      {
        id: 'sidebar',
        label: 'Sidebar',
        children: [
          { id: 'anatomy', label: 'Anatomy', isActive: true },
          { id: 'collapsing', label: 'Collapsing' },
          { id: 'sub-menus', label: 'Sub-menus' }
        ]
      },
      {
        id: 'data-grid',
        label: 'Data grid',
        children: [
          { id: 'columns', label: 'Columns' },
          { id: 'row-selection', label: 'Row selection' },
          { id: 'virtualisation', label: 'Virtualisation' }
        ]
      },
      {
        id: 'filters',
        label: 'Filters',
        children: [
          { id: 'operators', label: 'Operators' },
          { id: 'async-options', label: 'Async options' }
        ]
      },
      { id: 'calendar', label: 'Calendar' }
    ]
  },
  {
    id: 'api',
    label: 'API reference',
    items: [
      {
        id: 'provider',
        label: 'Provider props',
        children: [
          { id: 'open-state', label: 'Open state' },
          { id: 'widths', label: 'Widths' }
        ]
      },
      {
        id: 'hooks',
        label: 'Hooks',
        children: [{ id: 'use-sidebar', label: 'useSidebar' }]
      },
      { id: 'tokens', label: 'CSS variables' }
    ]
  }
];
function matches(label, query) {
  return label.toLowerCase().includes(query);
}
function filterItems(items, query) {
  if (!query) {
    return items;
  }
  return items
    .map((item) =>
      matches(item.label, query)
        ? item
        : {
            ...item,
            children: item.children?.filter((child) =>
              matches(child.label, query)
            )
          }
    )
    .filter(
      (item) => matches(item.label, query) || (item.children?.length ?? 0) > 0
    );
}

function Chevron({ open }) {
  return (
    <RegistryIcon
      lucide='ChevronRightIcon'
      className={cn(
        'ml-auto size-4 shrink-0 opacity-60 transition-transform duration-200',
        open && 'rotate-90'
      )}
      aria-hidden='true'
    />
  );
}
function DocsNavItem({ item, forceOpen }) {
  const [open, setOpen] = useState(
    () => item.children?.some((child) => child.isActive) ?? false
  );
  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={item.isActive}>
          <a href='#'>
            <span>{item.label}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  const expanded = forceOpen || open;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type='button'
        onClick={() => setOpen((value) => !value)}
        aria-expanded={expanded}
        aria-controls={`docs-sub-${item.id}`}
      >
        <span className='min-w-0 flex-1 truncate'>{item.label}</span>
        <Chevron open={expanded} />
      </SidebarMenuButton>
      {expanded ? (
        <SidebarMenuSub id={`docs-sub-${item.id}`}>
          {item.children.map((child) => (
            <SidebarMenuSubItem key={child.id}>
              <SidebarMenuSubButton asChild isActive={child.isActive}>
                <a href='#'>
                  <span>{child.label}</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}
function DocsSection({ section, items, filtering }) {
  const [open, setOpen] = useState(() =>
    section.items.some(
      (item) => item.isActive || item.children?.some((child) => child.isActive)
    )
  );
  const expanded = filtering || open;
  return (
    <Collapsible open={expanded} onOpenChange={setOpen}>
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className='hover:bg-ui-sidebar-accent hover:text-ui-sidebar-accent-foreground w-full'
        >
          <CollapsibleTrigger>
            <span className='min-w-0 flex-1 truncate text-start'>
              {section.label}
            </span>
            <Chevron open={expanded} />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <DocsNavItem key={item.id} item={item} forceOpen={filtering} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
export function Pattern() {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const visible = SECTIONS.map((section) => ({
    section,
    items: filterItems(section.items, needle)
  })).filter((entry) => entry.items.length > 0);
  return (
    <AppShellFrame>
      <SidebarProvider open={true} shortcut={false} className='h-full min-h-0 w-full overflow-hidden'>
        <Sidebar mobileTitle='Documentation navigation' mobileDescription='Search and browse the documentation.'>
          <SidebarHeader>
            <div className='flex items-center gap-2'>
              <GaudiBrand className='text-sm' />
              <span className='truncate text-sm font-medium'>Docs</span>
              <span className='text-ui-sidebar-foreground ml-auto shrink-0 text-xs'>
                v2.8
              </span>
            </div>
            <label htmlFor='docs-search' className='sr-only'>
              Search the documentation
            </label>
            <SidebarInput
              id='docs-search'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search docs'
            />
          </SidebarHeader>

          <SidebarContent role='navigation' aria-label='Documentation'>
            {visible.map((entry) => (
              <DocsSection
                key={entry.section.id}
                section={entry.section}
                items={entry.items}
                filtering={needle !== ''}
              />
            ))}
            {visible.length === 0 ? (
              <p className='text-ui-sidebar-foreground px-4 py-6 text-center text-xs'>
                No pages match{' '}
                <span className='text-ui-sidebar-foreground'>{query}</span>.
              </p>
            ) : null}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className='min-w-0 overflow-auto'>
          <AppShellHeader bordered className='hidden in-data-[compact=true]:flex'>
            <SidebarTrigger label='Toggle documentation navigation' />
            <span className='text-sm font-medium'>Gaudi Docs</span>
          </AppShellHeader>
          <article className='mx-auto w-full max-w-2xl px-6 py-6'>
            <h1 className='text-xl font-semibold tracking-tight'>
              Sidebar anatomy
            </h1>
            <p className='text-ui-muted-foreground mt-2 text-sm'>
              A sidebar is a provider, a panel and the inset beside it. The
              provider owns the open state and the widths, the panel owns the
              navigation, and the inset is the page the reader came for.
            </p>

            <h2 className='mt-6 text-base font-medium'>How the layout is arranged</h2>
            <p className='text-ui-muted-foreground mt-2 text-sm'>
              Header and footer are pinned; only the content between them scrolls.
              Groups carry the labels, menus carry the rows, and a sub-menu nests
              one level under the row that owns it.
            </p>
            <p className='text-ui-muted-foreground mt-2 text-sm'>
              Keep the panel to one job. A tree that needs three levels of
              indentation usually wants a page of its own.
            </p>

            <ul className='text-ui-muted-foreground mt-4 flex list-disc flex-col gap-1.5 ps-5 text-sm'>
              <li>Each panel is a named landmark, so screen readers can jump between them.</li>
              <li>
                Every disclosure reports aria-expanded and what it controls.
              </li>
              <li>Only the deepest matching link carries the current-page marker.</li>
            </ul>
          </article>
        </SidebarInset>
      </SidebarProvider>
    </AppShellFrame>
  );
}
