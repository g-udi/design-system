import {
  ScrollArea,
  ScrollBar
} from '@gaudi/design-system/core/ScrollArea';

const artworks = Array.from({ length: 10 }, (_, index) => ({
  src: `static/images/art/${(index + 1) % 12}.svg`,
  title: `Study ${index + 1}`
}));

export function Pattern() {
  return (
    <ScrollArea
      aria-label='Gallery'
      fadeEdges
      className='mx-auto w-full max-w-md rounded-2xl border border-ui-border data-has-overflow-x:pb-2.5 data-has-overflow-y:pe-2.5'
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
