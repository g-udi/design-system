// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconStack } from '../../../../src/components/core/Icon/parts/icon-stack-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <IconStack aria-hidden='true' className='text-ui-primary h-24 w-22'>
        <span className='bg-ui-background text-ui-primary flex size-8 items-center justify-center rounded-full border shadow-xs'>
          <RegistryIcon lucide='CheckIcon' className='size-4' />
        </span>
      </IconStack>
    </div>
  );
}
