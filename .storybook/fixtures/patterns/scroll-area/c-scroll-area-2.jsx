import { cn } from '../../../../src/utilities/cn/index.js';
import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';

// Masks fade whichever edge still has content to scroll to, and the gutter
// padding appears only on an axis that overflows, so the bar never covers a card.
const fadeEdges = [
  '**:data-[slot=scroll-area-viewport]:[--fade-size:2rem]',
  '**:data-[slot=scroll-area-viewport]:mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))]',
  '**:data-[slot=scroll-area-viewport]:mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))]',
  '**:data-[slot=scroll-area-viewport]:mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))]',
  '**:data-[slot=scroll-area-viewport]:mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))]'
];
const artworks = Array.from({ length: 10 }, (_, index) => ({
  src: `static/images/art/${(index + 1) % 12}.svg`,
  title: `Study ${index + 1}`
}));

export function Pattern() {
  return (
    <ScrollArea
      aria-label='Gallery'
      className={cn(
        'mx-auto w-full max-w-md rounded-2xl border border-ui-border data-has-overflow-x:pb-2.5 data-has-overflow-y:pe-2.5',
        fadeEdges
      )}
    >
      <ul className='flex w-max gap-3 p-3'>
        {artworks.map(({ src, title }) => (
          <li key={src} className='grid w-36 shrink-0 gap-1.5'>
            <img src={src} alt={title} className='h-24 w-full rounded-xl border border-ui-border object-cover' />
            <span className='text-xs font-medium'>{title}</span>
          </li>
        ))}
      </ul>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
