// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '../../../../src/components/core/Carousel/parts/carousel.jsx';
const ITEMS_COUNT = 10;
export function Pattern() {
  const [mainApi, setMainApi] = useState();
  const [thumbApi, setThumbApi] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onThumbClick = useCallback(
    (index) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );
  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);
  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
    return () => {
      mainApi.off('select', onSelect);
      mainApi.off('reInit', onSelect);
    };
  }, [mainApi, onSelect]);
  return (
    <div className='flex w-full max-w-md flex-col gap-3 p-4'>
      <Carousel setApi={setMainApi} className='w-full'>
        <CarouselContent>
          {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
            <CarouselItem key={index}>
              <div className='bg-ui-muted relative aspect-video overflow-hidden rounded-xl'>
                <img
                  src={`static/images/art/${(index + 20) % 12}.svg`}
                  alt={`Slide ${index + 1}`}
                  width={1e3}
                  height={800}
                  className='h-full w-full object-cover'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel
        setApi={setThumbApi}
        opts={{
          containScroll: 'keepSnaps',
          dragFree: true
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 flex-row'>
          {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
            <CarouselItem
              key={index}
              className='basis-1/5 cursor-pointer pl-2 sm:basis-1/6'
              onClick={() => onThumbClick(index)}
            >
              <div
                className={cn(
                  'relative aspect-square overflow-hidden rounded-lg border-2 transition-all',
                  index === selectedIndex
                    ? 'border-ui-primary opacity-100'
                    : 'border-transparent opacity-40 hover:opacity-70'
                )}
              >
                <img
                  src={`static/images/art/${(index + 20) % 12}.svg`}
                  alt={`Thumb ${index + 1}`}
                  width={400}
                  height={400}
                  className='h-full w-full object-cover'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
