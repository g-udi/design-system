import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='single' defaultValue='asc' variant='outline' size='sm'>
        <ToggleGroupItem value='asc' aria-label='Sort ascending'>
          <RegistryIcon lucide='ArrowUpIcon' />
          Ascending
        </ToggleGroupItem>
        <ToggleGroupItem value='desc' aria-label='Sort descending'>
          <RegistryIcon lucide='ArrowDownIcon' />
          Descending
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
