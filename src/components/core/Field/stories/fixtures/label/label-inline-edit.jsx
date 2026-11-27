'use client';
import { useState } from 'react';
import { EditableField } from '@gaudi/design-system/blocks/Forms';

export function Pattern() {
  const [value, setValue] = useState('My Awesome Project');
  return <EditableField label='Project name' value={value} onSave={setValue} className='mx-auto w-full max-w-md' />;
}
