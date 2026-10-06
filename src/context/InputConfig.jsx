'use client';

import { createContext, useContext } from 'react';

const InputConfigContext = createContext('smooth');

/** Set caret behavior for descendant Gaudi text controls; fields can override it. */
export function InputConfigProvider({ caretMode, children }) {
  const inherited = useContext(InputConfigContext);
  return <InputConfigContext.Provider value={caretMode ?? inherited}>{children}</InputConfigContext.Provider>;
}

export function useInputCaretMode(override) {
  const inherited = useContext(InputConfigContext);
  return override ?? inherited;
}
