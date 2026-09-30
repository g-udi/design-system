// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [pressed, setPressed] = useState(false);
  return (
    <div className='flex items-center justify-center'>
      <Toggle
        aria-label='Toggle notifications'
        pressed={pressed}
        onPressedChange={setPressed}
      >
        <div className='relative'>
          <RegistryIcon lucide='BellIcon' />
          {!pressed && (
            <Badge
              variant='destructive'
              size='xs'
              className='absolute -top-2 -right-2 rounded-control!'
            >
              3
            </Badge>
          )}
        </div>
      </Toggle>
    </div>
  );
}
