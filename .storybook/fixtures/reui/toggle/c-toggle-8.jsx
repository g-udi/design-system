// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='flex items-center gap-3'>
        <span className='text-ui-muted-foreground w-16 text-sm'>Small</span>
        <Toggle variant='outline' size='sm' aria-label='Toggle star small'>
          <RegistryIcon lucide='StarIcon' />
        </Toggle>
      </div>
      <div className='flex items-center gap-3'>
        <span className='text-ui-muted-foreground w-16 text-sm'>Default</span>
        <Toggle
          variant='outline'
          size='default'
          aria-label='Toggle star default'
        >
          <RegistryIcon lucide='StarIcon' />
        </Toggle>
      </div>
      <div className='flex items-center gap-3'>
        <span className='text-ui-muted-foreground w-16 text-sm'>Large</span>
        <Toggle variant='outline' size='lg' aria-label='Toggle star large'>
          <RegistryIcon lucide='StarIcon' />
        </Toggle>
      </div>
    </div>
  );
}
