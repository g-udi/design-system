// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='single' defaultValue='list' variant='outline'>
        <ToggleGroupItem value='list' aria-label='List view'>
          <RegistryIcon lucide='ListIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='grid' aria-label='Grid view'>
          <RegistryIcon lucide='LayoutGridIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='kanban' aria-label='Kanban view'>
          <RegistryIcon lucide='Columns2Icon' />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
