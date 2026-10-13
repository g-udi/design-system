'use client';
import { useLiveAnnouncer } from '../../../hooks/a11y/use-live-announcer.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useCopyToClipboard } from '../../../hooks/interaction/use-copy-to-clipboard.js';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../core/Tooltip/TooltipPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

function IconAction({ label, icon, pressed, onClick, disabled, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size='icon-xs' variant='ghost' aria-label={label} aria-pressed={pressed} disabled={disabled} onClick={onClick} className={cn('aria-pressed:text-accent', className)}>
          <RegistryIcon lucide={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Copy, rate and regenerate a reply. `copyText` is what the copy action writes; `rating` is 'up', 'down'
 * or null (controlled with onRatingChange). The shared live announcer confirms each action.
 */
function ChatMessageFeedback({ copyText, rating: ratingProp, defaultRating = null, onRatingChange, onCopy, onRegenerate, labels = {}, className, children }) {
  const [rating, setRating] = useControllableState({ value: ratingProp, defaultValue: defaultRating, onChange: onRatingChange });
  const { announce } = useLiveAnnouncer();
  const { copy, isCopied: copied } = useCopyToClipboard({
    timeout: 1600,
    onCopy: (text) => {
      onCopy?.(text);
      announce(labels.copied || 'Copied to clipboard.');
    },
    onError: () => announce(labels.copyFailed || 'Could not copy. Select the reply and copy it manually.')
  });
  const rate = (value) => {
    const next = rating === value ? null : value;
    setRating(next);
    if (next) announce(labels.thanks || 'Thanks for the feedback.');
  };
  return (
    <TooltipProvider delayDuration={300}>
    <div data-slot='message-feedback' role='group' aria-label={labels.group || 'Reply actions'} className={cn('ds-part-message-feedback text-text-muted flex items-center gap-0.5', className)}>
      <IconAction label={copied ? labels.copied || 'Copied' : labels.copy || 'Copy'} icon={copied ? 'Check' : 'Copy'} onClick={() => copy(copyText)} disabled={!copyText} />
      <IconAction label={labels.up || 'Good reply'} icon='ThumbsUp' pressed={rating === 'up'} onClick={() => rate('up')} />
      <IconAction label={labels.down || 'Bad reply'} icon='ThumbsDown' pressed={rating === 'down'} onClick={() => rate('down')} />
      {onRegenerate ? <IconAction label={labels.regenerate || 'Regenerate'} icon='RefreshCw' onClick={onRegenerate} /> : null}
      {children}
    </div>
    </TooltipProvider>
  );
}

export { ChatMessageFeedback };
