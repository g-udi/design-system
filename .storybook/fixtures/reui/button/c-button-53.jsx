// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button className='group/sliding relative overflow-hidden rounded-control px-6'>
      <span className='inline-flex items-center transition-transform duration-300 group-hover/sliding:-translate-x-2'>
        Get Started
      </span>
      <RegistryIcon
        lucide='ArrowRightIcon'
        aria-hidden='true'
        className='absolute right-2.5 translate-x-8 opacity-0 transition-all duration-300 group-hover/sliding:translate-x-0 group-hover/sliding:opacity-100'
      />
    </Button>
  );
}
