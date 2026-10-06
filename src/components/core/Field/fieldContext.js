import { createContext, useContext } from 'react';

export const FieldContext = createContext(null);

/** Shared label and feedback wiring for native and specialized field controls. */
export function useFieldControlProps({ id, invalid, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid }) {
  const field = useContext(FieldContext);
  return {
    id: id || field?.inputId,
    'aria-describedby': [describedBy, field?.registeredDescriptionId, field?.registeredErrorId].filter(Boolean).join(' ') || undefined,
    'aria-invalid': ariaInvalid ?? ((invalid ?? Boolean(field?.registeredErrorId)) || undefined),
  };
}
