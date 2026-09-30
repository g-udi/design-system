// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '../../../../src/components/core/Sortable/parts/sortable-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const defaultTracks = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    album: "Hurry Up, We're Dreaming",
    duration: '4:03',
    plays: '1.2B',
    active: true
  },
  {
    id: '2',
    title: 'Digital Love',
    artist: 'Daft Punk',
    album: 'Discovery',
    duration: '4:58',
    plays: '845M'
  },
  {
    id: '3',
    title: 'Starlight',
    artist: 'Muse',
    album: 'Black Holes',
    duration: '3:59',
    plays: '720M'
  },
  {
    id: '4',
    title: 'Take On Me',
    artist: 'a-ha',
    album: 'Hunting High and Low',
    duration: '3:48',
    plays: '1.8B'
  },
  {
    id: '5',
    title: 'Blue Monday',
    artist: 'New Order',
    album: 'Power, Corruption',
    duration: '7:29',
    plays: '530M'
  }
];
export function Pattern() {
  const [tracks, setTracks] = useState(defaultTracks);
  return (
    <div className='mx-auto w-full max-w-md'>
      <Frame spacing='xs'>
        <FrameHeader>
          <div className='flex items-center justify-between'>
            <div>
              <FrameTitle>Queue</FrameTitle>
              <FrameDescription>{tracks.length} tracks</FrameDescription>
            </div>
            <Badge variant='outline' size='sm'>
              <RegistryIcon lucide='ListMusicIcon' className='size-3' />
              Playlist
            </Badge>
          </div>
        </FrameHeader>
        <Sortable
          value={tracks}
          onValueChange={setTracks}
          getItemValue={(item) => item.id}
          strategy='vertical'
          className='space-y-0.5'
        >
          {tracks.map((track, _index) => (
            <SortableItem key={track.id} value={track.id}>
              <FramePanel className='p-0!'>
                <div className='group flex items-center gap-3 px-3 py-2'>
                  <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground'>
                    <RegistryIcon
                      lucide='GripVerticalIcon'
                      className='size-4'
                    />
                  </SortableItemHandle>
                  <div className='bg-ui-muted flex size-9 shrink-0 items-center justify-center rounded-md'>
                    <RegistryIcon
                      lucide='MusicIcon'
                      className='text-ui-muted-foreground size-4'
                    />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p
                      className={`truncate text-sm font-medium ${track.active ? 'text-ui-primary' : ''}`}
                    >
                      {track.title}
                      {track.active && (
                        <Badge
                          variant='primary-light'
                          size='xs'
                          className='ms-1.5 align-middle'
                        >
                          Playing
                        </Badge>
                      )}
                    </p>
                    <p className='text-ui-muted-foreground truncate text-xs'>
                      {track.artist} &middot; {track.album}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-ui-muted-foreground hidden text-xs tabular-nums sm:inline'>
                      {track.plays}
                    </span>
                    <span className='text-ui-muted-foreground text-xs tabular-nums'>
                      {track.duration}
                    </span>
                  </div>
                </div>
              </FramePanel>
            </SortableItem>
          ))}
        </Sortable>
      </Frame>
    </div>
  );
}
