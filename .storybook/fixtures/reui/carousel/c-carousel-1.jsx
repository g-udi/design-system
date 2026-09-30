// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../../../src/components/core/Carousel/parts/carousel.jsx';
export function Pattern() {
  return (
    <Carousel className='w-full max-w-xs'>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className='p-1'>
              <Card className='relative aspect-square overflow-hidden border-0 p-0'>
                <img
                  src={`https://picsum.photos/800/800?grayscale&random=${index + 1}`}
                  alt={`Slide ${index + 1}`}
                  width={800}
                  height={800}
                  className='h-full w-full object-cover'
                />
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='hidden sm:inline-flex' />
      <CarouselNext className='hidden sm:inline-flex' />
    </Carousel>
  );
}
