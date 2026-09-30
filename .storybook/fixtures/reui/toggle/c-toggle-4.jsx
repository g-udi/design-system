// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='flex items-center gap-2'>
        <Button size='sm' variant='outline'>
          Button
        </Button>
        <Toggle variant='outline' size='sm' aria-label='Small toggle'>
          Toggle
        </Toggle>
      </div>
      <div className='flex items-center gap-2'>
        <Button aria-label='Bold' variant='outline' size='icon'>
          <RegistryIcon lucide='BoldIcon' />
        </Button>
        <Toggle variant='outline' aria-label='Toggle bold icon'>
          <RegistryIcon lucide='BoldIcon' />
        </Toggle>
      </div>
    </div>
  );
}
