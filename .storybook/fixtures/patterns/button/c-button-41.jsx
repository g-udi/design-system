'use client';
import { useCopyToClipboard } from '../../../../src/hooks/use-copy-to-clipboard.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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
