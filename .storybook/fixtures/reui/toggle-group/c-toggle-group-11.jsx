// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='single' defaultValue='m' size='sm' variant='outline'>
        <ToggleGroupItem value='s'>S</ToggleGroupItem>
        <ToggleGroupItem value='m'>M</ToggleGroupItem>
        <ToggleGroupItem value='l'>L</ToggleGroupItem>
        <ToggleGroupItem value='xl'>XL</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
