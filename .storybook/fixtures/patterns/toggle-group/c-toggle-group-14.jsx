import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='single' defaultValue='2' variant='outline'>
        <ToggleGroupItem value='1' aria-label='1 column'>
          <RegistryIcon lucide='SquareIcon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='2' aria-label='2 columns'>
          <RegistryIcon lucide='Columns2Icon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='3' aria-label='3 columns'>
          <RegistryIcon lucide='Columns3Icon' />
        </ToggleGroupItem>
        <ToggleGroupItem value='4' aria-label='4 columns'>
          <RegistryIcon lucide='LayoutGridIcon' />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
