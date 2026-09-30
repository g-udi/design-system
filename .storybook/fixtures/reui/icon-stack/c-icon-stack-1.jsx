// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconStack } from '../../../../src/components/core/Icon/parts/icon-stack-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <IconStack aria-hidden='true'>
        <RegistryIcon lucide='LayersIcon' className='size-4' />
      </IconStack>
    </div>
  );
}
