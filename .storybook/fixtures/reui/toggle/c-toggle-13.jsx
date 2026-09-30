// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Toggle aria-label='Enabled default'>
        <RegistryIcon lucide='BoldIcon' />
      </Toggle>
      <Toggle variant='outline' aria-label='Enabled outline'>
        <RegistryIcon lucide='ItalicIcon' />
      </Toggle>
      <Toggle disabled aria-label='Disabled default'>
        <RegistryIcon lucide='UnderlineIcon' />
      </Toggle>
      <Toggle variant='outline' disabled aria-label='Disabled outline'>
        <RegistryIcon lucide='StrikethroughIcon' />
      </Toggle>
    </div>
  );
}
