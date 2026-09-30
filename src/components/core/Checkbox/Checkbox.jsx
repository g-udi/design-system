'use client';

import { useId } from 'react';

import { Label } from '../Field/parts/label.jsx';
import { cn } from '../../../utilities/cn';
import { Checkbox as CheckboxRoot } from './parts/checkbox.jsx';

/** A labelled checkbox: the composition part plus a visible label that toggles it. */
const Checkbox = ({ className, id, label, ...props }) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <span className={ cn('inline-flex items-center gap-2', className) }>
      <CheckboxRoot id={ checkboxId } { ...props } />
      {label ? <Label htmlFor={ checkboxId }>{label}</Label> : null}
    </span>
  );
};

export default Checkbox;
