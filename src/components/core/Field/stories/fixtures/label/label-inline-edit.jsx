'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import { Label } from '@gaudi/design-system/core/Field';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('My Awesome Project');
  return (
    <Field className='mx-auto w-full max-w-xs'>
      <Label htmlFor='label-inline-edit' className='gap-2'>
        Project name
        <Button
          size='icon-xs'
          variant='ghost'
          aria-label={isEditing ? 'Save project name' : 'Edit project name'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <RegistryIcon lucide='CheckIcon' className='size-3.5' />
          ) : (
            <RegistryIcon lucide='PencilIcon' className='size-3.5' />
          )}
        </Button>
      </Label>
      {isEditing ? (
        <Input
          id='label-inline-edit'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      ) : (
        <FieldDescription>{value}</FieldDescription>
      )}
    </Field>
  );
}
