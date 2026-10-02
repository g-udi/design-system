'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle
} from '../../../core/Attachment/parts/attachment.jsx';
import { default as Textarea } from '../../../core/Textarea/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '../../../core/Input/parts/input-group.jsx';

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
 * attachment tray, a toolbar slot for model or effort pickers, an `actions` slot beside send (voice
 * input, the current model), and send or stop. Enter sends, Shift+Enter
 * starts a new line. While a reply streams (`status='streaming'`) sending still works and reports
 * `{ queued: true }` so the host can hold the message in a PromptQueue.
 *
 * `variant='card'` is the roomier assistant composer: a one-line prompt that grows, a raised card frame
 * and a footer toolbar for PromptAttachMenu, ChatModelSelect, PromptSettings and ChatContextMeter.
 * `voice` takes the send button's place while the prompt is empty, and send returns as soon as there
 * is text or a file. Pass an element (a microphone button, a SpeechInput) or a function
 * `({ value, setValue, insert, disabled }) => element`, where `insert(text)` adds dictated text at the
 * end of the prompt.
 */
function PromptComposer({
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
  voice,
  variant = 'default',
  footer,
  disabled = false,
  labels: labelOverrides,
  className,
  textareaProps
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp ?? internal;
  const textarea = useRef(null);
  const files = useRef(null);
  const listId = useId();
  const [caret, setCaret] = useState(0);
  const [dismissed, setDismissed] = useState(null);
  const [active, setActive] = useState('');
  const streaming = status === 'streaming';
  const busy = status === 'submitting';

  const setValue = (next) => {
    setInternal(next);
    onValueChange?.(next);
  };

  const trigger = findTrigger(value, caret);
  const source = trigger?.symbol === '@' ? mentions : trigger?.symbol === '/' ? commands : [];
  const query = trigger?.query.toLowerCase() ?? '';
  const results = trigger ? source.filter((item) => item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)).slice(0, 8) : [];
  const resultKey = results.map((item) => item.id).join('|');
  const open = Boolean(trigger && results.length && dismissed !== trigger.start);

  useEffect(() => {
    const ids = resultKey.split('|');
    if (open && !ids.includes(active)) setActive(ids[0]);
  }, [open, resultKey, active]);

  const optionId = (id) => `${listId}-option-${id}`;

  const choose = (item) => {
    if (!trigger) return;
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
  const canSend = !disabled && !busy && hasContent;
  const card = variant === 'card';
  const insert = (text) => {
    if (!text) return;
    setValue(value && !/\s$/.test(value) ? `${value} ${text}` : `${value}${text}`);
    requestAnimationFrame(() => textarea.current?.focus());
  };
  const voiceSlot = voice && !hasContent && !streaming ? (typeof voice === 'function' ? voice({ value, setValue, insert, disabled }) : voice) : null;
  const submit = () => {
    if (!canSend) return;
    onSubmit?.(value.trim(), { mentions: mentionsIn(value, mentions), command: commands.find((item) => value.startsWith(insertionOf(item, '/'))), attachments, queued: streaming });
    if (valueProp === undefined) setInternal('');
    onValueChange?.('');
    setCaret(0);
  };

  const onKeyDown = (event) => {
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
    textareaProps?.onKeyDown?.(event);
  };

  const syncCaret = (event) => setCaret(event.currentTarget.selectionStart ?? 0);

  return (
    <div data-slot='prompt-composer' data-status={status} data-variant={variant} className={cn('ds-part-prompt-composer relative grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2', className)}>
      {open ? (
        // A listbox the textarea drives (aria-activedescendant), drawn with the Commander list and item styles.
        <div className='bg-ui-popover text-ui-popover-foreground ring-ui-foreground/10 absolute inset-x-0 bottom-full z-(--ds-z-overlay) mb-2 max-w-sm overflow-hidden rounded-(--ds-radius-card) shadow-md ring-1'>
          <div id={listId} role='listbox' aria-label={trigger.symbol === '@' ? labels.people : labels.commands} className='ds-part-command-list max-h-64 overflow-y-auto'>
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
                    <img src={item.avatar} alt='' className='size-5 shrink-0 rounded-full' />
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
          </div>
        </div>
      ) : null}
      <span role='status' className='sr-only'>{open ? labels.suggestions(results.length) : ''}</span>
      <InputGroup data-disabled={disabled || undefined} className={cn('bg-surface', card && 'rounded-(--ds-radius-card) shadow-sm')}>
        {attachments.length ? (
          <InputGroupAddon align='block-start' className='pb-0'>
            <AttachmentGroup className='flex flex-wrap gap-2'>
              {attachments.map((file) => (
                <Attachment key={file.id || file.name} size='xs'>
                  <AttachmentMedia>
                    <RegistryIcon lucide={/image\//.test(file.type || '') ? 'Image' : 'FileText'} />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                    {file.size ? <AttachmentDescription>{file.size}</AttachmentDescription> : null}
                  </AttachmentContent>
                  {onRemoveAttachment ? (
                    <AttachmentActions>
                      <AttachmentAction aria-label={`${labels.remove} ${file.name}`} onClick={() => onRemoveAttachment(file.id || file.name)}>
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
          ref={textarea}
          rows={card ? 1 : 2}
          value={value}
          disabled={disabled}
          placeholder={labels.placeholder}
          aria-label={labels.message}
          role='combobox'
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete='list'
          aria-activedescendant={open && active ? optionId(active) : undefined}
          {...textareaProps}
          className={cn('field-sizing-content max-h-48', card ? 'min-h-12 px-4 pt-3.5 text-base sm:text-sm' : 'min-h-14', textareaProps?.className)}
          onChange={(event) => {
            setValue(event.target.value);
            setCaret(event.target.selectionStart ?? 0);
            setDismissed(null);
          }}
          onKeyDown={onKeyDown}
          onKeyUp={syncCaret}
          onClick={syncCaret}
          onSelect={syncCaret}
        />
        <InputGroupAddon align='block-end' className={cn('justify-between gap-2', card && 'flex-nowrap items-end px-1.5 pb-2 sm:px-2')}>
          <div data-slot='prompt-composer-toolbar' className='flex min-w-0 flex-wrap items-center gap-1'>
            {onAttach ? (
              <>
                <InputGroupButton size='icon-sm' aria-label={labels.attach} onClick={() => files.current?.click()} disabled={disabled}>
                  <RegistryIcon lucide='Paperclip' />
                </InputGroupButton>
                <input
                  ref={files}
                  type='file'
                  multiple
                  accept={accept}
                  hidden
                  tabIndex={-1}
                  onChange={(event) => {
                    if (event.target.files?.length) onAttach([...event.target.files]);
                    event.target.value = '';
                  }}
                />
              </>
            ) : null}
            {toolbar}
          </div>
          <div className='ms-auto flex shrink-0 items-center gap-1'>
            {actions}
            {streaming && onStop ? (
              <InputGroupButton size='icon-sm' variant='outline' aria-label={labels.stop} onClick={onStop}>
                <RegistryIcon lucide='Square' className='fill-current' />
              </InputGroupButton>
            ) : null}
            {voiceSlot ?? (
              <InputGroupButton size='icon-sm' variant='solid' aria-label={streaming ? labels.queue : labels.send} disabled={!canSend} onClick={submit}>
                <RegistryIcon lucide={streaming ? 'ListTodo' : 'ArrowUp'} />
              </InputGroupButton>
            )}
          </div>
        </InputGroupAddon>
      </InputGroup>
      {footer ? <div data-slot='prompt-composer-footer' className='text-text-muted text-xs'>{footer}</div> : null}
    </div>
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
function PromptQueue({ items = [], onEdit, onRemove, onSendNow, onMove, labels: labelOverrides, className }) {
  const labels = { ...QUEUE_LABELS, ...labelOverrides };
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const editButtons = useRef(new Map());
  const headingId = useId();
  if (!items.length) return <span role='status' className='sr-only'>{announcement}</span>;
  const finish = (id, save) => {
    if (save && draft.trim()) {
      onEdit?.(id, draft.trim());
      setAnnouncement(labels.saved);
    }
    setEditing(null);
    requestAnimationFrame(() => editButtons.current.get(id)?.focus());
  };
  return (
    <section data-slot='prompt-queue' aria-labelledby={headingId} className={cn('ds-part-prompt-queue bg-surface-muted grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 rounded-(--ds-radius-card) border p-2', className)}>
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
                    setAnnouncement(labels.moved);
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
                        setAnnouncement(labels.removed);
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
      <span role='status' className='sr-only'>{announcement}</span>
    </section>
  );
}

export { PromptComposer, PromptQueue, findTrigger as findPromptTrigger };
