import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup
        type='single'
        defaultValue='monthly'
        variant='outline'
        size='lg'
      >
        <ToggleGroupItem value='monthly'>Monthly</ToggleGroupItem>
        <ToggleGroupItem value='yearly' className='gap-2'>
          Yearly
          <span className='bg-ui-primary text-ui-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium'>
            Save 20%
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
