'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../Tooltip/parts/tooltip.jsx';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from '../../Attachment/parts/attachment.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { MessageStatus } from './message-status.jsx';

function IconAction({ label, icon, pressed, onClick, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size='icon-xs' variant='ghost' aria-label={label} aria-pressed={pressed} onClick={onClick} className={cn('aria-pressed:text-accent', className)}>
          <RegistryIcon lucide={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Copy, rate and regenerate a reply. `copyText` is what the copy action writes; `rating` is 'up', 'down'
 * or null (controlled with onRatingChange). A visually hidden status confirms each action.
 */
function MessageFeedback({ copyText, rating: ratingProp, defaultRating = null, onRatingChange, onCopy, onRegenerate, labels = {}, className, children }) {
  const [internal, setInternal] = useState(defaultRating);
  const [announcement, setAnnouncement] = useState('');
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  const rating = ratingProp === undefined ? internal : ratingProp;
  useEffect(() => () => clearTimeout(timer.current), []);
  const rate = (value) => {
    const next = rating === value ? null : value;
    setInternal(next);
    onRatingChange?.(next);
    setAnnouncement(next ? (labels.thanks || 'Thanks for the feedback.') : '');
  };
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(copyText ?? '');
    } catch {
      // Clipboard can be blocked in frames; the host can still react through onCopy.
    }
    onCopy?.(copyText);
    setCopied(true);
    setAnnouncement(labels.copied || 'Copied to clipboard.');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return (
    <TooltipProvider delayDuration={300}>
    <div data-slot='message-feedback' role='group' aria-label={labels.group || 'Reply actions'} className={cn('ds-part-message-feedback text-text-muted flex items-center gap-0.5', className)}>
      <IconAction label={copied ? labels.copied || 'Copied' : labels.copy || 'Copy'} icon={copied ? 'Check' : 'Copy'} onClick={copy} />
      <IconAction label={labels.up || 'Good reply'} icon='ThumbsUp' pressed={rating === 'up'} onClick={() => rate('up')} />
      <IconAction label={labels.down || 'Bad reply'} icon='ThumbsDown' pressed={rating === 'down'} onClick={() => rate('down')} />
      {onRegenerate ? <IconAction label={labels.regenerate || 'Regenerate'} icon='RefreshCw' onClick={onRegenerate} /> : null}
      {children}
      <span role='status' className='sr-only'>{announcement}</span>
    </div>
    </TooltipProvider>
  );
}

/** Follow-up prompts as chips; `suggestions` are strings or `{ id, label, prompt?, icon? }`. */
function MessageSuggestions({ suggestions = [], onSelect, label = 'Suggested prompts', className }) {
  if (!suggestions.length) return null;
  return (
    <ul data-slot='message-suggestions' aria-label={label} className={cn('ds-part-message-suggestions flex flex-wrap gap-2', className)}>
      {suggestions.map((suggestion) => {
        const item = typeof suggestion === 'string' ? { id: suggestion, label: suggestion } : suggestion;
        return (
          <li key={item.id}>
            <Button size='sm' variant='outline' className='h-auto py-1.5 text-start whitespace-normal' onClick={() => onSelect?.(item.prompt || item.label, item)}>
              {item.icon ? <RegistryIcon lucide={item.icon} /> : null}
              {item.label}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

/** A turn that failed: what went wrong and a retry. */
function MessageError({ title = 'The reply stopped before it finished.', onRetry, retryLabel = 'Try again', className, children }) {
  return (
    <div data-slot='message-error' role='alert' className={cn('ds-part-message-error border-danger-border bg-danger-subtle grid gap-2 rounded-(--ds-radius-card) border px-3 py-2.5 text-sm', className)}>
      <div className='text-danger flex items-start gap-2 font-medium'>
        <RegistryIcon lucide='TriangleAlert' className='mt-0.5 size-4 shrink-0' />
        <span>{title}</span>
      </div>
      {children ? <div className='text-text-muted ps-6 text-xs'>{children}</div> : null}
      {onRetry ? (
        <div className='ps-6'>
          <Button size='xs' variant='outline' onClick={onRetry}><RegistryIcon lucide='RotateCcw' />{retryLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}

/** Work handed to another agent: who took it, the brief, and how it is going. Children carry its activity. */
function MessageDelegation({ agent, status = 'running', instructions, error, labels, className, children }) {
  return (
    <div data-slot='message-delegation' data-status={status} className={cn('ds-part-message-delegation bg-surface grid gap-2 rounded-(--ds-radius-card) border px-3 py-2.5 text-sm', className)}>
      <div className='flex min-w-0 items-center gap-2'>
        <span className='bg-discovery-subtle text-discovery grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='Bot' className='size-3.5' />
        </span>
        <span className='min-w-0 flex-1 truncate'>
          <span className='text-text-muted'>{labels?.handedTo || 'Handed to'} </span>
          <span className='font-medium'>{agent?.name}</span>
        </span>
        <MessageStatus status={status} labels={labels} />
      </div>
      {instructions ? <p className='text-text-muted text-xs'>{instructions}</p> : null}
      {error ? <p role='alert' className='text-danger text-xs'>{error}</p> : null}
      {children ? <div className='border-border grid gap-2 border-s-2 ps-3'>{children}</div> : null}
    </div>
  );
}

const fileIcon = (name = '', type = '') => {
  if (/image\//.test(type) || /\.(png|jpe?g|gif|webp|svg)$/i.test(name)) return 'Image';
  if (/\.(csv|xlsx?)$/i.test(name)) return 'FileSpreadsheet';
  if (/\.(js|jsx|ts|tsx|json|md|mdx|css|py)$/i.test(name)) return 'FileCode';
  return 'FileText';
};

/** A file the assistant delivered, with optional preview and download actions. */
function MessageFile({ name, type, size, description, onPreview, onDownload, href, className }) {
  return (
    <Attachment data-slot='message-file' size='sm' className={cn('ds-part-message-file max-w-sm', className)}>
      <AttachmentMedia>
        <RegistryIcon lucide={fileIcon(name, type)} />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{name}</AttachmentTitle>
        <AttachmentDescription>{[description, size].filter(Boolean).join(' · ')}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {onPreview ? <AttachmentAction aria-label={`Preview ${name}`} onClick={onPreview}><RegistryIcon lucide='Eye' /></AttachmentAction> : null}
        {onDownload || href ? (
          <AttachmentAction aria-label={`Download ${name}`} onClick={onDownload} {...(href ? { asChild: true } : {})}>
            {href ? <a href={href} download={name}><RegistryIcon lucide='Download' /></a> : <RegistryIcon lucide='Download' />}
          </AttachmentAction>
        ) : null}
      </AttachmentActions>
    </Attachment>
  );
}

export { MessageDelegation, MessageError, MessageFeedback, MessageFile, MessageSuggestions };
