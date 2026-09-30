// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-4'>
      <Spinner className='size-4 text-blue-500' />
      <Spinner className='size-4 text-green-500' />
      <Spinner className='size-4 text-red-500' />
      <Spinner className='size-4 text-yellow-500' />
      <Spinner className='size-4 text-purple-500' />
    </div>
  );
}
