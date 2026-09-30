'use client';

import { createContext, useContext, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '../../../utilities/cn';

const FieldContext = createContext(null);

export const Field = ({ children, className }) => {
  const id = useId();
  const [ hasDescription, setHasDescription ] = useState(false);
  const [ hasError, setHasError ] = useState(false);
  const context = useMemo(() => {
    return {
      'descriptionId': `${id}-description`,
      'errorId': `${id}-error`,
      hasDescription,
      hasError,
      'inputId': `${id}-input`,
      setHasDescription,
      setHasError
    };
  }, [ hasDescription, hasError, id ]);

  return (
    <FieldContext.Provider value={ context }>
      <div className={ cn('grid gap-2', className) }>{children}</div>
    </FieldContext.Provider>
  );
};

export const FieldLabel = ({ children, className, htmlFor }) => {
  const context = useContext(FieldContext);

  return (
    <label htmlFor={ htmlFor || context?.inputId } className={ cn('text-sm font-semibold text-gray-900 dark:text-gray-100', className) }>{children}</label>
  );
};

export const FieldDescription = ({ children, className, id }) => {
  const context = useContext(FieldContext);
  const setHasDescription = context?.setHasDescription;

  useEffect(() => {
    if (!setHasDescription) return undefined;

    setHasDescription(true);

    return () => setHasDescription(false);
  }, [ setHasDescription ]);

  return (
    <p id={ id || context?.descriptionId } className={ cn('text-sm leading-5 text-gray-500 dark:text-gray-400', className) }>{children}</p>
  );
};

export const FieldError = ({ children, className, id }) => {
  const context = useContext(FieldContext);
  const setHasError = context?.setHasError;

  useEffect(() => {
    if (!setHasError) return undefined;

    setHasError(true);

    return () => setHasError(false);
  }, [ setHasError ]);

  return (
    <p id={ id || context?.errorId } className={ cn('text-sm font-medium text-red-600 dark:text-red-400', className) }>{children}</p>
  );
};

export const FieldInput = ({ as: Control = 'input', 'aria-describedby': ariaDescribedBy, className, id, invalid, ...props }) => {
  const context = useContext(FieldContext);
  const describedBy = [
    ariaDescribedBy,
    context?.hasDescription ? context.descriptionId : null,
    context?.hasError ? context.errorId : null
  ].filter(Boolean).join(' ');
  const isInvalid = invalid ?? context?.hasError;

  return (
    <Control
      id={ id || context?.inputId }
      aria-describedby={ describedBy || undefined }
      aria-invalid={ isInvalid || undefined }
      className={ cn('ds-motion-state min-h-8 w-full min-w-0 rounded-md border border-border bg-surface px-3 py-1 text-base leading-5 text-text md:text-sm shadow-xs placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50', isInvalid && 'border-danger focus-visible:border-danger focus-visible:ring-danger', className) }
      { ...props }
    />
  );
};

export default Field;
