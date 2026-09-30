import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup
        type='single'
        defaultValue='active'
        variant='outline'
        size='sm'
      >
        <ToggleGroupItem value='all'>All</ToggleGroupItem>
        <ToggleGroupItem value='active'>Active</ToggleGroupItem>
        <ToggleGroupItem value='completed'>Completed</ToggleGroupItem>
        <ToggleGroupItem value='archived'>Archived</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
