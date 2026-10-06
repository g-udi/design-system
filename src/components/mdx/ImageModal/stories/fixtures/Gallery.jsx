import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import ImageModal from '@gaudi/design-system/mdx/ImageModal';

// A figure gallery from an article: the first figure follows the controls, the others keep their own captions.
export const gallery = [
  { src: '/static/images/art/0.svg', alt: 'Lavender gradient artwork', caption: 'A study in lavender and light.' },
  { src: '/static/images/art/1.svg', alt: 'Peach and pink gradient artwork', caption: 'Peach and pink blend into a soft glow.' },
  { src: '/static/images/art/2.svg', alt: 'Aqua and blue gradient artwork', caption: 'Cool aqua fades into blue.' }
];

/** The host owns which figure is open; `isOpen` sets whether the featured figure starts open. */
export function Gallery({ isOpen = false, onClose, ...featured } = {}) {
  const figures = [{ ...gallery[0], ...featured }, ...gallery.slice(1)];
  const [open, setOpen] = useState(isOpen ? 0 : null);
  const close = () => {
    setOpen(null);
    onClose?.();
  };
  return (
    <div className='grid grid-cols-3 gap-2 sm:gap-4'>
      {figures.map((figure, index) => (
        <figure key={figure.alt} className='min-w-0'>
          <Button
            variant='outline'
            className='block w-full overflow-hidden p-1 sm:p-2'
            aria-label={`Open image: ${figure.alt}`}
            onClick={() => setOpen(index)}
          >
            <img src={figure.src} alt='' className='aspect-[4/3] w-full object-contain' />
          </Button>
          <figcaption className='mt-2 wrap-anywhere text-xs leading-4 text-text-muted sm:text-sm sm:leading-5'>{figure.caption}</figcaption>
        </figure>
      ))}
      {figures.map((figure, index) => <ImageModal key={figure.alt} {...figure} isOpen={open === index} onClose={close} />)}
    </div>
  );
}
