import { ColorPicker } from '@gaudi/design-system/core/ColorPicker';
import Button from '@gaudi/design-system/core/Button';

const swatches = ['#2563eb', '#7c3aed', '#e11d48', '#ea580c', '#f59e0b', '#16a34a', '#0d9488', '#18181b'];

export function FormExample() {
  return (
    <form aria-label='Color preferences' className='grid gap-6'>
      <ColorPicker name='accent' label='Accent' defaultValue='#2563eb' swatches={swatches} />
      <ColorPicker name='locked' label='Read-only color' defaultValue='#16a34a' readOnly swatches={swatches.slice(0, 3)} />
      <ColorPicker name='disabled' label='Disabled color' defaultValue='#e11d48' disabled swatches={swatches.slice(0, 3)} />
      <Button type='reset' variant='outline'>Reset colors</Button>
    </form>
  );
}
