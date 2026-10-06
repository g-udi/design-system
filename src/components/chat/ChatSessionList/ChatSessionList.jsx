'use client';
import { useId, useRef, useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../core/DropdownMenu/DropdownMenuPrimitives.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../core/Dialog/DialogPrimitives.jsx';
import {
  DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationTitle
} from '../../core/Dialog/DialogConfirmationPrimitives.jsx';
import { FieldInput as Input } from '../../core/Field/index.js';
import { Label } from '../../core/Field/Label.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

const LABELS = {
  title: 'Chats',
  newChat: 'New chat',
  search: 'Search chats',
  empty: 'No chats match.',
  options: 'Chat options',
  rename: 'Rename',
  delete: 'Delete',
  renameTitle: 'Rename chat',
  renameDescription: 'Give the conversation a name you will recognise later.',
  name: 'Name',
  save: 'Save',
  cancel: 'Cancel',
  deleteTitle: 'Delete this chat?',
  deleteDescription: 'Confirm that you want to delete this conversation.',
  live: 'Replying'
};

/**
 * Conversations grouped by `group` (Today, Yesterday…), with search, a new-chat action and a menu per row
 * to rename (dialog) or delete (confirmation). Sessions are `{ id, title, preview?, updated?, group?, live? }`.
 */
function ChatSessionList({ sessions = [], activeId, onSelect, onRename, onDelete, onNew, searchable = true, labels: labelOverrides, className }) {
  const labels = { ...LABELS, ...labelOverrides };
  const [query, setQuery] = useState('');
  const [renaming, setRenaming] = useState(null);
  const [draft, setDraft] = useState('');
  const [deleting, setDeleting] = useState(null);
  const list = useRef(null);
  const optionButtons = useRef(new Map());
  const dialogTrigger = useRef(null);
  const searchId = useId();
  const nameId = useId();
  const visible = sessions.filter((session) => session.title.toLowerCase().includes(query.trim().toLowerCase()));
  const groups = visible.reduce((map, session) => {
    const key = session.group || '';
    map.set(key, [...(map.get(key) || []), session]);
    return map;
  }, new Map());
  const restoreDialogFocus = (event) => {
    event.preventDefault();
    const trigger = dialogTrigger.current;
    dialogTrigger.current = null;
    const target = trigger?.isConnected && trigger.getClientRects().length
      ? trigger
      : list.current?.querySelector('input[type="search"], [data-chat-session]') || list.current;
    target?.focus();
  };

  return (
    <nav ref={list} tabIndex={-1} data-slot='chat-session-list' aria-label={labels.title} className={cn('ds-part-chat-session-list flex flex-col gap-3', className)}>
      <div className='flex items-center justify-between gap-2'>
        <h2 className='text-sm font-semibold'>{labels.title}</h2>
        {onNew ? (
          <Button size='xs' variant='outline' data-close-sheet='' onClick={onNew}>
            <RegistryIcon lucide='SquarePen' />
            {labels.newChat}
          </Button>
        ) : null}
      </div>
      {searchable ? (
        <div className='relative'>
          <label htmlFor={searchId} className='sr-only'>{labels.search}</label>
          <RegistryIcon lucide='Search' className='text-text-muted pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2' />
          <Input id={searchId} type='search' value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search} className='h-8 ps-8 text-sm' />
        </div>
      ) : null}
      <div>
        {visible.length ? (
          [...groups].map(([group, items]) => (
            <section key={group || 'all'} aria-label={group || undefined} className='grid gap-0.5 not-first:mt-3'>
              {group ? <h3 className='text-text-muted px-2 pb-1 text-xs font-medium'>{group}</h3> : null}
              <ul className='grid gap-0.5'>
                {items.map((session) => {
                  const current = session.id === activeId;
                  return (
                    <li key={session.id} className={cn('group/session hover:bg-surface-muted relative flex items-center rounded-(--ds-radius-control)', current && 'bg-surface-muted')}>
                      <button
                        type='button'
                        data-chat-session=''
                        aria-current={current ? 'page' : undefined}
                        onClick={() => onSelect?.(session.id)}
                        className='focus-visible:ring-accent grid min-w-0 flex-1 rounded-(--ds-radius-control) px-2 py-1.5 text-start focus-visible:ring-2 focus-visible:outline-none'
                      >
                        <span className={cn('flex min-w-0 items-center gap-1.5 text-sm', current && 'font-medium')}>
                          {session.live ? <span className='bg-success size-1.5 shrink-0 rounded-full' aria-hidden='true' /> : null}
                          <span className='truncate'>{session.title}</span>
                          {session.live ? <span className='sr-only'>({labels.live})</span> : null}
                        </span>
                        {session.preview ? <span className='text-text-muted truncate text-xs'>{session.preview}</span> : null}
                      </button>
                      {onRename || onDelete ? (
                        <DropdownMenu onOpenChange={(open) => { if (open) dialogTrigger.current = optionButtons.current.get(session.id); }}>
                          <DropdownMenuTrigger asChild>
                            <Button ref={(element) => { if (element) optionButtons.current.set(session.id, element); else optionButtons.current.delete(session.id); }} size='icon-xs' variant='ghost' aria-label={`${labels.options}: ${session.title}`} className='me-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover/session:opacity-100 sm:focus-visible:opacity-100 sm:data-[state=open]:opacity-100'>
                              <RegistryIcon lucide='MoreHorizontal' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            {onRename ? (
                              <DropdownMenuItem onSelect={() => { setDraft(session.title); setRenaming(session); }}>
                                <RegistryIcon lucide='Pencil' />
                                {labels.rename}
                              </DropdownMenuItem>
                            ) : null}
                            {onRename && onDelete ? <DropdownMenuSeparator /> : null}
                            {onDelete ? (
                              <DropdownMenuItem variant='destructive' onSelect={() => setDeleting(session)}>
                                <RegistryIcon lucide='Trash2' />
                                {labels.delete}
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        ) : (
          <p role='status' className='text-text-muted px-2 py-4 text-sm'>{labels.empty}</p>
        )}
      </div>

      <Dialog open={Boolean(renaming)} onOpenChange={(open) => !open && setRenaming(null)}>
        <DialogContent className='sm:max-w-sm' onCloseAutoFocus={restoreDialogFocus}>
          <form
            className='grid gap-4'
            onSubmit={(event) => {
              event.preventDefault();
              if (draft.trim()) onRename?.(renaming.id, draft.trim());
              setRenaming(null);
            }}
          >
            <DialogHeader>
              <DialogTitle>{labels.renameTitle}</DialogTitle>
              <DialogDescription>{labels.renameDescription}</DialogDescription>
            </DialogHeader>
            <div className='grid gap-1.5'>
              <Label htmlFor={nameId}>{labels.name}</Label>
              <Input id={nameId} value={draft} onChange={(event) => setDraft(event.target.value)} required autoComplete='off' />
            </div>
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setRenaming(null)}>{labels.cancel}</Button>
              <Button type='submit'>{labels.save}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DialogConfirmation open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogConfirmationContent size='sm' onCloseAutoFocus={restoreDialogFocus}>
          <DialogConfirmationHeader>
            <DialogConfirmationTitle>{labels.deleteTitle}</DialogConfirmationTitle>
            <DialogConfirmationDescription>
              <span className='font-medium'>{deleting?.title}</span> · {labels.deleteDescription}
            </DialogConfirmationDescription>
          </DialogConfirmationHeader>
          <DialogConfirmationFooter>
            <DialogConfirmationCancel>{labels.cancel}</DialogConfirmationCancel>
            <DialogConfirmationAction variant='destructive' onClick={() => onDelete?.(deleting.id)}>{labels.delete}</DialogConfirmationAction>
          </DialogConfirmationFooter>
        </DialogConfirmationContent>
      </DialogConfirmation>
    </nav>
  );
}

export { ChatSessionList };
