'use client';
import { useState } from 'react';
import {
  Attachment,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger
} from '@gaudi/design-system/core/Attachment';
const SHOTS = [
  {
    id: 'gradient',
    name: 'brand-gradient.png',
    dimensions: '2400 x 1600',
    src: 'static/images/art/0.svg',
    alt: 'Sunset gradient with violet edges'
  },
  {
    id: 'mesh',
    name: 'mesh-backdrop.png',
    dimensions: '1800 x 1200',
    src: 'static/images/art/7.svg',
    alt: 'Cool blue mesh fading to lilac'
  },
  {
    id: 'spectrum',
    name: 'spectrum-wash.jpg',
    dimensions: '3000 x 2000',
    src: 'static/images/art/5.svg',
    alt: 'Pale spectrum blend across the frame'
  },
  {
    id: 'waves',
    name: 'wave-pattern.png',
    dimensions: '1200 x 1200',
    src: 'static/images/art/1.svg',
    alt: 'Rippled bands of magenta and plum'
  },
  {
    id: 'ink',
    name: 'ink-render.png',
    dimensions: '2000 x 1400',
    src: 'static/images/art/10.svg',
    alt: 'Swirling colour clouds on a dark ground'
  }
];
export function Pattern() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = SHOTS.find((shot) => shot.id === selectedId) ?? null;
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-2'>
      <AttachmentGroup role='group' aria-label='Images shared in this conversation'>
        {SHOTS.map((shot) => (
          /*
           * A vertical card takes its own fixed width, so a w-full here would
           * collapse the strip into one column and kill the snap scrolling.
           */
          <Attachment key={shot.id} orientation='vertical'>
            <AttachmentMedia variant='image'>
              {/*
               * No classes on the image: variant="image" already crops every
               * child img square and covers the frame. The alt describes the
               * picture, and the title below it names the file.
               */}
              <img
                src={shot.src}
                alt={shot.alt}
                width={120}
                height={120}
                loading='lazy'
                decoding='async'
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{shot.name}</AttachmentTitle>
            </AttachmentContent>
            {/*
             * The trigger reports aria-pressed because it selects rather than
             * navigates, and it renders below the actions slot in the stacking
             * order, so a card can carry a full card select and its own buttons.
             */}
            <AttachmentTrigger
              type='button'
              aria-label={`Preview ${shot.name}`}
              aria-pressed={selectedId === shot.id}
              onClick={() => setSelectedId(shot.id)}
            />
          </Attachment>
        ))}
      </AttachmentGroup>
      <p className='text-ui-muted-foreground text-xs' aria-live='polite'>
        {selected ? (
          <>
            {selected.name}
            <span
              aria-hidden='true'
              className='bg-ui-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle'
            />
            {selected.dimensions}
          </>
        ) : (
          'Choose an image to read its description.'
        )}
      </p>
    </div>
  );
}
