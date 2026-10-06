import Autoplay from 'embla-carousel-autoplay';
import { CardRoot as Card } from '@gaudi/design-system/core/Card';
import {
  CarouselRoot as Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@gaudi/design-system/core/Carousel';
export function Pattern() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2e3
        })
      ]}
      className='mx-auto w-full max-w-xs'
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className='p-1'>
              <Card className='relative aspect-square overflow-hidden border-0 p-0'>
                <img
                  src={`static/images/art/${(index + 25) % 12}.svg`}
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
