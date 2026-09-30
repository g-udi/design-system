// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { AspectRatio } from '../../../../src/components/core/AspectRatio/parts/aspect-ratio.jsx';
export function Pattern() {
  return (
    <div className='w-full max-w-xs'>
      <AspectRatio
        ratio={9 / 16}
        className='bg-ui-muted rounded-xl overflow-hidden border'
      >
        <img
          src='static/images/art/2.svg'
          alt='9:16'
          width={1e3}
          height={800}
          className='h-full w-full object-cover'
        />
      </AspectRatio>
    </div>
  );
}
