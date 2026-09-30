// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
export function Pattern() {
  return (
    <Badge variant='outline'>
      <img
        src='https://flagcdn.com/us.svg'
        alt='US'
        width={18}
        height={18}
        className='rounded-xs'
      />
      USA
    </Badge>
  );
}
