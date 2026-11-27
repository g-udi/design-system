'use client';
import { useEffect, useState } from 'react';
import { CardRoot as Card } from '@gaudi/design-system/core/Card';
import {
  CarouselRoot as Carousel,
  CarouselContent,
  CarouselItem,
  CarouselIndicator,
  CarouselNext,
  CarouselPrevious
} from '@gaudi/design-system/core/Carousel';
const slides = [
  { title: 'Northern lights', description: 'Long exposures from the Lofoten coast.' },
  { title: 'Desert bloom', description: 'Colour after the first spring rain.' },
  { title: 'Tidal pools', description: 'Life between the high and low water marks.' },
  { title: 'Alpine lakes', description: 'Still water above the tree line.' },
  { title: 'City at dusk', description: 'The blue hour over rooftops.' }
];
export function Pattern({ onNavigate }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return undefined;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);
  return (
    <Carousel setApi={setApi} className='mx-auto w-full max-w-md' aria-label='Photo stories'>
      <div className='mb-3 flex justify-end gap-2'>
        <CarouselPrevious className='static' onClick={(event) => onNavigate?.('previous', event)} />
        <CarouselNext className='static' onClick={(event) => onNavigate?.('next', event)} />
      </div>
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
      <div className='flex flex-wrap justify-center gap-x-2 pt-3'>
        {slides.map((slide, index) => (
          <CarouselIndicator key={slide.title} index={index} active={index === current} />
        ))}
      </div>
    </Carousel>
  );
}
