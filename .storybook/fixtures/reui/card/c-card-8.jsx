// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  return (
    <Card className='group/card relative h-96 w-full max-w-xs overflow-hidden border-0 p-0'>
      <img
        src='static/images/art/11.svg'
        alt='Background'
        width={1e3}
        height={800}
        className='absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/card:scale-110'
      />

      {/* Background fade effects */}
      <div className='absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-500 group-hover/card:from-black/70' />

      {/* Content */}
      <div className='relative flex h-full flex-col justify-end p-6'>
        <h3 className='text-2xl font-bold text-white'>Image Scale Effect</h3>
        <p className='mt-2 text-sm text-white'>
          This card features a smooth image scaling effect and background
          overlay on hover.
        </p>
      </div>
    </Card>
  );
}
