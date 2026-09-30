'use client';

import { FieldInput } from '../Field';
import { cn } from '../../../utilities/cn';

/** A multiline FieldInput: it shares the input's label, description and invalid wiring. */
export default function Textarea({ className, rows = 4, ...props }) {
  return (
    <FieldInput
      {...props}
      as='textarea'
      rows={rows}
      className={cn('resize-y py-2', className)}
    />
  );
}
