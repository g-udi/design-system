// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='link' className='group/link-button'>
      View Documentation
      <RegistryIcon
        lucide='ArrowUpRightIcon'
        aria-hidden='true'
        className='transition-transform group-hover/link-button:rotate-45'
      />
    </Button>
  );
}
