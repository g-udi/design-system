// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [pressed, setPressed] = useState(false);
  return (
    <div className='flex items-center justify-center'>
      <Toggle
        variant='outline'
        aria-label='Toggle bookmark'
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {pressed ? (
          <RegistryIcon lucide='BookmarkCheckIcon' className='fill-current' />
        ) : (
          <RegistryIcon lucide='BookmarkIcon' />
        )}
        {pressed ? 'Bookmarked' : 'Bookmark'}
      </Toggle>
    </div>
  );
}
