'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

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

export { MessageFeedback };
