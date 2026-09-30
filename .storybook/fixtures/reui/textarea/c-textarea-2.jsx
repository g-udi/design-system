// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <Textarea
        aria-label='Type your message here…'
        placeholder='Type your message here…'
        aria-invalid='true'
        className='w-full'
      />
    </div>
  );
}
