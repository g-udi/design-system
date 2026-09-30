// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline'>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent className='w-64' align='start'>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <FieldGroup className='gap-2'>
            <Field orientation='horizontal'>
              <FieldLabel htmlFor='width' className='w-1/2'>
                Width
              </FieldLabel>
              <Input id='width' defaultValue='100%' />
            </Field>
            <Field orientation='horizontal'>
              <FieldLabel htmlFor='height' className='w-1/2'>
                Height
              </FieldLabel>
              <Input id='height' defaultValue='25px' />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}
