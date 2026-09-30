// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='single' defaultValue='left' spacing={1}>
        <ToggleGroupItem value='left' aria-label='Align left'>
          <RegistryIcon lucide='AlignLeftIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='center' aria-label='Align center'>
          <RegistryIcon lucide='AlignCenterIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='right' aria-label='Align right'>
          <RegistryIcon lucide='AlignRightIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='justify' aria-label='Justify'>
          <RegistryIcon lucide='MenuIcon' />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
