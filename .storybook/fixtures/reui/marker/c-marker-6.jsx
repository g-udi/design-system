// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Marker,
  MarkerContent,
  MarkerIcon
} from '../../../../src/components/core/Marker/parts/marker.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [reverted, setReverted] = useState(false);
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      <Marker asChild>
        <a href='#'>
          <MarkerIcon>
            <RegistryIcon lucide='GitMergeIcon' />
          </MarkerIcon>
          <MarkerContent>Review pull request #412</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <a href='#'>
          <MarkerIcon>
            <RegistryIcon lucide='FileTextIcon' />
          </MarkerIcon>
          <MarkerContent>Open the diff for rate-limit.ts</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <button
          type='button'
          className='hover:text-ui-foreground transition-colors'
          onClick={() => setReverted((value) => !value)}
        >
          <MarkerIcon>
            {reverted ? (
              <RegistryIcon lucide='CheckIcon' />
            ) : (
              <RegistryIcon lucide='RotateCcwIcon' />
            )}
          </MarkerIcon>
          <MarkerContent>
            {reverted ? 'Undo the revert' : 'Revert this change'}
          </MarkerContent>
        </button>
      </Marker>
      {/* Mounted empty from the first render, not inserted on the click: a
       live region added at the same moment as its text is not reliably
       announced, and the button's own label changes silently. */}
      <span role='status' aria-live='polite' className='sr-only'>
        {reverted ? 'Change reverted' : ''}
      </span>
    </div>
  );
}
