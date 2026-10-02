'use client';
import * as React from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../core/Avatar/parts/avatar.jsx';
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
  // A custom mark (a progress ring, an avatar with presence) stands in for the icon.
  if (item.leading) return item.leading;
  if (item.avatar) {
    // A person: a small portrait with an optional presence dot (an intrinsic circle).
    return (
      <span aria-hidden='true' data-slot='app-shell-nav-avatar' className='relative -ms-0.5 shrink-0'>
        <Avatar className='size-5 rounded-full'>
          <AvatarImage src={item.avatar} alt='' className='rounded-full' />
          <AvatarFallback className='rounded-full'>{item.label.slice(0, 1)}</AvatarFallback>
        </Avatar>
        {item.presence ? (
          <span className={cn('ring-ui-sidebar absolute -end-0.5 -bottom-0.5 size-2 rounded-full ring-2', DOT_TONES[item.presence] || item.presence)} />
        ) : null}
      </span>
    );
  }
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
      <span className='min-w-0 truncate'>
        {item.label}
        {item.suffix ? <span className='text-text-muted font-normal'> {item.suffix}</span> : null}
      </span>
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

// A count badge sits over the end of the row, so badged rows keep their label clear of it.
const hasBadge = (item) => item.badge !== undefined && item.badge !== null && item.badge !== '';

function CountBadge({ badge }) {
  if (!hasBadge({ badge })) return null;
  const { label, variant = 'success-light' } = typeof badge === 'object' ? badge : { label: badge };
  // `variant: 'plain'` shows a bare count, as mail folders do.
  if (variant === 'plain') {
    return <SidebarMenuBadge data-variant='plain' className='text-text-muted font-normal'>{label}</SidebarMenuBadge>;
  }
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

// One hover action beside the row menu, for example pin or unpin: `quickAction(item)` returns
// `{ label, icon, onSelect }` (or nothing for rows without it).
function QuickAction({ item, quickAction, hasMenu }) {
  const action = quickAction?.(item);
  if (!action) return null;
  return (
    <SidebarMenuAction
      showOnHover
      aria-label={action.label}
      data-slot='app-shell-nav-quick-action'
      className={hasMenu ? 'end-7' : undefined}
      onClick={action.onSelect}
    >
      <RegistryIcon lucide={action.icon} aria-hidden='true' />
    </SidebarMenuAction>
  );
}

function LeafItem({ item, value, onValueChange, size, actions, actionsLabel, quickAction, itemClassName }) {
  const current = item.id === value;
  const hasQuick = Boolean(quickAction?.(item));
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild size={size} isActive={current} tooltip={item.label} className={cn(hasQuick && actions ? 'pe-14 md:pe-8 md:group-focus-within/menu-item:pe-14 md:group-hover/menu-item:pe-14' : hasBadge(item) && 'pe-9', itemClassName)}>
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
      <QuickAction item={item} quickAction={quickAction} hasMenu={Boolean(actions)} />
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
 * row, for example the raised active rows of a floating sidebar. `item.leading` replaces the icon with
 * a custom mark (a progress ring); people rows take an `avatar` photo (with an optional `presence`
 * dot tone) instead, and `suffix` adds muted text after the label ("(You)"). A `badge` of
 * `{ label, variant: 'plain' }` is a bare count. `quickAction(item)` returns `{ label, icon, onSelect }`
 * for one more hover action beside the row menu (pin, unpin), and `action` places a group action (a
 * `SidebarGroupAction`, for example "Add project") at the end of the group label.
 * `labelIcon` puts a registry icon before the group label and `labelClassName` restyles it (for
 * example a route group heading above indented rows).
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
  quickAction,
  itemClassName,
  action,
  labelIcon,
  labelClassName,
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
            quickAction={quickAction}
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
            <CollapsibleTrigger className={cn('group/section w-full cursor-pointer', action && 'pe-8')}>
              {label}
              <RegistryIcon
                lucide='ChevronDown'
                aria-hidden='true'
                className='ms-auto opacity-60 transition-transform duration-200 motion-reduce:transition-none group-data-[state=closed]/section:-rotate-90'
              />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          {action}
          <CollapsibleContent>
            <SidebarGroupContent>{list}</SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  }
  return (
    <SidebarGroup className={groupClass} {...props}>
      {label ? (
        <SidebarGroupLabel className={cn(labelIcon && 'gap-2', labelClassName)}>
          {labelIcon ? <RegistryIcon lucide={labelIcon} aria-hidden='true' /> : null}
          {label}
        </SidebarGroupLabel>
      ) : null}
      {action}
      <SidebarGroupContent>{list}</SidebarGroupContent>
    </SidebarGroup>
  );
}

export { AppShellNav };
