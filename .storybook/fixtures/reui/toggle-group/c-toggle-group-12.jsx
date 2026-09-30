// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='single' defaultValue='24h' variant='outline' size='sm'>
        <ToggleGroupItem value='1h'>1H</ToggleGroupItem>
        <ToggleGroupItem value='6h'>6H</ToggleGroupItem>
        <ToggleGroupItem value='24h'>24H</ToggleGroupItem>
        <ToggleGroupItem value='7d'>7D</ToggleGroupItem>
        <ToggleGroupItem value='30d'>30D</ToggleGroupItem>
        <ToggleGroupItem value='all'>All</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
