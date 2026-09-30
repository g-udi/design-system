'use client';

import { useId } from 'react';
import { cn } from '../../../utilities/cn';

/** Native radios preserve keyboard navigation, required validation and FormData. */
export default function RadioGroup({
  label,
  description,
  options = [],
  name,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  variant = 'list',
  className
}) {
  const id = useId();
  return (
    <fieldset disabled={disabled} className={cn('ds-radio-group', className)}>
      <legend className='ds-label'>{label}</legend>
      {description && <p className='ds-description'>{description}</p>}
      <div
        className={cn(
          'ds-radio-options',
          variant === 'cards' && 'ds-radio-cards'
        )}
      >
        {options.map((option) => (
          <label key={option.value} className='ds-radio-option'>
            <input
              type='radio'
              name={name || id}
              value={option.value}
              required={required}
              disabled={option.disabled}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={
                value === undefined ? defaultValue === option.value : undefined
              }
              onChange={() => onValueChange?.(option.value)}
            />
            <span>
              <span className='ds-label'>{option.label}</span>
              {option.description && (
                <span className='ds-description'>{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
