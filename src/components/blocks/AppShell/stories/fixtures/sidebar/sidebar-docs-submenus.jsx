'use client';
import { Label } from '@gaudi/design-system/core/Field';
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
  SidebarTrigger, useSidebar
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
const docs = {
  install: 'Install the package in your application, import its themes and mount the provider at the layout boundary.',
  structure: 'Keep layout, navigation and route content separate. Place shared providers above the routes that need them.',
  theming: 'Choose a theme on the root surface so controls inherit the same foreground, background and focus colors.',
  collapsing: 'Use the sidebar trigger to switch between expanded and collapsed views. On narrow screens the panel opens as a drawer.',
  'sub-menus': 'Nest related destinations under a disclosure. Keep its expanded state separate from the current page.',
  columns: 'Give each column a stable key, an accessible title and a renderer that preserves the meaning of its value.',
  'row-selection': 'Track rows by their stable identifier so selections survive sorting and filtering.',
  virtualisation: 'Render the visible row window when the data set is large. Keep the scroll region bounded so its measurements stay predictable.',
  operators: 'Offer comparison operators appropriate to the field type, such as contains for text or before for dates.',
  'async-options': 'Keep the input usable while suggestions load and provide an empty state when the search returns no matches.',
  calendar: 'The calendar supports date selection and month navigation. Provide a field label when a date is required by a form.',
  'open-state': 'Use the provider to control the panel and its trigger together. Mobile and desktop have separate open state.',
  widths: 'Set the sidebar width at its provider. Container breakpoints determine when the panel needs a mobile layout.',
  'use-sidebar': 'Read the current open state and invoke the provider toggle from a descendant of SidebarProvider.',
  tokens: 'Use sidebar surface, border, text and focus tokens so the same panel works across themes.'
};
function DocsNavItem({ item, forceOpen, page, onNavigate }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const go = (event, entry) => { event.preventDefault(); onNavigate(entry); if (isMobile) setOpenMobile(false); };
  const [open, setOpen] = useState(
    () => item.children?.some((child) => child.isActive) ?? false
  );
  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={page.id === item.id}>
          <a href={'#' + item.id} aria-current={page.id === item.id ? 'page' : undefined} onClick={event => go(event, item)}>
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
              <SidebarMenuSubButton asChild isActive={page.id === child.id}>
                <a href={'#' + child.id} aria-current={page.id === child.id ? 'page' : undefined} onClick={event => go(event, child)}>
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
function DocsSection({ section, items, filtering, page, onNavigate }) {
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
                <DocsNavItem key={item.id} item={item} forceOpen={filtering} page={page} onNavigate={onNavigate} />
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
  const [page, setPage] = useState({ id: 'anatomy', label: 'Sidebar anatomy' });
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
            <Label htmlFor='docs-search' className='sr-only'>
              Search the documentation
            </Label>
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
                filtering={needle !== ''} page={page} onNavigate={setPage}
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
          {page.id !== 'anatomy' ? <article className='mx-auto w-full max-w-2xl px-6 py-6'><h1 className='text-xl font-semibold'>{page.label}</h1><p className='text-text-muted mt-2 text-sm'>{docs[page.id]}</p></article> : <article className='mx-auto w-full max-w-2xl px-6 py-6'>
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
          </article>}
        </SidebarInset>
      </SidebarProvider>
    </AppShellFrame>
  );
}
