// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2.5'>
      <Badge size='sm'>Small</Badge>
      <Badge size='default'>Default</Badge>
      <Badge size='lg'>Large</Badge>
    </div>
  );
}
