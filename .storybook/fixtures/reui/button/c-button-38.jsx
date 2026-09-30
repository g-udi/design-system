// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button className='pe-0' variant='outline'>
      <RegistryIcon lucide='StarIcon' aria-hidden='true' />
      Star
      <span className='text-ui-muted-foreground before:bg-ui-border relative ms-1 px-2 text-xs font-medium before:absolute before:inset-0 before:left-0 before:w-px'>
        589
      </span>
    </Button>
  );
}
