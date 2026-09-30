// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <Button variant='outline' className='gap-2' aria-label='Messages (12)'>
      Messages
      <Badge variant='destructive-outline' size='sm' aria-hidden='true'>
        12
      </Badge>
    </Button>
  );
}
