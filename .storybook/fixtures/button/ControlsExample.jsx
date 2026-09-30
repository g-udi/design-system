import { default as Button } from '../../../src/components/core/Button/index.js';
import { default as Input } from '../../../src/components/core/Input/index.js';
import { default as Select } from '../../../src/components/core/Select/index.js';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput
} from '../../../src/components/core/NumberField/index.js';
import { RegistryIcon } from '../../../src/icons/RegistryIcon.jsx';

export function ControlsExample() {
  return (
    <div className='grid w-full max-w-3xl gap-6 sm:grid-cols-2'>
      <section className='min-w-0 space-y-2'>
        <h3 className='text-sm font-medium'>Search</h3>
        <div data-control-row className='flex min-w-0 items-center gap-2'>
          <Input className='min-w-0 flex-1' aria-label='Search articles' placeholder='Search articles' />
          <Button>Search</Button>
        </div>
      </section>
      <section className='min-w-0 space-y-2'>
        <h3 className='text-sm font-medium'>Website</h3>
        <div data-control-row className='flex min-w-0 items-center gap-2'>
          <Input className='min-w-0 flex-1' aria-label='Website' prefix='https://' placeholder='example.com' />
          <Button variant='outline' size='icon' aria-label='Open website'>
            <RegistryIcon lucide='ArrowUpRightIcon' aria-hidden='true' />
          </Button>
        </div>
      </section>
      <section className='min-w-0 space-y-2'>
        <h3 className='text-sm font-medium'>Publishing</h3>
        <div data-control-row className='flex min-w-0 items-center gap-2'>
          <Select
            className='min-w-0 flex-1'
            aria-label='Publication status'
            defaultValue='draft'
            options={[{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]}
          />
          <Button variant='outline'>Save</Button>
        </div>
      </section>
      {[
        { label: 'Small', size: 'sm', buttonSize: 'sm', iconSize: 'icon-sm' },
        { label: 'Default', size: 'default', buttonSize: 'md', iconSize: 'icon' },
        { label: 'Large', size: 'lg', buttonSize: 'lg', iconSize: 'icon-lg' }
      ].map(({ label, size, buttonSize, iconSize }) => (
        <section key={size} className='min-w-0 space-y-2'>
          <h3 className='text-sm font-medium'>{label} quantity</h3>
          <div data-control-row className='flex min-w-0 items-center gap-2'>
            <NumberField className='min-w-0 flex-1' size={size} defaultValue={3} min={0}>
              <NumberFieldGroup>
                <NumberFieldDecrement aria-label={`Decrease ${label.toLowerCase()} quantity`} />
                <NumberFieldInput aria-label={`${label} quantity`} />
                <NumberFieldIncrement aria-label={`Increase ${label.toLowerCase()} quantity`} />
              </NumberFieldGroup>
            </NumberField>
            <Button variant='outline' size={buttonSize}>Update</Button>
            <Button variant='outline' size={iconSize} aria-label={`${label} quantity settings`}>
              <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
            </Button>
          </div>
        </section>
      ))}
    </div>
  );
}
