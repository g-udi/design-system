// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-1.5'>
      <span className='bg-ui-primary size-2 animate-bounce rounded-full [animation-delay:-0.3s]' />
      <span className='bg-ui-primary size-2 animate-bounce rounded-full [animation-delay:-0.15s]' />
      <span className='bg-ui-primary size-2 animate-bounce rounded-full' />
    </div>
  );
}
