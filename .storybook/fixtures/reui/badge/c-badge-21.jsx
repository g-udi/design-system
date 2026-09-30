// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Badge variant='outline' className='gap-0.5'>
      Badge
      <Button
        aria-label='Close'
        variant='ghost'
        size='icon'
        className='size-3 hover:bg-transparent'
      >
        <RegistryIcon lucide='XIcon' />
      </Button>
    </Badge>
  );
}
