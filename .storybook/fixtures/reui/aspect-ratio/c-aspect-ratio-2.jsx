// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { AspectRatio } from '../../../../src/components/core/AspectRatio/parts/aspect-ratio.jsx';
export function Pattern() {
  return (
    <div className='w-full max-w-md'>
      <AspectRatio
        ratio={4 / 3}
        className='bg-ui-muted rounded-xl overflow-hidden border'
      >
        <img
          src='https://picsum.photos/1000/800?grayscale&random=2'
          alt='4:3'
          width={1e3}
          height={800}
          className='h-full w-full object-cover'
        />
      </AspectRatio>
    </div>
  );
}
