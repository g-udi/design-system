'use client';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  CarouselRoot as Carousel,
  CarouselContent,
  CarouselItem
} from '@gaudi/design-system/core/Carousel';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
const slides = Array.from({ length: 10 }, (_, index) => `static/images/art/${(index + 2) % 12}.svg`);
function Thumbnails({ setApi, selected, onSelect, overlay }) {
  return (
    <Carousel setApi={setApi} opts={{ containScroll: 'keepSnaps', dragFree: true }} className='w-full'>
      <CarouselContent className='-ml-2'>
        {slides.map((src, index) => (
          <CarouselItem key={src + index} className={cn('pl-2', overlay ? 'basis-1/6' : 'basis-1/5')}>
            <button
              type='button'
              onClick={() => onSelect(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === selected ? 'true' : undefined}
              className={cn(
                'relative block aspect-square w-full cursor-pointer overflow-hidden rounded-md border-2 transition-opacity',
                index === selected
                  ? overlay ? 'border-white' : 'border-accent'
                  : cn('opacity-50 hover:opacity-80', overlay ? 'border-white/40' : 'border-transparent')
              )}
            >
              <img src={src} alt='' width={200} height={200} className='h-full w-full object-cover' />
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
export function Pattern() {
  const [mainApi, setMainApi] = useState();
  const [thumbApi, setThumbApi] = useState();
  const [selected, setSelected] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelected(index);
    thumbApi?.scrollTo(index);
  }, [mainApi, thumbApi]);
  useEffect(() => {
    if (!mainApi) return undefined;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
    return () => {
      mainApi.off('select', onSelect);
      mainApi.off('reInit', onSelect);
    };
  }, [mainApi, onSelect]);
  const thumbnails = (
    <Thumbnails setApi={setThumbApi} selected={selected} onSelect={(index) => mainApi?.scrollTo(index)} overlay={overlay} />
  );
  return (
    <div className='mx-auto grid w-full max-w-md gap-3'>
      <Label className='gap-2 text-sm font-normal'>
        <Switch size='sm' checked={overlay} onCheckedChange={setOverlay} />
        Overlay thumbnails
      </Label>
      <div className='relative overflow-hidden rounded-xl'>
        <Carousel setApi={setMainApi} className='w-full' aria-label='Gallery'>
          <CarouselContent>
            {slides.map((src, index) => (
              <CarouselItem key={src + index}>
                <div className='relative aspect-video overflow-hidden rounded-xl bg-surface-muted'>
                  <img src={src} alt={`Slide ${index + 1}`} width={1000} height={560} className='h-full w-full object-cover' />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {overlay ? (
          <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3'>{thumbnails}</div>
        ) : null}
      </div>
      {overlay ? null : thumbnails}
    </div>
  );
}
