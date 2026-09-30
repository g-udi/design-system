import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
export function Pattern() {
  return (
    <ScrollArea className='rounded-2xl h-auto w-full max-w-96 border'>
      <div className='flex w-max gap-4 p-4'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className='rounded-2xl relative h-36 w-40 shrink-0 overflow-hidden border'
          >
            <img
              src={`static/images/art/${(i + 1) % 12}.svg`}
              alt={`Image ${i + 1}`}
              className='h-full w-full object-cover'
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
