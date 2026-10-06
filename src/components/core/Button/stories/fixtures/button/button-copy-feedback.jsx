'use client';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { default as Button } from '@gaudi/design-system/core/Button';
import { TooltipRoot as Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const url = 'https://design.assaf.website';
const CopyIcon = ({ copied }) => <RegistryIcon lucide={copied ? 'CheckIcon' : 'CopyIcon'} aria-hidden='true' />;

export function Pattern() {
  const labelled = useCopyToClipboard({ timeout: 1500 });
  const iconOnly = useCopyToClipboard({ timeout: 1500 });
  return (
    <TooltipProvider>
      <div className='flex flex-wrap items-center gap-2'>
        <Button variant='outline' onClick={() => labelled.copyToClipboard(url)}>
          <CopyIcon copied={labelled.isCopied} />
          <span aria-live='polite'>{labelled.isCopied ? 'Copied' : 'Copy'}</span>
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size='icon' variant='outline' aria-label={iconOnly.isCopied ? 'Copied' : 'Copy link'} onClick={() => iconOnly.copyToClipboard(url)}>
              <CopyIcon copied={iconOnly.isCopied} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{iconOnly.isCopied ? 'Copied' : 'Copy link'}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
