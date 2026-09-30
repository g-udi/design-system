'use client';
import { useState } from 'react';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [muted, setMuted] = useState(false);
  return (
    <div className='flex items-center justify-center'>
      <Toggle
        size='lg'
        variant='outline'
        aria-label='Toggle mute'
        pressed={muted}
        onPressedChange={setMuted}
      >
        {muted ? (
          <RegistryIcon lucide='VolumeOffIcon' />
        ) : (
          <RegistryIcon lucide='Volume2Icon' />
        )}
        {muted ? 'Muted' : 'Sound'}
      </Toggle>
    </div>
  );
}
