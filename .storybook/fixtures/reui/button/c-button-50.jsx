// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='link' className='group/back-button' asChild>
      <a href='#'>
        <RegistryIcon
          lucide='ChevronLeftIcon'
          data-icon='inline-start'
          aria-hidden='true'
          className='transition-transform duration-200 group-hover/back-button:-translate-x-1'
        />
        Go back
      </a>
    </Button>
  );
}
