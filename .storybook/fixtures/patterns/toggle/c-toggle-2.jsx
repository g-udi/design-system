import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Toggle variant='outline' aria-label='Toggle italic'>
        <RegistryIcon lucide='ItalicIcon' />
        Italic
      </Toggle>
      <Toggle variant='outline' aria-label='Toggle bold'>
        <RegistryIcon lucide='BoldIcon' />
        Bold
      </Toggle>
    </div>
  );
}
