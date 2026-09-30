'use client';
import { useState } from 'react';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [pressed, setPressed] = useState(false);
  return (
    <div className='flex items-center justify-center'>
      <Toggle
        aria-label='Toggle favorite'
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {pressed ? (
          <RegistryIcon lucide='HeartIcon' className='fill-current' />
        ) : (
          <RegistryIcon lucide='HeartIcon' />
        )}
      </Toggle>
    </div>
  );
}
