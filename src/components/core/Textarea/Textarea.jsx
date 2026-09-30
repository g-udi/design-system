'use client';

import { FieldInput } from '../Field';
import { cn } from '../../../utilities/cn';

export default function Textarea({ className, rows = 4, ...props }) {
  return (
    <FieldInput
      {...props}
      as='textarea'
      rows={rows}
      className={cn('resize-y', className)}
    />
  );
}
