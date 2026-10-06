'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import { Slider } from '@gaudi/design-system/core/Slider';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [opacity, setOpacity] = useState([75]);
  return (
    <div className='flex items-center justify-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline'>
            <RegistryIcon lucide='SlidersHorizontalIcon' aria-hidden='true' />
            Layer settings
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-72 gap-0 p-0' align='start'>
          <PopoverHeader className='border-b border-border p-3'>
            <PopoverTitle>Layer settings</PopoverTitle>
            <PopoverDescription>
              Set the dimensions and appearance of the layer.
            </PopoverDescription>
          </PopoverHeader>
          <div className='grid gap-3 p-3'>
            <FieldGroup className='gap-2'>
              <Field orientation='horizontal'>
                <FieldLabel htmlFor='layer-width' className='w-1/2'>
                  Width
                </FieldLabel>
                <Input id='layer-width' defaultValue='100%' />
              </Field>
              <Field orientation='horizontal'>
                <FieldLabel htmlFor='layer-height' className='w-1/2'>
                  Height
                </FieldLabel>
                <Input id='layer-height' defaultValue='25px' />
              </Field>
            </FieldGroup>
            <div className='grid gap-2 border-t border-border pt-3'>
              <div className='flex items-center justify-between'>
                <label htmlFor='layer-visible'>Visible</label>
                <Switch id='layer-visible' defaultChecked />
              </div>
              <div className='flex items-center justify-between'>
                <label htmlFor='layer-lock'>Lock position</label>
                <Switch id='layer-lock' />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center justify-between'>
                  <span>Opacity</span>
                  <span className='text-text-muted tabular-nums'>
                    {opacity[0]}%
                  </span>
                </div>
                <Slider
                  aria-label='Opacity'
                  value={opacity}
                  onValueChange={setOpacity}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
