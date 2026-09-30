'use client';
import { useState } from 'react';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

export function Pattern() {
  const [favourite, setFavourite] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(false);
  const [pinned, setPinned] = useState(false);
  return (
    <TooltipProvider>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <Toggle aria-label='Favourite' pressed={favourite} onPressedChange={setFavourite}>
          <RegistryIcon lucide='HeartIcon' className={favourite ? 'fill-current' : undefined} />
        </Toggle>
        <Toggle variant='outline' pressed={saved} onPressedChange={setSaved}>
          <RegistryIcon lucide={saved ? 'BookmarkCheckIcon' : 'BookmarkIcon'} />
          {saved ? 'Bookmarked' : 'Bookmark'}
        </Toggle>
        <Toggle variant='outline' pressed={muted} onPressedChange={setMuted}>
          <RegistryIcon lucide={muted ? 'VolumeOffIcon' : 'Volume2Icon'} />
          {muted ? 'Muted' : 'Sound on'}
        </Toggle>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle variant='outline' aria-label={pinned ? 'Unpin from sidebar' : 'Pin to sidebar'} pressed={pinned} onPressedChange={setPinned}>
              <RegistryIcon lucide={pinned ? 'PinOffIcon' : 'PinIcon'} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>{pinned ? 'Unpin from sidebar' : 'Pin to sidebar'}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
