import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Toggle aria-label='Toggle bold' defaultPressed>
        <RegistryIcon lucide='BoldIcon' />
      </Toggle>
      <Toggle aria-label='Toggle italic'>
        <RegistryIcon lucide='ItalicIcon' />
      </Toggle>
      <Toggle aria-label='Toggle underline'>
        <RegistryIcon lucide='UnderlineIcon' />
      </Toggle>
    </div>
  );
}
