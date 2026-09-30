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
      <CarouselContent className='-ml-1'>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className='basis-1/2 pl-1'>
            <div className='p-1'>
              <Card className='relative aspect-square overflow-hidden border-0 p-0'>
                <img
                  src={`static/images/art/${(index + 35) % 12}.svg`}
                  alt={`Slide ${index + 1}`}
                  width={600}
                  height={600}
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
