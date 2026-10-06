/** A muted line that reads a value out, with a polite status for changes that matter. */
export function Readout({ label, children, live = false }) {
  return (
    <p className='text-sm text-text-muted' {...(live ? { role: 'status', 'aria-live': 'polite' } : {})}>
      {label ? <span className='font-medium text-text'>{label}: </span> : null}
      {children}
    </p>
  );
}

/** A visible "code value" chip for readouts. */
export const Value = ({ children }) => <code className='rounded-(--ds-radius-control) bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-text'>{String(children)}</code>;
