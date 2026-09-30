'use client';

import { useId } from 'react';

import { cn } from '../../../utilities/cn';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '../Field/parts/field.jsx';
import { RadioGroup as RadioGroupRoot, RadioGroupItem } from './parts/radio-group.jsx';

/** A labelled single-choice group built from the RadioGroup and Field parts. */
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
  const cards = variant === 'cards';

  return (
    <FieldSet disabled={disabled} className={cn('gap-2', className)}>
      <FieldLegend variant='label' className='mb-0'>{label}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <RadioGroupRoot
        aria-label={label}
        name={name || id}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        data-variant={variant}
        className={cn('mt-1', cards && 'grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))]')}
      >
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          const item = <RadioGroupItem value={option.value} id={optionId} disabled={option.disabled} />;
          const optionDescription = option.description && <FieldDescription>{option.description}</FieldDescription>;

          // Cards make the whole bordered label the click target; list rows label the radio beside it.
          return cards ? (
            <FieldLabel key={option.value} htmlFor={optionId}>
              <Field orientation='horizontal' data-disabled={option.disabled || undefined}>
                {item}
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                  {optionDescription}
                </FieldContent>
              </Field>
            </FieldLabel>
          ) : (
            <Field key={option.value} orientation='horizontal' data-disabled={option.disabled || undefined}>
              {item}
              <FieldContent>
                <FieldLabel htmlFor={optionId}>{option.label}</FieldLabel>
                {optionDescription}
              </FieldContent>
            </Field>
          );
        })}
      </RadioGroupRoot>
    </FieldSet>
  );
}
