'use client';

import { useId, useState } from 'react';

import Icon from '../Icon';
import { cn } from '../../../utilities/cn';

const Checkbox = ({ checked, className, defaultChecked = false, disabled = false, id, label, onCheckedChange }) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const [ internalChecked, setInternalChecked ] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;

    if (checked === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <span className={ cn('inline-flex items-center gap-3', className) }>
      <button
        id={ checkboxId }
        type='button'
        role='checkbox'
        aria-checked={ isChecked }
        disabled={ disabled }
        className={ cn('ds-control-hit-target ds-motion-toggle-track relative inline-flex size-5 items-center justify-center rounded border border-gray-300 bg-white text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:focus-visible:ring-offset-gray-950', isChecked && 'border-blue-600 bg-blue-600') }
        onClick={ toggle }
      >
        {isChecked ? <Icon name='Check' decorative size='xs' /> : null}
      </button>
      {label ? <label htmlFor={ checkboxId } className={ cn('text-sm font-medium text-gray-800 dark:text-gray-200', disabled && 'cursor-not-allowed opacity-50') }>{label}</label> : null}
    </span>
  );
};

export default Checkbox;
