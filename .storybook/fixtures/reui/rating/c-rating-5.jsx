// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Rating } from '../../../../src/components/core/Rating/parts/rating-extended.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col items-center gap-4'>
      <Rating rating={4} size='sm' />
      <Rating rating={4} />
      <Rating rating={4} size='lg' />
    </div>
  );
}
