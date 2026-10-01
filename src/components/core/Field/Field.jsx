'use client';

import { createContext, useContext, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '../../../utilities/cn';
import {
  Field as FieldPart,
  FieldDescription as FieldDescriptionPart,
  FieldError as FieldErrorPart,
  FieldLabel as FieldLabelPart
} from './parts/field.jsx';

// The convenience Field wires ids between its parts: the label targets the control,
// and the control is described by whichever description and error are mounted.
const FieldContext = createContext(null);

// Registers a mounted description or error so FieldInput only references ids that exist.
const useRegister = (register) => {
  useEffect(() => {
    if (!register) return undefined;
    register(true);
    return () => register(false);
  }, [ register ]);
};

export const Field = ({ children, className }) => {
  const id = useId();
  const [ hasDescription, setHasDescription ] = useState(false);
  const [ hasError, setHasError ] = useState(false);
  const context = useMemo(() => ({
    'descriptionId': `${id}-description`,
    'errorId': `${id}-error`,
    hasDescription,
    hasError,
    'inputId': `${id}-input`,
    setHasDescription,
    setHasError
  }), [ hasDescription, hasError, id ]);

  return (
    <FieldContext.Provider value={ context }>
      <FieldPart className={ className }>{children}</FieldPart>
    </FieldContext.Provider>
  );
};

export const FieldLabel = ({ children, className, htmlFor }) => {
  const context = useContext(FieldContext);

  return <FieldLabelPart htmlFor={ htmlFor || context?.inputId } className={ className }>{children}</FieldLabelPart>;
};

export const FieldDescription = ({ children, className, id }) => {
  const context = useContext(FieldContext);
  useRegister(context?.setHasDescription);

  return <FieldDescriptionPart id={ id || context?.descriptionId } className={ className }>{children}</FieldDescriptionPart>;
};

const MountedError = ({ children, className, id }) => {
  const context = useContext(FieldContext);
  useRegister(context?.setHasError);

  return <FieldErrorPart id={ id || context?.errorId } className={ className }>{children}</FieldErrorPart>;
};

// An empty error renders nothing and leaves the control valid.
export const FieldError = (props) => (props.children ? <MountedError { ...props } /> : null);

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
      className={ cn('ds-motion-state min-h-8 w-full min-w-0 rounded-md border border-border bg-surface px-3 py-1 text-base leading-5 text-text md:text-sm shadow-xs placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50', isInvalid && 'border-danger', className) }
      { ...props }
    />
  );
};

export default Field;
