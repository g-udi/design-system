// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useCopyToClipboard } from '../../../../src/hooks/use-copy-to-clipboard.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 });
  return (
    <Button
      variant='outline'
      aria-label={isCopied ? 'Copied' : 'Copy'}
      onClick={() => copyToClipboard('https://reui.io')}
    >
      {isCopied ? (
        <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
      ) : (
        <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
      )}
      <span>{isCopied ? 'Copied' : 'Copy'}</span>
    </Button>
  );
}
