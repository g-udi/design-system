// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useCopyToClipboard } from '../../../../src/hooks/use-copy-to-clipboard.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 });
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            aria-label={isCopied ? 'Copied' : 'Copy'}
            onClick={() => copyToClipboard('https://design.assaf.website')}
          >
            {isCopied ? (
              <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
            ) : (
              <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isCopied ? 'Copied' : 'Copy link'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
