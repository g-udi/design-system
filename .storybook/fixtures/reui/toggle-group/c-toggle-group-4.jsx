// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup
        type='single'
        variant='outline'
        spacing={2}
        defaultValue='week'
      >
        <ToggleGroupItem value='day'>Day</ToggleGroupItem>
        <ToggleGroupItem value='week'>Week</ToggleGroupItem>
        <ToggleGroupItem value='month'>Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
