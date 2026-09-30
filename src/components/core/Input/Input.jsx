'use client';

import { FieldInput } from '../Field';
import { cn } from '../../../utilities/cn';
import { InputGroup, InputGroupAddon, InputGroupInput } from './parts/input-group.jsx';

/**
 * A Field-aware input. `prefix` and `suffix` render as InputGroup addons, so the
 * value, name, ref, validity and events stay on the input itself.
 */
export default function Input({
  prefix,
  suffix,
  className,
  inputClassName,
  ...props
}) {
  if (prefix == null && suffix == null) {
    return (
      <div className={cn('ds-input-group', className)}>
        <FieldInput {...props} className={inputClassName} />
      </div>
    );
  }

  return (
    <InputGroup className={cn('ds-input-group', className)}>
      {prefix != null && <InputGroupAddon>{prefix}</InputGroupAddon>}
      <InputGroupInput {...props} className={inputClassName} />
      {suffix != null && <InputGroupAddon align='inline-end'>{suffix}</InputGroupAddon>}
    </InputGroup>
  );
}
