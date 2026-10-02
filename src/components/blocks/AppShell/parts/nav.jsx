'use client';
import * as React from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Badge } from '../../../core/Pill/parts/badge-extended.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../core/Accordion/parts/collapsible.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from './sidebar.jsx';

// Status dots are intrinsic circles; tones map to Gaudi's semantic colours.
const DOT_TONES = {
  success: 'bg-success',
  info: 'bg-info',
  discovery: 'bg-discovery',
  warning: 'bg-warning',
  attention: 'bg-attention',
  danger: 'bg-ui-destructive',
  neutral: 'bg-text-muted',
  // A categorical hue for resources that are neither healthy nor failing.
  violet: 'bg-(--ds-color-chart-7)'
};

const go = (onValueChange, id) => (event) => {
  event.preventDefault();
  onValueChange?.(id);
};

function Leading({ item }) {
  if (item.dot) {
    return (
      <span
        aria-hidden='true'
        data-slot='app-shell-nav-dot'
        className={cn('ms-1.5 me-1 size-1.5 shrink-0 rounded-full', DOT_TONES[item.dot] || item.dot)}
      />
    );
  }
  if (item.icon) return <RegistryIcon lucide={item.icon} aria-hidden='true' />;
  return null;
}

function Label({ item }) {
  return (
    <>
      <Leading item={item} />
      <span className='min-w-0 truncate'>{item.label}</span>
      {item.tag ? (
        <Badge variant='outline' size='xs' className='shrink-0 font-normal'>
          {item.tag}
        </Badge>
      ) : null}
      {item.status ? <span className='sr-only'>, {item.status}</span> : null}
    </>
  );
}

// A live-status dot at the end of the row (for example, new activity).
function Indicator({ item }) {
  if (!item.indicator) return null;
  return (
    <SidebarMenuBadge>
      <span aria-hidden='true' className={cn('size-1.5 rounded-full', DOT_TONES[item.indicator] || item.indicator)} />
    </SidebarMenuBadge>
  );
}

function CountBadge({ badge }) {
  if (badge === undefined || badge === null || badge === '') return null;
  const { label, variant = 'success-light' } = typeof badge === 'object' ? badge : { label: badge };
  return (
    <SidebarMenuBadge>
      <Badge variant={variant} size='sm'>
        {label}
      </Badge>
    </SidebarMenuBadge>
  );
}

function RowActions({ item, actions, actionsLabel }) {
  const content = actions?.(item);
  if (!content) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover aria-label={`${actionsLabel} for ${item.label}`}>
          <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' />
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='start' className='w-44'>
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LeafItem({ item, value, onValueChange, size, actions, actionsLabel, itemClassName }) {
  const current = item.id === value;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild size={size} isActive={current} tooltip={item.label} className={itemClassName}>
        <a
          href={item.href || `#${item.id}`}
          aria-current={current ? 'page' : undefined}
          onClick={go(onValueChange, item.id)}
        >
          <Label item={item} />
        </a>
      </SidebarMenuButton>
      <CountBadge badge={item.badge} />
      <Indicator item={item} />
      <RowActions item={item} actions={actions} actionsLabel={actionsLabel} />
    </SidebarMenuItem>
  );
}

function NestedItem({ item, value, onValueChange, size, remembered, onRemember, itemClassName }) {
  const { state, isMobile } = useSidebar();
  const [open, setOpen] = React.useState(item.defaultOpen ?? false);
  const children = item.items;
  const currentChild = children.find((child) => child.id === value);
  // The section remembers its last view, so it stays marked while another page is current.
  const marked = currentChild?.id ?? remembered;
  const select = (id) => {
    onRemember(item.id, id);
    onValueChange?.(id);
  };
  if (state === 'collapsed' && !isMobile) {
    // On the icon rail the children open in a menu beside the rail.
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size={size} isActive={Boolean(currentChild)} aria-label={item.label} className={itemClassName}>
              <Leading item={item} />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='right' align='start' className='w-48'>
            <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
            <DropdownMenuGroup>
              {children.map((child) => (
                <DropdownMenuItem
                  key={child.id}
                  aria-current={child.id === value ? 'page' : undefined}
                  data-active={child.id === marked || undefined}
                  className='data-active:font-medium'
                  onSelect={() => select(child.id)}
                >
                  {child.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }
  return (
    <Collapsible asChild open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton size={size} tooltip={item.label} className={cn('group/nested', itemClassName)}>
            <Leading item={item} />
            <span className='min-w-0 truncate'>{item.label}</span>
            <RegistryIcon
              lucide='ChevronRight'
              aria-hidden='true'
              className='ds-part-rtl-flip ms-auto opacity-60 transition-transform duration-200 motion-reduce:transition-none group-data-[state=open]/nested:rotate-90'
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <SidebarMenuSubButton
                  href={child.href || `#${child.id}`}
                  isActive={child.id === marked}
                  className={itemClassName}
                  aria-current={child.id === value ? 'page' : undefined}
                  onClick={go(select, child.id)}
                >
                  <span>{child.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/**
 * A data-driven sidebar group for app-shell examples. Each item has an `id`, `label` and either an
 * `icon` (registry name) or a status `dot` tone (`success`, `info`, `violet`, `warning`, `danger`…,
 * with an optional spoken `status`); `badge` adds a count at the end, `tag` a small outline badge after
 * the label, and `items` nests sub-pages in a collapsible section (`defaultOpen`, `defaultValue`) that
 * opens as a menu beside the icon rail. A nested section remembers its last view and keeps it marked.
 * `value` / `onValueChange` hold the current page (marked `aria-current='page'`). `label` names the
 * group; `collapsible` turns the label into a toggle; `hideOnRail` hides the group on the icon rail;
 * `actions(item)` returns DropdownMenu items for a ⋯ row menu that appears on hover or focus;
 * `indicator` (a dot tone) marks live activity at the end of a row; `itemClassName` restyles every
 * row, for example the raised active rows of a floating sidebar.
 */
function AppShellNav({
  label,
  items,
  value,
  onValueChange,
  size = 'default',
  collapsible = false,
  defaultOpen = true,
  hideOnRail = false,
  actions,
  actionsLabel = 'Actions',
  itemClassName,
  className,
  ...props
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  // Choosing a page in the phone sheet closes it, as following a link would.
  const choose = React.useCallback(
    (id) => {
      onValueChange?.(id);
      if (isMobile) setOpenMobile(false);
    },
    [onValueChange, isMobile, setOpenMobile]
  );
  const [remembered, setRemembered] = React.useState(() =>
    Object.fromEntries(items.filter((item) => item.items).map((item) => [item.id, item.defaultValue]))
  );
  const onRemember = React.useCallback((parent, child) => setRemembered((map) => ({ ...map, [parent]: child })), []);
  const list = (
    <SidebarMenu className='gap-0.5'>
      {items.map((item) =>
        item.items ? (
          <NestedItem
            key={item.id}
            item={item}
            value={value}
            onValueChange={choose}
            size={size}
            remembered={remembered[item.id]}
            onRemember={onRemember}
            itemClassName={itemClassName}
          />
        ) : (
          <LeafItem
            key={item.id}
            item={item}
            value={value}
            onValueChange={choose}
            size={size}
            actions={actions}
            actionsLabel={actionsLabel}
            itemClassName={itemClassName}
          />
        )
      )}
    </SidebarMenu>
  );
  const groupClass = cn(hideOnRail && 'group-data-[collapsible=icon]:hidden', className);
  if (collapsible && label) {
    return (
      <Collapsible defaultOpen={defaultOpen} asChild>
        <SidebarGroup className={groupClass} {...props}>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className='group/section w-full cursor-pointer'>
              {label}
              <RegistryIcon
                lucide='ChevronDown'
                aria-hidden='true'
                className='ms-auto opacity-60 transition-transform duration-200 motion-reduce:transition-none group-data-[state=closed]/section:-rotate-90'
              />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>{list}</SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  }
  return (
    <SidebarGroup className={groupClass} {...props}>
      {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
      <SidebarGroupContent>{list}</SidebarGroupContent>
    </SidebarGroup>
  );
}

export { AppShellNav };
