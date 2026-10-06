import { useState } from 'react';
import Button from '../../components/core/Button';
import Icon from '../../components/core/Icon';
import { useCopyToClipboard } from '../../hooks/interaction/use-copy-to-clipboard.js';
import { cn } from '../../utilities/cn';

/** Shared copy feedback for guide specimens and compact snippet actions. */
export function CopyButton({ children, label, value, tile = false, className, ...props }) {
  const [failed, setFailed] = useState(false);
  const { copy, isCopied } = useCopyToClipboard({ timeout: 1600, onCopy: () => setFailed(false), onError: () => setFailed(true) });
  const action = failed ? 'Retry copy' : 'Copy';
  const feedback = isCopied ? 'Copied' : action;
  return (
    <Button
      {...props}
      size={tile ? null : 'xs'}
      variant={tile ? null : 'outline'}
      className={cn(tile && 'group relative cursor-copy justify-start whitespace-normal text-left', className)}
      aria-label={`${action} ${label || value}`}
      title={`${action} ${label || value}`}
      onClick={() => copy(value)}
    >
      {tile ? children : isCopied || failed ? feedback : children}
      <span role='status' aria-live='polite' className={tile ? cn('pointer-events-none absolute right-1.5 top-1.5 inline-flex min-h-6 min-w-6 items-center justify-center rounded border border-border bg-surface px-1.5 py-0.5 text-xs shadow-sm', failed ? 'text-danger' : 'text-text-muted') : 'sr-only'}>
        {tile && !isCopied && !failed ? <Icon name='Copy' decorative size='xs' /> : isCopied || failed ? feedback : null}
      </span>
    </Button>
  );
}
