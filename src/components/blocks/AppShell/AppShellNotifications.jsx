'use client';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { Badge } from '../../core/Pill/Badge.jsx';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../../core/Avatar/AvatarPrimitives.jsx';
import { Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentActions, AttachmentAction } from '../../core/Attachment/Attachment.jsx';
import { Progress } from '../../core/Progress/ProgressPrimitives.jsx';
import { Rating } from '../../core/Rating/Rating.jsx';
import { ScrollArea } from '../../core/ScrollArea/index.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../core/Sheet/Sheet.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../core/Tooltip/TooltipPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { normalizeDownloadHref } from '../../../utilities/href.js';
import { useAppShellFrame } from './AppShellFrame.jsx';

// Icon tones map to Gaudi's semantic colours.
const TONES = {
  neutral: 'text-text-muted',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  attention: 'text-attention',
  danger: 'text-ui-destructive',
  discovery: 'text-discovery'
};
const toneOf = (tone) => TONES[tone] || TONES.neutral;

/** A two-part outline pill: a muted label beside a toned value (for example Priority · High). */
function MetaPill({ label, value, tone }) {
  return (
    <span className='inline-flex h-5 items-stretch overflow-hidden rounded-(--ds-radius-control) border border-ui-border text-xs leading-none'>
      <span className='text-text-muted flex items-center px-1.5'>{label}</span>
      <span className={cn('flex items-center border-s border-ui-border px-1.5 font-medium', toneOf(tone))}>{value}</span>
    </span>
  );
}

function Lead({ item }) {
  if (item.avatar) {
    return (
      <Avatar className='size-6'>
        <AvatarImage src={item.avatar} alt='' />
        <AvatarFallback>{item.initials || item.title?.[0]}</AvatarFallback>
      </Avatar>
    );
  }
  return (
    <span aria-hidden='true' className={cn('grid size-6 place-items-center', toneOf(item.tone))}>
      <RegistryIcon lucide={item.icon || 'Bell'} className='size-4' />
    </span>
  );
}

function NotificationItem({ item, onAction }) {
  return (
    <li
      data-slot='app-shell-notification'
      data-unread={item.unread ? 'true' : undefined}
      className='flex gap-3 border-b border-ui-border px-4 py-3 last:border-b-0'
    >
      <Lead item={item} />
      <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
        <div className='flex items-start gap-2'>
          <p className='min-w-0 flex-1 text-sm leading-5 font-medium'>
            {item.title}
            {item.unread ? <span className='sr-only'> (unread)</span> : null}
          </p>
          {item.badge ? (
            <Badge variant='outline' size='sm' className='shrink-0'>
              {item.badge}
            </Badge>
          ) : null}
        </div>
        {item.body ? <p className='text-text-muted text-sm leading-5'>{item.body}</p> : null}
        {item.rating ? <Rating rating={item.rating} size='sm' className='gap-0.5' /> : null}
        {item.people ? (
          <AvatarGroup className='-space-x-1.5' role='img' aria-label={item.peopleLabel || `${item.people.length} people`}>
            {item.people.map((src) => (
              <Avatar key={src} className='size-6'>
                <AvatarImage src={src} alt='' />
                <AvatarFallback />
              </Avatar>
            ))}
          </AvatarGroup>
        ) : null}
        {item.progress ? (
          <Progress
            value={item.progress.value}
            max={item.progress.max}
            aria-label={item.progress.label || 'Progress'}
            className='h-1 [&>[data-slot=progress-indicator]]:bg-success'
          />
        ) : null}
        {item.schedule ? (
          <span className='inline-flex w-fit items-center gap-1.5 rounded-(--ds-radius-control) border border-ui-border px-2 py-1 text-xs'>
            <RegistryIcon lucide='Calendar' aria-hidden='true' className='text-text-muted size-3.5' />
            <span className='font-medium'>{item.schedule.date}</span>
            <span className='text-text-muted'>{item.schedule.time}</span>
          </span>
        ) : null}
        {item.attachment ? (
          <Attachment size='xs' className='w-fit'>
            <AttachmentMedia><RegistryIcon lucide='Paperclip' aria-hidden='true' /></AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{item.attachment.name}</AttachmentTitle>
              {item.attachment.size ? <AttachmentDescription>{item.attachment.size}</AttachmentDescription> : null}
            </AttachmentContent>
            {normalizeDownloadHref(item.attachment.href) ? (
              <AttachmentActions>
                <AttachmentAction asChild aria-label={`Open ${item.attachment.name}`}>
                  <a href={normalizeDownloadHref(item.attachment.href)}><RegistryIcon lucide='ExternalLink' aria-hidden='true' /></a>
                </AttachmentAction>
                <AttachmentAction asChild aria-label={`Download ${item.attachment.name}`}>
                  <a href={normalizeDownloadHref(item.attachment.href)} download={item.attachment.name}><RegistryIcon lucide='Download' aria-hidden='true' /></a>
                </AttachmentAction>
              </AttachmentActions>
            ) : null}
          </Attachment>
        ) : null}
        {item.resolved ? (
          <span className='text-ui-success-ink flex items-center gap-1 text-xs font-medium'>
            <RegistryIcon lucide='Check' aria-hidden='true' className='size-3.5' />
            {item.resolved}
          </span>
        ) : item.actions?.length ? (
          <div className='flex flex-wrap gap-1.5 pt-0.5'>
            {item.actions.map((action) => (
              <Button
                key={action.id || action.label}
                size='xs'
                variant={action.primary ? 'solid' : 'outline'}
                tone='neutral'
                onClick={() => onAction(item, action)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-text-muted text-xs'>{item.time}</span>
          {item.meta ? <MetaPill {...item.meta} /> : null}
        </div>
      </div>
    </li>
  );
}

/**
 * The notifications feed of an app shell: a bell trigger that opens a sheet with a count of unread
 * items, a "Mark all as read" action and one row per notification. Rows take an avatar or a toned
 * icon, a title, body text and optional extras: an outline `badge`, a `rating`, `people` photos, a
 * `progress` bar, a `schedule` chip, an `attachment`, inline `actions` and a two-part `meta` pill.
 * Actions marked `dismiss` remove the row; other actions resolve it with their `done` text and call
 * `onAction(item, action)`. Inside an `AppShellFrame` the sheet opens within the window; `inset` floats
 * it off the edge. Pass `items` with `onItemsChange` to control the list, or `defaultItems`.
 */
function AppShellNotifications({
  items: itemsProp,
  defaultItems = [],
  onItemsChange,
  onAction,
  onViewAll,
  open,
  onOpenChange,
  inset = false,
  side = 'right',
  label = 'Notifications',
  description = 'View and manage your notifications',
  viewAllLabel = 'View all notifications',
  triggerClassName,
  className
}) {
  const frame = useAppShellFrame();
  const [items, update] = useControllableState({ value: itemsProp, defaultValue: defaultItems, onChange: onItemsChange });
  const unread = items.filter((item) => item.unread).length;
  const handleAction = (item, action) => {
    onAction?.(item, action);
    if (action.dismiss) {
      update(items.filter((entry) => entry.id !== item.id));
      return;
    }
    update(items.map((entry) => (entry.id === item.id ? { ...entry, unread: false, resolved: action.done || action.label } : entry)));
  };
  const markAllRead = () => update(items.map((item) => ({ ...item, unread: false })));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Its own provider, so the bell works in any top bar, inside a sidebar provider or not. */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label={unread ? `${label}, ${unread} unread` : label}
                className={cn('relative', triggerClassName)}
              >
                <RegistryIcon lucide='Bell' aria-hidden='true' />
                {unread ? <span aria-hidden='true' className='bg-ui-destructive absolute top-1.5 right-1.5 size-1.5 rounded-full' /> : null}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side='bottom'>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent
        side={side}
        inset={inset}
        container={frame?.container ?? undefined}
        showCloseButton={false}
        data-slot='app-shell-notifications'
        className={cn('flex w-[24rem] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0', className)}
      >
        <SheetHeader className='flex-row items-center gap-2 border-b border-ui-border px-4 py-3'>
          <SheetTitle className='flex items-center gap-2 text-base font-medium'>
            {label}
            {unread ? (
              <Badge variant='invert' size='sm'>
                {unread}
                <span className='sr-only'> unread</span>
              </Badge>
            ) : null}
          </SheetTitle>
          <SheetDescription className='sr-only'>{description}</SheetDescription>
          <span className='ms-auto flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label='Mark all as read'
              title='Mark all as read'
              disabled={!unread}
              onClick={markAllRead}
            >
              <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
            </Button>
            <SheetClose asChild>
              <Button variant='ghost' size='icon-sm' aria-label={`Close ${label.toLowerCase()}`}>
                <RegistryIcon lucide='X' aria-hidden='true' />
              </Button>
            </SheetClose>
          </span>
        </SheetHeader>
        <ScrollArea aria-label={label} className='min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]]:overscroll-contain'>
          {items.length ? (
            <ul aria-label={label}>
              {items.map((item) => (
                <NotificationItem key={item.id} item={item} onAction={handleAction} />
              ))}
            </ul>
          ) : (
            <p className='text-text-muted px-4 py-10 text-center text-sm'>You are all caught up.</p>
          )}
        </ScrollArea>
        <SheetFooter className='border-t border-ui-border p-1'>
          <Button variant='ghost' className='w-full' onClick={onViewAll}>
            {viewAllLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { AppShellNotifications };
