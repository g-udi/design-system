import { ScrollArea } from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
export function Pattern() {
  return (
    <ScrollArea className='rounded-2xl h-72 w-56 border data-has-overflow-x:py-2.5 data-has-overflow-y:px-2.5'>
      <div className='flex w-full flex-col items-center gap-4 py-2'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className='rounded-2xl relative h-36 w-full shrink-0 overflow-hidden border'
          >
            <img
              src={`static/images/art/${(i + 1) % 12}.svg`}
              alt={`Image ${i + 1}`}
              className='h-full w-full object-cover'
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
