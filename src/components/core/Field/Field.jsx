'use client';

import { useContext, useEffect, useId, useMemo, useState } from 'react';
import { FieldContext, useFieldControlProps } from './fieldContext.js';

import { useInputCaret } from './hooks/useInputCaret.js';

import { cn } from '../../../utilities/cn';
import {
  Field as FieldPart,
  FieldDescription as FieldDescriptionPart,
  FieldError as FieldErrorPart,
  FieldLabel as FieldLabelPart
} from './FieldPrimitives.jsx';

// The convenience Field wires ids between its parts: the label targets the control,
// and the control is described by whichever description and error are mounted.

// Registers a mounted description or error so FieldInput only references ids that exist.
const useRegister = (register, id) => {
  useEffect(() => {
    if (!register) return undefined;
    register(id);
    return () => register(null);
  }, [ register, id ]);
};

export const Field = ({ children, className }) => {
  const id = useId();
  const [ registeredDescriptionId, setDescriptionId ] = useState(null);
  const [ registeredErrorId, setErrorId ] = useState(null);
  const context = useMemo(() => ({
    'descriptionId': `${id}-description`,
    'errorId': `${id}-error`,
    registeredDescriptionId,
    registeredErrorId,
    'inputId': `${id}-input`,
    setDescriptionId,
    setErrorId
  }), [ registeredDescriptionId, registeredErrorId, id ]);

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
  const descriptionId = id || context?.descriptionId;
  useRegister(context?.setDescriptionId, descriptionId);

  return <FieldDescriptionPart id={ descriptionId } className={ className }>{children}</FieldDescriptionPart>;
};

const MountedError = ({ children, className, id }) => {
  const context = useContext(FieldContext);
  const errorId = id || context?.errorId;
  useRegister(context?.setErrorId, errorId);

  return <FieldErrorPart id={ errorId } className={ className }>{children}</FieldErrorPart>;
};

// An empty error renders nothing and leaves the control valid.
export const FieldError = (props) => (props.children ? <MountedError { ...props } /> : null);

// Pointer focus is marked on the element (not state), so base.css can skip the keyboard outline after a click.
const markPointerFocus = (event) => {
  event.currentTarget.dataset.focusSource = 'pointer';
};
const clearPointerFocus = (event) => {
  delete event.currentTarget.dataset.focusSource;
};

export const FieldInput = ({ as: Control = 'input', caretMode, ref, 'aria-describedby': ariaDescribedBy, className, id, invalid, onPointerDown, onBlur, ...props }) => {
  const fieldProps = useFieldControlProps({ id, invalid, 'aria-describedby': ariaDescribedBy });
  const inputRef = useInputCaret(caretMode, ref);
  const isInvalid = fieldProps['aria-invalid'];

  return (
    <Control
      ref={ inputRef }
      {...fieldProps}
      onPointerDown={ (event) => {
        markPointerFocus(event);
        onPointerDown?.(event);
      } }
      onBlur={ (event) => {
        clearPointerFocus(event);
        onBlur?.(event);
      } }
      className={ cn('ds-motion-state min-h-8 w-full min-w-0 rounded-md border border-border bg-surface px-3 py-1 text-base leading-5 text-text md:text-sm shadow-xs placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50', isInvalid && 'border-danger', className) }
      { ...props }
    />
  );
};

export default Field;
