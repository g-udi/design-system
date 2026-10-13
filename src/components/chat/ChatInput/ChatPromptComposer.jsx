'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { getFocusableElements } from '../../../hooks/shared/dom.js';
import { useLiveAnnouncer } from '../../../hooks/a11y/use-live-announcer.js';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle
} from '../../core/Attachment/Attachment.jsx';
import { default as Textarea } from '../../core/Textarea/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '../../core/Input/InputGroup.jsx';
import { Popover, PopoverAnchor, PopoverContent } from '../../core/Popover/PopoverPrimitives.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../core/Avatar/AvatarPrimitives.jsx';
import { getAvatarInitials } from '../../core/Avatar/avatarModel.js';

/*
 * The trigger is the token right before the caret: `@` anywhere after a space starts a mention, and `/`
 * at the very start of the message starts a command. Choosing an item replaces the token with its
 * insertion text, so the message stays plain text the host can parse or send as is.
 */
const TRIGGER = /(^|\s)(@)([\w.-]*)$|^(\/)([\w-]*)$/;

function findTrigger(text, caret) {
  const before = text.slice(0, caret);
  const match = before.match(TRIGGER);
  if (!match) return null;
  const symbol = match[2] || match[4];
  const query = match[3] ?? match[5] ?? '';
  return { symbol, query, start: caret - query.length - 1, end: caret };
}

const insertionOf = (item, symbol) => item.insertionText || `${symbol}${item.name.replace(/\s+/g, '')}`;

/** Mentions present in the text, matched by their insertion text. */
const mentionsIn = (text, items) => items.filter((item) => text.includes(insertionOf(item, '@')));

const DEFAULT_LABELS = {
  message: 'Message',
  placeholder: 'Ask anything. Type @ to mention or / for commands.',
  send: 'Send',
  queue: 'Add to queue',
  stop: 'Stop reply',
  attach: 'Attach files',
  remove: 'Remove',
  people: 'Mentions',
  commands: 'Commands',
  suggestions: (count) => `${count} ${count === 1 ? 'suggestion' : 'suggestions'}. Use the arrow keys to choose.`
};

/**
 * A chat composer on InputGroup: multi-line prompt, @mentions and /commands from a listbox, an
 * attachment tray, configurable `leftControls` and `rightControls`, and send or stop.
 * `toolbar` and `actions` remain aliases for the left and right slots. Enter sends, Shift+Enter
 * starts a new line. While a reply streams (`status='streaming'`) sending still works and reports
 * `{ queued: true }` so the host can hold the message in a ChatPromptQueue.
 *
 * `variant='card'` is the roomier assistant composer: a one-line prompt that grows, a muted writing area
 * and a footer toolbar for ChatPromptAttachMenu, ChatModelSelect, ChatPromptSettings and ChatContextMeter.
 * `voice` takes the send button's place while the prompt is empty, and send returns as soon as there
 * is text or a file. Pass an element (a microphone button, a ChatSpeechInput) or a function
 * `({ value, setValue, insert, disabled }) => element`, where `insert(text)` adds dictated text at the
 * end of the prompt.
 */
function ChatPromptComposer({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  status = 'ready',
  onStop,
  mentions = [],
  commands = [],
  attachments = [],
  onAttach,
  onRemoveAttachment,
  accept,
  toolbar,
  actions,
  leftControls = toolbar,
  rightControls = actions,
  voice,
  variant = 'default',
  footer,
  disabled = false,
  labels: labelOverrides,
  className,
  textareaProps
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const textarea = useRef(null);
  const focusedStop = useRef(null);
  const textareaRef = useMergedRefs(textarea, textareaProps?.ref);
  const files = useRef(null);
  const listId = useId();
  const [caret, setCaret] = useState(0);
  const [dismissed, setDismissed] = useState(null);
  const [active, setActive] = useState('');
  const streaming = status === 'streaming';
  const busy = status === 'submitting';
  const inputDisabled = disabled || textareaProps?.disabled;
  const editable = !inputDisabled && !textareaProps?.readOnly;

  useIsomorphicLayoutEffect(() => {
    const previous = focusedStop.current;
    if (!previous || previous.isConnected) return;
    focusedStop.current = null;
    const document = previous.ownerDocument;
    if (document.hasFocus() && document.activeElement === document.body) textarea.current?.focus();
  });

  const trigger = findTrigger(value, caret);
  const source = trigger?.symbol === '@' ? mentions : trigger?.symbol === '/' ? commands : [];
  const query = trigger?.query.toLowerCase() ?? '';
  const results = trigger ? source.filter((item) => item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)).slice(0, 8) : [];
  const resultKey = results.map((item) => item.id).join('|');
  const open = Boolean(editable && trigger && results.length && dismissed !== trigger.start);

  useEffect(() => {
    const ids = resultKey.split('|');
    if (open && !ids.includes(active)) setActive(ids[0]);
  }, [open, resultKey, active]);

  const optionId = (id) => `${listId}-option-${id}`;

  const choose = (item) => {
    if (!editable || !trigger) return;
    const insertion = `${insertionOf(item, trigger.symbol)} `;
    const next = value.slice(0, trigger.start) + insertion + value.slice(trigger.end);
    const position = trigger.start + insertion.length;
    setValue(next);
    setCaret(position);
    requestAnimationFrame(() => {
      textarea.current?.focus();
      textarea.current?.setSelectionRange(position, position);
    });
  };

  const hasContent = Boolean(value.trim() || attachments.length);
  const canSend = editable && !busy && hasContent;
  const card = variant === 'card';
  const insert = (text) => {
    if (!editable || !text) return;
    setValue(value && !/\s$/.test(value) ? `${value} ${text}` : `${value}${text}`);
    requestAnimationFrame(() => textarea.current?.focus());
  };
  const voiceSlot = voice && !hasContent && !streaming ? (typeof voice === 'function' ? voice({ value, setValue, insert, disabled: !editable || busy }) : voice) : null;
  const submit = () => {
    if (!canSend) return;
    onSubmit?.(value.trim(), { mentions: mentionsIn(value, mentions), command: commands.find((item) => value.startsWith(insertionOf(item, '/'))), attachments, queued: streaming });
    setValue('');
    setCaret(0);
  };

  const onKeyDown = (event) => {
    textareaProps?.onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || !editable) return;
    if (open) {
      const index = results.findIndex((item) => item.id === active);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive(results[(index + step + results.length) % results.length].id);
        return;
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        choose(results[Math.max(index, 0)]);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setDismissed(trigger.start);
        return;
      }
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const syncCaret = (event, handler) => {
    handler?.(event);
    if (!event.defaultPrevented) setCaret(event.currentTarget.selectionStart ?? 0);
  };

  return (
    <Popover open={open} onOpenChange={(nextOpen) => { if (!nextOpen) setDismissed(trigger?.start ?? null); }}>
      <PopoverAnchor asChild>
        <div data-slot='prompt-composer' data-status={status} data-variant={variant} className={cn('ds-part-prompt-composer relative grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2', className)}>
          {open ? (
            // The textarea owns listbox focus; Popover only positions and dismisses it.
            <PopoverContent
              id={listId}
              role='listbox'
              aria-label={trigger.symbol === '@' ? labels.people : labels.commands}
              side='top'
              align='start'
              sideOffset={8}
              collisionPadding={12}
              className='ds-part-command-list w-(--radix-popover-trigger-width) max-w-[min(24rem,var(--radix-popover-content-available-width))] max-h-[min(16rem,var(--radix-popover-content-available-height))] p-0'
              onOpenAutoFocus={(event) => event.preventDefault()}
              onCloseAutoFocus={(event) => event.preventDefault()}
              onEscapeKeyDown={(event) => { if (event.isComposing) event.preventDefault(); }}
              onInteractOutside={(event) => {
                if (event.detail.originalEvent.target === textarea.current) event.preventDefault();
              }}
            >
              <div className='ds-part-command-group'>
                <div aria-hidden='true' className='text-text-muted px-3 pt-2 pb-1 text-xs font-medium'>{trigger.symbol === '@' ? labels.people : labels.commands}</div>
                {results.map((item) => (
                  <div
                    key={item.id}
                    id={optionId(item.id)}
                    role='option'
                    aria-selected={item.id === active}
                    data-selected={item.id === active}
                    data-slot='command-item'
                    className='ds-part-command-item gap-2'
                    onMouseDown={(event) => event.preventDefault()}
                    onPointerMove={() => setActive(item.id)}
                    onClick={() => choose(item)}
                  >
                    {item.avatar ? (
                      <Avatar size='sm' className='size-5'>
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{getAvatarInitials(item.name)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <RegistryIcon lucide={item.icon || (trigger.symbol === '@' ? 'AtSign' : 'Command')} className='text-text-muted size-4 shrink-0' />
                    )}
                    <span className='grid min-w-0'>
                      <span className='truncate'>{trigger.symbol === '/' ? `/${item.name}` : item.name}</span>
                      {item.description ? <span className='text-text-muted truncate text-xs'>{item.description}</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          ) : null}
          <span role='status' className='sr-only'>{open ? labels.suggestions(results.length) : ''}</span>
          <InputGroup data-disabled={inputDisabled || undefined} className={card ? undefined : 'bg-surface'}>
            {attachments.length ? (
              <InputGroupAddon align='block-start' className='pb-0'>
                <AttachmentGroup className='flex flex-wrap gap-2'>
                  {attachments.map((file) => (
                    <Attachment key={file.id ?? file.name} size='xs'>
                      <AttachmentMedia file={file} />
                      <AttachmentContent>
                        <AttachmentTitle>{file.name}</AttachmentTitle>
                        {file.size ? <AttachmentDescription>{file.size}</AttachmentDescription> : null}
                      </AttachmentContent>
                      {onRemoveAttachment ? (
                        <AttachmentActions>
                          <AttachmentAction disabled={!editable} aria-label={`${labels.remove} ${file.name}`} onClick={() => onRemoveAttachment(file.id ?? file.name)}>
                            <RegistryIcon lucide='X' />
                          </AttachmentAction>
                        </AttachmentActions>
                      ) : null}
                    </Attachment>
                  ))}
                </AttachmentGroup>
              </InputGroupAddon>
            ) : null}
            <InputGroupTextarea
              rows={card ? 1 : 2}
              placeholder={labels.placeholder}
              aria-label={labels.message}
              role='combobox'
              aria-expanded={open}
              aria-controls={open ? listId : undefined}
              aria-autocomplete='list'
              aria-activedescendant={open && active ? optionId(active) : undefined}
              {...textareaProps}
              ref={textareaRef}
              value={value}
              disabled={inputDisabled}
              className={cn('field-sizing-content max-h-48', card ? 'min-h-16 p-3 text-base sm:text-sm' : 'min-h-14', textareaProps?.className)}
              onChange={(event) => {
                textareaProps?.onChange?.(event);
                if (event.defaultPrevented || !editable) return;
                setValue(event.target.value);
                setCaret(event.target.selectionStart ?? 0);
                setDismissed(null);
              }}
              onKeyDown={onKeyDown}
              onKeyUp={(event) => syncCaret(event, textareaProps?.onKeyUp)}
              onClick={(event) => syncCaret(event, textareaProps?.onClick)}
              onSelect={(event) => syncCaret(event, textareaProps?.onSelect)}
            />
            <InputGroupAddon align='block-end' className='items-end justify-between gap-2'>
              <div data-slot='prompt-composer-toolbar' data-side='left' className={cn('flex min-w-0 max-w-full flex-wrap items-center gap-1 empty:hidden', card && 'flex-[1_1_10rem]')}>
                {onAttach ? (
                  <>
                    <InputGroupButton size='icon-sm' aria-label={labels.attach} onClick={() => files.current?.click()} disabled={!editable}>
                      <RegistryIcon lucide='Paperclip' />
                    </InputGroupButton>
                    <input
                      ref={files}
                      type='file'
                      disabled={!editable}
                      multiple
                      accept={accept}
                      hidden
                      tabIndex={-1}
                      onChange={(event) => {
                        if (editable && event.target.files?.length) onAttach([...event.target.files]);
                        event.target.value = '';
                      }}
                    />
                  </>
                ) : null}
                {leftControls}
              </div>
              <div data-slot='prompt-composer-actions' data-side='right' className='ms-auto flex min-w-0 max-w-full flex-wrap items-center justify-end gap-1'>
                {rightControls}
                <div data-slot='prompt-composer-submit' className='flex shrink-0 items-center gap-1'>
                  {streaming && onStop ? (
                    <InputGroupButton size='icon-sm' variant='outline' aria-label={labels.stop} disabled={inputDisabled} onClick={onStop} onFocus={(event) => { focusedStop.current = event.currentTarget; }} onBlur={(event) => { if (event.currentTarget.isConnected) focusedStop.current = null; }}>
                      <RegistryIcon lucide='Square' className='fill-current' />
                    </InputGroupButton>
                  ) : null}
                  {voiceSlot ?? (
                    <InputGroupButton size='icon-sm' variant='solid' aria-label={streaming ? labels.queue : labels.send} disabled={!canSend} onClick={submit}>
                      <RegistryIcon lucide={streaming ? 'ListTodo' : 'ArrowUp'} />
                    </InputGroupButton>
                  )}
                </div>
              </div>
            </InputGroupAddon>
          </InputGroup>
          {footer ? <div data-slot='prompt-composer-footer' className='text-text-muted text-xs'>{footer}</div> : null}
        </div>
      </PopoverAnchor>
    </Popover>
  );
}

const QUEUE_LABELS = {
  title: 'Queued',
  hint: 'Sends when the current reply finishes.',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  remove: 'Remove',
  sendNow: 'Send now',
  moved: 'Moved.',
  removed: 'Removed from the queue.',
  saved: 'Queued message updated.'
};

/**
 * Messages waiting for the current reply to finish. Each row can be edited in place (Enter saves,
 * Escape cancels), sent now, removed, or moved with Alt+Arrow keys.
 */
function ChatPromptQueue({ items = [], onEdit, onRemove, onSendNow, onMove, labels: labelOverrides, className }) {
  const labels = { ...QUEUE_LABELS, ...labelOverrides };
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const { announce } = useLiveAnnouncer();
  const editButtons = useRef(new Map());
  const queue = useRef(null);
  const lastQueueFocus = useRef(null);
  const headingId = useId();
  useEffect(() => {
    if (editing != null && !items.some((item) => item.id === editing)) setEditing(null);
  }, [editing, items]);
  useIsomorphicLayoutEffect(() => {
    const previous = lastQueueFocus.current;
    if (!previous || previous.isConnected) return;
    lastQueueFocus.current = null;
    const document = previous.ownerDocument;
    if (document.hasFocus() && document.activeElement === document.body) {
      (getFocusableElements(queue.current)[0] || queue.current)?.focus();
    }
  });
  // Focus lands here when the last queued message goes, so the queue keeps a named target.
  if (!items.length) return <span ref={queue} role='status' aria-label={labels.title} tabIndex={-1} className='sr-only' />;
  const finish = (id, save) => {
    if (save && draft.trim()) {
      onEdit?.(id, draft.trim());
      announce(labels.saved);
    }
    setEditing(null);
    requestAnimationFrame(() => editButtons.current.get(id)?.focus());
  };
  return (
    <section ref={queue} tabIndex={-1} data-slot='prompt-queue' aria-labelledby={headingId} className={cn('ds-part-prompt-queue bg-surface-muted grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 rounded-(--ds-radius-card) border p-2', className)} onFocusCapture={(event) => { lastQueueFocus.current = event.target; }} onBlurCapture={(event) => {
      if (event.target.isConnected && !event.currentTarget.contains(event.relatedTarget)) lastQueueFocus.current = null;
    }}>
      <div className='flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 px-1'>
        <h3 id={headingId} className='text-xs font-medium'>{labels.title} · {items.length}</h3>
        <span className='text-text-muted text-xs'>{labels.hint}</span>
      </div>
      <ol className='grid gap-1'>
        {items.map((item, index) => (
          <li key={item.id} className='bg-surface flex min-w-0 items-start gap-2 rounded-(--ds-radius-control) border px-2 py-1.5'>
            <RegistryIcon lucide='Clock' className='text-text-muted mt-1 size-3.5 shrink-0' />
            {editing === item.id ? (
              <div className='grid min-w-0 flex-1 gap-1.5'>
                <Textarea
                  aria-label={`${labels.edit} queued message ${index + 1}`}
                  value={draft}
                  autoFocus
                  rows={2}
                  className='min-h-0 text-sm'
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing) return;
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      finish(item.id, false);
                    }
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      finish(item.id, true);
                    }
                  }}
                />
                <div className='flex gap-1'>
                  <Button size='xs' onClick={() => finish(item.id, true)}>{labels.save}</Button>
                  <Button size='xs' variant='ghost' onClick={() => finish(item.id, false)}>{labels.cancel}</Button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className='min-w-0 flex-1 text-sm break-words'
                  tabIndex={onMove ? 0 : undefined}
                  aria-keyshortcuts={onMove ? 'Alt+ArrowUp Alt+ArrowDown' : undefined}
                  onKeyDown={(event) => {
                    if (!onMove || !event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;
                    event.preventDefault();
                    onMove(item.id, event.key === 'ArrowUp' ? -1 : 1);
                    announce(labels.moved);
                  }}
                >
                  {item.text}
                  {item.attachments?.length ? <span className='text-text-muted ms-1 text-xs'>· {item.attachments.length} files</span> : null}
                </p>
                <div className='flex shrink-0 items-center'>
                  {onEdit ? (
                    <Button
                      ref={(node) => (node ? editButtons.current.set(item.id, node) : editButtons.current.delete(item.id))}
                      size='icon-xs'
                      variant='ghost'
                      aria-label={`${labels.edit}: ${item.text}`}
                      onClick={() => {
                        setDraft(item.text);
                        setEditing(item.id);
                      }}
                    >
                      <RegistryIcon lucide='Pencil' />
                    </Button>
                  ) : null}
                  {onSendNow ? (
                    <Button size='icon-xs' variant='ghost' aria-label={`${labels.sendNow}: ${item.text}`} onClick={() => onSendNow(item.id)}>
                      <RegistryIcon lucide='ArrowUp' />
                    </Button>
                  ) : null}
                  {onRemove ? (
                    <Button
                      size='icon-xs'
                      variant='ghost'
                      aria-label={`${labels.remove}: ${item.text}`}
                      onClick={() => {
                        onRemove(item.id);
                        announce(labels.removed);
                      }}
                    >
                      <RegistryIcon lucide='Trash2' />
                    </Button>
                  ) : null}
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export { ChatPromptComposer, ChatPromptQueue, findTrigger as findPromptTrigger };
