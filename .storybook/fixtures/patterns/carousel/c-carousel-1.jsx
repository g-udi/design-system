'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../../../src/components/core/Carousel/parts/carousel.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
const options = [
  { key: 'vertical', label: 'Vertical' },
  { key: 'multiple', label: 'Multiple' },
  { key: 'centered', label: 'Centred loop' },
  { key: 'tight', label: 'Tight gap' }
];
const slides = Array.from({ length: 8 }, (_, index) => index);
function itemBasis({ vertical, multiple, centered }) {
  if (vertical) return multiple ? 'basis-1/2' : 'basis-full';
  // Several per view steps up with the viewport: two, then three.
  if (multiple) return 'basis-1/2 md:basis-1/3';
  return centered ? 'basis-[70%]' : 'basis-full';
}
export function Pattern() {
  const [layout, setLayout] = useState({ vertical: false, multiple: false, centered: false, tight: false });
  const { vertical, multiple, centered, tight } = layout;
  const gap = tight ? (vertical ? 'pt-1' : 'pl-1') : undefined;
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      <div role='group' aria-label='Carousel options' className='flex flex-wrap gap-x-4 gap-y-2'>
        {options.map((option) => (
          <Label key={option.key} className='gap-2 text-sm font-normal'>
            <Switch
              size='sm'
              checked={layout[option.key]}
              onCheckedChange={(checked) => setLayout((current) => ({ ...current, [option.key]: checked }))}
            />
            {option.label}
          </Label>
        ))}
      </div>
      <div className={cn('flex justify-center', vertical && 'py-12')}>
        <Carousel
          key={vertical ? 'vertical' : 'horizontal'}
          orientation={vertical ? 'vertical' : 'horizontal'}
          opts={{ align: centered ? 'center' : 'start', loop: centered }}
          className={vertical || !multiple ? 'w-full max-w-xs' : 'w-full'}
        >
          <CarouselContent className={cn(vertical && 'h-72', tight && (vertical ? '-mt-1' : '-ml-1'))}>
            {slides.map((index) => (
              <CarouselItem key={index} className={cn('min-h-0', itemBasis(layout), gap)}>
                <Card
                  className={cn(
                    'relative overflow-hidden border-0 p-0',
                    vertical ? 'h-full' : centered && !multiple ? 'aspect-video' : 'aspect-square'
                  )}
                >
                  <img
                    src={`static/images/art/${index % 12}.svg`}
                    alt={`Slide ${index + 1}`}
                    width={800}
                    height={800}
                    className='absolute inset-0 size-full object-cover'
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
