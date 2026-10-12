import { useEffect, useMemo, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks';
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
  const reducedMotion = usePrefersReducedMotion();
  const plugins = useMemo(() => [Autoplay({ delay: 2000, playOnInit: false })], []);
  const [api, setApi] = useState(null);
  const [playing, setPlaying] = useState(false);
  const autoplay = api?.plugins().autoplay;
  useEffect(() => {
    if (!autoplay) return;
    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    api.on('autoplay:play', onPlay).on('autoplay:stop', onStop);
    if (reducedMotion) autoplay.stop();
    else autoplay.play();
    setPlaying(autoplay.isPlaying());
    return () => {
      api.off('autoplay:play', onPlay).off('autoplay:stop', onStop);
      autoplay.stop();
    };
  }, [api, autoplay, reducedMotion]);
  const stop = () => autoplay?.stop();
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col items-center gap-3'>
      <Carousel
        plugins={plugins}
        setApi={setApi}
        className='w-full'
        onKeyDown={(event) => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) stop(); }}
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
        <CarouselPrevious onClick={stop} />
        <CarouselNext onClick={stop} />
      </Carousel>
      <Button
        size='sm'
        variant='outline'
        disabled={!autoplay}
        onClick={() => playing ? autoplay.stop() : autoplay.play()}
      >
        {playing ? 'Pause slideshow' : 'Play slideshow'}
      </Button>
    </div>
  );
}
