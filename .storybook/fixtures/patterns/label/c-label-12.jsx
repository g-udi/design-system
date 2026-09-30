'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldDescription
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
