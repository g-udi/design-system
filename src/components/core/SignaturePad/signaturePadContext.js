import { createContext, useContext } from 'react';

const SignaturePadContext = createContext(null);

const SignaturePadConfigContext = createContext(null);

function useSignaturePad() {
  const context = useContext(SignaturePadContext);
  if (!context) {
    throw new Error('useSignaturePad must be used within a SignaturePad');
  }
  return context;
}

function useSignaturePadConfig(part) {
  const context = useContext(SignaturePadConfigContext);
  if (!context) throw new Error(`${part} must be used within a SignaturePad`);
  return context;
}

export {
  SignaturePadContext,
  SignaturePadConfigContext,
  useSignaturePad,
  useSignaturePadConfig,
};
