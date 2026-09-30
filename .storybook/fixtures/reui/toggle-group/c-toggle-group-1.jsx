// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='multiple' spacing={1}>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <RegistryIcon lucide='BoldIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <RegistryIcon lucide='ItalicIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='underline' aria-label='Toggle underline'>
          <RegistryIcon lucide='UnderlineIcon' />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
