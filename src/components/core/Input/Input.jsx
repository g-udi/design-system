'use client';

import { FieldInput } from '../Field';
import { cn } from '../../../utilities/cn';

/** Adornments are presentation; name, ref, validity and events reach the input. */
export default function Input({
  prefix,
  suffix,
  className,
  inputClassName,
  ...props
}) {
  return (
    <div className={cn('ds-input-group', className)}>
      {prefix != null && <span className='ds-input-adornment'>{prefix}</span>}
      <FieldInput
        {...props}
        className={cn(
          (prefix != null || suffix != null) &&
            'ds-input-adorned min-h-0 border-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent',
          inputClassName
        )}
      />
      {suffix != null && <span className='ds-input-adornment'>{suffix}</span>}
    </div>
  );
}
