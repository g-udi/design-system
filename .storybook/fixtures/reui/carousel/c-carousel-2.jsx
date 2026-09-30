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
    <div className='flex w-full items-center justify-center p-6'>
      <Carousel
        opts={{
          align: 'start'
        }}
        orientation='vertical'
        className='w-full max-w-xs'
      >
        <CarouselContent className='-mt-1 h-[325px]'>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className='basis-1/2 pt-1'>
              <div className='p-1'>
                <Card className='relative h-[145px] overflow-hidden border-0 p-0'>
                  <img
                    src={`static/images/art/${(index + 10) % 12}.svg`}
                    alt={`Slide ${index + 1}`}
                    width={600}
                    height={300}
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
    </div>
  );
}
