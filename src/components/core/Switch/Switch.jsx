'use client';

import { useId } from 'react';

import { Label } from '../Field/parts/label.jsx';
import { cn } from '../../../utilities/cn';
import { Switch as SwitchRoot } from './parts/switch.jsx';

// The convenience scale names map onto the part's data-size values.
const partSizes = { sm: 'sm', md: 'default', lg: 'lg' };

/** A labelled switch: the composition part plus a visible label that toggles it. */
const Switch = ({ className, id, label, size = 'md', ...props }) => {
  const generatedId = useId();
  const switchId = id || generatedId;

  return (
    <span className={ cn('inline-flex items-center gap-2', className) }>
      <SwitchRoot id={ switchId } size={ partSizes[size] || 'default' } { ...props } />
      {label ? <Label htmlFor={ switchId }>{label}</Label> : null}
    </span>
  );
};

export default Switch;
