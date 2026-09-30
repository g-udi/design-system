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
    <Carousel
      opts={{
        align: 'center',
        loop: true
      }}
      className='w-full max-w-xs'
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className='basis-[70%]'>
            <div className='p-1'>
              <Card className='relative aspect-video overflow-hidden border-0 p-0'>
                <img
                  src={`static/images/art/${(index + 30) % 12}.svg`}
                  alt={`Slide ${index + 1}`}
                  width={800}
                  height={450}
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
