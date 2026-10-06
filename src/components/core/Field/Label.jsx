'use client';
import { cn } from '../../../utilities/cn/index.js';
import { Label as LabelPrimitive } from 'radix-ui';
import { createContext, useContext, useId } from 'react';
const LabelContext = createContext(undefined);
export const useFieldLabel = () => useContext(LabelContext);
function Label({ className, id, children, ...props }) {
  const generatedId = useId();
  const labelId = id || generatedId;
  return (
    <LabelContext.Provider value={labelId}>
      <LabelPrimitive.Root
        id={labelId}
        data-slot='label'
        className={cn(
          'ds-part-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </LabelPrimitive.Root>
    </LabelContext.Provider>
  );
}
export { Label };
