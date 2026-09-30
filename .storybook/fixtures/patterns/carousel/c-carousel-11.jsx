'use client';
import { useEffect, useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../../../src/components/core/Carousel/parts/carousel.jsx';
const slides = [
  { title: 'Northern lights', description: 'Long exposures from the Lofoten coast.' },
  { title: 'Desert bloom', description: 'Colour after the first spring rain.' },
  { title: 'Tidal pools', description: 'Life between the high and low water marks.' },
  { title: 'Alpine lakes', description: 'Still water above the tree line.' },
  { title: 'City at dusk', description: 'The blue hour over rooftops.' }
];
export function Pattern() {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return undefined;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api]);
  return (
    <Carousel setApi={setApi} className='mx-auto w-full max-w-md' aria-label='Photo stories'>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide.title}>
            <Card className='group/card relative aspect-video overflow-hidden border-0 p-0'>
              <img
                src={`static/images/art/${(index + 7) % 12}.svg`}
                alt=''
                width={1000}
                height={560}
                className='absolute inset-0 size-full object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-105'
              />
              <div className='absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 to-transparent' />
              <div className='relative flex h-full flex-col justify-end gap-1 p-4'>
                <h3 className='text-base font-semibold text-white'>{slide.title}</h3>
                <p className='text-sm text-white/90'>{slide.description}</p>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <div className='flex justify-center gap-2 pt-3'>
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type='button'
            className={cn(
              'h-2 cursor-pointer rounded-full transition-all duration-500 ease-in-out',
              index === current ? 'w-4 bg-accent' : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          />
        ))}
      </div>
    </Carousel>
  );
}
