'use client';

import { useId, useState } from 'react';

import { cn } from '../../../utilities/cn';

const switchSizes = {
  'lg': {
    'label': 'text-sm',
    'root': 'gap-3',
    'thumb': 'size-5 data-[checked=true]:translate-x-5',
    'track': 'h-7 w-12 p-1'
  },
  'md': {
    'label': 'text-sm',
    'root': 'gap-2.5',
    'thumb': 'size-4 data-[checked=true]:translate-x-5',
    'track': 'h-6 w-11 p-1'
  },
  'sm': {
    'label': 'text-sm',
    'root': 'gap-2',
    'thumb': 'size-3.5 data-[checked=true]:translate-x-4',
    'track': 'h-5 w-9 p-0.75'
  }
};

const Switch = ({ checked, className, defaultChecked = false, disabled = false, id, label, onCheckedChange, size = 'md' }) => {
  const generatedId = useId();
  const switchId = id || generatedId;
  const [ internalChecked, setInternalChecked ] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;
  const sizeConfig = switchSizes[size] || switchSizes.md;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;

    if (checked === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <span className={ cn('inline-flex items-center', sizeConfig.root, className) }>
      <button
        id={ switchId }
        type='button'
        role='switch'
        aria-checked={ isChecked }
        disabled={ disabled }
        className={ cn('ds-control-hit-target ds-motion-toggle-track relative inline-flex shrink-0 items-center rounded-control border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-gray-950', sizeConfig.track, isChecked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800') }
        onClick={ toggle }
      >
        <span data-checked={ isChecked } className={ cn('ds-motion-toggle-thumb pointer-events-none inline-block translate-x-0 rounded-control bg-white shadow-sm ring-1 ring-gray-950/5', sizeConfig.thumb) } />
      </button>
      {label ? <label htmlFor={ switchId } className={ cn('font-medium leading-none text-gray-800 dark:text-gray-200', sizeConfig.label) }>{label}</label> : null}
    </span>
  );
};

export default Switch;
