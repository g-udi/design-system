import { useState } from 'react';
import { Pointer } from '@gaudi/design-system/core/Pointer';
import Button from '@gaudi/design-system/core/Button';
import Input from '@gaudi/design-system/core/Input';
import Icon from '@gaudi/design-system/core/Icon';

export function PointerPlayground(args) {
  const [saved, setSaved] = useState(false);
  return (
    <Pointer {...args} className='grid min-h-96 w-full content-center gap-6 rounded-lg border border-border bg-surface-muted p-8'>
      <div className='grid max-w-lg gap-3'>
        <Icon name='MousePointer2' decorative className='size-6 text-text-muted' />
        <h3 className='text-2xl font-semibold text-text'>A little movement. A different feel.</h3>
        <p className='text-sm text-text-muted'>Move through this space, then hover a button. The dot stays precise while the frame catches up.</p>
      </div>
      <div className='flex flex-wrap items-center gap-3'>
        <Button data-pointer-label={saved ? 'Undo' : 'Save'} onClick={() => setSaved(!saved)} aria-pressed={saved}>{saved ? 'Saved to collection' : 'Save to collection'}</Button>
        <Button variant='outline' data-pointer-label='Explore' onClick={() => setSaved(false)}>Start again</Button>
      </div>
      <p role='status' className='text-xs text-text-muted'>{saved ? 'One item saved.' : 'Buttons work normally with mouse, touch, or keyboard.'}</p>
    </Pointer>
  );
}

export function TrackingComparison() {
  return (
    <div className='grid gap-4 md:grid-cols-3'>
      {[
        { name: 'Direct dot', tracking: 'direct', variant: 'dot', text: 'Stays exactly with your pointer.' },
        { name: 'Spring ring', tracking: 'spring', variant: 'ring', text: 'Catches up with a little spring.' },
        { name: 'Lazy frame', tracking: 'lazy', variant: 'frame', text: 'A precise dot and an unhurried frame.' }
      ].map(({ name, tracking, variant, text }) => (
        <Pointer key={tracking} tracking={tracking} variant={variant} tone='accent' className='grid min-h-64 content-between gap-8 rounded-lg border border-border bg-surface-muted p-6'>
          <div className='grid gap-2'><h3 className='text-base font-semibold text-text'>{name}</h3><p className='text-sm text-text-muted'>{text}</p></div>
          <Button variant='outline' className='justify-self-start'>Hover here</Button>
        </Pointer>
      ))}
    </div>
  );
}

export function ContextualLabels() {
  const [selected, setSelected] = useState(null);
  return (
    <Pointer variant='label' tracking='spring' label='Explore' className='grid gap-4'>
      <div className='grid gap-4 sm:grid-cols-2'>
        {[
          { name: 'Field notes', image: '/static/images/art/2.svg', action: 'Read notes' },
          { name: 'Shape and space', image: '/static/images/art/4.svg', action: 'View project' }
        ].map(({ name, image, action }) => (
          <Button key={name} variant='ghost' className='h-auto flex-col items-stretch overflow-hidden whitespace-normal border border-border p-0 text-start' data-pointer-label={action} onClick={() => setSelected(name)}>
            <img src={image} alt='' className='aspect-[4/3] w-full object-cover' />
            <span className='flex items-center justify-between gap-3 p-4'><span>{name}</span><Icon name='ArrowUpRight' decorative /></span>
          </Button>
        ))}
      </div>
      <p role='status' className='text-sm text-text-muted'>{selected ? `${selected} selected.` : 'Choose a collection to preview.'}</p>
    </Pointer>
  );
}

export function NativeControls() {
  return (
    <Pointer className='grid min-h-80 content-center gap-5 rounded-lg border border-border bg-surface-muted p-6'>
      <h3 className='text-lg font-semibold text-text'>Native where it matters</h3>
      <label className='grid max-w-md gap-2 text-sm text-text'>Collection name<Input placeholder='Type a name' /></label>
      <p className='max-w-md text-sm text-text-muted' data-pointer-native>Select and copy this text with the native cursor. Touch, keyboard use, and reduced motion keep their normal behavior.</p>
      <Button variant='outline' disabled className='justify-self-start'>Unavailable action</Button>
    </Pointer>
  );
}
